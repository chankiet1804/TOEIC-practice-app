
import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { SafeAreaBox } from "../../components";
import { ActivityIndicator } from "react-native";
import { getAnswerWRApi } from "../../utils/api";
import { useAuth } from "../../components/Context/auth.context";

interface AnswerWR {
  UserID : string,
  QuestionID : string,
  Content : string
}

export function NoteScreen() {
  const [answer, setAnswer] = useState<AnswerWR>();
  const [loading, setLoading] = useState(false);
  const {auth} = useAuth();


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
        <Text style={styles.title}>Note screen</Text>
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
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
