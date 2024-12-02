import React from 'react';
import { FlatList, ScrollView,View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { SpeakingScreenProps } from '../types';
//import { SafeAreaBox } from "../../components";
import { TestCard } from './components/TestCard';
import Ionicons from '@expo/vector-icons/Ionicons';

export function SpeakingListTestScreen({ navigation }: SpeakingScreenProps) {

  const TestsData = [
    { id: '1', title: 'Speaking Test 1'},
    { id: '2', title: 'Speaking Test 2'},
    { id: '3', title: 'Speaking Test 3'},
    { id: '4', title: 'Speaking Test 4'},
    { id: '5', title: 'Speaking Test 5'},
    { id: '6', title: 'Speaking Test 6'},
    { id: '7', title: 'Speaking Test 7'},
    { id: '8', title: 'Speaking Test 8'},
    // Thêm nhiều bài test khác ở đây
  ];
  
  return (
    <View>
      <View style={speakingScreen.heading}>
      <TouchableOpacity
        style={[speakingScreen.backButton, { position: 'absolute', zIndex: 1 }]}  
        onPress={() => {navigation.navigate("Home")}} 
      >
        
        <Ionicons name="chevron-back" size={30} color="white" />
      </TouchableOpacity>

      <Text style={speakingScreen.HeadingTitle}>Danh sách đề thi Speaking</Text>
      </View>
    <ScrollView>
      <View style={speakingScreen.rootContainer}>    
        <FlatList
          scrollEnabled={false}
          numColumns={2}
          data={TestsData}
          renderItem={({ item, index }) => (
            <TestCard
              title={item.title}
              index={index}
              onPress={() => {
                  navigation.navigate("Home")
              }}
            />
          )}
          keyExtractor={(item) => item.id}
        />
      </View>
    </ScrollView>
  </View>
  );
}

const speakingScreen = StyleSheet.create({
  rootContainer: {
    padding: 16,
    gap: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#525252",
  },
  HeadingTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    paddingTop : 40,
    textAlign: 'center'
  },
  heading: {
    height: 80,
    backgroundColor: '#5799DB',
    borderRadius: 5,   
  },
  backButton: {
    position: 'absolute',
    left: 10,  
    top: '50%',  
    transform: [{ translateY: -10 }],  
    padding: 10,
    borderRadius: 5,
  },
  backButtonText: {
    fontSize: 16,
    color: 'white',
    fontWeight: 'bold',
  },
});