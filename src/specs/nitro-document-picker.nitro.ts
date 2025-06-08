import { type HybridObject } from 'react-native-nitro-modules'
import type { NitroDocumentPickerOptions, NitroDocumentPickerResult } from '../types'

export interface NitroDocumentPicker extends HybridObject<{ ios: 'swift', android: 'kotlin' }> {
    pick(options: NitroDocumentPickerOptions): Promise<NitroDocumentPickerResult[]>
}