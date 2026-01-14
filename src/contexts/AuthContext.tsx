import React, { createContext, useContext, useState, useCallback } from 'react';

interface User {
  id: string;
  name: string;
  role: 'seller' | 'admin';
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  login: (code: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

const VALID_CODES = {
  'PILOT2026': { id: '1', name: 'Demo User', role: 'seller' as const },
  'ADMIN2026': { id: '2', name: 'Admin User', role: 'admin' as const },
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('dialogue-user');
    return saved ? JSON.parse(saved) : null;
  });

  const login = useCallback(async (code: string): Promise<boolean> => {
    const upperCode = code.toUpperCase().trim();
    const userData = VALID_CODES[upperCode as keyof typeof VALID_CODES];
    
    if (userData) {
      setUser(userData);
      localStorage.setItem('dialogue-user', JSON.stringify(userData));
      return true;
    }
    return false;
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem('dialogue-user');
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isAdmin: user?.role === 'admin',
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
