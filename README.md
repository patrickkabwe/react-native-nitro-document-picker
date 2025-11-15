# react-native-nitro-document-picker

A React Native document picker built with [Nitro Modules](https://github.com/mrousavy/nitro) for modern architecture.

[![Version](https://img.shields.io/npm/v/react-native-nitro-document-picker.svg)](https://www.npmjs.com/package/react-native-nitro-document-picker)
[![Downloads](https://img.shields.io/npm/dm/react-native-nitro-document-picker.svg)](https://www.npmjs.com/package/react-native-nitro-document-picker)
[![License](https://img.shields.io/npm/l/react-native-nitro-document-picker.svg)](https://github.com/patrickkabwe/react-native-nitro-document-picker/blob/main/LICENSE)

## ✨ Features

- 🚀 **High Performance**: Built with Nitro Modules for native-level performance
- 📱 **Cross Platform**: Works on both iOS and Android
- 📄 **Multiple File Types**: Support for PDF, DOCX, TXT, and CSV files
- 🔢 **Multiple Selection**: Pick single or multiple documents at once
- 📱 **Modern Architecture**: Built on React Native's new architecture but still supports the old architecture

## 📋 Requirements

- React Native v0.76.0 or higher
- Node.js 18.0.0 or higher
- iOS 13.0+ / Android API 21+

## 📦 Installation

```bash
# Using npm
npm install react-native-nitro-document-picker react-native-nitro-modules

# Using yarn
yarn add react-native-nitro-document-picker react-native-nitro-modules

# Using bun
bun add react-native-nitro-document-picker react-native-nitro-modules

# For iOS, you need to run pod install:
cd ios && pod install

# No additional setup required for Android. The package uses autolinking.
```

## 🚀 Quick Start

```typescript
import React, { useState } from 'react';
import { View, Button, Text } from 'react-native';
import {
  NitroDocumentPicker,
  NitroDocumentPickerResult
} from 'react-native-nitro-document-picker';

export default function App() {
  const [selectedFiles, setSelectedFiles] = useState<NitroDocumentPickerResult[]>([]);

  const pickDocuments = async () => {
    try {
      const result = await NitroDocumentPicker.pick({
        types: ['pdf', 'docx', 'csv'],
        multiple: true,
        maxFileSize: 10 * 1024 * 1024, // 10MB
      });
      setSelectedFiles(result);
    } catch (error) {
      console.error('Error picking documents:', error);
    }
  };

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <Button title="Pick Documents" onPress={pickDocuments} />
      {selectedFiles.map((file, index) => (
        <Text key={index}>{file.name} - {file.size} bytes</Text>
      ))}
    </View>
  );
}
```

## 📚 API Reference

### `NitroDocumentPicker.pick(options)`

Opens the document picker with the specified options.

**Parameters:**

- `options` (NitroDocumentPickerOptions): Configuration options for the document picker

**Returns:** `Promise<NitroDocumentPickerResult[]>`

### Types

#### `NitroDocumentPickerOptions`

```typescript
interface NitroDocumentPickerOptions {
  /**
   * Array of document types to allow for selection
   */
  types: NitroDocumentType[]

  /**
   * Whether to allow multiple documents to be picked
   * @default false
   */
  multiple?: boolean

  /**
   * Maximum file size in bytes
   * @default 50 * 1024 * 1024 (50MB)
   */
  maxFileSize?: number

  /**
   * Local only mode (Android only)
   * When true, only local files are shown
   * @platform android
   * @default false
   */
  localOnly?: boolean
}
```

#### `NitroDocumentType`

Supported document types:

```typescript
type NitroDocumentType =
  | 'pdf' // PDF documents
  | 'docx' // Microsoft Word documents
  | 'xlsx' // Microsoft Excel spreadsheets
  | 'pptx' // Microsoft PowerPoint presentations
  | 'txt' // Plain text files
  | 'csv' // Comma-separated values files
```

#### `NitroDocumentPickerResult`

```typescript
interface NitroDocumentPickerResult {
  /**
   * The file URI of the document
   */
  uri: string

  /**
   * The name of the document
   * @example 'document.pdf'
   */
  name: string

  /**
   * MIME type of the document
   * @example 'application/pdf'
   */
  mimeType: string

  /**
   * File size in bytes
   * @example 1048576
   */
  size: number
}
```

## 💡 Usage Examples

### Single File Selection

```typescript
const pickSingleDocument = async () => {
  try {
    const result = await NitroDocumentPicker.pick({
      types: ['pdf'],
      multiple: false,
    })

    if (result.length > 0) {
      const file = result[0]
      console.log('Selected file:', file.name)
      console.log('File size:', file.size, 'bytes')
      console.log('MIME type:', file.mimeType)
    }
  } catch (error) {
    console.error('Error:', error)
  }
}
```

### Multiple File Selection with Size Limit

```typescript
const pickMultipleDocuments = async () => {
  try {
    const result = await NitroDocumentPicker.pick({
      types: ['pdf', 'docx', 'xlsx'],
      multiple: true,
      maxFileSize: 5 * 1024 * 1024, // 5MB limit
    })

    console.log(`Selected ${result.length} files:`)
    result.forEach((file, index) => {
      console.log(`${index + 1}. ${file.name} (${file.size} bytes)`)
    })
  } catch (error) {
    console.error('Error:', error)
  }
}
```

### Android-Specific: Local Files Only

```typescript
const pickLocalDocuments = async () => {
  try {
    const result = await NitroDocumentPicker.pick({
      types: ['pdf', 'docx'],
      multiple: true,
      localOnly: true, // Android only - restricts to local files
    })

    console.log('Local files selected:', result.length)
  } catch (error) {
    console.error('Error:', error)
  }
}
```

## 🔧 Error Handling

The document picker can throw errors in various scenarios. Always wrap your calls in try-catch blocks:

```typescript
const handleDocumentPicking = async () => {
  try {
    const result = await NitroDocumentPicker.pick({
      types: ['pdf'],
      multiple: false,
    })
    // Handle success
  } catch (error) {
    if (error.message.includes('cancelled')) {
      console.log('User cancelled the picker')
    } else if (error.message.includes('size')) {
      console.log('File too large')
    } else {
      console.error('Unexpected error:', error)
    }
  }
}
```

## 🏗️ Platform Differences

### iOS

- Uses `UIDocumentPickerViewController` for native document picking
- Supports all document types through UTType system
- File size limits are enforced during processing
- Provides native iOS document picker UI

### Android

- Uses `Intent.ACTION_OPEN_DOCUMENT` for document selection
- Supports `localOnly` option to restrict to local files
- File size limits are configurable
- Integrates with Android's document providers

## 🎨 Example App

Check out the [example app](./example) for a complete implementation with a beautiful UI showcasing all features of the document picker.

To run the example:

```bash
# Clone the repository
git clone https://github.com/patrickkabwe/react-native-nitro-document-picker.git

# Install dependencies
cd react-native-nitro-document-picker
bun install

# Run the example
cd example
bun run ios
# or
bun run android
```

## 🔍 Troubleshooting

### Common Issues

1. **"Module not found" error**

   - Ensure you have installed both `react-native-nitro-document-picker` and `react-native-nitro-modules`
   - Run `pod install` for iOS projects

2. **File size too large errors**

   - Adjust the `maxFileSize` option to accommodate larger files
   - Consider implementing chunked upload for very large files

3. **Unsupported file types**

   - Check that the file type is included in the `types` array
   - Verify the file extension matches the supported types

4. **Android permissions**
   - The package handles permissions automatically
   - Ensure your app targets Android API 21 or higher

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

### Development Setup

```bash
# Clone the repository
git clone https://github.com/patrickkabwe/react-native-nitro-document-picker.git

# Install dependencies
bun install

# Generate native code
bun run codegen

# Run the example app
cd example
bun run ios
```

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Credits

- Built with [Nitro Modules](https://github.com/mrousavy/nitro) by [@mrousavy](https://github.com/mrousavy)
- Bootstrapped with [create-nitro-module](https://github.com/patrickkabwe/create-nitro-module)

## 📞 Support

- 🐛 [Report bugs](https://github.com/patrickkabwe/react-native-nitro-document-picker/issues)
- 💡 [Request features](https://github.com/patrickkabwe/react-native-nitro-document-picker/issues)
- 💬 [Discussions](https://github.com/patrickkabwe/react-native-nitro-document-picker/discussions)

---

Made with ❤️ by [Patrick Kabwe](https://github.com/patrickkabwe)
