import React, { useState } from 'react';
import { Modal, View, Text, Image, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { WRITING_IMAGES } from '../../database/images';

interface Question {
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

interface ViewQuestionModalProps {
  isVisible: boolean;
  onClose: () => void;
  question: Question;
}

const ViewQuestionModal = ({ isVisible, onClose, question }: ViewQuestionModalProps) => {
  const [selectedContent, setSelectedContent] = useState(1);

  const renderQuestionContent = () => {
    switch (question.QuestionType) {
      case 'image':
        return (
          <>
            <View style={styles.imageContainer}>
              {selectedContent === 1 ? (
                question.ImagePath1 && (
                  <Image
                    source={WRITING_IMAGES[question.ImagePath1 as keyof typeof WRITING_IMAGES]}
                    style={styles.image}
                    resizeMode="contain"
                  />
                )
              ) : (
                question.ImagePath2 && (
                  <Image
                    source={WRITING_IMAGES[question.ImagePath2 as keyof typeof WRITING_IMAGES]}
                    style={styles.image}
                    resizeMode="contain"
                  />
                )
              )}
            </View>
            {/* <View style={styles.questionItem}>
              <Text style={styles.questionNumber}>{selectedContent}</Text>
              <Text style={styles.questionText}>
                {selectedContent === 1 ? question.Question1 : question.Question2}
              </Text>
            </View> */}
          </>
        );
      
      case 'email':
        return (
          <>
            <View style={styles.readingBox}>
              <Text style={styles.readingText}>
                {selectedContent === 1 ? question.Content1 : question.Content2}
              </Text>
            </View>
            <View style={styles.questionItem}>
              <Text style={styles.questionNumber}>{selectedContent}</Text>
              <Text style={styles.questionText}>
                {selectedContent === 1 ? question.Question1 : question.Question2}
              </Text>
            </View>
          </>
        );
      
      case 'essay':
      default:
        return (
          <View style={styles.topicBox}>
            <Text style={styles.topicText}>{question.Content1}</Text>
          </View>
        );
    }
  };

  const hasTwoQuestions = question.QuestionType === 'image' || question.QuestionType === 'email';

  return (
    <Modal
      visible={isVisible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Ionicons name="document-text-outline" size={24} color="#4A90E2" />
            <Text style={styles.modalTitle}>Question Details</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Ionicons name="close-outline" size={24} color="#333" />
            </TouchableOpacity>
          </View>
          
          {hasTwoQuestions && (
            <View style={styles.tabContainer}>
              <TouchableOpacity
                style={[styles.tab, selectedContent === 1 && styles.activeTab]}
                onPress={() => setSelectedContent(1)}
              >
                <Text style={[styles.tabText, selectedContent === 1 && styles.activeTabText]}>
                  Question 1
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.tab, selectedContent === 2 && styles.activeTab]}
                onPress={() => setSelectedContent(2)}
              >
                <Text style={[styles.tabText, selectedContent === 2 && styles.activeTabText]}>
                  Question 2
                </Text>
              </TouchableOpacity>
            </View>
          )}
          
          <ScrollView style={styles.contentContainer}>
            {renderQuestionContent()}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '90%',
    maxHeight: '80%',
    backgroundColor: 'white',
    borderRadius: 10,
    overflow: 'hidden',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 10,
    color: '#4A90E2',
    flex: 1,
  },
  closeButton: {
    padding: 5,
  },
  tabContainer: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#4A90E2',
  },
  tabText: {
    color: '#666',
    fontWeight: '500',
  },
  activeTabText: {
    color: '#4A90E2',
    fontWeight: 'bold',
  },
  contentContainer: {
    padding: 15,
  },
  imageContainer: {
    alignItems: 'center',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#eee',
    borderRadius: 8,
    padding: 10,
  },
  image: {
    width: '100%',
    height: 200,
  },
  readingBox: {
    backgroundColor: '#f9f9f9',
    padding: 15,
    borderRadius: 8,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#eee',
  },
  readingText: {
    fontSize: 16,
    lineHeight: 24,
  },
  questionItem: {
    flexDirection: 'row',
    marginBottom: 10,
    backgroundColor: '#f5f5f5',
    padding: 15,
    borderRadius: 8,
  },
  questionNumber: {
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 10,
    color: '#4A90E2',
  },
  questionText: {
    fontSize: 16,
    flex: 1,
    lineHeight: 24,
  },
  topicBox: {
    backgroundColor: '#f9f9f9',
    padding: 20,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#eee',
  },
  topicText: {
    fontSize: 18,
    fontWeight: '500',
    lineHeight: 26,
    textAlign: 'center',
  },
});

export default ViewQuestionModal;