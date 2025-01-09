import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet, Alert } from 'react-native';
import { SafeAreaBox } from '../../../components';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { HomeStackParamList } from '../../types';
import { Ionicons } from '@expo/vector-icons';
import type { VocabWord, VocabTopic } from '../../../data/Vocab'; // Ensure consistent casing
import { vocabTopics, getVocabByTopic } from '../../../data/vocabData';

export function EditTopicScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<HomeStackParamList>>();
  const route = useRoute();
  const { topicId, onTopicUpdated } = route.params as { 
    topicId: string;
    onTopicUpdated: (updatedTopic: VocabTopic) => void;
  };

  const [topic, setTopic] = useState<VocabTopic | null>(null);
  const [topicName, setTopicName] = useState('');
  const [words, setWords] = useState<VocabWord[]>([]);
  const [newWord, setNewWord] = useState({ word: '', vietnamese: '' });

  useEffect(() => {
    const currentTopic = getVocabByTopic(topicId);
    if (currentTopic) {
      setTopic(currentTopic);
      setTopicName(currentTopic.TopicName);
      setWords(currentTopic.words);
    }
  }, [topicId]);

  const handleAddWord = () => {
    if (newWord.word.trim() === '' || newWord.vietnamese.trim() === '') {
      Alert.alert('Lỗi', 'Vui lòng nhập đầy đủ thông tin từ vựng');
      return;
    }

    const wordId = `${topicId}_${words.length + 1}`;
    const newWordItem: VocabWord = {
      id: wordId,
      word: newWord.word.trim(),
      vietnamese: newWord.vietnamese.trim()
    };

    setWords([...words, newWordItem]);
    setNewWord({ word: '', vietnamese: '' });
  };

  const handleDeleteWord = (wordId: string) => {
    setWords(words.filter(word => word.id !== wordId));
  };

  const handleSave = () => {
    if (topicName.trim() === '') {
      Alert.alert('Lỗi', 'Vui lòng nhập tên chủ đề');
      return;
    }

    if (words.length === 0) {
      Alert.alert('Lỗi', 'Vui lòng thêm ít nhất một từ vựng');
      return;
    }

    const updatedTopic: VocabTopic = {
      TopicID: topicId,
      TopicName: topicName,
      words: words
    };

    onTopicUpdated(updatedTopic);
    navigation.goBack();
  };

  if (!topic) {
    return (
      <View style={styles.centerContent}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <SafeAreaBox>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.label}>Tên chủ đề:</Text>
          <TextInput
            style={styles.topicNameInput}
            value={topicName}
            onChangeText={setTopicName}
            placeholder="Nhập tên chủ đề"
          />
        </View>

        <View style={styles.wordInputContainer}>
          <View style={styles.wordInputRow}>
            <TextInput
              style={styles.wordInput}
              value={newWord.word}
              onChangeText={(text) => setNewWord({ ...newWord, word: text })}
              placeholder="Thuật ngữ"
            />
            <TextInput
              style={styles.wordInput}
              value={newWord.vietnamese}
              onChangeText={(text) => setNewWord({ ...newWord, vietnamese: text })}
              placeholder="Định nghĩa"
            />
          </View>
          <TouchableOpacity style={styles.addWordButton} onPress={handleAddWord}>
            <Text style={styles.addButtonText}>+</Text>
          </TouchableOpacity>
        </View>

        <FlatList
          data={words}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.wordItem}>
              <View style={styles.wordContent}>
                <Text style={styles.word}>{item.word}</Text>
                <Text style={styles.definition}>{item.vietnamese}</Text>
              </View>
              <TouchableOpacity onPress={() => handleDeleteWord(item.id)}>
                <Ionicons name="trash-outline" size={20} color="#FF0000" />
              </TouchableOpacity>
            </View>
          )}
          style={styles.wordList}
        />

        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveButtonText}>Lưu Chủ đề</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaBox>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 8,
  },
  topicNameInput: {
    borderWidth: 1,
    borderColor: '#E8E8E8',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#FFF',
  },
  wordInputContainer: {
    marginBottom: 20,
  },
  wordInputRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 8,
  },
  wordInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#E8E8E8',
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    backgroundColor: '#FFF',
  },
  addWordButton: {
    backgroundColor: '#4A90E2',
    height: 40,
    width: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
  },
  addButtonText: {
    color: '#FFF',
    fontSize: 24,
    fontWeight: 'bold',
  },
  wordList: {
    flex: 1,
  },
  wordItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#F0F0FF',
    padding: 12,
    marginBottom: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E8E8E8',
  },
  wordContent: {
    flex: 1,
  },
  word: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 4,
  },
  definition: {
    fontSize: 14,
    color: '#666',
  },
  saveButton: {
    backgroundColor: '#4A90E2',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginVertical: 16,
  },
  saveButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});