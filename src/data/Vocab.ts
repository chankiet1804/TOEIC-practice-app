export interface VocabWord {
    id: string;
    word: string;
    vietnamese: string;
  }
  
  export interface VocabTopic {
    TopicID: string;
    TopicName: string;
    description?: string;
    words: VocabWord[];
  }