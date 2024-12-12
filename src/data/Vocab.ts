export interface VocabWord {
    id: string;
    word: string;
    partOfSpeech: string;
    vietnamese: string;
  }
  
  export interface VocabTopic {
    id: string;
    name: string;
    description?: string;
    words: VocabWord[];
  }