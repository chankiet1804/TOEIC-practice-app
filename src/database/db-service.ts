import * as SQLite from 'expo-sqlite';
import { Platform } from 'react-native';
import { VocabTopic } from '../data/Vocab';

export const getDBConnection = async () => {
    try {
      // Kiểm tra nếu đang chạy trên web
      if (Platform.OS === 'web') {
        throw new Error('SQLite is not supported on web platform');
      }
      
      const db = SQLite.openDatabase('Toeic-data.db');
      if (!db) {
        throw new Error('Could not open database');
      }
      return db;
    } catch (error) {
      console.error('Error opening database:', error);
      throw error;
    }
  };

export const createTables = async (db: SQLite.SQLiteDatabase) => {
    return new Promise((resolve, reject) => {
        db.transaction(
            tx => {
                // Tạo bảng Tests
                tx.executeSql(
                    `CREATE TABLE IF NOT EXISTS Tests (
                        TestID TEXT PRIMARY KEY,
                        Title TEXT NOT NULL
                    );`,
                    []
                );

                // Tạo bảng Parts
                tx.executeSql(
                    `CREATE TABLE IF NOT EXISTS Parts (
                        PartID TEXT PRIMARY KEY,
                        TestID TEXT,
                        PartNumber INTEGER NOT NULL,
                        FOREIGN KEY (TestID) REFERENCES Tests(TestID)
                    );`,
                    []
                );

                // Tạo bảng Questions
                tx.executeSql(
                    `CREATE TABLE IF NOT EXISTS Questions (
                        QuestionID TEXT PRIMARY KEY,
                        PartID TEXT,
                        QuestionNumber INTEGER NOT NULL,
                        QuestionText TEXT,
                        ImagePath TEXT,
                        AudioPath TEXT,
                        CorrectAnswer TEXT,
                        FOREIGN KEY (PartID) REFERENCES Parts(PartID)
                    );`,
                    []
                );

                // Tạo bảng Topics (Chủ đề)
                tx.executeSql(
                    `CREATE TABLE IF NOT EXISTS Topics (
                        TopicID TEXT PRIMARY KEY,
                        TopicName TEXT NOT NULL,
                        Description TEXT,
                        ImagePath TEXT
                    );`,
                    []
                );

                // Tạo bảng Vocabulary (Từ vựng)
                tx.executeSql(
                    `CREATE TABLE IF NOT EXISTS Vocabulary (
                        VocabID TEXT PRIMARY KEY,
                        TopicID TEXT,
                        Word TEXT NOT NULL,
                        Meaning TEXT NOT NULL,
                        Example TEXT,
                        Pronunciation TEXT,
                        WordType TEXT,
                        ImagePath TEXT,
                        FOREIGN KEY (TopicID) REFERENCES Topics(TopicID)
                    );`,
                    []
                );
            },
            (error) => {
                console.error('Error creating tables:', error);
                reject(error);
            },
            () => {
                console.log('All tables created successfully');
                resolve(true);
            }
        );
    });
};

// tao danh sach cac bai test
export const insertTests = async (db: SQLite.SQLiteDatabase) => {
    return new Promise((resolve, reject) => {
        db.transaction(tx => {
            // Insert 10 bài test
            for (let i = 1; i <= 10; i++) {
                tx.executeSql(
                    'INSERT OR IGNORE INTO Tests (TestID, Title) VALUES (?, ?)',
                    [i.toString(), `SpeakingTest${i}`],
                    (_, result) => {
                        if (i === 10) {
                            console.log('All tests inserted successfully');
                        }
                    }
                );
            }
        },
        (error) => {
            console.error('Error inserting tests:', error);
            reject(error);
        },
        () => {
            console.log('Tests transaction completed');
            resolve(true);
        });
    });
};

// tao danh sach cac phan trong bai test
export const insertParts = async (db: SQLite.SQLiteDatabase) => {
    return new Promise((resolve, reject) => {
        db.transaction(tx => {
            // Lặp qua 10 bài test
            for (let testId = 1; testId <= 10; testId++) {
                // Lặp qua 5 phần cho mỗi bài test
                for (let partNumber = 1; partNumber <= 5; partNumber++) {
                    const partId = `${testId}_${partNumber}`; // Tạo PartID duy nhất
                    tx.executeSql(
                        'INSERT OR IGNORE INTO Parts (PartID, TestID, PartNumber) VALUES (?, ?, ?)',
                        [partId, testId.toString(), partNumber],
                        (_, result) => {
                            if (testId === 10 && partNumber === 5) {
                                console.log('All parts inserted successfully');
                            }
                        }
                    );
                }
            }
        },
        (error) => {
            console.error('Error inserting parts:', error);
            reject(error);
        },
        () => {
            console.log('Parts transaction completed');
            resolve(true);
        });
    });
};

// Hàm để lấy tất cả tests
export const getAllTests = async (db: SQLite.SQLiteDatabase) => {
    return new Promise((resolve, reject) => {
        db.transaction(tx => {
            tx.executeSql(
                'SELECT * FROM Tests ORDER BY TestID',
                [],
                (_, { rows: { _array } }) => {
                    resolve(_array);
                },
                (_, error) => {
                    reject(error);
                    return false;
                }
            );
        });
    });
};

// Hàm để lấy tất cả parts của một test
export const getPartsForTest = async (db: SQLite.SQLiteDatabase, testId: string) => {
    return new Promise((resolve, reject) => {
        db.transaction(tx => {
            tx.executeSql(
                'SELECT * FROM Parts WHERE TestID = ? ORDER BY PartNumber',
                [testId],
                (_, { rows: { _array } }) => {
                    resolve(_array);
                },
                (_, error) => {
                    reject(error);
                    return false;
                }
            );
        });
    });
};

// Hàm thêm chủ đề mới
export const insertTopics = async (db: SQLite.SQLiteDatabase, vocabData: { 
    topic: string; 
    description?: string;
    vocabulary: { id: string; term: string; definition: string; }[] 
}) => {
    return new Promise((resolve, reject) => {
        const topicId = vocabData.topic.toLowerCase().replace(/\s+/g, '-');
        
        db.transaction(tx => {
            // Kiểm tra xem topic đã tồn tại chưa
            tx.executeSql(
                'SELECT TopicID FROM Topics WHERE TopicID = ?',
                [topicId],
                (_, { rows }) => {
                    if (rows.length > 0) {
                        reject(new Error('Chủ đề này đã tồn tại'));
                        return;
                    }

                    // Thêm topic mới
                    tx.executeSql(
                        'INSERT INTO Topics (TopicID, TopicName, Description) VALUES (?, ?, ?)',
                        [topicId, vocabData.topic, vocabData.description || ''],
                        (_, topicResult) => {
                            if (topicResult.rowsAffected === 0) {
                                reject(new Error('Không thể thêm chủ đề'));
                                return;
                            }

                            // Tạo bảng mới cho từ vựng của chủ đề này
                            const createVocabTableQuery = `CREATE TABLE IF NOT EXISTS ${topicId} (
                                VocabID TEXT PRIMARY KEY,
                                Word TEXT NOT NULL,
                                Meaning TEXT NOT NULL
                            );`;
                            tx.executeSql(createVocabTableQuery);

                            // Thêm từ vựng
                            const vocabPromises = vocabData.vocabulary.map(word => {
                                return new Promise((resolveVocab, rejectVocab) => {
                                    const vocabId = `${topicId}_${word.id}`;
                                    tx.executeSql(
                                        `INSERT INTO ${topicId} (VocabID, Word, Meaning) VALUES (?, ?, ?)`,
                                        [vocabId, word.term, word.definition],
                                        (_, vocabResult) => {
                                            if (vocabResult.rowsAffected === 0) {
                                                rejectVocab(new Error(`Không thể thêm từ vựng: ${word.term}`));
                                            } else {
                                                resolveVocab(true);
                                            }
                                        }
                                    );
                                });
                            });

                            Promise.all(vocabPromises)
                                .then(() => resolve(true))
                                .catch(error => reject(error));
                        }
                    );
                }
            );
        });
    });
};

// Hàm lấy tất cả chủ đề
export const getAllTopics = async (db: SQLite.SQLiteDatabase): Promise<VocabTopic[]> => {
    return new Promise((resolve, reject) => {
        db.transaction(tx => {
            tx.executeSql(
                'SELECT * FROM Topics ORDER BY TopicID',
                [],
                (_, { rows: { _array } }) => {
                    resolve(_array);
                },
                (_, error) => {
                    reject(error);
                    return false;
                }
            );
        });
    });
};

export const getVocabByTopic = async (db: SQLite.WebSQLDatabase, topicId: string) => {
  return new Promise<VocabTopic>((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        'SELECT v.*, t.TopicName FROM Vocabulary v JOIN Topics t ON v.TopicID = t.TopicID WHERE v.TopicID = ?',
        [topicId],
        (_, { rows: { _array } }) => {
          if (_array.length > 0) {
            const topic: VocabTopic = {
              TopicID: topicId,
              TopicName: _array[0].TopicName,
              words: _array.map(row => ({
                id: row.VocabID,
                word: row.Word,
                partOfSpeech: 'noun',
                vietnamese: row.Meaning
              }))
            };
            resolve(topic);
          } else {
            resolve({ TopicID: topicId, TopicName: '', words: [] });
          }
        },
        (_, error) => {
          reject(error);
          return false;
        }
      );
    });
  });
};

    