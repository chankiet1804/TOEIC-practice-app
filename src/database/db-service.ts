import * as SQLite from 'expo-sqlite';
import { 
  part1Questions, 
  part2Questions, 
  part3Questions, 
  part4Questions, 
  part5Questions 
} from './questionData';

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
      DROP TABLE IF EXISTS Questions;
      DROP TABLE IF EXISTS Parts;
      DROP TABLE IF EXISTS Tests;
      DROP TABLE IF EXISTS Recordings;
      
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
      
      CREATE TABLE IF NOT EXISTS Recordings (
        testId INTEGER NOT NULL,
        partNumber INTEGER NOT NULL,
        questionNumber INTEGER NOT NULL,
        fileName TEXT NOT NULL PRIMARY KEY,
        filePath TEXT NOT NULL,
        createdAt TEXT NOT NULL
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
    console.log('All questions inserted successfully');
    return true;
  } catch (error) {
    console.error('Error inserting questions:', error);
    throw error;
  }
};

export const getAllTests = async (db: SQLite.SQLiteDatabase) => {
  try {
    const result = await db.getAllAsync('SELECT * FROM Tests ORDER BY TestID');
    return result;
  } catch (error) {
    console.error('Error getting all tests:', error);
    throw error;
  }
};

export const getPartsForTest = async (db: SQLite.SQLiteDatabase, testId: string) => {
  try {
    const result = await db.getAllAsync('SELECT * FROM Parts WHERE TestID = ? ORDER BY PartNumber', [testId]);
    return result;
  } catch (error) {
    console.error('Error getting parts for test:', error);
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

