import React, { createContext, useContext, useState, useCallback } from 'react';

interface UserData {
  displayName: string;
  password: string;
  contentKey: string;
  role: 'seller' | 'admin';
}

interface User {
  id: string;
  name: string;
  role: 'seller' | 'admin';
  contentKey: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  availableUsers: { key: string; displayName: string }[];
  login: (userKey: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  switchUser: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

// Hardcoded user mapping for MVP
const USERS: Record<string, UserData> = {
  daniel: { displayName: 'Daniel', password: 'daniel123', contentKey: 'daniel', role: 'seller' },
  sarah: { displayName: 'Sarah', password: 'sarah123', contentKey: 'sarah', role: 'seller' },
  liam: { displayName: 'Liam', password: 'liam123', contentKey: 'liam', role: 'seller' },
  amelia: { displayName: 'Amelia', password: 'amelia123', contentKey: 'amelia', role: 'admin' },
  marcus: { displayName: 'Marcus', password: 'marcus123', contentKey: 'marcus', role: 'seller' },
  elena: { displayName: 'Elena', password: 'elena123', contentKey: 'elena', role: 'seller' },
};

const AVAILABLE_USERS = Object.entries(USERS).map(([key, data]) => ({
  key,
  displayName: data.displayName,
}));

function getUserFromStorage(): User | null {
  const isAuthenticated = localStorage.getItem('isAuthenticated');
  const selectedUserKey = localStorage.getItem('selectedUserKey');
  
  if (isAuthenticated !== 'true' || !selectedUserKey) {
    return null;
  }
  
  const userData = USERS[selectedUserKey];
  if (!userData) {
    // Invalid user key in storage, clear it
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('selectedUserKey');
    return null;
  }
  
  return {
    id: selectedUserKey,
    name: userData.displayName,
    role: userData.role,
    contentKey: userData.contentKey,
  };
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(() => getUserFromStorage());

  const login = useCallback(async (userKey: string, password: string): Promise<{ success: boolean; error?: string }> => {
    const userData = USERS[userKey];
    
    if (!userData) {
      return { success: false, error: 'User not found.' };
    }
    
    if (userData.password !== password) {
      return { success: false, error: 'Incorrect password.' };
    }
    
    const newUser: User = {
      id: userKey,
      name: userData.displayName,
      role: userData.role,
      contentKey: userData.contentKey,
    };
    
    setUser(newUser);
    localStorage.setItem('isAuthenticated', 'true');
    localStorage.setItem('selectedUserKey', userKey);
    
    return { success: true };
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('selectedUserKey');
  }, []);

  const switchUser = useCallback(() => {
    logout();
  }, [logout]);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isAdmin: user?.role === 'admin',
        availableUsers: AVAILABLE_USERS,
        login,
        logout,
        switchUser,
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
