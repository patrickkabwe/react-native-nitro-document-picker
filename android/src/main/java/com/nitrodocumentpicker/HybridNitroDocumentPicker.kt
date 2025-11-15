package com.nitrodocumentpicker

import com.margelo.nitro.NitroModules
import com.margelo.nitro.core.Promise
import com.margelo.nitro.nitrodocumentpicker.HybridNitroDocumentPickerSpec
import com.margelo.nitro.nitrodocumentpicker.NitroDocumentPickerOptions
import com.margelo.nitro.nitrodocumentpicker.Variant_NitroDocumentPickerResult_Array_NitroDocumentPickerResult_

class HybridNitroDocumentPicker: HybridNitroDocumentPickerSpec() {
    val context = NitroModules.applicationContext ?: throw Exception("Context not found")
    val picker = NitroDocumentPicker(context)

    override fun pick(options: NitroDocumentPickerOptions): Promise<Variant_NitroDocumentPickerResult_Array_NitroDocumentPickerResult_> {
        return Promise.async {
            try {
                val results = picker.pick(options)
                if (options.multiple == true) {
                    Variant_NitroDocumentPickerResult_Array_NitroDocumentPickerResult_.Second(results)
                } else {
                    Variant_NitroDocumentPickerResult_Array_NitroDocumentPickerResult_.First(results[0])
                }
            } catch (e: Exception) {
                e.printStackTrace()
                throw Error(e)
            }
        }
    }
}
