import { ResultScreenProps } from "../types";
// import { SafeAreaBox } from "../../components";
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  Alert,
  TouchableOpacity
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
  // thêm các properties khác nếu có
}


export function ResultScreen({ navigation }: ResultScreenProps) {
    const [loading, setLoading] = useState(true);
    const [results, setResults] = useState<EvaluationResult[]>([]);
    // const [feedbacks, setFeedbacks] = useState<(any | null)[]>([]);
    //const [feedbacks, setFeedbacks] = useState<string[]>([]);
    //const [suggestion,setSuggestion] = useState<Suggestion | null>(null);
    const [feedbacks, setFeedbacks] = useState<Map<string,string>>(new Map());
    const [suggestionList,setSuggestionList] = useState<Map<string,string>>(new Map());
    const [dbConnection, setDbConnection] = useState<SQLite.SQLiteDatabase | null>(null);
    const [haveFeedback,setHaveFeedback] = useState(false);

    const openai = new OpenAI({
        apiKey: OPENAI_API_KEY, // Lấy từ file .env
      });

    const route = useRoute<ResultRouteProp>();
    const answers = route.params.answers; // danh sach cac cau tra loi dc truyen vao tu TestScreenWR
    
    
    

    const evaluateAnswer = async (answer: string, answerID : string): Promise<EvaluationResult | null> => {
        try {
          const sugest = suggestionList.get(answerID);
          console.log(sugest);
          const prompt_part1_WR = `
            Câu trả lời: "${answer}"
            Gợi ý của đề : "${sugest}"   
            Yêu cầu: Trả về chính xác định dạng JSON với cấu trúc:
            {
              "feedback": "Nhận xét về câu trả lời"
            }
            Kiểm tra câu trả lời có đúng ngữ pháp, và sử dụng đúng cặp từ keyword trong ngoặc ở gợi ý, nội dung chỉ cần tương đồng với gợi ý hoặc thiếu cũng đc, khi nào khác hoàn toàn với gợi ý thì mới nhắc nhở. 
            CHÚ Ý: Chỉ trả về object JSON, không thêm bất kỳ text nào khác.
          `;

          const completion = await openai.chat.completions.create({
            messages: [
              {
                role: "system",
                content: "Bạn là assistant chuyên đánh giá câu trả lời. Luôn trả về kết quả ở định dạng JSON."
              },
              { role: "user", content: prompt_part1_WR  }
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
              if (dbConnection) {
                await saveFeedback(dbConnection,answerID,feedbackFromAPI.feedback);
              }
              setHaveFeedback(true);
              loadFeedback();
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
          return null;
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

    const evaluateAllAnswers = async () => {
      try {
      setLoading(true);
      const evaluations = await Promise.all(
          answers.map(answer => evaluateAnswer(answer.answerContent,answer.questionID))
      );
      const validEvaluations = evaluations.filter((evaluation): evaluation is EvaluationResult => evaluation !== null);
      setResults(validEvaluations);
      } catch (error) {
      Alert.alert('Lỗi', 'Không thể đánh giá kết quả. Vui lòng thử lại sau.');
      } finally {
      setLoading(false);
      }
  };

  const loadFeedback = async () => {
    try {
      setLoading(true);
      const dbase = await getDBConnection();
      setDbConnection(dbase);
      const myMap: Map<string, string> = new Map(feedbacks);
      //const feedbackResult = await Promise.all(
        await Promise.all( 
        answers.map(async (answer) => {
          const feedback = await getFeedback(dbase, answer.questionID);
          const feedbackContent = (feedback as FeedbackItem[])[0]?.Feedback || '';
          console.log("Individual feedback for question", answer.questionID, ":", feedbackContent);
          if(feedbackContent!=="") 
            myMap.set(answer.questionID,JSON.stringify(feedbackContent))
          // Giả sử feedback là một mảng các object có property feedback
          // return (feedback as Array<{ feedback: string }>)
          //   .map(f => f.feedback)
          //   .join('');
        }) 
      );  
      
      setFeedbacks(myMap);
      // console.log("FEEDBACK: " + JSON.stringify(feedbacks[0]) + "\n" + JSON.stringify(feedbacks[1]));
      // console.log("kkkkk" + JSON.stringify(feedbackResult[0].feedback) + "------------\n" + JSON.stringify(feedbackResult[1].feedback));
      //console.log("FEEDBACKS:", feedbackResult);
    } catch (error) {
      console.error('Error loading feedback:', error);
    } finally { 
      setLoading(false);
    }
  };


    useEffect(() => {    
      loadFeedback();  
    }, [answers]); 

    useEffect(() => {
      if(feedbacks.size > 0) {
        setHaveFeedback(true);
      }
    }, [feedbacks]);

    useEffect(() => {
      const loadSuggestion = async () => {
        try {
          setLoading(true);
          //const dbase = await getDBConnection();
          const myMap: Map<string, string> = new Map(suggestionList);
          for(let i=0;i<2;i++){
            const q = query(
              collection(db, 'suggestion'),
              where('questionID', '==', answers[i].questionID),
            );
            const querySnapshot = await getDocs(q);
              const suggestionData = querySnapshot.docs.map(doc => {
              const data = doc.data();
              return data.sgt;
            });
            if (suggestionData.length > 0) {
              myMap.set(answers[i].questionID,suggestionData[0]);
              console.log(answers[i].questionID + "-" + suggestionData[0]+"\n")
            }         
          }
          setSuggestionList(myMap); 
        } catch (error) {
          console.error('Error loading suggestions:', error);
        } finally {
          setLoading(false);
        }
      };
      loadSuggestion();
    }, [answers]);

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#0000ff" />
            <Text style={styles.loadingText}>Đang trong quá trình xử lý kết quả...</Text>
            </View>
        );
    }

    return (
      <View style={styles.container}>
        <ScrollView >
          <Text style={styles.title}>Kết quả đánh giá</Text>
          
          {answers.map((answer, index) => (
            <View key={index} style={styles.resultCard}>
              <Text style={styles.partTitle}>Câu hỏi {answer.questionID}</Text>
              
              {/* <View style={styles.timeSpentContainer}>
                <Text style={styles.timeSpentLabel}>Thời gian làm bài:</Text>
                <Text style={styles.timeSpentValue}>
                  {answer.timeSpent.minutes} phút {answer.timeSpent.seconds} giây
                </Text>
              </View> */}
    
              {/* <View style={styles.scoreContainer}>
                <Text style={styles.scoreLabel}>Điểm số:</Text>
                <Text style={styles.scoreValue}>{results[index]?.score}/10</Text>
              </View> */}
    
              <View style={styles.feedbackContainer}>
                <Text style={styles.feedbackLabel}>Nhận xét:</Text>
                <Text style={styles.feedbackContent}>
                  {/* {results[index]?.feedback} */}
                  {/* {index === 0 ? feedbacks.get(answers[0].questionID) : feedbacks.get(answers[1].questionID)} */}
                  {
                    haveFeedback
                    ? (index === 0
                        ? feedbacks.get(answers[0].questionID)
                        : feedbacks.get(answers[1].questionID))
                    : "Chưa có nhận xét"
                  }
                </Text>
              </View>
    
              <View style={styles.suggestionsContainer}>
                <Text style={styles.suggestionsLabel}>Gợi ý cải thiện:</Text>
                <Text style={styles.suggestionsContent}>
                  {/* {index === 0 ? suggestion?.Suggestion1 : suggestion?.Suggestion2} */}
                  {index === 0 ? suggestionList.get(answers[0].questionID) : suggestionList.get(answers[1].questionID)}
                </Text>
              </View>
            </View>
          ))}
        </ScrollView>
        {!haveFeedback&&(
        <TouchableOpacity
          style={styles.submitButton}
          onPress={() => {
            if(1){
              evaluateAllAnswers();
            }
          }}
        >
          <Text style={styles.submitButtonText}>Xem nhận xét</Text>      
        </TouchableOpacity>
        )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#f5f5f5',
      padding: 16,
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
    title: {
      fontSize: 24,
      fontWeight: 'bold',
      marginBottom: 20,
      textAlign: 'center',
    },
    resultCard: {
      backgroundColor: '#fff',
      borderRadius: 12,
      padding: 16,
      marginBottom: 16,
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    partTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      marginBottom: 12,
      color: '#333',
    },
    timeSpentContainer: {
      flexDirection: 'row',
      marginBottom: 8,
    },
    timeSpentLabel: {
      fontSize: 14,
      color: '#666',
      flex: 1,
    },
    timeSpentValue: {
      fontSize: 14,
      color: '#333',
      fontWeight: '500',
    },
    scoreContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 12,
      backgroundColor: '#f8f9fa',
      padding: 8,
      borderRadius: 8,
    },
    scoreLabel: {
      fontSize: 16,
      color: '#666',
      flex: 1,
    },
    scoreValue: {
      fontSize: 20,
      fontWeight: 'bold',
      color: '#007AFF',
    },
    feedbackContainer: {
      marginBottom: 12,
    },
    feedbackLabel: {
      fontSize: 14,
      color: '#666',
      marginBottom: 4,
    },
    feedbackContent: {
      fontSize: 14,
      color: '#333',
      lineHeight: 20,
    },
    suggestionsContainer: {
      backgroundColor: '#f8f9fa',
      padding: 12,
      borderRadius: 8,
    },
    suggestionsLabel: {
      fontSize: 14,
      color: '#666',
      marginBottom: 4,
    },
    suggestionsContent: {
      fontSize: 14,
      color: '#333',
      lineHeight: 20,
    },
    submitButton: {
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
      marginBottom: 20,
    },
    
    submitButtonText: {
      color: '#fff',
      fontSize: 18,
      fontWeight: 'bold',
      textTransform: 'uppercase',
      letterSpacing: 1,
    },
  });
  

