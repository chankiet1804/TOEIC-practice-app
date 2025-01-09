import { ResultScreenProps } from "../types";
// import { SafeAreaBox } from "../../components";
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  Alert
} from 'react-native';
import { RouteProp } from '@react-navigation/native';
import { HomeStackParamList } from '../types';
import { useRoute } from '@react-navigation/native';
import { getFeedback,getDBConnection } from "../../database/db-service";

import OpenAI from "openai";
// import 'dotenv/config';
import { OPENAI_API_KEY } from '@env';


type ResultRouteProp = RouteProp<HomeStackParamList, 'ResultScreen'>;

// interface answer {
//     questionID: string,
//     answerContent: string
// };

interface EvaluationResult {
  feedback: string;
  suggestions?: string;
}



export function ResultScreen({ navigation }: ResultScreenProps) {
    const [loading, setLoading] = useState(true);
    const [results, setResults] = useState<EvaluationResult[]>([]);
    const [feedbacks, setFeedbacks] = useState<(any | null)[]>([]);

    const openai = new OpenAI({
        apiKey: OPENAI_API_KEY, // Lấy từ file .env
      });

    const route = useRoute<ResultRouteProp>();
    const answers = route.params.answers; // danh sach cac cau tra loi dc truyen vao tu TestScreenWR
    

    const evaluateAnswer = async (answer: string): Promise<EvaluationResult | null> => {
        try {
          
          const prompt = `
            Hãy đánh giá câu trả lời sau đây và trả về kết quả theo định dạng JSON:
            Câu trả lời: "${answer}"
            
            Yêu cầu: Trả về chính xác định dạng JSON với cấu trúc:
            {
              "feedback": "Nhận xét về câu trả lời"
            }
            
            CHÚ Ý: Chỉ trả về object JSON, không thêm bất kỳ text nào khác.
          `;

          const completion = await openai.chat.completions.create({
            messages: [
              {
                role: "system",
                content: "Bạn là assistant chuyên đánh giá câu trả lời. Luôn trả về kết quả ở định dạng JSON."
              },
              { role: "user", content: prompt }
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
              return {
              feedback: feedbackFromAPI.feedback, // Parse from response
              suggestions: "hihihi" // Parse from response
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

    useEffect(() => {
        const loadFeedback = async () => {
          try {
            setLoading(true);
            const db = await getDBConnection();
            const feedbackResult = await Promise.all(
                answers.map(async (answer) => {
                  const feedback = await getFeedback(db, answer.questionID);
                  return { feedback };
                })
            );
            setFeedbacks(feedbackResult);
          } catch (error) {
            console.error('Error loading feedback:', error);
          } finally {
            setLoading(false);
          }
        };
        loadFeedback();
      }, [answers]);

    
    useEffect(() => {
        const evaluateAllAnswers = async () => {
            try {
            setLoading(true);
            const evaluations = await Promise.all(
                answers.map(answer => evaluateAnswer(answer.answerContent))
            );
            const validEvaluations = evaluations.filter((evaluation): evaluation is EvaluationResult => evaluation !== null);
            setResults(validEvaluations);
            } catch (error) {
            Alert.alert('Lỗi', 'Không thể đánh giá kết quả. Vui lòng thử lại sau.');
            } finally {
            setLoading(false);
            }
        };

        if (feedbacks.every((feedback) => feedback === null)) {
            evaluateAllAnswers();
        }
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
        <ScrollView style={styles.container}>
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
                <Text style={styles.feedbackContent}>{results[index]?.feedback}</Text>
              </View>
    
              <View style={styles.suggestionsContainer}>
                <Text style={styles.suggestionsLabel}>Gợi ý cải thiện:</Text>
                <Text style={styles.suggestionsContent}>
                  {results[index]?.suggestions}
                  {/* hihihi */}
                </Text>
              </View>
            </View>
          ))}
        </ScrollView>
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
  });
  

