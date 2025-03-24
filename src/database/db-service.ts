import * as SQLite from 'expo-sqlite';

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

     
    `);
    
    console.log('All tables created successfully');
    return true;
  } catch (error) {
    console.error('Error creating tables:', error);
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

