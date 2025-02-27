import React, { useEffect, useState } from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";
import { SafeAreaBox } from "../../components";
import { ActivityIndicator } from "react-native";
import { getUserApi } from "../../utils/api";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface User {
  _id: string;
  email: string;
  name: string;
  role: string;
}

export function NoteScreen() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    const fetchUser = async () => {
      try {
        const data = await getUserApi();
        //console.log("Dữ liệu người dùng:", data);
        setUsers(data);
        // const AT = await AsyncStorage.getItem("access_token");
        // console.log(">>> Check access_token:", AT);
      } catch (error) {
        console.error("Lỗi tải dữ liệu:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  if (loading) {
    return (
      <SafeAreaBox>
        <View style={styles.centered}>
          <ActivityIndicator size="large" color="#007bff" />
        </View>
      </SafeAreaBox>
    );
  }

  return (
    <SafeAreaBox>
      <View style={styles.container}>
        <Text style={styles.title}>Danh sách người dùng</Text>
        <FlatList
          data={users}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            <View style={styles.item}>
              <Text style={styles.name}>{item.name}</Text>
              <Text style={styles.email}>{item.email}</Text>
              <Text style={styles.role}>{item.role}</Text>
            </View>
          )}
        />
      </View>
    </SafeAreaBox>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  item: {
    padding: 10,
    marginVertical: 5,
    backgroundColor: "#f9f9f9",
    borderRadius: 8,
  },
  name: {
    fontSize: 16,
    fontWeight: "bold",
  },
  email: {
    fontSize: 14,
    color: "gray",
  },
  role: {
    fontSize: 14,
    fontStyle: "italic",
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
