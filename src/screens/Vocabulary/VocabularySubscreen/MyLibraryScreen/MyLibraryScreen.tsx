import React, { useRef, useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaBox } from "../../../../components";
import { useRoute } from '@react-navigation/native';
import { HomeStackParamList, MyLibraryScreenProps } from '../../../types';
import { RouteProp } from '@react-navigation/native';
import { PanGestureHandler, State } from 'react-native-gesture-handler';
import { insertTopics, getDBConnection } from '../../../../database/db-service';
import * as SQLite from 'expo-sqlite';

type MyLibraryScreenRouteProp = RouteProp<HomeStackParamList, 'MyLibraryScreen'>;

const itemWidth = 300; // Set this to the actual width of your vocabulary item

export function MyLibraryScreen({ navigation }: MyLibraryScreenProps) {
  const route = useRoute<MyLibraryScreenRouteProp>();
  const [title, setTitle] = React.useState('');
  const [description, setDescription] = React.useState('');
  const [vocabularyList, setVocabularyList] = React.useState<{ id: number; term: string; definition: string }[]>([
    { id: 1, term: '', definition: '' },
    { id: 2, term: '', definition: '' },
  ]);
  const [swipeX, setSwipeX] = React.useState<{ [key: number]: number }>({});
  const scrollViewRef = useRef<ScrollView>(null);
  const [db, setDb] = useState<SQLite.SQLiteDatabase | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const initializeDB = async () => {
      try {
        const database = await getDBConnection();
        setDb(database);
      } catch (error) {
        console.error('Error initializing database:', error);
        Alert.alert('Lỗi', 'Không thể kết nối với cơ sở dữ liệu');
      }
    };

    initializeDB();
  }, []);

  const handleSaveTopic = async () => {
    // Validation
    if (!title.trim()) {
      Alert.alert('Lỗi', 'Vui lòng nhập tiêu đề chủ đề');
      return;
    }

    const hasEmptyFields = vocabularyList.some(item => !item.term.trim() || !item.definition.trim());
    if (hasEmptyFields) {
      Alert.alert('Lỗi', 'Vui lòng điền đầy đủ thuật ngữ và định nghĩa');
      return;
    }

    if (!db) {
      Alert.alert('Lỗi', 'Không thể kết nối với cơ sở dữ liệu');
      return;
    }

    try {
      setIsSaving(true);

      // Chuẩn bị dữ liệu để lưu
      const vocabData = {
        topic: title,
        description: description,
        vocabulary: vocabularyList.map(item => ({
          id: item.id.toString(),
          term: item.term,
          definition: item.definition,
        })),
      };

      // Lưu vào database
      await insertTopics(db, vocabData);

      // Gọi callback để cập nhật danh sách topic trong VocabularyScreen
      if (route.params?.onTopicAdded) {
        const newTopic = {
          TopicID: title.toLowerCase().replace(/\s+/g, '-'),
          TopicName: title,
          wordCount: vocabularyList.length,
        };
        route.params.onTopicAdded(newTopic);
      }

      Alert.alert('Thành công', 'Đã lưu chủ đề thành công');
    } catch (error) {
      console.error('Error saving topic:', error);
      Alert.alert('Lỗi', 'Không thể lưu chủ đề. Vui lòng thử lại.');
    } finally {
      setIsSaving(false);
    }
  };

  useEffect(() => {
    if (navigation) {
      navigation.setParams({
        handleSaveTopic: handleSaveTopic, // Đảm bảo hàm này đã được định nghĩa
      });
    }
  }, [handleSaveTopic]);

  const addVocabularyItem = () => {
    const newItem = { id: vocabularyList.length + 1, term: '', definition: '' };
    setVocabularyList([...vocabularyList, newItem]);
    setSwipeX(prev => ({ ...prev, [newItem.id]: 0 }));
    scrollViewRef.current?.scrollToEnd({ animated: true });
  };

  const deleteVocabularyItem = (id: number) => {
    setVocabularyList(prevList => {
      const newList = prevList.filter(item => item.id !== id);
      return newList;
    });
    setSwipeX(prevSwipeX => {
      const newSwipeX = { ...prevSwipeX };
      delete newSwipeX[id]; // Xóa trạng thái swipeX của khung đã xóa
      return newSwipeX;
    });
  };

  const onGestureEvent = (event: any, id: number) => {
    if (event.nativeEvent.state === State.ACTIVE) {
      const translationX = event.nativeEvent.translationX;
      if (translationX < 0 && Math.abs(translationX) <= itemWidth) {
        setSwipeX(prev => ({ ...prev, [id]: translationX }));
      }
    } else if (event.nativeEvent.state === State.END) {
      const translationX = event.nativeEvent.translationX;
      if (translationX < -itemWidth * (1 / 3)) {
        deleteVocabularyItem(id);
      } else {
        setSwipeX(prev => ({ ...prev, [id]: 0 })); // Đặt lại trạng thái cho khung hiện tại
      }
    }
  };

  return (
    <SafeAreaBox>
      <ScrollView ref={scrollViewRef} style={styles.container}>
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
          <PanGestureHandler onGestureEvent={(event) => onGestureEvent(event, item.id)} key={item.id}>
            <View style={styles.vocabularyItem}>
              <View style={[styles.inputContainer, { transform: [{ translateX: swipeX[item.id] || 0 }] }]}>
                <TextInput
                  style={styles.termInput}
                  placeholder=""
                  value={item.term}
                  onChangeText={(text) => {
                    setVocabularyList(prevList => 
                      prevList.map(vocabItem => 
                        vocabItem.id === item.id ? { ...vocabItem, term: text } : vocabItem
                      )
                    );
                  }}
                />
                <Text style={styles.helperText}>Thuật ngữ</Text>
                <TextInput
                  style={styles.definitionInput}
                  placeholder=""
                  value={item.definition}
                  onChangeText={(text) => {
                    setVocabularyList(prevList => 
                      prevList.map(vocabItem => 
                        vocabItem.id === item.id ? { ...vocabItem, definition: text } : vocabItem
                      )
                    );
                  }}
                />
                <Text style={styles.helperText}>Định nghĩa</Text>
              </View>
              {swipeX[item.id] < -itemWidth * (1 / 3) && (
                <TouchableOpacity style={styles.deleteButton} onPress={() => deleteVocabularyItem(item.id)}>
                  <Text style={styles.deleteButtonText}>🗑️</Text>
                </TouchableOpacity>
              )}
            </View>
          </PanGestureHandler>
        ))}

        <TouchableOpacity style={styles.addButton} onPress={addVocabularyItem}>
          <Text style={styles.addButtonText}>+</Text>
        </TouchableOpacity>
        {/* <TouchableOpacity 
          style={[styles.saveButton, isSaving && styles.saveButtonDisabled]} 
          onPress={handleSaveTopic}
          disabled={isSaving}
        >
          {isSaving ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.saveButtonText}>Lưu</Text>
          )}
        </TouchableOpacity> */}
      </ScrollView>
      {/* <TouchableOpacity 
          style={[styles.saveButton, isSaving && { opacity: 0.7 }]} 
          onPress={handleSaveTopic}
          disabled={isSaving}
        >
          {isSaving ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.saveButtonText}>Lưu</Text>
          )}
        </TouchableOpacity> */}
    </SafeAreaBox>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f0f4ff',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
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
  inputContainer: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 8,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    elevation: 5,
  },
  termInput: {
    borderBottomWidth: 2,
    borderColor: '#000',
    padding: 8,
    marginBottom: 2,
  },
  definitionInput: {
    borderBottomWidth: 2,
    borderColor: '#000',
    padding: 8,
    marginBottom: 4,
  },
  helperText: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
    textAlign: 'left',
    fontWeight: 'bold',
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
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  addButtonText: {
    color: 'white',
    fontSize: 24,
  },
  deleteButton: {
    position: 'absolute',
    right: 10,
    top: 10,
    backgroundColor: 'transparent',
  },
  deleteButtonText: {
    fontSize: 24,
  },
  saveButton: {
    backgroundColor: "#4A90E2",
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    marginTop: 16,
    width: '80%',
  },
  saveButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  saveButtonDisabled: {
    opacity: 0.7,
  }
});

