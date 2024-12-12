import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet } from "react-native";
import { SafeAreaBox } from "../../components";
import React, { useState, useEffect } from "react";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { HomeStackParamList, Topic } from "../types";
import { Ionicons } from '@expo/vector-icons';

export function VocabularyScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<HomeStackParamList>>();
  const [topics, setTopics] = useState<Topic[]>([
    { 
      TopicID: 'contract',
      TopicName: 'Contract',
      wordCount: 20,
    },
    {
      TopicID: 'office',
      TopicName: 'Office',
      wordCount: 20,
    },
    {
      TopicID: 'marketing',
      TopicName: 'Marketing',
      wordCount: 20,
    },
    {
      TopicID: 'computer',
      TopicName: 'Computer',
      wordCount: 20,
    },
    {
      TopicID: 'salaries-and-benefits',
      TopicName: 'Salaries and Benefits',
      wordCount: 19,
    },
  ]);

  const handleAddPress = () => {
    try {
      console.log('Navigating to MyLibraryScreen');
      navigation.navigate('MyLibraryScreen');
    } catch (error) {
      console.error('Navigation error:', error);
    }
  };

  const handleDeleteTopic = (topicId: string) => {
    setTopics(currentTopics => currentTopics.filter(topic => topic.TopicID !== topicId));
  };

  const handleTopicPress = (topic: Topic) => {
    navigation.navigate('TopicsScreen', { topicId: topic.TopicID });
  };

  return (
    <SafeAreaBox>
      {/* Thanh tìm kiếm */}
      <View style={styles.searchContainer}>
        <TextInput
          placeholder="Nhập chủ đề cần tìm kiếm"
          style={styles.searchInput}
          placeholderTextColor="#666"
        />
      </View>

      <View style={styles.rootContainer}>    
        <FlatList
          data={topics}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => handleTopicPress(item)}>
              <View style={styles.card}>
                <View style={styles.cardContent}>
                  <Text style={styles.wordCount}>{item.wordCount} thuật ngữ</Text>
                  <Text style={styles.title}>{item.TopicName}</Text>
                </View>
                <View style={styles.cardActions}>
                  <TouchableOpacity>
                    <Ionicons name="pencil" size={20} color="#4A90E2" />
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => handleDeleteTopic(item.TopicID)}>
                    <Ionicons name="trash-outline" size={20} color="#FF0000" />
                  </TouchableOpacity>
                </View>
              </View>
            </TouchableOpacity>
          )}
          keyExtractor={(item) => item.TopicID}
        />
      </View>

      <TouchableOpacity style={styles.addButton} onPress={handleAddPress}>
        <Text style={styles.addButtonText}>+</Text>
      </TouchableOpacity>
    </SafeAreaBox>
  );
}

const styles = StyleSheet.create({
  rootContainer: {
    padding: 16,
    flex: 1,
    gap: 8,
  },
  searchContainer: {
    flexDirection: "row",
    marginHorizontal: 16,
    marginTop: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#E8E8E8",
    borderRadius: 25,
    backgroundColor: "#F6F6F6",
    alignItems: "center",
    paddingLeft: 16,
    paddingRight: 8,
    height: 40,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 3,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: "#000",
    padding: 0,
    outlineStyle: 'none',
  },
  searchButton: {
    padding: 8,
  },
  searchIcon: {
    fontSize: 16,
  },
  card: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#F0F0FF",
    padding: 16,
    marginBottom: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#E8E8E8",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  cardContent: {
    flex: 1,
  },
  wordCount: {
    fontSize: 12,
    color: "#666",
    marginBottom: 4,
  },
  title: {
    fontSize: 16,
    fontWeight: "500",
    color: "#000",
  },
  cardActions: {
    flexDirection: "row",
    gap: 16,
  },
  addButton: {
    backgroundColor: "#4A90E2",
    height: 50,
    width: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    marginTop: 16,
  },
  addButtonText: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "bold",
  },
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
  },
});

