import { NitroModules } from 'react-native-nitro-modules'
import type { NitroDocumentPicker as NitroDocumentPickerSpec } from './specs/nitro-document-picker.nitro'

export const NitroDocumentPicker =
  NitroModules.createHybridObject<NitroDocumentPickerSpec>('NitroDocumentPicker')