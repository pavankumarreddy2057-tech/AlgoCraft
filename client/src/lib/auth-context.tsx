import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types/index.js';
import { fetchCurrentUser, sendOtp, verifyOtp } from './api.js';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isAuthModalOpen: boolean;
  openAuthModal: () => void;
  closeAuthModal: () => void;
  sendVerificationCode: (email: string) => Promise<{ success: boolean; message: string; is_dev?: boolean; dev_otp?: string }>;
  loginWithOtp: (email: string, code: string) => Promise<User>;
  logout: () => void;
  reloadUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);

  const reloadUser = async () => {
    try {
      const data = await fetchCurrentUser();
      setUser(data.user);
    } catch (e) {
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    reloadUser();
  }, []);

  const openAuthModal = () => setIsAuthModalOpen(true);
  const closeAuthModal = () => setIsAuthModalOpen(false);

  const sendVerificationCode = async (email: string) => {
    return await sendOtp(email);
  };

  const loginWithOtp = async (email: string, code: string): Promise<User> => {
    const res = await verifyOtp(email, code);
    setUser(res.user);
    setIsAuthModalOpen(false);
    return res.user;
  };

  const logout = () => {
    localStorage.removeItem('algocraft_token');
    reloadUser();
  };

  const isAuthenticated = !!(user && user.id !== 1);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isLoading,
        isAuthModalOpen,
        openAuthModal,
        closeAuthModal,
        sendVerificationCode,
        loginWithOtp,
        logout,
        reloadUser
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
