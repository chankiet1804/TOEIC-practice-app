export interface Image {
  uri: string;
  alt: string;
}

export interface Option {
  id: string;
  text: string;
  isCorrect: boolean;
}

export interface Question {
  id: string;
  question: string;
  image?: Image;
  hint: string;
  options: Option[];
  answerDescription: string;
}

export interface Test {
  id: string;
  title: string;
  image?: Image;
  testName: TestName;
  numOfQuestions: number;
  duration: number;
}

export type TestName = "flags" | "solarSystem";

export type TopicImage = {
  source: any;
  alt: string;
};

export interface Topic {
  TopicID: string;
  TopicName: string;
  Description: string;
  ImagePath?: string;
}

export interface TopicWithImage extends Topic {
  image: TopicImage;
}
