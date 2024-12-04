import React from 'react';
import { FlatList, ScrollView,View, StyleSheet } from 'react-native';
import { SpeakingScreenProps } from '../types';
import { TestCard } from './components/TestCard';
import { SafeAreaBox } from "../../components";

export function SpeakingScreen({ navigation }: SpeakingScreenProps) {

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
    <SafeAreaBox>
      <View>
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
                    navigation.navigate("InforTestScreen")
                }}
              />
            )}
            keyExtractor={(item) => item.id}
          />
        </View>
      </ScrollView>
    </View>
  </SafeAreaBox>
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
  
});
