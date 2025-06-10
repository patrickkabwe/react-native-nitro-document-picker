package com.nitrodocumentpicker

import com.margelo.nitro.NitroModules
import com.margelo.nitro.core.Promise
import com.margelo.nitro.nitrodocumentpicker.HybridNitroDocumentPickerSpec
import com.margelo.nitro.nitrodocumentpicker.NitroDocumentPickerOptions
import com.margelo.nitro.nitrodocumentpicker.NitroDocumentPickerResult

class HybridNitroDocumentPicker: HybridNitroDocumentPickerSpec() {
    val context = NitroModules.applicationContext ?: throw Exception("Context not found")
    val picker = NitroDocumentPicker(context)

    override fun pick(options: NitroDocumentPickerOptions): Promise<Array<NitroDocumentPickerResult>> {
        return Promise.async {
            try {
                picker.pick(options)
            } catch (e: Exception) {
                e.printStackTrace()
                throw Error(e)
            }
        }
    }
}
