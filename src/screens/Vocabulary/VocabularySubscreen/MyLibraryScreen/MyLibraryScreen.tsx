import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { SafeAreaBox } from "../../../../components";
import { useRoute} from '@react-navigation/native';
import { HomeStackParamList, MyLibraryScreenProps} from '../../../types';
import { RouteProp } from '@react-navigation/native';
import { Modal } from 'react-native';

type MyLibraryScreenRouteProp = RouteProp<HomeStackParamList, 'MyLibraryScreen'>;

export function MyLibraryScreen({ navigation }: MyLibraryScreenProps) {
  const route = useRoute<MyLibraryScreenRouteProp>();
  const [title, setTitle] = React.useState('');
  const [description, setDescription] = React.useState('');
  const [vocabularyList, setVocabularyList] = React.useState([
    { id: 1, term: '', definition: '' },
    { id: 2, term: '', definition: '' },
    { id: 3, term: '', definition: '' },
  ]);

  return (
    <SafeAreaBox>
      <ScrollView style={styles.container}>
        <TextInput
          style={styles.titleInput}
          placeholder="Nhập tiêu đề, ví dụ: 'Animal and plant'"
          value={title}
          onChangeText={setTitle}
        />
        
        <TextInput
          style={styles.descriptionInput}
          placeholder="Thêm mô tả..."
          value={description}
          onChangeText={setDescription}
          multiline
        />

        {vocabularyList.map((item) => (
          <View key={item.id} style={styles.vocabularyItem}>
            <View style={styles.termContainer}>
              <TextInput
                style={styles.termInput}
                placeholder="THUẬT NGỮ"
                value={item.term}
                onChangeText={(text) => {
                  setVocabularyList(vocabularyList.map(vocabItem => 
                    vocabItem.id === item.id ? {...vocabItem, term: text} : vocabItem
                  ));
                }}
              />
              <TextInput
                style={styles.definitionInput}
                placeholder="ĐỊNH NGHĨA"
                value={item.definition}
                onChangeText={(text) => {
                  setVocabularyList(vocabularyList.map(vocabItem => 
                    vocabItem.id === item.id ? {...vocabItem, definition: text} : vocabItem
                  ));
                }}
              />
            </View>
          </View>
        ))}

        <TouchableOpacity style={styles.addButton}>
          <Text style={styles.addButtonText}>+</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaBox>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  titleInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  descriptionInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    height: 100,
    marginBottom: 16,
  },
  vocabularyItem: {
    marginBottom: 16,
  },
  termContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  termInput: {
    flex: 1,
    borderBottomWidth: 1,
    borderColor: '#ccc',
    marginRight: 8,
    padding: 8,
  },
  definitionInput: {
    flex: 1,
    borderBottomWidth: 1,
    borderColor: '#ccc',
    marginLeft: 8,
    padding: 8,
  },
  addButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#4A90E2',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginTop: 16,
  },
  addButtonText: {
    color: 'white',
    fontSize: 24,
  },
});

