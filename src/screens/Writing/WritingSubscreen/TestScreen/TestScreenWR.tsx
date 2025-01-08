import React, { useEffect, useState } from 'react';
import * as SQLite from 'expo-sqlite';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Dimensions, Image,Alert,TextInput,Modal } from 'react-native';
import { SafeAreaBox } from "../../../../components";
import { useRoute } from '@react-navigation/native';
import { HomeStackParamList } from '../../../types';
import { RouteProp } from '@react-navigation/native';
import { getDBConnection, getWRQuestionById } from '../../../../database/db-service';
import { CountdownTimer } from '../../../../components/CountdownTimer';
import { WRITING_IMAGES } from '../../../../database/images';
import { TestScreenWRProps } from '../../../types';
import { saveAnswerWriting } from '../../../../database/db-service';
import Foundation from '@expo/vector-icons/Foundation';

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
  const [answer1, setAnswer1] = useState('');
  const [answer2, setAnswer2] = useState('');
  const [answer3, setAnswer3] = useState('');

  const [submitted, setSubmitted] = useState(false);

  const [modalVisible, setModalVisible] = useState(false);
  const [outline, setOutline] = useState('');
  

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


  const handleFinish = async (part:number) => {
    
    if(part === 1 || part === 2){
      if(answer1 === '' || answer2 === '') {
        Alert.alert('Thông báo','Vui lòng điền đầy đủ câu trả lời!');
      }else{
        Alert.alert('Thành công', 'Bài làm của bạn đã được nộp');   
        const ID1 = testId + '_' + PartNumber +'_1';   
        const ID2 = testId + '_' + PartNumber +'_2';  
        if (dbConnection) {
              await saveAnswerWriting(dbConnection,ID1,answer1);
              await saveAnswerWriting(dbConnection,ID2,answer2);
            }
            //console.log('Recording saved successfully:', fileName);
        setSubmitted(true);
      }
    }
    else
    {
      if(answer3 ===''){
        Alert.alert('Thông báo','Vui lòng điền đầy đủ câu trả lời!');
      }
      else{
        Alert.alert('Thành công', 'Bài làm của bạn đã được nộp');
        const ID1 = testId + '_' + PartNumber +'_1';  
        if (dbConnection) {
              await saveAnswerWriting(dbConnection,ID1,answer3);
            }
        setSubmitted(true);
      }
    }
  }

  return (
    <SafeAreaBox>
      <View style={styles.container}>
      {!submitted && question && (
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Part {PartNumber} - Test {testId}</Text>
          
            <CountdownTimer 
              initialMinutes={question.ResponseTime / 60} // Chuyển đổi giây thành phút
              onTimeUp={() => console.log('Time up!')} // Xử lý khi hết giờ
            />       
        </View>
        )}

        <ScrollView style={styles.questionContainer}>
          {/* Hiển thị nội dung dựa vào QuestionType */}

          {question.QuestionType === 'image' && (
            <>

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

              <View style={styles.answerContainer}>
                <TextInput
                  style={styles.input}
                  multiline
                  placeholder="Nhập câu trả lời của bạn..."
                  value={selectedContent === 1 ? answer1 : answer2}
                  onChangeText={selectedContent === 1 ? setAnswer1 : setAnswer2}
                  textAlignVertical="top"
                  scrollEnabled={true} 
                  editable={!submitted}
                />
                
                <TouchableOpacity
                  style={submitted ? styles.navigateButton : styles.finishButton}
                  onPress={() => {
                    if(!submitted){
                    handleFinish(1);
                    }
                    else{

                    }
                  }}
                >
                  <Text style={styles.finishButtonText}>{submitted ? 'Xem kết quả' : 'Nộp bài'}</Text>      
                </TouchableOpacity>
              </View>
            </>
          )}

          {question.QuestionType === 'email' && (
            <>
              {/* <Text style={styles.directions}>
              Bạn sẽ trả lời 3 câu hỏi dựa trên thông tin cho trước.              
              Khi sẵn sàng, nhấn nút "Bắt đầu ghi âm" và bạn có {question.ResponseTime} giây cho mỗi câu hỏi.  
              </Text> */}
              
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

              <View style={styles.answerContainer}>
                <TextInput
                  style={styles.input}
                  multiline
                  placeholder="Nhập câu trả lời của bạn..."
                  value={selectedContent === 1 ? answer1 : answer2}
                  onChangeText={selectedContent === 1 ? setAnswer1 : setAnswer2}
                  textAlignVertical="top"
                  scrollEnabled={true} 
                  editable={!submitted}
                />
                
                <TouchableOpacity
                  style={submitted ? styles.navigateButton : styles.finishButton}
                  onPress={() => {
                    if(!submitted){
                    handleFinish(2);
                    }
                    else{

                    }
                  }}
                >
                  <Text style={styles.finishButtonText}>{submitted ? 'Xem kết quả' : 'Nộp bài'}</Text>      
                </TouchableOpacity>
              </View>

            </>
          )}

          {question.QuestionType === 'essay' && (
            <>
              <View style={styles.topicBox}>
                <Text style={styles.topicText}>{question.Content1}</Text>
              </View>

              
              <TouchableOpacity
                style={styles.outlineButton}
                onPress={() => setModalVisible(true)} // Mở modal khi nhấn nút
              >
                <Text><Foundation name="lightbulb" size={26} color="#FFC107" /></Text>
              </TouchableOpacity>

              
              <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
              >
                <View style={styles.modalOverlay}>
                  <View style={styles.modalContainer}>
                    <Text style={styles.modalTitle}>Nhập Dàn ý</Text>
                    <TextInput
                      style={styles.inputOutline}
                      multiline
                      placeholder="Nhập nội dung dàn ý ở đây..."
                      value={outline}
                      onChangeText={setOutline} // Cập nhật dàn ý
                    />
                    <View style={styles.buttonContainerOutline}>
                      <TouchableOpacity
                        style={[styles.button]}
                        onPress={() => setModalVisible(false)} 
                      >
                        <Text style={styles.buttonText}>Đóng</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              </Modal>

              <View style={styles.answerContainer}>
                <TextInput
                  style={styles.inputPart3}
                  multiline
                  placeholder="Nhập câu trả lời của bạn..."
                  value={answer3}
                  onChangeText={setAnswer3}
                  textAlignVertical="top"
                  scrollEnabled={true} 
                  editable={!submitted}
                />
                
                <TouchableOpacity
                  style={submitted ? styles.navigateButton : styles.finishButton}
                  onPress={() => {
                    if(!submitted){
                    handleFinish(3);
                    }
                    else{

                    }
                  }}
                >
                  <Text style={styles.finishButtonText}>{submitted ? 'Xem kết quả' : 'Nộp bài'}</Text>      
                </TouchableOpacity>
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
    marginTop: 10,
    paddingHorizontal: 20,
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
    fontSize: 12,
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
    fontSize: 12,
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
    //padding: 16,
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
    height: Dimensions.get('window').width * 0.7, // Tỉ lệ 3:5
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
  answerContainer: {
    //marginTop: 10,
    paddingHorizontal: 15,
  },
  
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    padding: 15,
    minHeight: 150,
    maxHeight: 150,
    backgroundColor: '#f9f9f9',
    fontSize: 16,
    lineHeight: 22,
    color: '#333',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2, // Hiệu ứng bóng cho Android
  },
  inputPart3 : {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    padding: 15,
    minHeight: 350,
    maxHeight: 350,
    backgroundColor: '#f9f9f9',
    fontSize: 16,
    lineHeight: 22,
    color: '#333',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2, // Hiệu ứng bóng cho Android
  },
  
  finishButton: {
    backgroundColor: '#60A5FA',
    paddingVertical: 15,
    paddingHorizontal: 25,
    borderRadius: 12,
    marginTop: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 2,
    marginBottom: 40,
  },
  
  finishButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  navigateButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 15,
    paddingHorizontal: 25,
    borderRadius: 12,
    marginTop: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 2,
    marginBottom: 50,
  },

  outlineButton: {
    padding: 15,
    borderRadius: 8,
    alignItems: 'flex-start',
    width: 50,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Màu nền tối mờ
  },
  modalContainer: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 8,
    width: '80%',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 10,
  },
  inputOutline: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    minHeight: 400,
    maxHeight: 400,
    backgroundColor: '#f9f9f9',
    fontSize: 16,
    textAlignVertical: 'top',
  },
  buttonContainerOutline: {
    flexDirection: 'row',
    marginTop: 20,
  },
  button: {
    backgroundColor: '#F44336',
    padding: 10,
    borderRadius: 8,
    margin: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
