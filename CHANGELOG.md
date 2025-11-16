## [1.2.0](https://github.com/patrickkabwe/react-native-nitro-document-picker/compare/v1.1.1...v1.2.0) (2025-11-16)

### ✨ Features

* add pickDirectory method and NitroDocumentPickerDirectoryResult type ([3edb7db](https://github.com/patrickkabwe/react-native-nitro-document-picker/commit/3edb7db302d3a10a5bdbdfb6e15f9bcd3cb451fb))
* **android:** implement pickDirectory method for directory selection ([c080f66](https://github.com/patrickkabwe/react-native-nitro-document-picker/commit/c080f66f4888fb77a5382ba0f99cea25b12726dd))
* **ios:** implement pickDirectory method for directory selection ([355d731](https://github.com/patrickkabwe/react-native-nitro-document-picker/commit/355d7310fdee1214ec878e4371ec3cd058044209))

### 📚 Documentation

* add pickDirectory method documentation and usage examples ([fe35ae8](https://github.com/patrickkabwe/react-native-nitro-document-picker/commit/fe35ae81b8ad4b1478d24c1accbb4247e8ba6fe9))
* **example:** add directory picking functionality to example app ([b260396](https://github.com/patrickkabwe/react-native-nitro-document-picker/commit/b2603962b36154df1ef3d03725c25f76034e42ee))
* update README with Android directory picking permissions and privacy warning details ([b41b57d](https://github.com/patrickkabwe/react-native-nitro-document-picker/commit/b41b57d46fdb0f5263ad70081c999c4ea4433ba3))

### 🛠️ Other changes

* regenerate nitro bindings for pickDirectory method ([f5c5742](https://github.com/patrickkabwe/react-native-nitro-document-picker/commit/f5c57422055a0b124c2c47c1b7c06c696e9a89b2))
* update NitroDocumentPicker to version 1.1.1 in Podfile.lock ([3af1638](https://github.com/patrickkabwe/react-native-nitro-document-picker/commit/3af16385b3b5c7aa92c37cd40ea5f0c40f813e13))

## [1.1.1](https://github.com/patrickkabwe/react-native-nitro-document-picker/compare/v1.1.0...v1.1.1) (2025-11-16)

### 📚 Documentation

* convert NitroDocumentType section to table format ([929d298](https://github.com/patrickkabwe/react-native-nitro-document-picker/commit/929d29863ceecc3a6226765c38491ef951e3b721))
* fix API reference return types and single file selection example ([055f23c](https://github.com/patrickkabwe/react-native-nitro-document-picker/commit/055f23ccd04fd2c7f8b105c679f2a99aa15e0be2))
* organize NitroDocumentType by category sections ([4615f06](https://github.com/patrickkabwe/react-native-nitro-document-picker/commit/4615f062dd6dfeff6a080f7e4803baf920b8de8d))

### 🛠️ Other changes

* configure git author and committer in release workflow ([c322b7d](https://github.com/patrickkabwe/react-native-nitro-document-picker/commit/c322b7dceb5cdf3ee5c6c9d1235f0b81101b6951))

## [1.1.0](https://github.com/patrickkabwe/react-native-nitro-document-picker/compare/v1.0.1...v1.1.0) (2025-11-16)

### ✨ Features

* add comprehensive document type support and wildcard type ([8a3e53b](https://github.com/patrickkabwe/react-native-nitro-document-picker/commit/8a3e53b2343385b07c2b613df9bed638232103d7))
* add support for images, videos, and audio ([74b4c5e](https://github.com/patrickkabwe/react-native-nitro-document-picker/commit/74b4c5ef9a6df8dd0a135e27b08c5a645ec7520f))
* improve picker api and example ([2195743](https://github.com/patrickkabwe/react-native-nitro-document-picker/commit/2195743bebba2c132a766c8ca8ca231ef40c6f6d))
* **ios:** improve cloud storage file handling ([3e391d2](https://github.com/patrickkabwe/react-native-nitro-document-picker/commit/3e391d2dd1ff56625775ec767f8f510cc37c4dbd))
* update Podfile.lock and extend NitroDocumentType to support image, video, and audio file types ([598883f](https://github.com/patrickkabwe/react-native-nitro-document-picker/commit/598883f2bd5663b3893ee42adf744e3f0dc03287))

### 🐛 Bug Fixes

* correct mime type check and add error handling for unsupported document types ([f620463](https://github.com/patrickkabwe/react-native-nitro-document-picker/commit/f6204637464b35dbb43cfc8661b2a72d2765d5d4))
* enhance CSS type handling for compatibility with iOS 18.0 and earlier ([fe1d5c4](https://github.com/patrickkabwe/react-native-nitro-document-picker/commit/fe1d5c497b8ef0fab3f5782255cdd217fa0d0d85))

### 🔄 Code Refactors

* remove maxFileSize option from NitroDocumentPickerOptions and implementation ([3f905e7](https://github.com/patrickkabwe/react-native-nitro-document-picker/commit/3f905e78557eec8a0df377ba0075e00d93eb1539))
* rename `path` to `uri` ([a336188](https://github.com/patrickkabwe/react-native-nitro-document-picker/commit/a3361880cdf5713c062b54946f1bce31fe191448))
* update document type handling to use 'all' instead of '*' for selecting all file types ([6234a42](https://github.com/patrickkabwe/react-native-nitro-document-picker/commit/6234a4274fe4b84863357ad4767426969163b975))
* update mime type check to use lowercase comparison for 'all' in document types ([3a8f53d](https://github.com/patrickkabwe/react-native-nitro-document-picker/commit/3a8f53db500cd73f2c7a7a870baa76b8537cb96a))

## [1.0.1](https://github.com/patrickkabwe/react-native-nitro-document-picker/compare/v1.0.0...v1.0.1) (2025-06-14)

### 📚 Documentation

* update README to enhance documentation with features, installation instructions, usage examples, and platform differences for the Nitro Document Picker ([0fd3141](https://github.com/patrickkabwe/react-native-nitro-document-picker/commit/0fd314117622f182770e139b041a52b5eafc0014))

### 🛠️ Other changes

* enhance App component with document picker functionality and UI improvements ([f0387a5](https://github.com/patrickkabwe/react-native-nitro-document-picker/commit/f0387a589678d52681a4e99b44f333217ce1b4fa))

## 1.0.0 (2025-06-11)

### ✨ Features

* add max file size option to NitroDocumentPicker for improved file selection ([ca1b6a1](https://github.com/patrickkabwe/react-native-nitro-document-picker/commit/ca1b6a1de716c860cf9dddf2bd8367acea8d91a9))
* android support ([1fa65fa](https://github.com/patrickkabwe/react-native-nitro-document-picker/commit/1fa65faa2307650f0d47ff96e615f197564fc865))
* enhance NitroDocumentPickerResult to include mimeType and size for improved file metadata handling ([7d6f0fc](https://github.com/patrickkabwe/react-native-nitro-document-picker/commit/7d6f0fc2fb5a1245077d7f415d497101bdfd3a9c))
* ios support ([ababeff](https://github.com/patrickkabwe/react-native-nitro-document-picker/commit/ababeff2bd856c51cc96819e77cf2e0fa3a1e1eb))
* support localOnly option on android ([c4c19e8](https://github.com/patrickkabwe/react-native-nitro-document-picker/commit/c4c19e83e4716270d02517be78eb0bed309e30fc))

### 🐛 Bug Fixes

* update license link in README to point to the main branch ([c105fcd](https://github.com/patrickkabwe/react-native-nitro-document-picker/commit/c105fcd237b8ba133429b786180a00b2c19b2d4b))

### 🔄 Code Refactors

* optimize file handling in NitroDocumentPicker by switching to Base64OutputStream and improving URI resolution ([cc76340](https://github.com/patrickkabwe/react-native-nitro-document-picker/commit/cc76340b5d98a20c7d3f0adb5f64965f60b3935d))
* remove NitroDocumentPickerOutput support from iOS and Android, update NitroDocumentPickerResult and NitroDocumentPickerOptions to reflect changes ([c0cbbb9](https://github.com/patrickkabwe/react-native-nitro-document-picker/commit/c0cbbb9e92535e22cc7de778b45220d08962c732))

### 📚 Documentation

* remove outdated React Native version requirement for Nitro Views in README ([5bc5f9c](https://github.com/patrickkabwe/react-native-nitro-document-picker/commit/5bc5f9c8043174466e27874d7bee24ac5149349f))

### 🛠️ Other changes

* display selected file names in App component ([b179db7](https://github.com/patrickkabwe/react-native-nitro-document-picker/commit/b179db799e9cee99973b81387b01c145a9421359))
* update NitroDocumentPickerResult to include mimeType and size for enhanced file metadata handling ([2082f16](https://github.com/patrickkabwe/react-native-nitro-document-picker/commit/2082f16917d9b64f133cafa4e036c5a9bb228767))
