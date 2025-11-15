import React, {useState} from 'react';
import {
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Alert,
} from 'react-native';
import {
  NitroDocumentPicker,
  NitroDocumentPickerResult,
  NitroDocumentType,
} from 'react-native-nitro-document-picker';

type FileResult = NitroDocumentPickerResult | NitroDocumentPickerResult[];

const types: NitroDocumentType[] = ['csv', 'txt', 'pdf', 'docx', 'xlsx', 'pptx'];

function HomeScreen(): React.JSX.Element {
  const [result, setResult] = useState<FileResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handlePickSingle = async () => {
    try {
      setIsLoading(true);
      const pickedFile = await NitroDocumentPicker.pick({
        types,
        multiple: false,
      });
      setResult(pickedFile);
    } catch (error: any) {
      if (error?.message?.includes('cancelled')) {
        // User cancelled, no error needed
        return;
      }
      Alert.alert('Error', error?.message || 'Failed to pick document');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePickMultiple = async () => {
    try {
      setIsLoading(true);
      const pickedFiles = await NitroDocumentPicker.pick({
        types,
        multiple: true,
      });
      setResult(pickedFiles);
    } catch (error: any) {
      if (error?.message?.includes('cancelled')) {
        return;
      }
      Alert.alert('Error', error?.message || 'Failed to pick documents');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePickWithSizeLimit = async () => {
    try {
      setIsLoading(true);
      const pickedFile = await NitroDocumentPicker.pick({
        types: ['pdf'],
        multiple: false,
        maxFileSize: 5 * 1024 * 1024, // 5MB
      });
      setResult(pickedFile);
    } catch (error: any) {
      if (error?.message?.includes('cancelled')) {
        return;
      }
      Alert.alert('Error', error?.message || 'Failed to pick document');
    } finally {
      setIsLoading(false);
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
  };

  const files = Array.isArray(result) ? result : result ? [result] : [];

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>🚀 Nitro Document Picker</Text>
          <Text style={styles.subtitle}>
            High-performance document picker powered by Nitro
          </Text>
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.button, styles.primaryButton]}
            onPress={handlePickSingle}
            disabled={isLoading}>
            <Text style={styles.buttonText}>
              {isLoading ? '⏳ Loading...' : '📄 Pick Single File'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.secondaryButton]}
            onPress={handlePickMultiple}
            disabled={isLoading}>
            <Text style={styles.buttonText}>
              {isLoading ? '⏳ Loading...' : '📚 Pick Multiple Files'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.tertiaryButton]}
            onPress={handlePickWithSizeLimit}
            disabled={isLoading}>
            <Text style={styles.buttonText}>
              {isLoading ? '⏳ Loading...' : '📏 Pick PDF (5MB limit)'}
            </Text>
          </TouchableOpacity>
        </View>

        {files.length > 0 && (
          <View style={styles.resultContainer}>
            <View style={styles.resultHeader}>
              <Text style={styles.resultTitle}>
                {files.length} {files.length === 1 ? 'File' : 'Files'} Selected
              </Text>
              <TouchableOpacity
                style={styles.clearButton}
                onPress={() => setResult(null)}>
                <Text style={styles.clearButtonText}>Clear</Text>
              </TouchableOpacity>
            </View>

            {files.map((file, index) => (
              <View key={index} style={styles.fileCard}>
                <View style={styles.fileHeader}>
                  <Text style={styles.fileIcon}>
                    {file.mimeType.includes('pdf') ? '📄' :
                     file.mimeType.includes('word') ? '📝' :
                     file.mimeType.includes('sheet') ? '📊' :
                     file.mimeType.includes('presentation') ? '📽️' :
                     '📄'}
                  </Text>
                  <View style={styles.fileInfo}>
                    <Text style={styles.fileName} numberOfLines={1}>
                      {file.name}
                    </Text>
                    <Text style={styles.fileMeta}>
                      {formatFileSize(file.size)} • {file.mimeType || 'Unknown type'}
                    </Text>
                  </View>
                </View>
                <Text style={styles.filePath} numberOfLines={2}>
                  {file.path}
                </Text>
              </View>
            ))}
          </View>
        )}

        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>✨ Features</Text>
          <Text style={styles.infoText}>• Lightning-fast performance</Text>
          <Text style={styles.infoText}>• Parallel file processing</Text>
          <Text style={styles.infoText}>• File size validation</Text>
          <Text style={styles.infoText}>• Multiple file support</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  container: {
    flex: 1,
  },
  content: {
    padding: 20,
  },
  header: {
    marginBottom: 30,
    alignItems: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#7f8c8d',
    textAlign: 'center',
  },
  buttonContainer: {
    marginBottom: 30,
    gap: 12,
  },
  button: {
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: 'center',
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
  primaryButton: {
    backgroundColor: '#3498db',
  },
  secondaryButton: {
    backgroundColor: '#9b59b6',
  },
  tertiaryButton: {
    backgroundColor: '#e67e22',
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  resultContainer: {
    marginBottom: 30,
  },
  resultHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  resultTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#2c3e50',
  },
  clearButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#e74c3c',
    borderRadius: 6,
  },
  clearButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
  fileCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 1},
        shadowOpacity: 0.1,
        shadowRadius: 3,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  fileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  fileIcon: {
    fontSize: 32,
    marginRight: 12,
  },
  fileInfo: {
    flex: 1,
  },
  fileName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 4,
  },
  fileMeta: {
    fontSize: 12,
    color: '#7f8c8d',
  },
  filePath: {
    fontSize: 12,
    color: '#95a5a6',
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
    marginTop: 8,
  },
  infoCard: {
    backgroundColor: '#ecf0f1',
    borderRadius: 12,
    padding: 20,
    marginTop: 10,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 12,
  },
  infoText: {
    fontSize: 14,
    color: '#34495e',
    marginBottom: 6,
    lineHeight: 20,
  },
});

export default HomeScreen;

