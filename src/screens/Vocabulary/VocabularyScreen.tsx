import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet } from "react-native";
import { SafeAreaBox } from "../../components";
import React, { useState } from "react";

export function VocabularyScreen() {
  // Dữ liệu mẫu về các chủ đề
  const [topics, setTopics] = useState([
    { id: "1", termCount: 30, title: "Natural" },
    { id: "2", termCount: 25, title: "Society and culture" },
    { id: "3", termCount: 42, title: "Education" },
    { id: "4", termCount: 42, title: "Education" },
  ]);

  // Hàm xóa chủ đề
  const handleDelete = (id: string) => {
    setTopics(topics.filter(topic => topic.id !== id));
  };

  return (
    <SafeAreaBox>
      {/* Tiêu đề */}
      <View style={styles.header}>
        <Text style={styles.headerText}>Thư viện của tôi</Text>
      </View>

      {/* Thanh tìm kiếm */}
      <View style={styles.searchContainer}>
        <TextInput
          placeholder="Nhập chủ đề cần tìm kiếm"
          style={styles.searchInput}
          placeholderTextColor="#666"
        />
        <TouchableOpacity style={styles.searchButton}>
          <Text style={styles.searchIcon}>🔍</Text>
        </TouchableOpacity>
      </View>

      {/* Danh sách các chủ đề */}
      <FlatList
        data={topics}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.cardContent}>
              <Text style={styles.termCount}>{item.termCount} thuật ngữ</Text>
              <Text style={styles.title}>{item.title}</Text>
            </View>
            <View style={styles.cardActions}>
              <TouchableOpacity>
                <Text>✏️</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handleDelete(item.id)}>
                <Text>🗑️</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />

      {/* Nút thêm */}
      <TouchableOpacity style={styles.addButton}>
        <Text style={styles.addButtonText}>+</Text>
      </TouchableOpacity>
    </SafeAreaBox>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: "#4A90E2",
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
    alignItems: "center",
  },
  headerText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  searchContainer: {
    flexDirection: "row",
    marginHorizontal: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#E8E8E8",
    borderRadius: 25,
    backgroundColor: "#F6F6F6",
    alignItems: "center",
    paddingLeft: 16,
    paddingRight: 8,
    height: 40,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: "#000",
    padding: 0,
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
    backgroundColor: "#e6e6fa",
    padding: 16,
    marginBottom: 8,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 1 },
  },
  cardContent: {
    flex: 1,
  },
  termCount: {
    fontSize: 14,
    color: "#666",
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 4,
  },
  cardActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: 50,
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
});

