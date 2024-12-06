import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaBox } from "../../../../components";
import { useRoute } from '@react-navigation/native';
import { HomeStackParamList } from '../../../types';
import { RouteProp } from '@react-navigation/native';

type TestScreenRouteProp = RouteProp<HomeStackParamList, 'TestScreen'>;

// Dữ liệu mẫu cho các câu hỏi theo từng part
const questionsData = {
  '1': [
    {
      id: 1,
      text: "Directions: In this part of the test, you will read aloud the text on the screen. You will have 45 seconds to prepare. Then you will have 45 seconds to read the text aloud.",
      content: "The development of new technology has brought many changes to the workplace. One significant change is the ability to work remotely. Many employees now have the option to work from home or other locations outside the traditional office environment. This flexibility has led to increased productivity and job satisfaction for many workers. However, it also presents new challenges in terms of communication and team collaboration.",
    }
  ],
  '2': [
    {
      id: 1,
      text: "Directions: In this part of the test, you will describe the picture on your screen in as much detail as possible. You will have 30 seconds to prepare your response. Then you will have 45 seconds to speak about the picture.",
      imageUrl: "path_to_image",
    }
  ],
  '3': [
    {
      id: 1,
      text: "Directions: In this part of the test, you will answer three questions. For each question, begin responding immediately after you hear a beep. No preparation time is provided. You will have 15 seconds to respond to questions 1 and 2, and 30 seconds to respond to question 3.",
      questions: [
        "What kind of transportation do you usually use to go to work or school?",
        "What are some advantages of using public transportation?",
        "Describe a memorable journey you have taken. What made it special?"
      ]
    }
  ],
  '4': [
    {
      id: 1,
      text: "Directions: In this part of the test, you will answer three questions based on the information provided. You will have 30 seconds to read the information before the questions begin. For each question, begin responding immediately after you hear a beep. No additional preparation time is provided. You will have 15 seconds to respond to questions 1 and 2, and 30 seconds to respond to question 3.",
      readingText: "Attention all employees: The company annual meeting will be held next Thursday at 2 PM in the main conference room. All department heads are required to prepare a brief presentation about their team's achievements this year. The meeting is expected to last approximately three hours, and refreshments will be provided.",
      questions: [
        "What is the main purpose of the meeting?",
        "Who needs to prepare presentations?",
        "What details are provided about the meeting arrangements?"
      ]
    }
  ],
  '5': [
    {
      id: 1,
      text: "Directions: In this part of the test, you will give your opinion about a specific topic. Be sure to say as much as you can in the time allowed. You will have 15 seconds to prepare. Then you will have 60 seconds to speak.",
      topic: "Some people prefer to work for large companies, while others prefer to work for small companies. Which would you prefer? Include reasons and specific examples to support your answer."
    }
  ]
};

export function TestScreen({ navigation }: any) {
  const route = useRoute<TestScreenRouteProp>();
  const { testId, PartNumber } = route.params;
  const questions = questionsData[PartNumber as keyof typeof questionsData];

  return (
    <SafeAreaBox>
      <ScrollView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Part {PartNumber} - Test {testId}</Text>
          <Text style={styles.timer}>00:45</Text>
        </View>

        <View style={styles.questionContainer}>
          <Text style={styles.directions}>{questions[0].text}</Text>
          
          {PartNumber === '1' && 'content' in questions[0] && (
            <View style={styles.readingBox}>
              <Text style={styles.readingText}>{questions[0].content}</Text>
            </View>
          )}

          {PartNumber === '3' && 'questions' in questions[0] && (
            <View style={styles.questionsList}>
              {questions[0].questions.map((question: string, index: number) => (
                <View key={index} style={styles.questionItem}>
                  <Text style={styles.questionNumber}>{index + 1}</Text>
                  <Text style={styles.questionText}>{question}</Text>
                </View>
              ))}
            </View>
          )}

          {PartNumber === '4' && 'readingText' in questions[0] && 'questions' in questions[0] && (
            <>
              <View style={styles.readingBox}>
                <Text style={styles.readingText}>{questions[0].readingText}</Text>
              </View>
              <View style={styles.questionsList}>
                {questions[0].questions.map((question: string, index: number) => (
                  <View key={index} style={styles.questionItem}>
                    <Text style={styles.questionNumber}>{index + 1}</Text>
                    <Text style={styles.questionText}>{question}</Text>
                  </View>
                ))}
              </View>
            </>
          )}

          {PartNumber === '5' && 'topic' in questions[0] && (
            <View style={styles.topicBox}>
              <Text style={styles.topicText}>{questions[0].topic}</Text>
            </View>
          )}
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity 
          style={styles.button}
          onPress={() => {/* Xử lý logic ghi âm */}}
        >
          <Text style={styles.buttonText}>Bắt đầu ghi âm</Text>
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
  timer: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2980B9',
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
});