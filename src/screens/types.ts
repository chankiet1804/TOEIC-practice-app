import { NativeStackScreenProps } from "@react-navigation/native-stack";

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
  TestScreen: {
    testId: number;
    PartNumber: string;
  };
  MyLibraryScreen: undefined;
  TopicsScreen: {
    topicId: string;
  };
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