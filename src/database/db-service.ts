import { enablePromise, openDatabase, SQLiteDatabase} from 'react-native-sqlite-storage';

enablePromise(true);

export const getDBConnection = async () => {
    try {
      return openDatabase({
        name: 'Toeic-data.db',
        location: 'default',
      });
    } catch (error) {
      console.error('Error opening database:', error);
      throw Error('Failed to open database');
    }
  };

export const createTables = async (db: SQLiteDatabase) => {
    // create table if not exists
    const createTestsTable = `
        CREATE TABLE IF NOT EXISTS Tests (
            TestID TEXT PRIMARY KEY,
            Title TEXT NOT NULL,       
        );
    `;

    const createPartsTable = `
        CREATE TABLE IF NOT EXISTS Parts (
            PartID TEXT PRIMARY KEY,
            TestID TEXT,
            PartNumber INTEGER NOT NULL,
            FOREIGN KEY (TestID) REFERENCES Tests(TestID)
        );
    `;

    const createQuestionsTable = `
        CREATE TABLE IF NOT EXISTS Questions (
            QuestionID TEXT PRIMARY KEY,
            PartID TEXT,
            QuestionNumber INTEGER NOT NULL,
            QuestionText TEXT,
            ImagePath TEXT,
            AudioPath TEXT,
            CorrectAnswer TEXT,
            FOREIGN KEY (PartID) REFERENCES Parts(PartID)
        );
    `;

    await db.executeSql(createTestsTable);
    await db.executeSql(createPartsTable);
    await db.executeSql(createQuestionsTable);
  
  };
  // tao danh sach cac bai test
    export const insertTests = async (db: SQLiteDatabase) => {
        try {
            const queries = [
                `INSERT OR IGNORE INTO Tests (TestID, Title) VALUES ('1', 'SpeakingTest1');`,
                `INSERT OR IGNORE INTO Tests (TestID, Title) VALUES ('2', 'SpeakingTest2');`,
                `INSERT OR IGNORE INTO Tests (TestID, Title) VALUES ('3', 'SpeakingTest3');`,
                `INSERT OR IGNORE INTO Tests (TestID, Title) VALUES ('4', 'SpeakingTest4');`,
                `INSERT OR IGNORE INTO Tests (TestID, Title) VALUES ('5', 'SpeakingTest5');`,
                `INSERT OR IGNORE INTO Tests (TestID, Title) VALUES ('6', 'SpeakingTest6');`,
                `INSERT OR IGNORE INTO Tests (TestID, Title) VALUES ('7', 'SpeakingTest7');`,
                `INSERT OR IGNORE INTO Tests (TestID, Title) VALUES ('8', 'SpeakingTest8');`,
                `INSERT OR IGNORE INTO Tests (TestID, Title) VALUES ('9', 'SpeakingTest9');`,
                `INSERT OR IGNORE INTO Tests (TestID, Title) VALUES ('10', 'SpeakingTest10);`
            ];

            for (const query of queries) {
                await db.executeSql(query);
            }

            console.log('Inserted tests successfully');
        } catch (error) {
            console.error('Error inserting tests:', error);
        }
    };

    // tao danh sach cac phan trong bai test
    export const insertParts = async (db: SQLiteDatabase) => {
        try {
            // Lặp qua 10 bài test
            for (let testId = 1; testId <= 10; testId++) {
                // Lặp qua 8 phần cho mỗi bài test
                for (let partNumber = 1; partNumber <= 8; partNumber++) {
                    const partId = `${testId}_${partNumber}`; // Tạo PartID duy nhất bằng cách kết hợp TestID và PartNumber
                    const query = `INSERT INTO Parts (PartID, TestID, PartNumber) VALUES (?, ?, ?)`;
                    await db.executeSql(query, [partId, testId.toString(), partNumber]);
                }
            }
            console.log('Inserted parts for all tests successfully');
        } catch (error) {
            console.error('Error inserting parts:', error);
        }
    };

