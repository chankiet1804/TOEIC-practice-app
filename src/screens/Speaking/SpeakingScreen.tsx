import React, { useEffect, useState } from 'react';
import { FlatList, View, StyleSheet } from 'react-native';
import { SpeakingScreenProps } from '../types';
import { TestCard } from './components/TestCard';
import { SafeAreaBox } from "../../components";
import { createTables, getDBConnection, insertTests,getAllTests } from '../../database/db-service';


export function SpeakingScreen({ navigation }: SpeakingScreenProps) {

  // const TestsData = [
  //   { TestID: '1', Title: 'Speaking Test 1'},
  //   { TestID: '2', Title: 'Speaking Test 2'},
  //   { TestID: '3', Title: 'Speaking Test 3'},
  //   { TestID: '4', Title: 'Speaking Test 4'},
  //   { TestID: '5', Title: 'Speaking Test 5'},
  //   { TestID: '6', Title: 'Speaking Test 6'},
  //   { TestID: '7', Title: 'Speaking Test 7'},
  //   { TestID: '8', Title: 'Speaking Test 8'},
  //   // Thêm nhiều bài test khác ở đây
  // ];

  const [testsData, setTestsData] = useState<any>([]);

  useEffect(() => {
    const initDatabase = async () => {
      try {
        const db = await getDBConnection();
        await createTables(db);
        await insertTests(db);
        //await insertParts(db);
        
        const tests = await getAllTests(db);
        setTestsData(tests);
      } catch (error) {
        console.error('Database initialization error:', error);
      }
    };
  
    initDatabase();
  }, []);

  return (
    <SafeAreaBox>
      
        <View style={speakingScreen.rootContainer}>    
          <FlatList
            
            numColumns={2}
            data={testsData}
            renderItem={({ item, index }) => (
              <TestCard
                title={item.Title}
                index={index}
                onPress={() => {
                    navigation.navigate("InforTestScreen", { SpeakTestID: item.TestID});
                }}
              />
            )}
            keyExtractor={(item) => item.TestID}
          />
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
