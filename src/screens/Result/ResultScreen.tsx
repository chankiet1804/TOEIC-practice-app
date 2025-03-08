import { ResultScreenProps } from "../types";
// import { SafeAreaBox } from "../../components";
import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  Alert,
  TouchableOpacity,
  SafeAreaView
} from 'react-native';
import * as SQLite from 'expo-sqlite';
import { RouteProp } from '@react-navigation/native';
import { HomeStackParamList } from '../types';
import { useRoute } from '@react-navigation/native';
import { getFeedback,saveFeedback,getDBConnection } from "../../database/db-service";

import OpenAI from "openai";
// import 'dotenv/config';
import { OPENAI_API_KEY } from '@env';

import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../../firebase'; 

import { WRITING_IMAGES } from '../../database/images';

import { useAuth } from "../../components/Context/auth.context";
import { getQuestionWRApi,getAnswerWRApi,saveAnswerWRApi } from "../../utils/api";

import ViewQuestionModal from './ViewQuestionModal';

type ResultRouteProp = RouteProp<HomeStackParamList, 'ResultScreen'>;

// interface answer {
//     questionID: string,
//     answerContent: string
// };

interface EvaluationResult {
  feedback: string;
}

interface FeedbackItem {
  Feedback: string;
}

interface QuestionWR {
  QuestionID : string,
  QuestionType : string,
  Content1 : string | null,
  Content2 : string | null,
  ImagePath1 : string | null,
  ImagePath2 : string | null,
  Question1 : string | null,
  Question2 : string | null,
  PreparationTime : number,
  ResponseTime : number,
  Suggestion1 : string,
  Suggestion2 : string
}


export function ResultScreen({ navigation }: ResultScreenProps) {
  const route = useRoute<ResultRouteProp>();
    const [loading, setLoading] = useState(true);
    const [results, setResults] = useState<EvaluationResult[]>([]);
    // const [feedbacks, setFeedbacks] = useState<(any | null)[]>([]);
    //const [feedbacks, setFeedbacks] = useState<string[]>([]);
    //const [suggestion,setSuggestion] = useState<Suggestion | null>(null);
    // const [feedbacks, setFeedbacks] = useState<Map<string,string>>(new Map());
    // const [suggestionList,setSuggestionList] = useState<Map<string,string>>(new Map());
    // const [dbConnection, setDbConnection] = useState<SQLite.SQLiteDatabase | null>(null);
    // const [haveFeedback,setHaveFeedback] = useState(false);
    const [question, setQuestion] = useState<QuestionWR | null>(null);
    const [selectedContent, setSelectedContent] = useState<1 | 2 >(1);
    const [answer1, setAnswer1] = useState('');
    const [answer2, setAnswer2] = useState('');
    const [answer3, setAnswer3] = useState('');
    const [feedback1,setFeedback1] = useState('');
    const [feedback2,setFeedback2] = useState('');
    // const [suggestion1,setSuggestion1] = useState('');
    // const [suggestion2,setSuggestion2] = useState('');
    const { testId, PartNumber } = route.params; 
    const questionID = `${testId}_${PartNumber}`;
    const {auth} = useAuth();
    const api = OPENAI_API_KEY as string;

    const [isQuestionModalVisible, setIsQuestionModalVisible] = useState(false);

    const openai = new OpenAI({
        apiKey: OPENAI_API_KEY, // Lấy từ file .env
      });

      // console.log("Current API key:", OPENAI_API_KEY);
      // console.log("Environment variables:", process.env.);

    const evaluateAnswer = async (answer: string, partID : string, selected : number): Promise<EvaluationResult | null> => {
        try {
          let prompt='';
          let suggest='' ;
          if(partID==="1"){
            if(selected===1)
               suggest = question?.Suggestion1 as string;
            else 
                suggest = question?.Suggestion2 as string;
            //console.log(sugest);
            prompt = `
              Câu trả lời: "${answer}"
              Gợi ý của đề : "${suggest}"   
              Yêu cầu: Trả về chính xác định dạng JSON với cấu trúc:
              {
                "feedback": "Nhận xét về câu trả lời"
              }
              Kiểm tra câu trả lời có đúng ngữ pháp, và sử dụng đúng cặp từ keyword trong ngoặc ở cuối cùng của gợi ý, nội dung chỉ cần tương đồng với gợi ý hoặc thiếu cũng đc, khi nào khác hoàn toàn với gợi ý thì mới nhắc nhở. 
              CHÚ Ý: Chỉ trả về object JSON, không thêm bất kỳ text nào khác.
            `;
          }
          else if(partID==="2"){
            let content;
            let require;
            if(selected===1){
              content=question?.Content1;
              require=question?.Question1;
            }
            else if(selected===2){
              content=question?.Content2;
              require=question?.Question2;
            }
            prompt = `
              
              Đây là email đề bài: "${content}"
              Đây là yêu cầu viết email phản hồi: "${require}"
              Đay là câu trả lời: "${answer}"
              Yêu cầu: Trả về chính xác định dạng JSON với cấu trúc:
              {
                "feedback": "Nhận xét về câu trả lời"
              }
              Nhận xét về câu trả lời trên có phù hợp với email và yêu cầu hay không?
              CHÚ Ý: Chỉ trả về object JSON, không thêm bất kỳ text nào khác.
            `;
          }
          else if(partID==="3"){
            prompt = `
              Đây là yêu cầu đề bài viết 1 essay : "${question?.Content1}"
              Đay là câu trả lời: "${answer}"
              Yêu cầu: Trả về chính xác định dạng JSON với cấu trúc:
              {
                "feedback": "Nhận xét về câu trả lời"
              }
              Nhận xét về câu trả lời trên có phù hợp với yêu cầu hay không?
              CHÚ Ý: Chỉ trả về object JSON, không thêm bất kỳ text nào khác.
            `;
          }

          const completion = await openai.chat.completions.create({
            messages: [
              {
                role: "system",
                content: "Bạn là assistant chuyên đánh giá câu trả lời. Luôn trả về kết quả ở định dạng JSON."
              },
              { role: "user", content: prompt  }
            ],
            model: "gpt-4o-mini",
            temperature: 0.7,
            max_tokens: 200,
          });

          const response = completion.choices[0]?.message?.content;
          if(response){         
            console.log('API Response:', response);
            try{
              const feedbackFromAPI = JSON.parse(response.trim());
              // if (dbConnection) {
              //   await saveFeedback(dbConnection,answerID,feedbackFromAPI.feedback);
              // }
              // setHaveFeedback(true);
              // loadFeedback();
              return {
              feedback: feedbackFromAPI.feedback, // Parse from response
              //suggestions: suggestion // Parse from response
              };             
            } catch (error) {
              console.error('Raw response:', response);
              console.error('Error parsing API response:', error);
              return null;
            }
          }
          else{
            console.log("Khong the goi API")
          return null;
          }
        } 
         catch (error) {
          console.error('Error evaluating answer:', error);
          // return {
          //   feedback: "Không thể đánh giá do lỗi hệ thống",
          //   suggestions: "Vui lòng thử lại sau"
          // };
          return null;
        }
    };

  //   const evaluateAllAnswers = async () => {
  //     try {
  //     setLoading(true);
  //     const evaluations = await Promise.all(
  //         answers.map(answer => evaluateAnswer(answer.answerContent,answer.questionID))
  //     );
  //     const validEvaluations = evaluations.filter((evaluation): evaluation is EvaluationResult => evaluation !== null);
  //     setResults(validEvaluations);
  //     } catch (error) {
  //     Alert.alert('Lỗi', 'Không thể đánh giá kết quả. Vui lòng thử lại sau.');
  //     } finally {
  //     setLoading(false);
  //     }
  // };

  // const loadFeedback = async () => {
  //   try {
  //     setLoading(true);
  //     const dbase = await getDBConnection();
  //     setDbConnection(dbase);
  //     const myMap: Map<string, string> = new Map(feedbacks);
  //       await Promise.all( 
  //       answers.map(async (answer) => {
  //         const feedback = await getFeedback(dbase, answer.questionID);
  //         const feedbackContent = (feedback as FeedbackItem[])[0]?.Feedback || '';
  //         console.log("Individual feedback for question", answer.questionID, ":", feedbackContent);
  //         if(feedbackContent!=="") 
  //           myMap.set(answer.questionID,JSON.stringify(feedbackContent))
  //       }) 
  //     );  
      
  //     setFeedbacks(myMap);
  //   } catch (error) {
  //     console.error('Error loading feedback:', error);
  //   } finally { 
  //     setLoading(false);
  //   }
  // };


    // useEffect(() => {    
    //   loadFeedback();  
    // }, [answers]); 

    // useEffect(() => {
    //   if(feedbacks.size > 0) {
    //     setHaveFeedback(true);
    //   }
    // }, [feedbacks]);

    // useEffect(() => {
    //   const loadSuggestion = async () => {
    //     try {
    //       setLoading(true);
    //       const myMap: Map<string, string> = new Map(suggestionList);
          
    //       for(let i=0;i<answers.length;i++){
    //         const q = query(
    //           collection(db, 'suggestion'),
    //           where('questionID', '==', answers[i].questionID),
    //         );
    //         const querySnapshot = await getDocs(q);
    //           const suggestionData = querySnapshot.docs.map(doc => {
    //           const data = doc.data();
    //           return data.sgt;
    //         });
    //         if (suggestionData.length > 0) {
    //           myMap.set(answers[i].questionID,suggestionData[0]);
    //           console.log(answers[i].questionID + "-" + suggestionData[0]+"\n")
    //         }         
    //       }
    //       setSuggestionList(myMap); 
    //     } catch (error) {
    //       console.error('Error loading suggestions:', error);
    //     } finally {
    //       setLoading(false);
    //     }
    //   };
    //   loadSuggestion();
    // }, [answers]);


    // useEffect(() => {
    //     const loadQuestion = async () => {
    //       try {
    //         const dbase = await getDBConnection();
    //         setDbConnection(dbase);
    //         const ID = answers[0].questionID;
    //         const parts = ID.split('_');
    //         const questionId = `${parts[0]}_${parts[1]}_WR`;  
    //         const q = query(
    //           collection(db, 'questionWR'),
    //           where('questionID', '==', questionId),
    //         );
    //         const querySnapshot = await getDocs(q);
    //         const questionData = querySnapshot.docs.map(doc => {
    //         const data = doc.data();
    //         return {
    //           QuestionID: data.questionID, 
    //           PartID: data.PartID,
    
    //           Content1: data.content1 || null,
    //           Content2: data.content2 || null,
    //           ImagePath1: data.imagePath1 || null,
    //           ImagePath2: data.imagePath2 || null,
    //           Require1 : data.require1 || null,
    //           Require2 : data.require2 || null,
            
    //         } as Question;
    //         });
    //         if (questionData.length > 0) {
    //           setQuestion(questionData[0]);
    //         } else {
    //           setQuestion(null);
    //         }
    //       } catch (error) {
    //         console.error('Error loading question:', error);
    //       } finally {
    //         setLoading(false);
    //       }
    //     };
    //     loadQuestion();
    //   }, [answers]);

    useEffect(() => {
        const fetchQuestion = async () => {
          try {
            setLoading(true);
            const data = await getQuestionWRApi(questionID);
            console.log("Dữ liệu cau hoi:", data);
            setQuestion(data);
            // const AT = await AsyncStorage.getItem("access_token");
            // console.log(">>> Check access_token:", AT);
          } catch (error) {
            console.error("Lỗi tải dữ liệu:", error);
          } finally {
            setLoading(false);
          }
        };
        fetchQuestion();
      }, []);
    
      useEffect(() => {
        const fetchAnswer = async () => {
          try{
            setLoading(true);
            //console.log(">>> check api",api);
            if(PartNumber==='1' || PartNumber==='2'){
              const answerID1 = `${questionID}_1`;
              const answerID2 = `${questionID}_2`;
              const ans1 = await getAnswerWRApi(auth?.userId,answerID1)
              const ans2 = await getAnswerWRApi(auth?.userId,answerID2)
              if(ans1?.Content && ans2?.Content){
                //console.log("Dữ liệu cau tra loi:", ans1, ans2);
                setAnswer1(ans1.Content);
                setAnswer2(ans2.Content);
                //setSubmitted(true); // neu da co cau tra loi thi bat bien submitted
              }
              else{
                console.log("Khong co du lieu cau tra loi")
              }
              // if(!ans1?.Feedback  && !ans2?.Feedback ){ // neu 1 trong 2 cau ko co feedback => gui len openAI de lay feedback
              //   const feed1 = await evaluateAnswer(answer1,PartNumber,1);
              //   const feed2 = await evaluateAnswer(answer2,PartNumber,2);
              //   if(feed1 && feed2){
              //     setFeedback1(feed1?.feedback as string);
              //     setFeedback2(feed2?.feedback as string);
              //     // dong thoi luu lai feedback vao database
              //     const ID1 = testId + '_' + PartNumber +'_1';   
              //     const ID2 = testId + '_' + PartNumber +'_2';  
              //     await saveAnswerWRApi(auth?.userId,ID1,answer1,feedback1); 
              //     await saveAnswerWRApi(auth?.userId,ID2,answer2,feedback2); 
              //   }
              //   else{
              //     console.log("Khong the load feedback")
              //   }
              // }else { // neu co feedback roi -> luu vao bien feeedback de hien thi ra man hinh
              //   setFeedback1(ans1.Feedback);
              //   setFeedback2(ans2.Feedback);
              // }
              if(!ans1?.Feedback  && !ans2?.Feedback ){ // viet tam ham nay, check api sau
                setFeedback1(ans1.Feedback);
                setFeedback2(ans2.Feedback);
              }
            }
            else { // partNumber = 3
              const answerID = `${questionID}_1`;
              const ans = await getAnswerWRApi(auth?.userId,answerID);
              if(ans.Content){
                //console.log("Dữ liệu cau tra loi:", ans);
                setAnswer3(ans.Content);
                //setSubmitted(true); // neu da co cau tra loi thi bat bien submitted
              }
              else{
                console.log("Khong co du lieu cau tra loi")
              }
              if(ans?.Feedback ){
                setFeedback1(ans.Feedback);
              }
            }
            
          } catch (error) {
            console.error("Lỗi tải dữ liệu:", error);
          } finally {
            setLoading(false);
          }
        }
        fetchAnswer();
      },[]);


    if (loading) {
        return (
            <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#0000ff" />
            <Text style={styles.loadingText}>Đang trong quá trình xử lý kết quả...</Text>
            </View>
        );
    }


return (
  <SafeAreaView style={styles.container}>

    <ScrollView
      contentContainerStyle={styles.scrollViewContent}
      showsVerticalScrollIndicator={false}
    >
    
      {(question?.QuestionType === 'image' || question?.QuestionType === 'email') && (
        <>

          <View style={styles.buttonContainer}>
            <TouchableOpacity 
              style={[
                styles.contentButton,
                selectedContent === 1 && styles.contentButtonActive
              ]}
              onPress={() => setSelectedContent(1)}
              //disabled={isDisabled}
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
              //disabled={isDisabled}
            >
              <Text style={[
                styles.contentButtonText,
                selectedContent === 2 && styles.contentButtonTextActive
              ]}>Question 2</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.resultCard}>
            <View style={styles.cardHeader}>
            <Text style={styles.partTitle}>Test {testId} - Part {PartNumber} </Text>
            <TouchableOpacity 
              style={styles.viewQuestionButton}
              onPress={() => setIsQuestionModalVisible(true)}
            >
              <Ionicons name="eye-outline" size={20} color="#4A90E2" />
              <Text style={styles.viewQuestionText}>Xem câu hỏi</Text>
            </TouchableOpacity>
            </View>
            <ViewQuestionModal
              isVisible={isQuestionModalVisible}
              onClose={() => setIsQuestionModalVisible(false)}
              question={question}
            />
            


            <View style={styles.sectionContainer}>
              <Text style={styles.sectionLabel}>Câu trả lời của bạn:</Text>
              <Text style={styles.sectionContent}>
                {selectedContent === 1 ? answer1 : answer2}
              </Text>
            </View>

            <View style={styles.sectionContainer}>
              <Text style={styles.sectionLabel}>Nhận xét:</Text>
              <Text style={styles.sectionContent}>
                {selectedContent === 1 
                  ? feedback1 !== '' ? feedback1 : "Chưa có nhận xét" 
                  : selectedContent === 2 
                    ? feedback2 !== '' ? feedback2 : "Chưa có nhận xét" 
                  : "Chưa có nhận xét"}
              </Text>
            </View>

            <View style={styles.sectionContainer}>
              <Text style={styles.sectionLabel}>Gợi ý cải thiện:</Text>
              <Text style={styles.sectionContent}>
                {selectedContent === 1 ? question?.Suggestion1 : question?.Suggestion2}
              </Text>
            </View>          
          </View>
        </>
      )}

      {question?.QuestionType === 'essay' && (
        <View style={styles.resultCard}>
          <View style={styles.cardHeader}>
            <Text style={styles.partTitle}>Test {testId} - Part {PartNumber} </Text>
            <TouchableOpacity 
              style={styles.viewQuestionButton}
              onPress={() => setIsQuestionModalVisible(true)}
            >
              <Ionicons name="eye-outline" size={20} color="#4A90E2" />
              <Text style={styles.viewQuestionText}>Xem câu hỏi</Text>
            </TouchableOpacity>
          </View>
          <ViewQuestionModal
            isVisible={isQuestionModalVisible}
            onClose={() => setIsQuestionModalVisible(false)}
            question={question}
          />

          <View style={styles.sectionContainer}>
            <Text style={styles.sectionLabel}>Câu trả lời của bạn:</Text>
            <Text style={styles.sectionContent}>{answer3}</Text>
          </View>

          <View style={styles.sectionContainer}>
            <Text style={styles.sectionLabel}>Nhận xét:</Text>
            <Text style={styles.sectionContent}>{answer3}</Text>
          </View>

          <View style={styles.sectionContainer}>
            <Text style={styles.sectionLabel}>Gợi ý cải thiện:</Text>
            <Text style={styles.sectionContent}>{answer3}</Text>
          </View>          
        </View>
      )}
    
    </ScrollView>
  </SafeAreaView>
);
};


// const styles = StyleSheet.create({
//     container: {
//       flex: 1,
//       backgroundColor: '#f5f5f5',
//       padding: 16,
//     },
//     loadingContainer: {
//       flex: 1,
//       justifyContent: 'center',
//       alignItems: 'center',
//       backgroundColor: '#fff',
//     },
//     loadingText: {
//       marginTop: 16,
//       fontSize: 16,
//       color: '#666',
//     },
//     title: {
//       fontSize: 24,
//       fontWeight: 'bold',
//       marginBottom: 20,
//       textAlign: 'center',
//     },
//     resultCard: {
//       backgroundColor: '#fff',
//       borderRadius: 12,
//       padding: 16,
//       marginBottom: 16,
//       shadowColor: '#000',
//       shadowOffset: {
//         width: 0,
//         height: 2,
//       },
//       shadowOpacity: 0.1,
//       shadowRadius: 4,
//       elevation: 3,
//     },
//     partTitle: {
//       fontSize: 18,
//       fontWeight: 'bold',
//       marginBottom: 12,
//       color: '#333',
//     },
//     timeSpentContainer: {
//       flexDirection: 'row',
//       marginBottom: 8,
//     },
//     timeSpentLabel: {
//       fontSize: 14,
//       color: '#666',
//       flex: 1,
//     },
//     timeSpentValue: {
//       fontSize: 14,
//       color: '#333',
//       fontWeight: '500',
//     },
//     scoreContainer: {
//       flexDirection: 'row',
//       alignItems: 'center',
//       marginBottom: 12,
//       backgroundColor: '#f8f9fa',
//       padding: 8,
//       borderRadius: 8,
//     },
//     scoreLabel: {
//       fontSize: 16,
//       color: '#666',
//       flex: 1,
//     },
//     scoreValue: {
//       fontSize: 20,
//       fontWeight: 'bold',
//       color: '#007AFF',
//     },
//     feedbackContainer: {
//       marginBottom: 12,
//       backgroundColor: '#f8f9fa',
//       padding: 12,
//       borderRadius: 8,
//     },
//     feedbackLabel: {
//       fontSize: 14,
//       color: '#666',
//       marginBottom: 4,
//     },
//     feedbackContent: {
//       fontSize: 14,
//       color: '#333',
//       lineHeight: 20,
//     },
//     suggestionsContainer: {
//       backgroundColor: '#f8f9fa',
//       padding: 12,
//       borderRadius: 8,
//     },
//     suggestionsLabel: {
//       fontSize: 14,
//       color: '#666',
//       marginBottom: 4,
//     },
//     suggestionsContent: {
//       fontSize: 14,
//       color: '#333',
//       lineHeight: 20,
//     },
//     submitButton: {
//       backgroundColor: '#60A5FA',
//       paddingVertical: 15,
//       paddingHorizontal: 25,
//       borderRadius: 12,
//       marginTop: 20,
//       alignItems: 'center',
//       shadowColor: '#000',
//       shadowOffset: { width: 0, height: 2 },
//       shadowOpacity: 0.2,
//       shadowRadius: 3,
//       elevation: 2,
//       marginBottom: 20,
//     },
    
//     submitButtonText: {
//       color: '#fff',
//       fontSize: 18,
//       fontWeight: 'bold',
//       textTransform: 'uppercase',
//       letterSpacing: 1,
//     },
//   });


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E9F0F7', // Soft blue background instead of gradient
  },
  headerContainer: {
    backgroundColor: '#4A90E2', // Blue header background
    paddingVertical: 15,
    paddingHorizontal: 20,
    alignItems: 'center',
    
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: 'white',
  },
  scrollViewContent: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 20,
  },
  resultCard: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 20,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 5,
  },
  cardHeader: {
    flexDirection: 'column',
    marginBottom: 15,
  },
  viewQuestionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop:10
  },
  viewQuestionText:{
    fontSize: 15,
    fontWeight: '600',
    color: '#333',
    marginLeft: 10,
  },
  partTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginLeft: 10,
  },
  sectionContainer: {
    backgroundColor: '#F7F9FC',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
  },
  sectionLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
    fontWeight: '500',
  },
  sectionContent: {
    fontSize: 15,
    color: '#333',
    lineHeight: 22,
  },

  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
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
});