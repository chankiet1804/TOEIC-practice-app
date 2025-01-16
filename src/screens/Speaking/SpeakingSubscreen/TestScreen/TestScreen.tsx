import React, { useEffect, useState } from 'react';
import * as SQLite from 'expo-sqlite';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Dimensions, Image } from 'react-native';
import { SafeAreaBox } from "../../../../components";
import { useRoute } from '@react-navigation/native';
import { HomeStackParamList } from '../../../types';
import { RouteProp } from '@react-navigation/native';
import { getDBConnection, getQuestionById, getRecording } from '../../../../database/db-service';
import { CountdownTimer } from '../../../../components/CountdownTimer';
import { SPEAKING_IMAGES } from '../../../../database/images';
import { saveRecordingInfo } from '../../../../database/db-service';
import { Audio } from 'expo-av';

import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../../../../firebase';  

type TestScreenRouteProp = RouteProp<HomeStackParamList, 'TestScreen'>;

interface Question {
  QuestionID: string;
  PartID: string;
  QuestionType: string;
  Content1: string | null;
  Content2: string | null;
  ImagePath1: keyof typeof SPEAKING_IMAGES ;
  ImagePath2: keyof typeof SPEAKING_IMAGES ;
  Question1: string | null;
  Question2: string | null;
  Question3: string | null;
  //PreparationTime: number;
  ResponseTime: number;
}



interface RecordingPath {
  filePath: string;
}

export function TestScreen({ navigation }: any) {
  const route = useRoute<TestScreenRouteProp>();
  const { testId, PartNumber } = route.params;
  const [question, setQuestion] = useState<Question | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedContent, setSelectedContent] = useState<1 | 2 | 3>(1);
  const [dbConnection, setDbConnection] = useState<SQLite.SQLiteDatabase | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [recording, setRecording] = useState<Audio.Recording | undefined>();
  const [recordingPath, setRecordingPath] = useState<string>('');
  const [isDisabled, setIsDisabled] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [sound, setSound] = useState<Audio.Sound | undefined>(undefined);

  // useEffect(() => {
  //   const loadQuestion = async () => {
  //     try {
  //       const db = await getDBConnection();
  //       setDbConnection(db);
  //       // Format questionId: TestID_PartNumber
  //       const questionId = `${testId}_${PartNumber}`; 
  //       const questionData = await getQuestionById(db, questionId);
  //       setQuestion(questionData as Question);
  //     } catch (error) {
  //       console.error('Error loading question:', error);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };
  //   loadQuestion();
  // }, [testId, PartNumber]);

  useEffect(() => {
    const loadQuestion = async () => {
      try {
        const dbase = await getDBConnection();
        setDbConnection(dbase);
        
        // Format questionId: TestID_PartNumber
        const questionId = `${testId}_${PartNumber}_SP`; 
        //const questionData = await getQuestionById(db, questionId);
        const q = query(
          collection(db, 'question'),
          where('questionID', '==', questionId),
          //orderBy('order', 'asc')
        );
        const querySnapshot = await getDocs(q);
        const questionData = querySnapshot.docs.map(doc => {
          const data = doc.data();
          return {
            QuestionID: data.questionID, // hoặc data.QuestionID nếu bạn có sẵn field này
            PartID: data.PartID,
            //QuestionType: data.questionType,
            QuestionType : (
              PartNumber === '1' ? "text" :
              PartNumber === '2' ? "image" :
              PartNumber === '3' ? "passage" :
              PartNumber === '4' ? "imageWithQuestion" :
              PartNumber === '5' ? "topic" :
              null ),

            Content1: data.content1 || null,
            Content2: data.content2 || null,
            ImagePath1: data.imagePath1 || null,
            ImagePath2: data.imagePath2 || null,
            Question1: data.question1 || null,
            Question2: data.question2 || null,
            Question3: data.question3 || null,
            //PreparationTime: data.preparationTime,
            //ResponseTime: data.responseTime
            ResponseTime : (
              PartNumber === '1' ? 45 :
              PartNumber === '2' ? 45 :
              PartNumber === '3' ? 15 :
              PartNumber === '4' ? 15 :
              PartNumber === '5' ? 60 :
              null ),
          
          } as Question;
        });
        if (questionData.length > 0) {
          setQuestion(questionData[0]);
        } else {
          setQuestion(null);
        }
      } catch (error) {
        console.error('Error loading question:', error);
        setQuestion(null);
      } finally {
        setLoading(false);
      }
    };
    loadQuestion();
  }, [testId, PartNumber]);

  const loadRecordings = async () => {
    if (dbConnection) {     
        const Paths = await getRecording(dbConnection, testId.toString(), Number(PartNumber), selectedContent) as RecordingPath[]; 
        if(Paths.length > 0){
          const path = Paths[0].filePath;
          console.log('Loaded recording successfully:', path);
          setRecordingPath(path);
        }
        else{
          console.log('No recordings available to play.');
          setRecordingPath('');
        }
      } 
      else {
        console.log('Fail to load recording');
      }
  };

  useEffect(() => {
    loadRecordings();
  },[testId, PartNumber,selectedContent]);


  if (loading) {
    return (
      <SafeAreaBox>
        <View style={styles.container}>
          <View style={styles.loadingContainer}>
            <Text style={styles.messageText}>Loading...</Text>
          </View>
        </View>
      </SafeAreaBox>
    );
  }

  if (!question) {
    return (
      <SafeAreaBox>
        <View style={styles.container}>
          <View style={styles.loadingContainer}>
            <Text style={styles.messageText}>No question found</Text>
          </View>
        </View>
      </SafeAreaBox>
    );
  }

  const handleStartRecording = async () => {
    try {
      const perm = await Audio.requestPermissionsAsync();
      if (perm.status === "granted") {
        await Audio.setAudioModeAsync({
          allowsRecordingIOS: true,
          playsInSilentModeIOS: true
        });
        const { recording } = await Audio.Recording.createAsync(
          Audio.RecordingOptionsPresets.HIGH_QUALITY
        );
        setRecording(recording);
        setIsRecording(true);
        setIsDisabled(true);
      }
    } catch (err) {
      console.error('Error starting recording:', err);
    }
  };

  const handleStopRecording = async () => {
    if (!recording) return;

    setIsRecording(false);
    await recording.stopAndUnloadAsync();

    const uri = recording.getURI();
    if (!uri) return;

    // Lưu thông tin ghi âm vào cơ sở dữ liệu
    const createdAt = new Date().toISOString(); // Lấy thời gian hiện tại
    const questionNumber = selectedContent; // Sử dụng selectedContent làm questionNumber

    // Tạo tên file theo định dạng testId_partNumber_questionNumber
    const fileName = `${testId}_${PartNumber}_${questionNumber}.m4a`; // Định dạng tên file

    if (dbConnection) {
      await saveRecordingInfo(dbConnection, {
        testId: Number(testId),
        partNumber: Number(PartNumber),
        questionNumber: questionNumber,
        fileName: fileName,
        filePath: uri,
        createdAt: createdAt
      });
    }
    console.log('Recording saved successfully:', fileName);   
    setRecording(undefined);
    
    setIsDisabled(false); // cho phep su dung cac nut khi dung ghi am
    loadRecordings(); // Load lai moi khi ghi am xong
};

  const playRecording = async (filePath: string) => {
    if (!filePath) {
      console.error('No file path provided for playback.');
      return;
    }

  try {
    const { sound } = await Audio.Sound.createAsync(
      { uri: filePath }
    );
    setSound(sound);
    await sound.playAsync();
    setIsDisabled(true);
    setIsPlaying(true);
  } catch (error) {
    console.error('Error playing sound:', error);
  }
};

  const handleStopPlaying = async () => {
    if (sound) {
      await sound.stopAsync();
      setIsDisabled(false);
      setIsPlaying(false);
      setSound(undefined);
    }
  };

  return (
    <SafeAreaBox>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Part {PartNumber} - Test {testId}</Text>
          {isRecording && question && (
            <CountdownTimer 
              initialMinutes={question.ResponseTime / 60} // Chuyển đổi giây thành phút
              onTimeUp={()=>handleStopRecording}
            />
          )}
        </View>

        <ScrollView style={styles.questionContainer}>
          {/* Hiển thị nội dung dựa vào QuestionType */}
          {question.QuestionType === 'text' && (
            <>
              <Text style={styles.directions}>
              Bạn sẽ đọc to và rõ ràng 2 đoạn văn bản trên màn hình.              
              Khi sẵn sàng, nhấn nút "Bắt đầu ghi âm" và bạn có {question.ResponseTime} giây cho mỗi đoạn văn. 
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
                <Text style={styles.readingText}>
                  {selectedContent === 1 ? question.Content1 : question.Content2}
                </Text>
              </View>
            </>
          )}

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

                <TouchableOpacity 
                  style={[
                    styles.contentButton,
                    selectedContent === 3 && styles.contentButtonActive
                  ]}
                  onPress={() => setSelectedContent(3)}
                  disabled={isDisabled}
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
                Bạn sẽ trả lời 3 câu hỏi dựa trên bảng thông tin cho trước.              
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

                <TouchableOpacity 
                  style={[
                    styles.contentButton,
                    selectedContent === 3 && styles.contentButtonActive
                  ]}
                  onPress={() => setSelectedContent(3)}
                  disabled={isDisabled}
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
      
      
      {!isRecording && recordingPath !== '' && (
        <TouchableOpacity 
        style={styles.playButton}
        onPress={() => {
          if (isPlaying) {
            handleStopPlaying(); // Nếu đang phát, dừng phát
          } else {
            playRecording(recordingPath); // Nếu không, phát lại
          }
        }}
        disabled={isRecording} // Vô hiệu hóa nút nếu dang ghi am 
      >
        <Text style={styles.buttonText}>
          {isPlaying ? 'Ngừng phát lại' : 'Phát lại ghi âm'} {/* Thay đổi văn bản dựa trên trạng thái */}
        </Text>
      </TouchableOpacity>
      )}
      

      <View style={styles.footer}>
        <TouchableOpacity 
          style={[
            styles.button,
            isRecording && styles.recordingButton // Thêm style cho trạng thái đang ghi âm
          ]}
          onPress={() => {
            if (isRecording) {
              handleStopRecording();
            } else {
              handleStartRecording();
            }
          }}
          disabled={isPlaying} // Vô hiệu hóa nút nếu isPlaying là true
        >
          <Text style={styles.buttonText}>
            {isRecording ? 'Dừng ghi âm...' : 'Bắt đầu ghi âm'}
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
  playButton: {
    backgroundColor: '#28a745', // Màu xanh lá cây
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
    elevation: 2, // Đổ bóng cho nút
    marginHorizontal:20
  },
  messageText: {
    fontSize: 16,
    color: '#666666',
    fontWeight: '500',
    textAlign: 'center',
  },
  loadingContainer: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  }

});
