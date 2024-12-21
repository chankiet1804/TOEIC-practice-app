import React, { useEffect, useState } from 'react';
import * as SQLite from 'expo-sqlite';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Dimensions, Image } from 'react-native';
import { SafeAreaBox } from "../../../../components";
import { useRoute } from '@react-navigation/native';
import { HomeStackParamList } from '../../../types';
import { RouteProp } from '@react-navigation/native';
import { getDBConnection, getWRQuestionById } from '../../../../database/db-service';
import { CountdownTimer } from '../../../../components/CountdownTimer';
import { WRITING_IMAGES } from '../../../../database/images';
import { TestScreenWRProps } from '../../../types';

type TestScreenWRRouteProp = RouteProp<HomeStackParamList, 'TestScreenWR'>;

interface Question {
  QuestionID: string;
  PartID: string;
  QuestionType: string;
  Content1: string | null;
  Content2: string | null;
  ImagePath1: keyof typeof WRITING_IMAGES;
  ImagePath2: keyof typeof WRITING_IMAGES;
  Require1: string | null;
  Require2: string | null;
  PreparationTime: number;
  ResponseTime: number;
}


export function TestScreenWR({ navigation }: TestScreenWRProps) {
  const route = useRoute<TestScreenWRRouteProp>();
  const { testId, PartNumber } = route.params;
  const [question, setQuestion] = useState<Question | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedContent, setSelectedContent] = useState<1 | 2 | 3>(1);
  const [dbConnection, setDbConnection] = useState<SQLite.SQLiteDatabase | null>(null);
  const [isDisabled, setIsDisabled] = useState(false);

  useEffect(() => {
    const loadQuestion = async () => {
      try {
        const db = await getDBConnection();
        setDbConnection(db);
        // Format questionId: TestID_PartNumber
        const questionId = `${testId}_${PartNumber}_WR`; 
        const questionData = await getWRQuestionById(db, questionId);
        setQuestion(questionData as Question);
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


  return (
    <SafeAreaBox>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Part {PartNumber} - Test {testId}</Text>
          {question && (
            <CountdownTimer 
              initialMinutes={question.ResponseTime / 60} // Chuyển đổi giây thành phút
              onTimeUp={() => console.log('Time up!')} // Xử lý khi hết giờ
            />
          )}
        </View>

        <ScrollView style={styles.questionContainer}>
          {/* Hiển thị nội dung dựa vào QuestionType */}

          {question.QuestionType === 'image' && (
            <>
              <Text style={styles.directions}>
                Bạn sẽ mô tả 2 bức ảnh trên màn hình chi tiết nhất có thể.              
                Khi sẵn sàng, nhấn nút "Bắt đầu ghi âm" và bạn có {question.ResponseTime} giây cho mỗi bức ảnh. 
              </Text>

              <View style={styles.buttonContainer}>
                <TouchableOpacity 
                  style={[
                    styles.contentButton,
                    selectedContent === 1 && styles.contentButtonActive
                  ]}
                  onPress={() => setSelectedContent(1)}
                  disabled={isDisabled}
                >
                  <Text style={[
                    styles.contentButtonText,
                    selectedContent === 1 && styles.contentButtonTextActive
                  ]}>Question 1</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={[
                    styles.contentButton,
                    selectedContent === 2 && styles.contentButtonActive
                  ]}
                  onPress={() => setSelectedContent(2)}
                  disabled={isDisabled}
                >
                  <Text style={[
                    styles.contentButtonText,
                    selectedContent === 2 && styles.contentButtonTextActive
                  ]}>Question 2</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.imageContainer}>
                {selectedContent === 1 ? (
                  question.ImagePath1 && (
                    <Image
                      source={WRITING_IMAGES[question.ImagePath1]}
                      style={styles.image}
                      resizeMode="contain"
                    />
                  )
                ) : (
                  question.ImagePath2 && (
                    <Image
                      source={WRITING_IMAGES[question.ImagePath2]}
                      style={styles.image}
                      resizeMode="contain"
                    />
                  )
                )}
              </View>
            </>
          )}

          {question.QuestionType === 'email' && (
            <>
              <Text style={styles.directions}>
              Bạn sẽ trả lời 3 câu hỏi dựa trên thông tin cho trước.              
              Khi sẵn sàng, nhấn nút "Bắt đầu ghi âm" và bạn có {question.ResponseTime} giây cho mỗi câu hỏi.  
              </Text>
              
              <View style={styles.buttonContainer}>
                <TouchableOpacity 
                  style={[
                    styles.contentButton,
                    selectedContent === 1 && styles.contentButtonActive
                  ]}
                  onPress={() => setSelectedContent(1)}
                  disabled={isDisabled}
                >
                  <Text style={[
                    styles.contentButtonText,
                    selectedContent === 1 && styles.contentButtonTextActive
                  ]}>Question 1</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={[
                    styles.contentButton,
                    selectedContent === 2 && styles.contentButtonActive
                  ]}
                  onPress={() => setSelectedContent(2)}
                  disabled={isDisabled}
                >
                  <Text style={[
                    styles.contentButtonText,
                    selectedContent === 2 && styles.contentButtonTextActive
                  ]}>Question 2</Text>
                </TouchableOpacity>

                
              </View>

              <View style={styles.readingBox}>
                <Text style={styles.readingText}>{selectedContent === 1 ? question.Content1 : 
                   question.Content2 }</Text>
              </View>
              
              <View style={styles.questionItem}>
                <Text style={styles.questionNumber}>{selectedContent}</Text>
                <Text style={styles.questionText}>
                  {selectedContent === 1 ? question.Require1 : 
                   question.Require2 }
                </Text>
              </View>
            </>
          )}

          {question.QuestionType === 'essay' && (
            <>
              <Text style={styles.directions}>
                Bạn sẽ bày tỏ quan điểm của mình về 1 vấn đề nào đó.              
                Khi sẵn sàng, nhấn nút "Bắt đầu ghi âm" và bạn có {question.ResponseTime} giây để trả lời.
                Bạn có thể dùng phần "Ghi chú" để viết dàn ý cho bài nói của mình.
              </Text>
              <View style={styles.topicBox}>
                <Text style={styles.topicText}>{question.Content1}</Text>
              </View>
            </>
          )}
        </ScrollView>
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
    flex: 1,
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
    marginBottom: 25,

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
  
  imageContainer: {
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 10,
    marginBottom: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  image: {
    width: '100%',
    height: Dimensions.get('window').width * 0.6, // Tỉ lệ 3:5
    marginBottom: 16,
    borderRadius: 8,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 12,
    marginBottom: 16,
  },
  contentButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#2980B9',
    backgroundColor: 'white',
    minWidth: 100,
    alignItems: 'center',
  },
  contentButtonActive: {
    backgroundColor: '#2980B9',
  },
  contentButtonText: {
    color: '#2980B9',
    fontSize: 14,
    fontWeight: '500',
  },
  contentButtonTextActive: {
    color: 'white',
  },
  part4ImageContainer: {
    backgroundColor: '#fff',
    borderRadius: 10,
    marginVertical: 10,
    height: Dimensions.get('window').height * 0.45,
    elevation: 2,
  },

  part4ImageContentContainer: {
    flexGrow: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
  },

  part4ImageWrapper: {
    width: '100%',
    alignItems: 'center',
    paddingVertical: 10,
  },

  part4Image: {
    width: '95%',
    height: Dimensions.get('window').height * 0.7,
    borderRadius: 8,
  },
  playButton: {
    backgroundColor: '#28a745', // Màu xanh lá cây
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
    elevation: 2, // Đổ bóng cho nút
    marginHorizontal:20
  },

});
