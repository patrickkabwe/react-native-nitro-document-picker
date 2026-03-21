package com.nitrodocumentpicker

import com.margelo.nitro.NitroModules
import com.margelo.nitro.core.Promise
import com.margelo.nitro.nitrodocumentpicker.HybridNitroDocumentPickerSpec
import com.margelo.nitro.nitrodocumentpicker.NitroDocumentPickerOptions
import com.margelo.nitro.nitrodocumentpicker.NitroDocumentPickerDirectoryResult
import com.margelo.nitro.nitrodocumentpicker.Variant_Array_NitroDocumentPickerResult__NitroDocumentPickerResult

class HybridNitroDocumentPicker: HybridNitroDocumentPickerSpec() {
    val context = NitroModules.applicationContext ?: throw Exception("Context not found")
    val picker = NitroDocumentPicker(context)

    override fun pick(options: NitroDocumentPickerOptions): Promise<Variant_Array_NitroDocumentPickerResult__NitroDocumentPickerResult> {
        return Promise.async {
            try {
                val results = picker.pick(options)
                if (options.multiple == true) {
                    Variant_Array_NitroDocumentPickerResult__NitroDocumentPickerResult.First(results)
                } else {
                    Variant_Array_NitroDocumentPickerResult__NitroDocumentPickerResult.Second(results[0])
                }
            } catch (e: Exception) {
                e.printStackTrace()
                throw Error(e)
            }
        }
    }


    override fun pickDirectory(): Promise<NitroDocumentPickerDirectoryResult> {
        return Promise.async {
            try {
                picker.pickDirectory()
            } catch (e: Exception) {
                e.printStackTrace()
                throw Error(e)
            }
        }
    }
}
