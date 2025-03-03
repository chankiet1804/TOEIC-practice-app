
import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { SafeAreaBox } from "../../components";
import { ActivityIndicator } from "react-native";
import { getAnswerSPApi } from "../../utils/api";
import { useAuth } from "../../components/Context/auth.context";

interface AnswerSP {
  QuestionID : string,
  RecordingPath : string,
  ContentOfSpeaking : string
}

export function NoteScreen() {
  const [answer, setAnswer] = useState<AnswerSP>();
  const [loading, setLoading] = useState(true);
  const {auth} = useAuth();

  useEffect(() => {
    const fetchData = async () => {
      try {
        
        const data = await getAnswerSPApi(auth?.userId,"1_1_1");
        console.log("Dữ liệu cau tra loi:", data);
        setAnswer(data);
        // const AT = await AsyncStorage.getItem("access_token");
        // console.log(">>> Check access_token:", AT);
      } catch (error) {
        console.error("Lỗi tải dữ liệu:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
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
        <Text style={styles.title}>Question</Text>
        <Text>{answer?.QuestionID}</Text>
        <Text>{answer?.RecordingPath}</Text>
        <Text>{answer?.ContentOfSpeaking}</Text>
        <Text>{auth?.userId}</Text>
        <Text>{auth?.name}</Text>
        <Text>{auth?.email}</Text>
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
