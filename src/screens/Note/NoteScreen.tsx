
import React, { useEffect, useState } from "react";
import { Button, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaBox } from "../../components";
import axios from "../../utils/axios.customize";

export function NoteScreen() {
  //console.log(">>> NoteScreen rendered");
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    const fetchHelloWorld = async () => {
      try {
        const res = await axios.get("/v1/api"); // Đổi localhost thành IP máy, 10.0.2.2 la ip cua android studio
        console.log(">>> check res : ", res);
        setData(res);
      } catch (error) {
        console.error(">>> API fetch error: ", error);
      }
    };
    fetchHelloWorld();
  }, []);

  return (
    <SafeAreaBox>
      <View style={styles.container}>
        <Text style={styles.title}>{data}</Text>
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
    fontSize: 24,
    fontWeight: "600",
    color: "#333",
  },
});