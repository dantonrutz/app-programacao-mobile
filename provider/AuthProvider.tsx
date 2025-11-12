import { BACKEND_URL } from '@/app/components/constants';
import { UserInterface } from '@/types/User';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, ReactNode, useContext, useEffect, useState } from 'react';

// Define a forma do contexto de autenticação
interface AuthContextType {
  isAuthenticated: boolean;
  credentialsSignIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  getUser: () => Promise<UserInterface | null>;
  signUp: (name: string, email: string, password: string, passwordConfirmation: string) => Promise<UserInterface>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadAuthState = async () => {
      try {
        const token = await AsyncStorage.getItem('access_token');
        setIsAuthenticated(!!token);
      } catch (e) {
        console.error('Erro ao carregar estado de autenticação', e);
      } finally {
        setLoading(false);
      }
    };

    loadAuthState();
  }, []);

  const credentialsSignIn = async (email: string, password: string) => {
    try {
      const response = await fetch(`${BACKEND_URL}/auth/credentials-login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Erro ao fazer login');
      }

      await AsyncStorage.setItem('access_token', data.accessToken);
      await AsyncStorage.setItem('user', JSON.stringify(data.user));

      setIsAuthenticated(true);
      return data.user; // opcional
    } catch (e: any) {
      // propaga o erro para o front
      throw e;
    }
  };

  const signUp = async (name: string, email: string, password: string, passwordConfirmation: string) => {
    try {
      const response = await fetch(`${BACKEND_URL}/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, passwordConfirmation }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Erro ao fazer criação de conta');
      }

      await AsyncStorage.setItem('access_token', data.accessToken);
      await AsyncStorage.setItem('user', JSON.stringify(data.user));

      setIsAuthenticated(true);
      return data.user;
    } catch (e: any) {
      throw e;
    }
  };

  const signOut = async () => {
    try {
      await AsyncStorage.removeItem('access_token');
      await AsyncStorage.removeItem('user');
      setIsAuthenticated(false);
    } catch (e) {
      console.error('Erro ao sair', e);
    }
  };

  const getUser = async () => {
    const userData = await AsyncStorage.getItem('user');
    return userData ? JSON.parse(userData) : null;
  }

  if (loading) {
    return null;
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, credentialsSignIn, signOut, getUser, signUp }}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook para usar o contexto
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
};
