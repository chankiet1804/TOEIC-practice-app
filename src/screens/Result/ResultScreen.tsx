import { ResultScreenProps } from "../types";
import { SafeAreaBox } from "../../components";
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

type ResultRouteProp = RouteProp<HomeStackParamList, 'ResultScreen'>;

interface answer {
    questionID: string,
    answerContent: string
};

interface EvaluationResult {
    feedback: string;
    suggestions: string;
};



export function ResultScreen({ navigation }: ResultScreenProps) {
    const [loading, setLoading] = useState(true);
    const [results, setResults] = useState<EvaluationResult[]>([]);
    const [feedbacks, setFeedbacks] = useState<(any | null)[]>([]);

    const route = useRoute<ResultRouteProp>();
    const answers = route.params.answers; // danh sach cac cau tra loi dc truyen vao tu TestScreenWR
    

    const evaluateAnswer = async (answer: string): Promise<EvaluationResult> => {
        try {
          // Thay thế URL và API key bằng của bạn
          const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              
            },
            body: JSON.stringify({
              model: "gpt-3.5-turbo",
              messages: [
                {
                  role: "system",
                  content: "Bạn đang là 1 chuyên gia đánh giá phần thi toeic writing. Hãy đánh giá câu trả lời của người dùng dựa vào gợi ý đáp án.Trả lời tiếng việt"
                },
                {
                  role: "user",
                  content: `Đánh giá câu trả lời này và cho 1 câu nhận xét ngắn gọn, cần cải thiện chỗ nào : "${answer}"`
                }
              ]
            })
          });
    
          const data = await response.json();
          console.log(data);
          return {
            feedback: "hihihi", // Parse from response
            suggestions: "Example" // Parse from response
          };
        } 
         catch (error) {
          console.error('Error evaluating answer:', error);
          return {
            feedback: "Không thể đánh giá do lỗi hệ thống",
            suggestions: "Vui lòng thử lại sau"
          };
        }
    };

    useEffect(() => {
        const loadFeedback = async () => {
          try {
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
            const evaluations = await Promise.all(
                answers.map(answer => evaluateAnswer(answer.answerContent))
            );
            setResults(evaluations);
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
  

