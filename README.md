# react-native-nitro-document-picker

A React Native document picker built with [Nitro Modules](https://github.com/mrousavy/nitro) for modern architecture.

[![Version](https://img.shields.io/npm/v/react-native-nitro-document-picker.svg)](https://www.npmjs.com/package/react-native-nitro-document-picker)
[![Downloads](https://img.shields.io/npm/dm/react-native-nitro-document-picker.svg)](https://www.npmjs.com/package/react-native-nitro-document-picker)
[![License](https://img.shields.io/npm/l/react-native-nitro-document-picker.svg)](https://github.com/patrickkabwe/react-native-nitro-document-picker/blob/main/LICENSE)

## ✨ Features

- 🚀 **High Performance**: Built with Nitro Modules for native-level performance
- 📱 **Cross Platform**: Works on both iOS and Android
- 📄 **Multiple File Types**: Support for PDF, DOCX, TXT, CSV, images, videos, and audio files
- 🔢 **Multiple Selection**: Pick single or multiple documents at once
- 📁 **Directory Picking**: Pick directories/folders on both iOS and Android
- ☁️ **Cloud Storage Support**: Access files from iCloud Drive, Google Drive, Dropbox, OneDrive, and other cloud providers
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

**Returns:** 
- `Promise<NitroDocumentPickerResult>` when `multiple` is `false` or not specified
- `Promise<NitroDocumentPickerResult[]>` when `multiple` is `true`

### `NitroDocumentPicker.pickDirectory()`

Opens a directory picker to select a folder/directory.

**Parameters:**

- None

**Returns:** 
- `Promise<NitroDocumentPickerDirectoryResult>` - The selected directory information

**Note:** 
- On iOS, only single directory selection is supported
- On Android, uses the system directory tree picker

### Types

#### `NitroDocumentPickerOptions`

```typescript
interface NitroDocumentPickerOptions {
  /**
   * Array of document types to allow for selection.
   * Use 'all' to allow all file types.
   */
  types: NitroDocumentType[]

  /**
   * Whether to allow multiple documents to be picked
   * @default false
   */
  multiple?: boolean

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

**All File Types**

| Type | Description |
|------|-------------|
| `all` | Allow picking any file type |

**Document Types**

| Type | Description |
|------|-------------|
| `pdf` | PDF documents |
| `docx` | Microsoft Word documents |
| `xlsx` | Microsoft Excel spreadsheets |
| `pptx` | Microsoft PowerPoint presentations |
| `txt` | Plain text files |
| `csv` | Comma-separated values files |

**Rich Text/Markup**

| Type | Description |
|------|-------------|
| `rtf` | Rich Text Format |
| `html` | HTML files |
| `xml` | XML files |
| `md`, `markdown` | Markdown files |

**Archives**

| Type | Description |
|------|-------------|
| `zip` | ZIP archives |

**Code Files**

| Type | Description |
|------|-------------|
| `js`, `javascript` | JavaScript files |
| `ts`, `typescript` | TypeScript files |
| `json` | JSON files |
| `css` | CSS files |
| `py` | Python files |
| `cpp`, `c` | C/C++ source files |
| `swift` | Swift source files |
| `kt`, `kotlin` | Kotlin source files |

**E-books**

| Type | Description |
|------|-------------|
| `epub` | EPUB e-books |

**Fonts**

| Type | Description |
|------|-------------|
| `ttf` | TrueType fonts |
| `otf` | OpenType fonts |

**Databases**

| Type | Description |
|------|-------------|
| `db`, `sqlite` | SQLite database files |

**Config Files**

| Type | Description |
|------|-------------|
| `yaml`, `yml` | YAML files |

**CAD/Design**

| Type | Description |
|------|-------------|
| `svg` | Scalable Vector Graphics |

**Image Types**

| Type | Description |
|------|-------------|
| `jpg`, `jpeg` | JPEG images |
| `png` | PNG images |
| `gif` | GIF images |
| `webp` | WebP images |

**Video Types**

| Type | Description |
|------|-------------|
| `mp4` | MP4 videos |
| `mov` | QuickTime videos |
| `avi` | AVI videos |
| `mkv` | Matroska videos |
| `webm` | WebM videos |

**Audio Types**

| Type | Description |
|------|-------------|
| `mp3` | MP3 audio |
| `wav` | WAV audio |

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

#### `NitroDocumentPickerDirectoryResult`

```typescript
interface NitroDocumentPickerDirectoryResult {
  /**
   * The URI of the directory
   */
  uri: string

  /**
   * The name of the directory
   * @example 'MyFolder'
   */
  name: string
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

    console.log('Selected file:', result.name)
    console.log('File URI:', result.uri)
    console.log('File size:', result.size, 'bytes')
    console.log('MIME type:', result.mimeType)
  } catch (error) {
    console.error('Error:', error)
  }
}
```

### Multiple File Selection

```typescript
const pickMultipleDocuments = async () => {
  try {
    const result = await NitroDocumentPicker.pick({
      types: ['pdf', 'docx', 'xlsx'],
      multiple: true,
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

### Pick Any File Type

```typescript
const pickAnyFile = async () => {
  try {
    const result = await NitroDocumentPicker.pick({
      types: ['all'], // Use 'all' to allow picking any file type
      multiple: true,
    })

    console.log(`Selected ${result.length} files of any type:`)
    result.forEach((file, index) => {
      console.log(`${index + 1}. ${file.name} (${file.mimeType})`)
    })
  } catch (error) {
    console.error('Error:', error)
  }
}
```

### Using Specific Media Types

```typescript
const pickSpecificMediaTypes = async () => {
  try {
    // Pick only JPEG and PNG images
    const images = await NitroDocumentPicker.pick({
      types: ['jpg', 'png'],
      multiple: true,
    })

    // Pick only MP3 and WAV audio files
    const audioFiles = await NitroDocumentPicker.pick({
      types: ['mp3', 'wav'],
      multiple: true,
    })

    // Pick only MP4 videos
    const videos = await NitroDocumentPicker.pick({
      types: ['mp4'],
      multiple: true,
    })
  } catch (error) {
    console.error('Error:', error)
  }
}
```

### Pick Directory

```typescript
const pickDirectory = async () => {
  try {
    const directory = await NitroDocumentPicker.pickDirectory()

    console.log('Selected directory:', directory.name)
    console.log('Directory URI:', directory.uri)
  } catch (error) {
    if (error.message.includes('cancelled')) {
      console.log('User cancelled directory selection')
    } else {
      console.error('Error:', error)
    }
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
    } else {
      console.error('Unexpected error:', error)
    }
  }
}
```

## 🏗️ Platform Differences

### iOS

- Uses `UIDocumentPickerViewController` for native document picking
- Uses `UIDocumentPickerViewController` with `UTType.folder` for directory picking
- Supports all document types through UTType system
- Provides native iOS document picker UI

### Android

- Uses `Intent.ACTION_OPEN_DOCUMENT` for document selection
- Uses `Intent.ACTION_OPEN_DOCUMENT_TREE` for directory selection
- Supports `localOnly` option to restrict to local files
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

2. **Unsupported file types**

   - Check that the file type is included in the `types` array
   - Verify the file extension matches the supported types

4. **Android permissions**
   - The package handles permissions automatically
   - No manifest permissions are required for document or directory picking
   - `ACTION_OPEN_DOCUMENT` and `ACTION_OPEN_DOCUMENT_TREE` use the Storage Access Framework (SAF) which handles permissions automatically
   - Ensure your app targets Android API 21 or higher

5. **Android directory picking privacy warning**
   - Android shows a privacy warning ("To protect your privacy, choose another folder") for directories that contain files
   - This is expected Android behavior to protect user privacy
   - Users can still select directories by tapping "Use this folder" or "Allow access"
   - This warning cannot be disabled as it's a core Android security feature

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
