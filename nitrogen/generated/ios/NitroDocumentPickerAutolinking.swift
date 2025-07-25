///
/// NitroDocumentPickerAutolinking.swift
/// This file was generated by nitrogen. DO NOT MODIFY THIS FILE.
/// https://github.com/mrousavy/nitro
/// Copyright © 2025 Marc Rousavy @ Margelo
///

public final class NitroDocumentPickerAutolinking {
  public typealias bridge = margelo.nitro.nitrodocumentpicker.bridge.swift

  /**
   * Creates an instance of a Swift class that implements `HybridNitroDocumentPickerSpec`,
   * and wraps it in a Swift class that can directly interop with C++ (`HybridNitroDocumentPickerSpec_cxx`)
   *
   * This is generated by Nitrogen and will initialize the class specified
   * in the `"autolinking"` property of `nitro.json` (in this case, `HybridNitroDocumentPicker`).
   */
  public static func createNitroDocumentPicker() -> bridge.std__shared_ptr_margelo__nitro__nitrodocumentpicker__HybridNitroDocumentPickerSpec_ {
    let hybridObject = HybridNitroDocumentPicker()
    return { () -> bridge.std__shared_ptr_margelo__nitro__nitrodocumentpicker__HybridNitroDocumentPickerSpec_ in
      let __cxxWrapped = hybridObject.getCxxWrapper()
      return __cxxWrapped.getCxxPart()
    }()
  }
}
