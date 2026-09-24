import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole, AuthState } from '../types/user';
import { DEMO_USERS } from '../data/mockSeedData';

interface AuthContextType extends AuthState {
  login: (email: string, role?: UserRole) => boolean;
  switchRole: (role: UserRole) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Default logged in as ADMIN for immediate demonstration experience
  const [user, setUser] = useState<User | null>(DEMO_USERS[0]);
  const [token, setToken] = useState<string | null>('agrichain_demo_jwt_token_2026');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const login = (email: string, role?: UserRole): boolean => {
    setIsLoading(true);
    let matchedUser = DEMO_USERS.find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (!matchedUser && role) {
      matchedUser = DEMO_USERS.find((u) => u.role === role);
    }
    if (!matchedUser) {
      // Fallback user
      matchedUser = {
        id: `usr-${Date.now()}`,
        name: email.split('@')[0],
        email,
        role: role || 'FARMER',
        organization: 'Independent Agri Enterprise',
      };
    }

    setUser(matchedUser);
    setToken(`jwt-${Date.now()}`);
    setIsLoading(false);
    return true;
  };

  const switchRole = (newRole: UserRole) => {
    const demoUser = DEMO_USERS.find((u) => u.role === newRole);
    if (demoUser) {
      setUser(demoUser);
    } else if (user) {
      setUser({ ...user, role: newRole });
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!user,
        isLoading,
        login,
        switchRole,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
