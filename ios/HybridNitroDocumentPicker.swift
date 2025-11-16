//
//  HybridNitroDocumentPicker.swift
//  NitroDocumentPicker
//
//  Created by Patrick Kabwe on 6/7/2025.
//

import Foundation
import NitroModules

class HybridNitroDocumentPicker: HybridNitroDocumentPickerSpec {
    private let nitroDocPickerImpl = NitroDocumentPickerImpl()

    func pick(options: NitroDocumentPickerOptions) throws -> Promise<Variant_NitroDocumentPickerResult__NitroDocumentPickerResult_> {
        return .async { @MainActor [weak self] in
            guard let self = self else {
                throw RuntimeError.error(withMessage: "HybridNitroDocumentPicker instance has been deallocated")
            }
            if options.multiple == true {
                let results = try await self.nitroDocPickerImpl.pick(options: options)
                return Variant_NitroDocumentPickerResult__NitroDocumentPickerResult_.second(results)
            }
            let results = try await self.nitroDocPickerImpl.pick(options: options)
            
            return Variant_NitroDocumentPickerResult__NitroDocumentPickerResult_.first(results[0])
        }
    }
    
    func pickDirectory() throws -> Promise<NitroDocumentPickerDirectoryResult> {
        return .async { @MainActor [weak self] in
            guard let self = self else {
                throw RuntimeError.error(withMessage: "HybridNitroDocumentPicker instance has been deallocated")
            }
            return try await self.nitroDocPickerImpl.pickDirectory()
        }
    }
}
