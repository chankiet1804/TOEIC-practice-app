import {
  ExpoSpeechRecognitionModule,
  useSpeechRecognitionEvent,
} from "expo-speech-recognition";

import React, { useState } from "react";
import { Button, ScrollView, Text, View } from "react-native";

export function NoteScreen() {
  const [recognizing, setRecognizing] = useState(false);
  //const [transcript, setTranscript] = useState("");
  const [transcriptHistory, setTranscriptHistory] = useState<string[]>([]);
  const [contentOfSpeaking, setContentOfSpeaking] = useState<string>('');

  useSpeechRecognitionEvent("start", () => setRecognizing(true));
  useSpeechRecognitionEvent("end", () => setRecognizing(false));
  useSpeechRecognitionEvent("result", (event) => {
    if (event.results[0]?.transcript) {
      const newTranscript = event.results[0].transcript;
      
      // Cập nhật transcriptHistory
      setTranscriptHistory(prev => [...prev, newTranscript]);
      
      // Cập nhật contentOfSpeaking, kiểm tra trùng lặp
      setContentOfSpeaking((prev) => {
        const newContent = newTranscript.trim();
        // Kiểm tra xem nội dung mới đã có trong chuỗi trước đó chưa
        if (!prev.includes(newContent)) {
          return prev ? `${prev}\n${newContent}` : newContent;
        }
        return prev;
      });
    }
  });
  useSpeechRecognitionEvent("error", (event) => {
    console.log("error code:", event.error, "error message:", event.message);
  });

  const handleStart = async () => {
    const result = await ExpoSpeechRecognitionModule.requestPermissionsAsync();
    if (!result.granted) {
      console.warn("Permissions not granted", result);
      return;
    }
    // Start speech recognition
    ExpoSpeechRecognitionModule.start({
      lang: "en-US",
      interimResults: false,
      maxAlternatives: 1,
      continuous: true,
      requiresOnDeviceRecognition: false,
      addsPunctuation: false,
      //contextualStrings: ["Carlsen", "Nepomniachtchi", "Praggnanandhaa"],
    });
  };

  const handleReset = () => {
    setTranscriptHistory([]);
    setContentOfSpeaking('');
  };

  return (
    <View style={{ padding: 10 }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-around', marginBottom: 10,padding:10 }}>
        {!recognizing ? (
          <Button title="Start" onPress={handleStart} />
        ) : (
          <Button
            title="Stop"
            onPress={() => {
              
              ExpoSpeechRecognitionModule.stop()
              console.log(contentOfSpeaking);
            }}
          />
        )}
        <Button title="Reset" onPress={handleReset} />
      </View>

      <View style={{ marginBottom: 20,padding:10 }}>
        <Text style={{ fontWeight: 'bold', marginBottom: 5 }}>History:</Text>
        <ScrollView style={{ maxHeight: 150, borderWidth: 1, padding: 10 }}>
          {transcriptHistory.map((text, index) => (
            <Text key={index} style={{ marginBottom: 5 }}>
              {text}
            </Text>
          ))}
        </ScrollView>
      </View>

      <View>
        <Text style={{ fontWeight: 'bold', marginBottom: 5 }}>Unique Content:</Text>
        <ScrollView style={{ maxHeight: 150, borderWidth: 1, padding: 10 }}>
          <Text>{contentOfSpeaking || 'No content yet...'}</Text>
        </ScrollView>
      </View>
    </View>
  );
}