import React, { createContext, useContext, useEffect, useState } from 'react';
import { getDBConnection, createTables, insertTests, insertParts, insertQuestions } from './db-service';

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
        const db = await getDBConnection();
        await createTables(db);
        await insertTests(db);
        await insertParts(db);
        await insertQuestions(db);
        
        setDatabase(db);
      } catch (err) {
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