import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Dimensions, Image } from 'react-native';
import { SafeAreaBox } from "../../../../components";
import { useRoute } from '@react-navigation/native';
import { HomeStackParamList } from '../../../types';
import { RouteProp } from '@react-navigation/native';
import { getDBConnection, getQuestionById } from '../../../../database/db-service';
import { CountdownTimer } from '../../../../components/CountdownTimer';
import { SPEAKING_IMAGES } from '../../../../database/images';
type TestScreenRouteProp = RouteProp<HomeStackParamList, 'TestScreen'>;

interface Question {
  QuestionID: string;
  PartID: string;
  QuestionType: string;
  Content1: string | null;
  Content2: string | null;
  ImagePath1: keyof typeof SPEAKING_IMAGES;
  ImagePath2: keyof typeof SPEAKING_IMAGES;
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
  const [selectedContent, setSelectedContent] = useState<1 | 2 | 3>(1);

  useEffect(() => {
    const loadQuestion = async () => {
      try {
        const db = await getDBConnection();
        // Format questionId: TestID_PartNumber
        const questionId = `${testId}_${PartNumber}`; 
        
        const questionData = await getQuestionById(db, questionId);
        
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
      <View style={styles.container}>
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

        <ScrollView style={styles.questionContainer}>
          {/* Hiển thị nội dung dựa vào QuestionType */}
          {question.QuestionType === 'text' && (
            <>
              <Text style={styles.directions}>
                Directions: In this part of the test, you will read aloud the text on the screen. 
                You will have {question.PreparationTime} seconds to prepare. 
                Then you will have {question.ResponseTime} seconds to read the text aloud.
              </Text>

              <View style={styles.buttonContainer}>
                <TouchableOpacity 
                  style={[
                    styles.contentButton,
                    selectedContent === 1 && styles.contentButtonActive
                  ]}
                  onPress={() => setSelectedContent(1)}
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
                >
                  <Text style={[
                    styles.contentButtonText,
                    selectedContent === 2 && styles.contentButtonTextActive
                  ]}>Question 2</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.readingBox}>
                <Text style={styles.readingText}>
                  {selectedContent === 1 ? question.Content1 : question.Content2}
                </Text>
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

              <View style={styles.buttonContainer}>
                <TouchableOpacity 
                  style={[
                    styles.contentButton,
                    selectedContent === 1 && styles.contentButtonActive
                  ]}
                  onPress={() => setSelectedContent(1)}
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
                      source={SPEAKING_IMAGES[question.ImagePath1]}
                      style={styles.image}
                      resizeMode="contain"
                    />
                  )
                ) : (
                  question.ImagePath2 && (
                    <Image
                      source={SPEAKING_IMAGES[question.ImagePath2]}
                      style={styles.image}
                      resizeMode="contain"
                    />
                  )
                )}
              </View>
            </>
          )}

          {question.QuestionType === 'passage' && (
            <>
              <Text style={styles.directions}>
                Directions: In this part of the test, you will answer three questions based on the information provided. 
                You will have {question.PreparationTime} seconds to read the information before the questions begin.
              </Text>
              
              <View style={styles.buttonContainer}>
                <TouchableOpacity 
                  style={[
                    styles.contentButton,
                    selectedContent === 1 && styles.contentButtonActive
                  ]}
                  onPress={() => setSelectedContent(1)}
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
                >
                  <Text style={[
                    styles.contentButtonText,
                    selectedContent === 2 && styles.contentButtonTextActive
                  ]}>Question 2</Text>
                </TouchableOpacity>

                <TouchableOpacity 
                  style={[
                    styles.contentButton,
                    selectedContent === 3 && styles.contentButtonActive
                  ]}
                  onPress={() => setSelectedContent(3)}
                >
                  <Text style={[
                    styles.contentButtonText,
                    selectedContent === 3 && styles.contentButtonTextActive
                  ]}>Question 3</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.readingBox}>
                <Text style={styles.readingText}>{question.Content1}</Text>
              </View>
              
              <View style={styles.questionItem}>
                <Text style={styles.questionNumber}>{selectedContent}</Text>
                <Text style={styles.questionText}>
                  {selectedContent === 1 ? question.Question1 : 
                  selectedContent === 2 ? question.Question2 : 
                  question.Question3}
                </Text>
              </View>
            </>
          )}

          {question.QuestionType === 'imageWithQuestion' && (
            <>
              <Text style={styles.directions}>
                Directions: In this part of the test, you will answer three questions based on the table shown. 
                You will have {question.PreparationTime} seconds to prepare. 
                Then you will have {question.ResponseTime} seconds to speak about each question.
              </Text>

              <View style={styles.buttonContainer}>
                <TouchableOpacity 
                  style={[
                    styles.contentButton,
                    selectedContent === 1 && styles.contentButtonActive
                  ]}
                  onPress={() => setSelectedContent(1)}
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
                >
                  <Text style={[
                    styles.contentButtonText,
                    selectedContent === 2 && styles.contentButtonTextActive
                  ]}>Question 2</Text>
                </TouchableOpacity>

                <TouchableOpacity 
                  style={[
                    styles.contentButton,
                    selectedContent === 3 && styles.contentButtonActive
                  ]}
                  onPress={() => setSelectedContent(3)}
                >
                  <Text style={[
                    styles.contentButtonText,
                    selectedContent === 3 && styles.contentButtonTextActive
                  ]}>Question 3</Text>
                </TouchableOpacity>
              </View>

              <ScrollView 
              style={styles.part4ImageContainer}
              contentContainerStyle={styles.part4ImageContentContainer}
              horizontal={false}
              maximumZoomScale={3.0}
              minimumZoomScale={1.0}
              showsVerticalScrollIndicator={true}
              scrollEnabled={true}
              nestedScrollEnabled={true} // Thêm prop này
            >
              <View style={styles.part4ImageWrapper}>
                <Image
                  source={SPEAKING_IMAGES[question.ImagePath1]}
                  style={styles.part4Image}
                  resizeMode="contain"
                />
              </View>
            </ScrollView>
              
              <View style={styles.questionItem}>
                <Text style={styles.questionNumber}>{selectedContent}</Text>
                <Text style={styles.questionText}>
                  {selectedContent === 1 ? question.Question1 : 
                  selectedContent === 2 ? question.Question2 : 
                  question.Question3}
                </Text>
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
                <Text style={styles.topicText}>{question.Content1}</Text>
              </View>
            </>
          )}
        </ScrollView>
      </View>

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
});