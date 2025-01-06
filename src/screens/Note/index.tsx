import React, { useEffect, useState } from 'react';
import { View, Button, Text, StyleSheet } from 'react-native';
import * as SpeechRecognition from 'expo-speech-recognition';

// Định nghĩa interfaces
interface SpeechResult {
  value: string[];
  isFinal: boolean;
}

interface SpeechError {
  message: string;
}

interface SpeechState {
  isListening: boolean;
  results: string[];
  partialResults: string[];
  error?: string;
}

const SpeechRecognitionComponent: React.FC = () => {
  // State management
  const [state, setState] = useState<SpeechState>({
    isListening: false,
    results: [],
    partialResults: [],
  });

  // Kiểm tra và xin quyền khi component mount
  useEffect(() => {
    const checkPermissions = async () => {
      try {
        const { granted } = await SpeechRecognition.requestPermissionsAsync();
        if (!granted) {
          setState(prev => ({
            ...prev,
            error: 'Permission to access microphone was denied'
          }));
        }
      } catch (error) {
        setState(prev => ({
          ...prev,
          error: 'Error requesting permissions: ' + (error as Error).message
        }));
      }
    };

    checkPermissions();
  }, []);

  const startListening = async () => {
    try {
      setState(prev => ({ ...prev, isListening: true }));
      
      await SpeechRecognition.startListeningAsync(
        {
          language: 'vi-VN',
          partialResults: true,
          cancelOnStop: true
        },
        {
          onPartialResults: (result: SpeechResult) => {
            setState(prev => ({
              ...prev,
              partialResults: result.value
            }));
          },
          onResults: (result: SpeechResult) => {
            setState(prev => ({
              ...prev,
              results: [...prev.results, ...result.value]
            }));
          },
          onError: (error: SpeechError) => {
            setState(prev => ({
              ...prev,
              error: error.message,
              isListening: false
            }));
          }
        }
      );
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: 'Error starting speech recognition: ' + (error as Error).message,
        isListening: false
      }));
    }
  };

  const stopListening = async () => {
    try {
      await SpeechRecognition.stopListeningAsync();
      setState(prev => ({ ...prev, isListening: false }));
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: 'Error stopping speech recognition: ' + (error as Error).message,
        isListening: false
      }));
    }
  };

  return (
    <View style={styles.container}>
      <Button
        title={state.isListening ? "Stop" : "Start"}
        onPress={state.isListening ? stopListening : startListening}
      />
      
      {state.error && (
        <Text style={styles.errorText}>Error: {state.error}</Text>
      )}

      {state.isListening && (
        <Text style={styles.statusText}>Listening...</Text>
      )}

      {state.partialResults.length > 0 && (
        <View style={styles.resultContainer}>
          <Text style={styles.headerText}>Partial Results:</Text>
          <Text>{state.partialResults.join(' ')}</Text>
        </View>
      )}

      {state.results.length > 0 && (
        <View style={styles.resultContainer}>
          <Text style={styles.headerText}>Results:</Text>
          {state.results.map((result, index) => (
            <Text key={index}>{result}</Text>
          ))}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  statusText: {
    marginTop: 10,
    fontStyle: 'italic',
  },
  errorText: {
    color: 'red',
    marginTop: 10,
  },
  resultContainer: {
    marginTop: 20,
  },
  headerText: {
    fontWeight: 'bold',
    marginBottom: 5,
  },
});

export default SpeechRecognitionComponent;

export function NoteScreen() {
  return (
    <View style={{ flex: 1 }}>
      <SpeechRecognitionComponent />
    </View>
  );
}