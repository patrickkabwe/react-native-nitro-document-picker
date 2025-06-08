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
            
            guard let docTypes = self.getDocTypes(for: options.types) else {
                var msg = "Unsupported document types"
                if options.types.isEmpty {
                    msg += ": No document types specified"
                } else {
                    msg += ": \(options.types.map(\.stringValue).joined(separator: ", "))"
                }
                return self.resumeWithError(RuntimeError.error(withMessage: msg))
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
        
        let output = options?.output ?? .path
        
        Task {
            do {
                var results: [NitroDocumentPickerResult] = []
                
                switch output {
                case .path:
                    results = urls.map {
                        NitroDocumentPickerResult(
                            path: $0.absoluteString, base64: nil, name: $0.lastPathComponent
                        )
                    }
                    
                case .base64:
                    // Process files concurrently but with controlled concurrency to manage memory
                    results = try await withThrowingTaskGroup(of: NitroDocumentPickerResult.self) { group in
                        var taskResults: [NitroDocumentPickerResult] = []
                        
                        for url in urls {
                            group.addTask { [weak self] in
                                guard let self = self else { throw RuntimeError.error(withMessage: "Picker deallocated") }

                                let base64String = try await self.toBase64Async(for: url)
                                return NitroDocumentPickerResult(
                                    path: nil, base64: base64String, name: url.lastPathComponent
                                )
                            }
                        }
                        
                        for try await result in group {
                            taskResults.append(result)
                        }
                        
                        return taskResults
                    }
                    
                @unknown default:
                    throw RuntimeError.error(withMessage: "Unknown output type")
                }
                
                self.resumeWithResult(results)
                
            } catch {
                self.resumeWithError(error)
            }
        }
    }

    func documentPickerWasCancelled(_ controller: UIDocumentPickerViewController) {
        resumeWithError(RuntimeError.error(withMessage: "Document picker was cancelled"))
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
        let utTypes = docTypes.flatMap { docType in
            UTType.types(tag: docType.stringValue, tagClass: .filenameExtension, conformingTo: nil)
        }
        return utTypes.isEmpty ? nil : utTypes
    }
    
    private func toBase64Async(for url: URL) async throws -> String {
        return try await withCheckedThrowingContinuation { continuation in
            Task.detached(priority: .userInitiated) {
                do {
                    let resourceValues = try url.resourceValues(forKeys: [.fileSizeKey])
                    let fileSize = resourceValues.fileSize ?? 0
                    let maxFileSize = self.options?.maxFileSize ?? 50 * 1024 * 1024
                    
                    if fileSize > Int(maxFileSize) {
                        throw RuntimeError.error(withMessage: "File size (\(fileSize) bytes) exceeds maximum allowed size (\(maxFileSize) bytes)")
                    }
                    
                    // Load file data in chunks to manage memory better
                    let data = try Data(contentsOf: url, options: .mappedIfSafe)
                    let base64String = data.base64EncodedString(options: .lineLength64Characters)
                    
                    continuation.resume(returning: base64String)
                } catch {
                    continuation.resume(throwing: error)
                }
            }
        }
    }
}
