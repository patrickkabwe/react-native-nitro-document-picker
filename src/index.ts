import { NitroModules } from 'react-native-nitro-modules'
import type { NitroDocumentPicker as NitroDocumentPickerSpec } from './specs/nitro-document-picker.nitro'
import type { NitroDocumentPickerOptions, NitroDocumentPickerResult } from './types'
export type * from './types'

const nitroDocumentPicker =
    NitroModules.createHybridObject<NitroDocumentPickerSpec>('NitroDocumentPicker')

function pick(options: NitroDocumentPickerOptions & { multiple: true }): Promise<NitroDocumentPickerResult[]>
function pick(options: NitroDocumentPickerOptions & { multiple?: false }): Promise<NitroDocumentPickerResult>
function pick(options: NitroDocumentPickerOptions): Promise<NitroDocumentPickerResult | NitroDocumentPickerResult[]> {
    return nitroDocumentPicker.pick(options)
}

export const NitroDocumentPicker = {
    pick,
}