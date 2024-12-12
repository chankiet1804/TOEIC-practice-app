import React, { createContext, useContext, useEffect, useState } from 'react';
import { Platform } from 'react-native';
import { getDBConnection, createTables, insertTests, insertParts } from './db-service';

interface DatabaseContextType {
  database: any;
  isLoading: boolean;
  error: Error | null;
}

const DatabaseContext = createContext<DatabaseContextType | undefined>(undefined);

export function DatabaseProvider({ children }: { children: React.ReactNode }) {
  const [database, setDatabase] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const initDatabase = async () => {
      try {
        setIsLoading(true);
        
        // Nếu là web platform, tạo mock database
        if (Platform.OS === 'web') {
          // Mock database object với các phương thức cần thiết
          const mockDb = {
            transaction: () => {},
            // Thêm các phương thức mock khác nếu cần
          };
          setDatabase(mockDb);
          return;
        }

        const db = await getDBConnection();
        try {
          await createTables(db);
          await insertTests(db);
          await insertParts(db);
        } catch (err) {
          console.error('Error initializing database tables:', err);
          throw err;
        }
        
        setDatabase(db);
      } catch (err) {
        console.error('Database initialization failed:', err);
        setError(err as Error);
      } finally {
        setIsLoading(false);
      }
    };

    initDatabase();
  }, []);

  return (
    <DatabaseContext.Provider value={{ database, isLoading, error }}>
      {children}
    </DatabaseContext.Provider>
  );
}

// Custom hook để sử dụng database
export function useDatabase() {
  const context = useContext(DatabaseContext);
  if (context === undefined) {
    throw new Error('useDatabase must be used within a DatabaseProvider');
  }
  return context;
}