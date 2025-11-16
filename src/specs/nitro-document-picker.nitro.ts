import { type HybridObject } from 'react-native-nitro-modules'
import type { NitroDocumentPickerOptions, NitroDocumentPickerResult, NitroDocumentPickerDirectoryResult } from '../types'

export interface NitroDocumentPicker extends HybridObject<{ ios: 'swift', android: 'kotlin' }> {
    pick(options: NitroDocumentPickerOptions): Promise<NitroDocumentPickerResult | NitroDocumentPickerResult[]>
    pickDirectory(): Promise<NitroDocumentPickerDirectoryResult>
}