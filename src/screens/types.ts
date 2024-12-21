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
  InforTestScreenWR: { PartNumber: string };
  TestScreen: {
    testId: number;
    PartNumber: string;
  };
  TestScreenWR: {
    testId: number;
    PartNumber: string;
  };
  
  MyLibraryScreen: undefined;
  
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

export type InforTestScreenWRProps = NativeStackScreenProps<
  HomeStackParamList,
  "InforTestScreenWR"
>;

export type TestScreenWRProps = NativeStackScreenProps<
  HomeStackParamList,
  "TestScreenWR"
>;
