import React, { createContext, useContext, useState } from 'react';

interface AuthState {
    userId: string;
    email: string;
    name: string;
}

interface AuthContextType {
    auth: AuthState | null;  
    setAuth: React.Dispatch<React.SetStateAction<AuthState | null>>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);


export function AuthWrapper({ children }: { children: React.ReactNode }) { 
    const [auth, setAuth] = useState<AuthState | null>(null);

    return (
        <AuthContext.Provider value={{ auth, setAuth }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthWrapper");
    }
    return context;
}
