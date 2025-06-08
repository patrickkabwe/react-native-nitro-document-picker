//
//  HybridNitroDocumentPicker.swift
//  NitroDocumentPicker
//
//  Created by Patrick Kabwe on 6/7/2025.
//

import UIKit
import NitroModules
import UniformTypeIdentifiers

class HybridNitroDocumentPicker: HybridNitroDocumentPickerSpec {
    private let nitroDocPickerImpl = NitroDocumentPickerImpl()

    func pick(options: NitroDocumentPickerOptions) throws -> Promise<[NitroDocumentPickerResult]> {
        return .async { @MainActor [weak self] in
            guard let self = self else {
                throw RuntimeError.error(withMessage: "HybridNitroDocumentPicker instance has been deallocated")
            }
            return try await self.nitroDocPickerImpl.pick(options: options)
        }
    }
}
