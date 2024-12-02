import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export function VocabularyScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>This is vocabulary screen. Customize it as you wish!</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  text: {
    fontSize: 18,
    color: '#333',
  },
});