import React, { useState, useRef } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Animated, 
  Dimensions,
  PanResponder
} from 'react-native';
import { SafeAreaBox } from "../../../components";
import { useRoute } from '@react-navigation/native';
import { HomeStackParamList } from '../../../screens/types';
import { RouteProp } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Feather';
import { getVocabByTopic } from '../../../data/vocabData';

type TopicsScreenRouteProp = RouteProp<HomeStackParamList, 'TopicsScreen'>;

export function TopicsScreen() {
  const route = useRoute<TopicsScreenRouteProp>();
  const { topicId } = route.params;
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  
  const topicData = getVocabByTopic(topicId);
  const words = topicData?.words || [];
  const currentWord = words[currentWordIndex];

  // Animation
  const flipAnimation = useRef(new Animated.Value(0)).current;
  const translateX = useRef(new Animated.Value(0)).current;

  const flipCard = () => {
    setIsFlipped(!isFlipped);
    Animated.spring(flipAnimation, {
      toValue: isFlipped ? 0 : 180,
      friction: 8,
      tension: 10,
      useNativeDriver: true,
    }).start();
  };

  const frontInterpolate = flipAnimation.interpolate({
    inputRange: [0, 180],
    outputRange: ['0deg', '180deg'],
  });

  const backInterpolate = flipAnimation.interpolate({
    inputRange: [0, 180],
    outputRange: ['180deg', '360deg'],
  });

  const frontAnimatedStyle = {
    transform: [{ rotateY: frontInterpolate }],
  };
  
  const backAnimatedStyle = {
    transform: [{ rotateY: backInterpolate }],
  };

  const handleNext = () => {
    if (currentWordIndex < words.length - 1) {
      setIsFlipped(false);
      flipAnimation.setValue(0);
      setCurrentWordIndex(currentWordIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentWordIndex > 0) {
      setIsFlipped(false);
      flipAnimation.setValue(0);
      setCurrentWordIndex(currentWordIndex - 1);
    }
  };

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (evt, gestureState) => {
        return Math.abs(gestureState.dx) > 20;
      },
      onPanResponderMove: (evt, gestureState) => {
        translateX.setValue(gestureState.dx);
      },
      onPanResponderRelease: (evt, gestureState) => {
        if (gestureState.dx > 50) {
          handlePrevious();
        } else if (gestureState.dx < -50) {
          handleNext();
        } else {
          Animated.spring(translateX, {
            toValue: 0,
            friction: 8,
            tension: 10,
            useNativeDriver: true,
          }).start();
        }
      },
    })
  ).current;

  return (
    <SafeAreaBox>
      <View style={styles.container}>
        <TouchableOpacity onPress={flipCard} activeOpacity={1} {...panResponder.panHandlers}>
          <Animated.View style={[styles.cardContainer, { transform: [{ translateX }] }]}>
            <Animated.View style={[styles.flashcard, frontAnimatedStyle]}>
              <Text style={styles.wordText}>{currentWord?.word}</Text>
              <Text style={styles.partOfSpeechText}>{currentWord?.partOfSpeech}</Text>
            </Animated.View>
            
            <Animated.View style={[styles.flashcard, styles.flashcardBack, backAnimatedStyle]}>
              <Text style={styles.vietnameseText}>{currentWord?.vietnamese}</Text>
            </Animated.View>
          </Animated.View>
        </TouchableOpacity>

        <View style={styles.navigation}>
          <TouchableOpacity 
            style={styles.navButton}
            onPress={handlePrevious}
            disabled={currentWordIndex === 0}
          >
            <Icon name="chevron-left" size={24} color={currentWordIndex === 0 ? "#ccc" : "#000"} />
          </TouchableOpacity>
          <Text style={styles.pageIndicator}>{`${currentWordIndex + 1} / ${words.length}`}</Text>
          <TouchableOpacity 
            style={styles.navButton}
            onPress={handleNext}
            disabled={currentWordIndex === words.length - 1}
          >
            <Icon name="chevron-right" size={24} color={currentWordIndex === words.length - 1 ? "#ccc" : "#000"} />
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaBox>
  );
}

const { width, height } = Dimensions.get('window');
const cardWidth = width * 0.85;
const cardHeight = height * 0.45;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    padding: 20,
    paddingTop: 10,
  },
  cardContainer: {
    width: cardWidth,
    height: cardHeight,
    marginVertical: 15,
  },
  flashcard: {
    width: '100%',
    height: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 15,
    alignItems: 'center',
    justifyContent: 'center',
    backfaceVisibility: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    position: 'absolute',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  flashcardBack: {
    backgroundColor: '#F8F9FA',
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  wordText: {
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 20,
    color: '#2C3E50',
  },
  pronunciationText: {
    fontSize: 18,
    color: '#7F8C8D',
    marginVertical: 10,
    fontStyle: 'italic',
  },
  partOfSpeechText: {
    fontSize: 16,
    color: '#95A5A6',
    marginVertical: 10,
    textTransform: 'lowercase',
  },
  vietnameseText: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 20,
    color: '#2C3E50',
  },
  exampleText: {
    fontSize: 16,
    color: '#666',
  },
  navigation: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  navButton: {
    padding: 10,
  },
  pageIndicator: {
    marginHorizontal: 20,
    fontSize: 16,
  },
  errorText: {
    fontSize: 16,
    color: '#ff0000',
    marginTop: 20,
  },
});