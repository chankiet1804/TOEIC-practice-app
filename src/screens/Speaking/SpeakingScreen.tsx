import React, { useEffect, useState } from 'react';
import { FlatList, View, StyleSheet } from 'react-native';
import { SpeakingScreenProps } from '../types';
import { TestCard } from './components/TestCard';
import { SafeAreaBox } from "../../components";
import { createTables, getDBConnection, insertTests } from '../../database/db-service';

interface Test {
  TestID: string;
  Title: string;
}

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

  const [testsData, setTestsData] = useState<Test[]>([]);

  useEffect(() => {
    const initializeDatabase = async () => {
      try {
        console.log('Starting database initialization...');
        
        const db = await getDBConnection();
        console.log('Database connection established');
        
        await createTables(db);
        console.log('Tables created successfully');
        
        await insertTests(db);
        console.log('Initial data inserted');
        
        const [results] = await db.executeSql('SELECT * FROM Tests ORDER BY TestID');
        console.log('Query executed, results:', results);

        if (results && results.rows && results.rows.length > 0) {
          const tests = results.rows.raw() as Test[];
          console.log('Loaded tests:', tests);
          setTestsData(tests);
        } else {
          console.warn('No tests found in the database.');
          setTestsData([]);
        }
      } catch (error) {
        console.error('Database initialization error details:', error);
        setTestsData([]);
      }
    };

    initializeDatabase();
}, []);

  return (
    <SafeAreaBox>
      
        <View style={speakingScreen.rootContainer}>    
          <FlatList
            scrollEnabled={false}
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
