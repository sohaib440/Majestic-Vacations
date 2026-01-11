// src/contexts/AuthContext.tsx
import React, { createContext, useContext, ReactNode } from 'react';
import { useGetMe, useLogout } from '@/features/authApi';
import { User } from '@/types';

interface AuthContextType {
   user: User | null;
   isLoading: boolean;
   isAuthenticated: boolean;
   logout: () => void;
   refetchUser: () => Promise<any>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
   children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
   const { data: user, isLoading, refetch } = useGetMe();
   const logout = useLogout();

   const isAuthenticated = !!user;

   const contextValue: AuthContextType = {
      user: user || null,
      isLoading,
      isAuthenticated,
      logout,
      refetchUser: refetch,
   };

   return (
      <AuthContext.Provider value={contextValue}>
         {children}
      </AuthContext.Provider>
   );
};

export const useAuth = () => {
   const context = useContext(AuthContext);
   if (context === undefined) {
      throw new Error('useAuth must be used within an AuthProvider');
   }
   return context;
};