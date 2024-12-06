import { ScrollView, View, Text, StyleSheet } from 'react-native';
import { useEffect } from 'react';
import { useState } from 'react';
import { useDatabase } from '../../../../database/DatabaseContext';
import { getAllTests } from '../../../../database/db-service';
import { ErrorScreen } from '../../../LoadingscreenAndErrorscreen';
import { LoadingScreen } from '../../../LoadingscreenAndErrorscreen';

interface Test {
    TestID: string;
    Title: string;
  }

export function TestScreen() {
  const { database, isLoading, error } = useDatabase();
  const [tests, setTests] = useState<Test[]>([]);

  useEffect(() => {
    const loadTests = async () => {
      if (database) {
        try {
          const testsData = await getAllTests(database) as Test[];
          setTests(testsData);
          console.log('Loaded tests:', testsData);
        } catch (err) {
          console.error('Error loading tests:', err);
        }
      }
    };

    loadTests();
  }, [database]);

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (error) {
    return <ErrorScreen error={error} />;
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Danh sách Tests:</Text>
      {tests.map(test => (
        <View key={test.TestID} style={styles.testCard}>
          <Text style={styles.testId}>Test ID: {test.TestID}</Text>
          <Text style={styles.testTitle}>Title: {test.Title}</Text>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#f5f5f5',
      padding: 16,
    },
    header: {
      fontSize: 20,
      fontWeight: 'bold',
      marginBottom: 16,
      color: '#333',
    },
    testCard: {
      backgroundColor: '#fff',
      padding: 16,
      marginBottom: 12,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: '#ddd',
    },
    testId: {
      fontSize: 16,
      color: '#666',
      marginBottom: 4,
    },
    testTitle: {
      fontSize: 18,
      fontWeight: '500',
      color: '#333',
    },
  });