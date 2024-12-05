import * as SQLite from 'expo-sqlite';

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
        // Tạo bảng Parts
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
            [],
            () => {
              console.log('Questions table created successfully');
              resolve(true);
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
              // Lặp qua 8 phần cho mỗi bài test
              for (let partNumber = 1; partNumber <= 8; partNumber++) {
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

    