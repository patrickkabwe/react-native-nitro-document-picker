import React, {useState} from 'react';
import {
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  NitroDocumentPicker,
  NitroDocumentPickerResult,
} from 'react-native-nitro-document-picker';

enum DocumentType {
  CSV = 'csv',
  DOCX = 'docx',
  PDF = 'pdf',
}

function App(): React.JSX.Element {
  const [result, setResult] = useState<NitroDocumentPickerResult[]>([]);

  const handlePickDocuments = async () => {
    try {
      const pickedFiles = await NitroDocumentPicker.pick({
        types: [DocumentType.CSV, DocumentType.DOCX, DocumentType.PDF],
        multiple: true,
      });
      setResult(pickedFiles);
    } catch (error) {
      console.error('Error picking documents:', error);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.title}>Document Picker Demo</Text>
        <Text style={styles.subtitle}>
          Select multiple files (CSV, DOCX, PDF)
        </Text>

        <TouchableOpacity
          style={styles.pickerButton}
          onPress={handlePickDocuments}>
          <Text style={styles.pickerButtonText}>Choose Files</Text>
        </TouchableOpacity>

        {result.length > 0 && (
          <View style={styles.resultContainer}>
            <Text style={styles.resultTitle}>
              {result.length} {result.length === 1 ? 'File' : 'Files'} Selected
            </Text>
            <ScrollView style={styles.scrollView}>
              {result.map((file, index) => (
                <View key={index} style={styles.fileItem}>
                  <Text style={styles.fileName}>{file.name}</Text>
                  <Text style={styles.filePath} numberOfLines={1}>
                    {file.path}
                  </Text>
                </View>
              ))}
            </ScrollView>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#7f8c8d',
    marginBottom: 30,
    textAlign: 'center',
  },
  pickerButton: {
    backgroundColor: '#3498db',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 10,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
      },
      android: {
        elevation: 5,
      },
    }),
  },
  pickerButtonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
  },
  resultContainer: {
    marginTop: 30,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 15,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  resultTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 15,
  },
  scrollView: {
    maxHeight: 300,
  },
  fileItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#ecf0f1',
  },
  fileName: {
    fontSize: 16,
    color: '#2c3e50',
    fontWeight: '500',
  },
  filePath: {
    fontSize: 14,
    color: '#7f8c8d',
    marginTop: 4,
  },
});

export default App;
