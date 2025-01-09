import * as SQLite from 'expo-sqlite';
import { 
  part1Questions, 
  part2Questions, 
  part3Questions, 
  part4Questions, 
  part5Questions,
  part1WRQuestions,
  part2WRQuestions,
  part3WRQuestions,
} from './questionData';
import { VocabTopic } from '../data/Vocab';

export const getDBConnection = async () => {
  try {
    return SQLite.openDatabaseSync('Toeic-data.db');
  } catch (error) {
    console.error('Error opening database:', error);
    throw Error('Failed to open database');
  }
};

export const createTables = async (db: SQLite.SQLiteDatabase) => {
  try {
    // Xóa các bảng cũ
    await db.execAsync(`
      /*
      DROP TABLE IF EXISTS Questions;
      DROP TABLE IF EXISTS Parts;
      DROP TABLE IF EXISTS Tests;
      DROP TABLE IF EXISTS Recordings;
      DROP TABLE IF EXISTS QuestionsWR;
      DROP TABLE IF EXISTS AnswerWriting;
      */
      
      CREATE TABLE IF NOT EXISTS Tests (
        TestID TEXT PRIMARY KEY,
        Title TEXT NOT NULL
      );
      
      CREATE TABLE IF NOT EXISTS Parts (
        PartID TEXT PRIMARY KEY,
        TestID TEXT,
        PartNumber INTEGER NOT NULL,
        FOREIGN KEY (TestID) REFERENCES Tests(TestID)
      );
      
      CREATE TABLE IF NOT EXISTS Questions (
        QuestionID TEXT PRIMARY KEY,
        PartID TEXT,
        QuestionType TEXT,
        Content1 TEXT,
        Content2 TEXT,
        ImagePath1 TEXT,
        ImagePath2 TEXT,
        Question1 TEXT,
        Question2 TEXT,
        Question3 TEXT,
        PreparationTime INTEGER,
        ResponseTime INTEGER,
        FOREIGN KEY (PartID) REFERENCES Parts(PartID)
      );

      CREATE TABLE IF NOT EXISTS QuestionsWR (
        QuestionID TEXT PRIMARY KEY,
        PartID TEXT,
        QuestionType TEXT,
        Content1 TEXT,
        Content2 TEXT,
        Require1 TEXT,
        Require2 TEXT,
        ImagePath1 TEXT,
        ImagePath2 TEXT,
        PreparationTime INTEGER,
        ResponseTime INTEGER,
        FOREIGN KEY (PartID) REFERENCES Parts(PartID)
      );
      
      CREATE TABLE IF NOT EXISTS Recordings (
        testId INTEGER NOT NULL,
        partNumber INTEGER NOT NULL,
        questionNumber INTEGER NOT NULL,
        fileName TEXT NOT NULL PRIMARY KEY,
        filePath TEXT NOT NULL,
        createdAt TEXT NOT NULL
      );

      CREATE TABLE IF NOT EXISTS Topics (
        TopicID TEXT PRIMARY KEY,
        TopicName TEXT NOT NULL,
        Description TEXT,
        ImagePath TEXT
      );

      CREATE TABLE IF NOT EXISTS Vocabulary (
        VocabID TEXT PRIMARY KEY,
        TopicID TEXT,
        Word TEXT NOT NULL,
        Meaning TEXT NOT NULL,
        Example TEXT,
        Pronunciation TEXT,
        WordType TEXT,
        ImagePath TEXT,
        FOREIGN KEY (TopicID) REFERENCES Topics(TopicID)
      );

      CREATE TABLE IF NOT EXISTS AnswerWriting (
        AnswerID TEXT PRIMARY KEY NOT NULL,
        Content TEXT NOT NULL,
        feedback TEXT
      );

      
    `);
    
    console.log('All tables created successfully');
    return true;
  } catch (error) {
    console.error('Error creating tables:', error);
    throw error;
  }
};

export const insertTests = async (db: SQLite.SQLiteDatabase) => {
  try {
    let insertSQL = '';
    for (let i = 1; i <= 10; i++) {
      insertSQL += `INSERT OR IGNORE INTO Tests (TestID, Title) VALUES ('${i}', 'SpeakingTest${i}');`;
    }
    
    await db.execAsync(insertSQL);
    console.log('All tests inserted successfully');
    return true;
  } catch (error) {
    console.error('Error inserting tests:', error);
    throw error;
  }
};

export const insertParts = async (db: SQLite.SQLiteDatabase) => {
  try {
    let insertSQL = '';
    for (let testId = 1; testId <= 10; testId++) {
      for (let partNumber = 1; partNumber <= 5; partNumber++) {
        const partId = `${testId}_${partNumber}`;
        insertSQL += `INSERT OR IGNORE INTO Parts (PartID, TestID, PartNumber) VALUES ('${partId}', '${testId}', ${partNumber});`;
      }
    }
    
    await db.execAsync(insertSQL);
    console.log('All parts inserted successfully');
    return true;
  } catch (error) {
    console.error('Error inserting parts:', error);
    throw error;
  }
};

export const insertQuestions = async (db: SQLite.SQLiteDatabase) => {
  try {
    let insertSQL = '';
    
    // Part 1 Questions
    part1Questions.forEach(q => {
      insertSQL += `INSERT OR IGNORE INTO Questions (QuestionID, PartID, QuestionType, Content1, Content2, PreparationTime, ResponseTime) 
        VALUES ('${q.questionId}', '${q.partId}', 'text', '${q.content1}', '${q.content2}', 45, 45);`;
    });

    // Part 2 Questions 
    part2Questions.forEach(q => {
      insertSQL += `INSERT OR IGNORE INTO Questions (QuestionID, PartID, QuestionType, ImagePath1, ImagePath2, PreparationTime, ResponseTime) 
        VALUES ('${q.questionId}', '${q.partId}', 'image', '${q.imagePath1}', '${q.imagePath2}', 30, 45);`;
    });

    // Part 3 Questions
    part3Questions.forEach(q => {
      insertSQL += `INSERT OR IGNORE INTO Questions (QuestionID, PartID, QuestionType, Content1, Question1, Question2, Question3, PreparationTime, ResponseTime) 
        VALUES ('${q.questionId}', '${q.partId}', 'passage', '${q.content1}', '${q.question1}', '${q.question2}', '${q.question3}', 30, 15);`;
    });

    // Part 4 Questions
    part4Questions.forEach(q => {
      insertSQL += `INSERT OR IGNORE INTO Questions (QuestionID, PartID, QuestionType, ImagePath1, Question1, Question2, Question3, PreparationTime, ResponseTime) 
        VALUES ('${q.questionId}', '${q.partId}', 'imageWithQuestion', '${q.imagePath1}', '${q.question1}', '${q.question2}', '${q.question3}', 30, 15);`;
    });

    // Part 5 Questions
    part5Questions.forEach(q => {
      insertSQL += `INSERT OR IGNORE INTO Questions (QuestionID, PartID, QuestionType, Content1, PreparationTime, ResponseTime) 
        VALUES ('${q.questionId}', '${q.partId}', 'topic', '${q.content1}', 15, 60);`;
    });

    await db.execAsync(insertSQL);
    console.log('All Speaking questions inserted successfully');
    return true;
  } catch (error) {
    console.error('Error inserting questions:', error);
    throw error;
  }
};

export const insertWRQuestions = async (db: SQLite.SQLiteDatabase) => {
  try {
    let insertSQL = '';
    
    // Part 1 Questions
    part1WRQuestions.forEach(q => {
      insertSQL += `INSERT OR IGNORE INTO QuestionsWR (QuestionID, PartID, QuestionType, ImagePath1, ImagePath2, PreparationTime, ResponseTime) 
        VALUES ('${q.questionId}', '${q.partId}', 'image', '${q.imagePath1}', '${q.imagePath2}', 600, 600);`;
    });
    

    // Part 2 Questions 
    part2WRQuestions.forEach(q => {
      insertSQL += `INSERT OR IGNORE INTO QuestionsWR (QuestionID, PartID, QuestionType, Content1, Content2, Require1, Require2, PreparationTime, ResponseTime) 
        VALUES ('${q.questionId}', '${q.partId}', 'email', '${q.content1}', '${q.content2}', '${q.require1}', '${q.require2}', 1200, 1200);`;
    });

    // Part 3 Questions
    part3WRQuestions.forEach(q => {
      insertSQL += `INSERT OR IGNORE INTO QuestionsWR (QuestionID, PartID, QuestionType, Content1, PreparationTime, ResponseTime) 
        VALUES ('${q.questionId}', '${q.partId}', 'essay', '${q.content1}', 1800, 1800);`;
    });

    await db.execAsync(insertSQL);
    console.log('All Writing questions inserted successfully');
    return true;
  } catch (error) {
    console.error('Error inserting WR questions:', error);
    throw error;
  }
};


export const getQuestionById = async (db: SQLite.SQLiteDatabase, questionId: string) => {
  try {
    const result = await db.getFirstAsync('SELECT * FROM Questions WHERE QuestionID = ?', [questionId]);
    return result || null;
  } catch (error) {
    console.error('Error getting question:', error);
    throw error;
  }
};

export const getWRQuestionById = async (db: SQLite.SQLiteDatabase, questionId: string) => {
  try {
    const result = await db.getFirstAsync('SELECT * FROM QuestionsWR WHERE QuestionID = ?', [questionId]);
    return result || null;
  } catch (error) {
    console.error('Error getting WR question:', error);
    throw error;
  }
};

export const saveRecordingInfo = async (db: SQLite.SQLiteDatabase, recordingInfo: {
  testId: number;
  partNumber: number;
  questionNumber: number;
  fileName: string;
  filePath: string;
  createdAt: string;
}) => {
  try {
    await db.runAsync(
      `INSERT OR REPLACE INTO Recordings (testId, partNumber, questionNumber, fileName, filePath, createdAt) 
       VALUES (?, ?, ?, ?, ?, ?)`,
      [
        recordingInfo.testId,
        recordingInfo.partNumber,
        recordingInfo.questionNumber,
        recordingInfo.fileName,
        recordingInfo.filePath,
        recordingInfo.createdAt
      ]
    );
    console.log('Recording info saved successfully');
    return true;
  } catch (error) {
    console.error('Error saving recording info:', error);
    throw error;
  }
};

export const getRecording = async (db: SQLite.SQLiteDatabase, testId: string, partNumber: number, questionNumber: number) => {
  try {
    const result = await db.getAllAsync(
      'SELECT filePath FROM Recordings WHERE testId = ? AND partNumber = ? AND questionNumber = ?',
      [testId, partNumber, questionNumber]
    );
    return result;
  } catch (error) {
    console.error('Error getting recording:', error);
    throw error;
  }
};

export const deleteExistingRecording = async (db: SQLite.SQLiteDatabase, testId: string, partNumber: number) => {
  try {
    await db.runAsync('DELETE FROM Recordings WHERE testId = ? AND partNumber = ?', [testId, partNumber]);
    return true;
  } catch (error) {
    console.error('Error deleting recording:', error);
    throw error;
  }
};


export const insertTopics = async (db: SQLite.SQLiteDatabase, vocabData: {
  topic: string;
  description?: string;
  vocabulary: { id: string; term: string; definition: string; }[]
}) => {
  try {
      const topicId = vocabData.topic.toLowerCase().replace(/\s+/g, '-');
      
      // Kiểm tra topic tồn tại
      const existingTopic = await db.getAllAsync(
          'SELECT TopicID FROM Topics WHERE TopicID = ?',
          [topicId]
      );
      
      if (existingTopic.length > 0) {
          throw new Error('Chủ đề này đã tồn tại');
      }
      
      // Thêm topic mới
      await db.runAsync(
          'INSERT INTO Topics (TopicID, TopicName, Description) VALUES (?, ?, ?)',
          [topicId, vocabData.topic, vocabData.description || '']
      );
      
      // Tạo bảng mới cho từ vựng
      const createVocabTableQuery = `CREATE TABLE IF NOT EXISTS ${topicId} (
          VocabID TEXT PRIMARY KEY,
          Word TEXT NOT NULL,
          Meaning TEXT NOT NULL
      );`;
      await db.runAsync(createVocabTableQuery);
      
      // Thêm từ vựng
      for (const word of vocabData.vocabulary) {
          const vocabId = `${topicId}_${word.id}`;
          await db.runAsync(
              `INSERT INTO ${topicId} (VocabID, Word, Meaning) VALUES (?, ?, ?)`,
              [vocabId, word.term, word.definition]
          );
      }
      
      console.log('Topic and vocabulary added successfully');
      return true;
      
  } catch (error) {
      console.error('Error inserting topic and vocabulary:', error);
      throw error;
  }
};

export const saveAnswerWriting = async (db: SQLite.SQLiteDatabase, answerID: string, content: string) => {
  try {
    await db.runAsync(
      `INSERT OR REPLACE INTO AnswerWriting (AnswerID, Content) 
       VALUES (?, ?)`,
      [
        answerID,
        content
      ]
    );
    console.log(`Answer of writing with ID : ${answerID} saved successfully`);
    return true;
  } catch (error) {
    console.error(`Error saving Answer of writing with ID : ${answerID}, info:`, error);
    throw error;
  }
};

// ham lay feedback tu db
export const getFeedback = async (db: SQLite.SQLiteDatabase, quesID:string) => {
  try {
    const result = await db.getAllAsync(
      'SELECT feedback FROM AnswerWriting WHERE AnswerID = ?',
      [quesID]
    );
    return result;
  } catch (error) {
    console.error('Error getting feedback:', error);
    throw error;
  }
};

export const getAnswerWR = async (db: SQLite.SQLiteDatabase, quesID:string) => {
  try {
    const result = await db.getAllAsync(
      'SELECT Content FROM AnswerWriting WHERE AnswerID = ?',
      [quesID]
    );
    return result;
  } catch (error) {
    console.error('Error getting content:', error);
    throw error;
  }
};

// export const getStatusQuestion = async (db: SQLite.SQLiteDatabase, quesID:string) => {
//   try {
//     const result = await db.getAllAsync(
//       'SELECT Status FROM StatusQuestion WHERE QuestionID = ?',
//       [quesID]
//     );
//     return result;
//   } catch (error) {
//     console.error('Error getting status:', error);
//     throw error;
//   }
// };
