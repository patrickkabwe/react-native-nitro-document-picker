//
//  NitroDocumentPickerImpl.swift
//  NitroDocumentPicker
//
//  Created by Patrick Kabwe on 08/06/2025.
//

import Foundation
import NitroModules
import UniformTypeIdentifiers

class NitroDocumentPickerImpl: NSObject {
    private var continuation: CheckedContinuation<[NitroDocumentPickerResult], Error>?
    private var options: NitroDocumentPickerOptions?
    
    @MainActor
    func pick(options: NitroDocumentPickerOptions) async throws -> [NitroDocumentPickerResult] {
        return try await withCheckedThrowingContinuation { continuation in
            self.cleanupContinuation()
            self.options = options
            self.continuation = continuation
            
            guard !options.types.isEmpty else {
                return self.resumeWithError(RuntimeError.error(withMessage: "No document types specified. Provide types array with at least one type or use 'all' for all types."))
            }
            
            // Check if 'all' is in the types array
            let docTypes: [UTType]
            if options.types.contains(where: { $0.stringValue == "all" }) {
                docTypes = [UTType.item]
            } else {
                guard let resolvedTypes = self.getDocTypes(for: options.types) else {
                    let msg = "Unsupported document types: \(options.types.map(\.stringValue).joined(separator: ", "))"
                    return self.resumeWithError(RuntimeError.error(withMessage: msg))
                }
                docTypes = resolvedTypes
            }
            do {
                let rootVC = try self.getRootViewController()
                let picker = UIDocumentPickerViewController(forOpeningContentTypes: docTypes)
                picker.allowsMultipleSelection = options.multiple ?? false
                picker.delegate = self
                
                rootVC.present(picker, animated: true)
            } catch {
                self.resumeWithError(error)
            }
        }
    }
    
    private func cleanupContinuation() {
        continuation = nil
    }
    
    private func resumeWithError(_ error: Error) {
        continuation?.resume(throwing: error)
        cleanupContinuation()
    }
    
    private func resumeWithResult(_ result: [NitroDocumentPickerResult]) {
        continuation?.resume(returning: result)
        cleanupContinuation()
    }
}

extension NitroDocumentPickerImpl: UIDocumentPickerDelegate {
    func documentPicker(_ controller: UIDocumentPickerViewController, didPickDocumentsAt urls: [URL]) {
        guard self.continuation != nil else {
            return
        }
                
        Task {
            do {
                let results = try await withThrowingTaskGroup(of: NitroDocumentPickerResult.self) { group in
                    var taskResults: [NitroDocumentPickerResult] = []
                    
                    for url in urls {
                        group.addTask { [weak self] in
                            guard self != nil else { throw RuntimeError.error(withMessage: "Picker deallocated") }

                            let isAccessing = url.startAccessingSecurityScopedResource()
                            defer {
                                if isAccessing {
                                    url.stopAccessingSecurityScopedResource()
                                }
                            }
                            
                            var fileSize: UInt64 = 0
                            
                            if url.isFileURL {
                                if let attributes = try? FileManager.default.attributesOfItem(atPath: url.path),
                                   let size = attributes[FileAttributeKey.size] as? UInt64 {
                                    fileSize = size
                                }
                            } else {
                                // For cloud storage URLs, try to get size from resource values
                                if let resourceValues = try? url.resourceValues(forKeys: [.fileSizeKey]),
                                   let size = resourceValues.fileSize {
                                    fileSize = UInt64(size)
                                }
                            }
                            
                            let mimeType = UTType(filenameExtension: url.pathExtension)?.preferredMIMEType ?? ""
                            
                            return NitroDocumentPickerResult(
                                uri: url.absoluteString,
                                name: url.lastPathComponent,
                                mimeType: mimeType,
                                size: Double(fileSize)
                            )
                        }
                    }
                    
                    for try await result in group {
                        taskResults.append(result)
                    }
                    
                    return taskResults
                }
                
                self.resumeWithResult(results)
                
            } catch {
                self.resumeWithError(error)
            }
        }
    }

    func documentPickerWasCancelled(_ controller: UIDocumentPickerViewController) {
        resumeWithError(RuntimeError.error(withMessage: "Picker was cancelled"))
    }
}

// Utils
extension NitroDocumentPickerImpl {
    private func getRootViewController() throws -> UIViewController {
        guard let windowScene = UIApplication.shared.connectedScenes.first(where: { $0.activationState == .foregroundActive }) as? UIWindowScene,
              let rootVC = windowScene.windows.first(where: { $0.isKeyWindow })?.rootViewController else {
            throw RuntimeError.error(withMessage: "Could not find root view controller. Make sure the app is in the foreground.")
        }
        return rootVC
    }

    private func getDocTypes(for docTypes: [NitroDocumentType]) -> [UTType]? {
        let utTypes = docTypes.flatMap { docType -> [UTType] in
            switch docType.stringValue {
            // All file types
            case "all":
                return [UTType.item]
            // Image types
            case "jpg", "jpeg":
                return [UTType.jpeg]
            case "png":
                return [UTType.png]
            case "gif":
                return [UTType.gif]
            case "webp":
                return [UTType.webP]
            // Video types
            case "mp4":
                return [UTType.mpeg4Movie]
            case "mov":
                return [UTType.quickTimeMovie]
            case "avi":
                return [UTType.avi]
            case "mkv":
                if let mkvType = UTType("public.mkv") {
                    return [mkvType]
                }
                return UTType.types(tag: "mkv", tagClass: .filenameExtension, conformingTo: nil)
            case "webm":
                if let webmType = UTType("public.webm") {
                    return [webmType]
                }
                return UTType.types(tag: "webm", tagClass: .filenameExtension, conformingTo: nil)
            // Audio types
            case "mp3":
                return [UTType.mp3]
            case "wav":
                return [UTType.wav]
            // Rich Text/Markup
            case "rtf":
                return [UTType.rtf]
            case "html":
                return [UTType.html]
            case "xml":
                return [UTType.xml]
            case "md", "markdown":
                if let markdownType = UTType("public.markdown") {
                    return [markdownType]
                }
                return [UTType.plainText]
            // Archives
            case "zip":
                return [UTType.zip]
            // Code files
            case "js", "javascript":
                return [UTType.javaScript]
            case "ts", "typescript":
                if let tsType = UTType("public.typescript") {
                    return [tsType]
                }
                return UTType.types(tag: "ts", tagClass: .filenameExtension, conformingTo: nil)
            case "json":
                return [UTType.json]
            case "css":
                if #available(iOS 18.0, *) {
                    return [UTType.css]
                } else {
                    if let cssType = UTType("public.css") {
                        return [cssType]
                    }
                    return UTType.types(tag: "css", tagClass: .filenameExtension, conformingTo: nil)
                }
            case "py":
                return [UTType.pythonScript]
            case "cpp", "c":
                return [UTType.cPlusPlusSource]
            case "swift":
                if let swiftType = UTType("public.swift-source") {
                    return [swiftType]
                }
                return UTType.types(tag: "swift", tagClass: .filenameExtension, conformingTo: nil)
            case "kt", "kotlin":
                if let kotlinType = UTType("public.kotlin-source") {
                    return [kotlinType]
                }
                return UTType.types(tag: "kt", tagClass: .filenameExtension, conformingTo: nil)
            // E-books
            case "epub":
                return [UTType.epub]
            // Fonts
            case "ttf":
                return [UTType.font]
            case "otf":
                return [UTType.font]
            // Databases
            case "db", "sqlite":
                if let dbType = UTType("public.database") {
                    return [dbType]
                }
                return UTType.types(tag: "db", tagClass: .filenameExtension, conformingTo: nil)
            // Config files
            case "yaml", "yml":
                if let yamlType = UTType("public.yaml") {
                    return [yamlType]
                }
                return UTType.types(tag: "yaml", tagClass: .filenameExtension, conformingTo: nil)
            // CAD/Design
            case "svg":
                return [UTType.svg]
            // Default: try to resolve by file extension
            default:
                return UTType.types(tag: docType.stringValue, tagClass: .filenameExtension, conformingTo: nil)
            }
        }
        return utTypes.isEmpty ? nil : utTypes
    }
}
