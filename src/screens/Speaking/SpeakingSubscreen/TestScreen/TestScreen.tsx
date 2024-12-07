import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaBox } from "../../../../components";
import { useRoute } from '@react-navigation/native';
import { HomeStackParamList } from '../../../types';
import { RouteProp } from '@react-navigation/native';
import { getDBConnection, getQuestionById } from '../../../../database/db-service';
import { CountdownTimer } from '../../../../components/CountdownTimer';

type TestScreenRouteProp = RouteProp<HomeStackParamList, 'TestScreen'>;

interface Question {
  QuestionID: string;
  PartID: string;
  QuestionNumber: number;
  QuestionType: string;
  Content: string | null;

  ImagePath1: string | null;
  ImagePath2: string | null;
  Question1: string | null;
  Question2: string | null;
  Question3: string | null;
  PreparationTime: number;
  ResponseTime: number;
}


export function TestScreen({ navigation }: any) {
  const route = useRoute<TestScreenRouteProp>();
  const { testId, PartNumber } = route.params;
  const [question, setQuestion] = useState<Question | null>(null);
  const [loading, setLoading] = useState(true);
  const [isRecording, setIsRecording] = useState(false);

  useEffect(() => {
    const loadQuestion = async () => {
      try {
        const db = await getDBConnection();
        // Format questionId: TestID_PartNumber_QuestionNumber
        const questionId1 = `${testId}_${PartNumber}_1`; // Assuming QuestionNumber is 1
        const questionId2 = `${testId}_${PartNumber}_2`; // Assuming QuestionNumber is 2
        const questionData1 = await getQuestionById(db, questionId1);
        const questionData2 = await getQuestionById(db, questionId2);
        setQuestion(questionData1 as Question);
      } catch (error) {
        console.error('Error loading question:', error);
      } finally {
        setLoading(false);
      }
    };

    loadQuestion();
  }, [testId, PartNumber]);

  if (loading) {
    return (
      <SafeAreaBox>
        <View style={styles.container}>
          <Text>Loading...</Text>
        </View>
      </SafeAreaBox>
    );
  }

  if (!question) {
    return (
      <SafeAreaBox>
        <View style={styles.container}>
          <Text>No question found</Text>
        </View>
      </SafeAreaBox>
    );
  }

  const handleStartRecording = () => {
    setIsRecording(true);
    // Thêm logic ghi âm ở đây
  };

  const handleTimeUp = () => {
    setIsRecording(false);
    // Thêm logic dừng ghi âm khi hết giờ
  };


  return (
    <SafeAreaBox>
      <ScrollView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Part {PartNumber} - Test {testId}</Text>
          {/* <Text style={styles.timer}>00:45</Text> */}
          {isRecording && question && (
            <CountdownTimer 
              initialMinutes={question.ResponseTime / 60} // Chuyển đổi giây thành phút
              onTimeUp={handleTimeUp}
            />
          )}
        </View>

        <View style={styles.questionContainer}>
          {/* Hiển thị nội dung dựa vào QuestionType */}
          {question.QuestionType === 'text' && (
            <>
              <Text style={styles.directions}>
                Directions: In this part of the test, you will read aloud the text on the screen. 
                You will have {question.PreparationTime} seconds to prepare. 
                Then you will have {question.ResponseTime} seconds to read the text aloud.
              </Text>
              <View style={styles.readingBox}>
                <Text style={styles.readingText}>{question.Content}</Text>
              </View>
            </>
          )}

          {question.QuestionType === 'image' && (
            <>
              <Text style={styles.directions}>
                Directions: In this part of the test, you will describe the picture on your screen in as much detail as possible. 
                You will have {question.PreparationTime} seconds to prepare your response. 
                Then you will have {question.ResponseTime} seconds to speak about the picture.
              </Text>
              {/* Thêm component hiển thị hình ảnh ở đây */}
            </>
          )}

          {question.QuestionType === 'passage' && (
            <>
              <Text style={styles.directions}>
                Directions: In this part of the test, you will answer three questions based on the information provided. 
                You will have {question.PreparationTime} seconds to read the information before the questions begin.
              </Text>
              <View style={styles.readingBox}>
                <Text style={styles.readingText}>{question.Content}</Text>
              </View>
              <View style={styles.questionsList}>
                {[question.Question1, question.Question2, question.Question3].map((q, index) => (
                  q && (
                    <View key={index} style={styles.questionItem}>
                      <Text style={styles.questionNumber}>{index + 1}</Text>
                      <Text style={styles.questionText}>{q}</Text>
                    </View>
                  )
                ))}
              </View>
            </>
          )}

          {question.QuestionType === 'topic' && (
            <>
              <Text style={styles.directions}>
                Directions: In this part of the test, you will give your opinion about a specific topic. 
                You will have {question.PreparationTime} seconds to prepare. 
                Then you will have {question.ResponseTime} seconds to speak.
              </Text>
              <View style={styles.topicBox}>
                <Text style={styles.topicText}>{question.Content}</Text>
              </View>
            </>
          )}
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity 
          style={[
            styles.button,
            isRecording && styles.recordingButton // Thêm style cho trạng thái đang ghi âm
          ]}
          onPress={handleStartRecording}
          disabled={isRecording} // Disable nút khi đang ghi âm
        >
          <Text style={styles.buttonText}>
            {isRecording ? 'Đang ghi âm...' : 'Bắt đầu ghi âm'}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaBox>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2C3E50',
  },
  questionContainer: {
    padding: 16,
  },
  directions: {
    fontSize: 16,
    color: '#34495E',
    marginBottom: 20,
    lineHeight: 24,
  },
  readingBox: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 10,
    marginBottom: 20,
    elevation: 2,
  },
  readingText: {
    fontSize: 16,
    lineHeight: 24,
    color: '#2C3E50',
  },
  questionsList: {
    gap: 16,
  },
  questionItem: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 10,
    elevation: 2,
  },
  questionNumber: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2980B9',
    marginRight: 12,
  },
  questionText: {
    flex: 1,
    fontSize: 16,
    color: '#2C3E50',
    lineHeight: 24,
  },
  topicBox: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 10,
    elevation: 2,
  },
  topicText: {
    fontSize: 16,
    color: '#2C3E50',
    lineHeight: 24,
  },
  footer: {
    padding: 16,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  button: {
    backgroundColor: '#2980B9',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  recordingButton: {
    backgroundColor: '#dc3545', // Màu đỏ khi đang ghi âm
  },
  timer: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2980B9',
  },
});