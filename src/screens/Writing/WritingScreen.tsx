import React, { useEffect, useState } from 'react';
import { FlatList, View, StyleSheet } from 'react-native';
import { WritingScreenProps } from '../types';
import { PartCard } from './components/PartCard';
import { SafeAreaBox } from "../../components";



export function WritingScreen({ navigation }: WritingScreenProps) {

  const Parts = [
    { PartNumber: '1', 
      Title: 'Mô tả hình ảnh với từ khóa', 
      image: {
        source: require('../../../assets/toeic_writing_part1.png'),
        alt: 'Mô tả hình ảnh với từ khóa' },
    },
    { PartNumber: '2', 
      Title: 'Viết email phản hồi',
      image: {
        source: require('../../../assets/toeic_writing_part2.png'),
        alt: 'Viết email phản hồi' },
    },
    { PartNumber: '3', 
      Title: 'Viết bài luận bày tỏ quan điểm cá nhân', 
      image: {
        source: require('../../../assets/toeic_writing_part3.png'),
        alt: 'Viết bài luận bày tỏ quan điểm cá nhân' },
    },
  ];

  return (
    <SafeAreaBox>
      <View style={writingScreen.rootContainer}>    
        <FlatList
          numColumns={2}
          data={Parts}
          renderItem={({ item, index }) => (
            <PartCard
              title={`Part ${item.PartNumber}\n`+item.Title}
              image={item.image}
              index={index}
              onPress={() => {  
                navigation.navigate("InforTestScreenWR", { PartNumber: item.PartNumber});
              }}
            />
          )}
          keyExtractor={(item) => item.PartNumber}
          //key = {1}
        />
      </View>
    </SafeAreaBox>
  );
}

const writingScreen = StyleSheet.create({
  rootContainer: {
    padding: 8,
    flex: 1,
    gap: 8,
    marginTop:20
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
    paddingTop : 20,
    textAlign: 'center',
    borderWidth: 1,
    
  },
  heading: {
    height: 70,
    backgroundColor: '#5799DB',
    borderRadius: 5,   
  },
  
});
