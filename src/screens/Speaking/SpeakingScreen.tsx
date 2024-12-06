import React, { useEffect, useState } from 'react';
import { FlatList, View, StyleSheet } from 'react-native';
import { SpeakingScreenProps } from '../types';
import { PartCard } from './components/PartCard';
import { SafeAreaBox } from "../../components";
//import { createTables, getDBConnection, insertTests,getAllTests, insertParts, getPartsForTest } from '../../database/db-service';


export function SpeakingScreen({ navigation }: SpeakingScreenProps) {

  const Parts = [
    { PartNumber: '1', 
      Title: 'Đọc đoạn văn',
      image: {
        source: require('../../../assets/toeic_speaking_part1.jpg'),
        alt: 'Đọc đoạn văn' },
    },
    { PartNumber: '2', 
      Title: 'Mô tả hình ảnh',
      image: {
        source: require('../../../assets/toeic_speaking_part2.jpg'),
        alt: 'Mô tả hình ảnh' },
    },
    { PartNumber: '3', 
      Title: 'Trả lời câu hỏi với tình huống',
      image: {
        source: require('../../../assets/toeic_speaking_part3.jpg'),
        alt: 'Trả lời câu hỏi với tình huống' },
    },
    { PartNumber: '4', 
      Title: 'Trả lời câu hỏi với thông tin cho trước',
      image: {
        source: require('../../../assets/toeic_speaking_part4.jpg'),
        alt: 'Trả lời câu hỏi với thông tin cho trước' },
    },
    { PartNumber: '5', 
      Title: 'Bày tỏ quan điểm cá nhân',
      image: {
        source: require('../../../assets/toeic_speaking_part5.jpg'),
        alt: 'Bày tỏ quan điểm cá nhân' },
    },
  ];

  // const [testsData, setTestsData] = useState<any>([]);

  // useEffect(() => {
  //   const initDatabase = async () => {
  //     try {
  //       const db = await getDBConnection();
  //       await createTables(db);
  //       await insertTests(db);
  //       await insertParts(db);
        
  //       const tests = await getAllTests(db);
        
  //       setTestsData(tests);
  //     } catch (error) {
  //       console.error('Database initialization error:', error);
  //     }
  //   };
  
  //   initDatabase();
  // }, []);

  return (
    <SafeAreaBox>
      <View style={speakingScreen.rootContainer}>    
        <FlatList
          numColumns={2}
          data={Parts}
          renderItem={({ item, index }) => (
            <PartCard
              title={`Part ${item.PartNumber}\n`+item.Title}
              image={item.image}
              index={index}
              onPress={() => {  
                navigation.navigate("InforTestScreen", { PartNumber: item.PartNumber});
              }}
            />
          )}
          keyExtractor={(item) => item.PartNumber}
        />
      </View>
    </SafeAreaBox>
  );
}

const speakingScreen = StyleSheet.create({
  rootContainer: {
    padding: 16,
    flex: 1,
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
