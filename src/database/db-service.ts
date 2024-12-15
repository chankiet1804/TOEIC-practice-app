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
      return SQLite.openDatabase('Toeic-data.db');
    } catch (error) {
      console.error('Error opening database:', error);
      throw Error('Failed to open database');
    }
  };

  export const createTables = async (db: SQLite.SQLiteDatabase) => {
    return new Promise((resolve, reject) => {
      db.transaction(tx => {

        //Xóa các bảng cũ nếu tồn tại
        tx.executeSql('DROP TABLE IF EXISTS Questions;');
        tx.executeSql('DROP TABLE IF EXISTS Parts;');
        tx.executeSql('DROP TABLE IF EXISTS Tests;');
        tx.executeSql('DROP TABLE IF EXISTS Recordings;');

        // Tạo bảng Tests
        tx.executeSql(
          `CREATE TABLE IF NOT EXISTS Tests (
            TestID TEXT PRIMARY KEY,
            Title TEXT NOT NULL
          );`,
          [],
          () => {
            console.log('Tests table created successfully');
          }
        );
  
        // Tạo bảng Parts
        tx.executeSql(
          `CREATE TABLE IF NOT EXISTS Parts (
            PartID TEXT PRIMARY KEY,
            TestID TEXT,
            PartNumber INTEGER NOT NULL,
            FOREIGN KEY (TestID) REFERENCES Tests(TestID)
          );`,
          [],
          () => {
            console.log('Parts table created successfully');
            resolve(true);
          }
        );
        // Tạo bảng Questions
        tx.executeSql(
            `CREATE TABLE IF NOT EXISTS Questions (
              QuestionID TEXT PRIMARY KEY,
              PartID TEXT,
              
              QuestionType TEXT, -- 'text', 'image', 'passage', 'topic'
              Content1 TEXT, -- Nội dung chính (đoạn văn, topic, etc.)
              Content2 TEXT, -- Nội dung phụ (cho Part 2)
              ImagePath1 TEXT, -- Đường dẫn hình ảnh 1 (cho Part 2)
              ImagePath2 TEXT, -- Đường dẫn hình ảnh 2 (cho Part 2)
              Question1 TEXT, -- Câu hỏi 1 (cho Part 3, 4)
              Question2 TEXT, -- Câu hỏi 2 (cho Part 3, 4)
              Question3 TEXT, -- Câu hỏi 3 (cho Part 3, 4)
              PreparationTime INTEGER, -- Thời gian chuẩn bị (giây)
              ResponseTime INTEGER, -- Thời gian trả lời (giây)
              FOREIGN KEY (PartID) REFERENCES Parts(PartID)
            );`,
            [],
            () => {
              console.log('Questions table created successfully');
              resolve(true);
            }
          );
        // Tạo bảng Recordings
        tx.executeSql(
          `CREATE TABLE IF NOT EXISTS Recordings (
            testId INTEGER NOT NULL,
            partNumber INTEGER NOT NULL,
            questionNumber INTEGER NOT NULL,
            fileName TEXT NOT NULL PRIMARY KEY,
            filePath TEXT NOT NULL,
            createdAt TEXT NOT NULL
          );`,
          [],
          () => {
            console.log('Recordings table created successfully');
          }
        );
      });
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
                  if (testId === 10 && partNumber === 8) {
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
  
  //tao danh sach cac cau hoi cho moi part
  export const insertQuestions = async (db: SQLite.SQLiteDatabase) => {
    return new Promise((resolve, reject) => {
      db.transaction(tx => {


        // Part 1: Read a text aloud (2 đoạn text)
        part1Questions.forEach(question => {
          tx.executeSql(
            `INSERT OR IGNORE INTO Questions (
              QuestionID, PartID, QuestionType,
              Content1, Content2, PreparationTime, ResponseTime
            ) VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [
              question.questionId,
              question.partId,
              'text',
              question.content1,
              question.content2,
              45,
              45
            ]
          );
        });

        // Part 2: Describe a picture (2 hình ảnh)
        part2Questions.forEach(question => {
        tx.executeSql(
          `INSERT OR IGNORE INTO Questions (
            QuestionID, PartID, QuestionType,
            ImagePath1,ImagePath2,  PreparationTime, ResponseTime
          ) VALUES (?, ?, ?, ?, ?, ?, ?)`,
          [
            question.questionId,
            question.partId,
            'image',
            question.imagePath1,
            question.imagePath2,
            30,
            45
          ]
        );
        });


        // Part 3: Respond to questions (1 đoạn văn + 3 câu hỏi)
        part3Questions.forEach(question => {
        tx.executeSql(
          `INSERT OR IGNORE INTO Questions (
            QuestionID, PartID, QuestionType,
            Content1, Question1, Question2, Question3,
            PreparationTime, ResponseTime
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            question.questionId,
            question.partId,
            'passage',
            question.content1,
            question.question1,
            question.question2,
            question.question3,
            30,
            15 // 15 giây cho mỗi câu hỏi
          ]
        );
        });

        // Part 4: Respond to questions with information (1 đoạn thông tin + 3 câu hỏi)
        part4Questions.forEach(question => {
        tx.executeSql(
          `INSERT OR IGNORE INTO Questions (
            QuestionID, PartID, QuestionType,
            ImagePath1, Question1, Question2, Question3,
            PreparationTime, ResponseTime
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            question.questionId,
            question.partId,
            'imageWithQuestion',
            question.imagePath1,
            question.question1,
            question.question2,
            question.question3,
            30,
            15
          ]
        );
        });

        // Part 5: Express an opinion (1 topic)
        part5Questions.forEach(question => {
        tx.executeSql(
          `INSERT OR IGNORE INTO Questions (
            QuestionID, PartID, QuestionType,
            Content1, PreparationTime, ResponseTime
          ) VALUES (?, ?, ?, ?, ?, ?)`,
          [
            question.questionId,
            question.partId,
            'topic',
            question.content1,
            15,
            60
          ]
        );  
        });
      }, 
      (error) => {
        console.error('Error inserting questions:', error);
        reject(error);
      },
      () => {
        console.log('Questions inserted successfully');
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

  //Ham de lay question cua mot part tuong ung voi questionID : TestID_PartNumber_questionNumber
  export const getQuestionById = async (db: SQLite.SQLiteDatabase, questionId: string) => {
    return new Promise((resolve, reject) => {
      db.transaction(tx => {
        tx.executeSql(
          `SELECT * FROM Questions WHERE QuestionID = ?`,
          [questionId],
          (_, { rows: { _array } }) => {
            if (_array.length > 0) {
              //console.log('Question found:', _array[0]);
              resolve(_array[0]);
            } else {
              console.log('No question found with ID:', questionId);
              resolve(null);
            }
          },
          (_, error) => {
            console.error('Error getting question:', error);
            reject(error);
            return false;
          }
        );
      });
    });
  };

  // Hàm để lưu thông tin ghi âm
  export const saveRecordingInfo = async (db: SQLite.SQLiteDatabase, recordingInfo: {
    testId: number;
    partNumber: number;
    questionNumber: number;
    fileName: string;
    filePath: string;
    createdAt: string;
  }) => {
    return new Promise((resolve, reject) => {
      db.transaction(tx => {
        tx.executeSql(
          `INSERT OR REPLACE INTO Recordings (testId, partNumber, questionNumber, fileName, filePath, createdAt) 
           VALUES (?, ?, ?, ?, ?, ?)`,
          [
            recordingInfo.testId,
            recordingInfo.partNumber,
            recordingInfo.questionNumber,
            recordingInfo.fileName,
            recordingInfo.filePath,
            recordingInfo.createdAt
          ],
          (_, result) => {
            console.log('Recording info saved successfully with file name: ', recordingInfo.fileName);
            resolve(result);
          },
          (_, error) => {
            console.error('Error saving recording info:', error);
            reject(error);
            return false;
          }
        );
      });
    });
  };

  // Ham lấy danh sách recordings theo test và part 
  export const getRecording = async (db: SQLite.SQLiteDatabase, testId: string, partNumber: number, questionNumber: number) => {
    return new Promise((resolve, reject) => {
      db.transaction(tx => {
        tx.executeSql(
          'SELECT filePath FROM Recordings WHERE testId = ? AND partNumber = ? AND questionNumber = ?',
          [testId, partNumber, questionNumber],
          (_, { rows: { _array } }) => {
            console.log('Query result:', _array);
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

  // Thêm hàm để xóa recording cũ trước khi lưu recording mới
  export const deleteExistingRecording = async (db: SQLite.SQLiteDatabase, testId: string, partNumber: number) => {
    return new Promise((resolve, reject) => {
      db.transaction(tx => {
        tx.executeSql(
          'DELETE FROM Recordings WHERE testId = ? AND partNumber = ?',
          [testId, partNumber],
          (_, result) => {
            resolve(result);
          },
          (_, error) => {
            reject(error);
            return false;
          }
        );
      });
    });
  };

