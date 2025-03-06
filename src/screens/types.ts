import { NativeStackScreenProps } from "@react-navigation/native-stack";

import type { VocabWord } from '../data/Vocab'; // Adjust the path if necessary

export type BottomTabParamList = {
  HomeTab: undefined;
  SavedTab: undefined;
  StatsTab: undefined;
  SettingsTab: undefined;
};

export type HomeStackParamList = {
  Home: undefined;
  // Test: {
  //   title: string;
  //   testName: TestName;
  // };
  // Result: {
  //   correctAnswers: number;
  //   totalQuestions: number;
  //   timeTaken: number;
  // };
  Speaking: undefined;
  Writing: undefined;
  Vocabulary: undefined;
  InforTestScreen: { PartNumber: string };
  InforTestScreenWR: { PartNumber: string };
  TestScreen: {
    testId: number;
    PartNumber: string;
  };
  TestScreenWR: {
    testId: number;
    PartNumber: string;
  };

  MyLibraryScreen: {
    onTopicAdded?: (topic: Topic) => void;
    handleSaveTopic?: () => void;
    isSaving?: boolean;
  };
  TopicsScreen: {
    topicId: string;
  };
  
  NoteScreen: undefined;
  SettingsScreen: undefined;
  // ResultScreen: {
  //   answers: {
  //     questionID: string;
  //     answerContent: string;
  //   }[];
  // };
  ResultScreen:{
    testId: number;
    PartNumber: string;
  };
  LoginScreen: undefined;
  RegisterScreen: undefined;
  
};

export type HomeScreenProps = NativeStackScreenProps<
  HomeStackParamList,
  "Home"
>;
// export type TestScreenProps = NativeStackScreenProps<
//   HomeStackParamList,
//   "Test"
// >;
// export type ResultScreenProps = NativeStackScreenProps<
//   HomeStackParamList,
//   "Result"
// >;

export type SpeakingScreenProps = NativeStackScreenProps<
  HomeStackParamList,
  "Speaking"
>;

export type WritingScreenProps = NativeStackScreenProps<
  HomeStackParamList,
  "Writing"
>;

export type VocabularyScreenProps = NativeStackScreenProps<
  HomeStackParamList,
  "Vocabulary"
>;

export type InforTestScreenProps = NativeStackScreenProps<
  HomeStackParamList,
  "InforTestScreen"
>;

export type TestScreenProps = NativeStackScreenProps<
  HomeStackParamList,
  "TestScreen"
>;


export type InforTestScreenWRProps = NativeStackScreenProps<
  HomeStackParamList,
  "InforTestScreenWR"
>;

export type TestScreenWRProps = NativeStackScreenProps<
  HomeStackParamList,
  "TestScreenWR"
>;

export type MyLibraryScreenProps = NativeStackScreenProps<
  HomeStackParamList,
  "MyLibraryScreen"
>;

export type TopicsScreenRouteProp = NativeStackScreenProps<
  HomeStackParamList,
  "TopicsScreen"
>;

export type Topic = {
  TopicID: string;
  TopicName: string;
  wordCount: number;
};

export type TopicImage = {
  source: any;
  alt: string;
};

export interface VocabTopic {
  TopicID: string;  // Thay đổi từ id
  TopicName: string; // Thay đổi từ name 
  Description?: string;
  words?: VocabWord[];
}
export type NoteScreenProps = NativeStackScreenProps<
  HomeStackParamList,
  "NoteScreen"
>;

export type SettingsScreenProps = NativeStackScreenProps<
  HomeStackParamList,
  "SettingsScreen"
>;

export type ResultScreenProps = NativeStackScreenProps<
HomeStackParamList,
"ResultScreen"
>;

export type LoginScreenProps = NativeStackScreenProps<
HomeStackParamList,
"LoginScreen"
>;

export type RegisterScreenProps = NativeStackScreenProps<
HomeStackParamList,
"RegisterScreen"
>;