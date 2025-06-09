import React, {useState} from 'react';
import {Button, StyleSheet, Text, View} from 'react-native';
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

  return (
    <View style={styles.container}>
      {result.length > 0 && (
        <Text
          style={[
            styles.text,
            {
              fontSize: 16,
              fontWeight: 'bold',
              color: 'hsl(210, 100%, 50%)',
              marginBottom: 10,
              textTransform: 'uppercase',
              width: '100%',
              textAlign: 'center',
            },
          ]}>
          {result.length} files selected
        </Text>
      )}
      <Text numberOfLines={10} style={styles.text}>
        {result.map(r => r.base64).join('\n')}
        {result.map(r => r.path).join('\n')}
      </Text>

      <Button
        title="Open Document Picker"
        onPress={() => {
          NitroDocumentPicker.pick({
            types: [DocumentType.CSV, DocumentType.DOCX, DocumentType.PDF],
            multiple: true,
          })
            .then(setResult)
            .catch(console.error);
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 14,
    color: 'green',
  },
});

export default App;
