import { UserInterface } from '@/types/User';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, ReactNode, useContext, useEffect, useState } from 'react';

// Define a forma do contexto de autenticação
interface AuthContextType {
  isAuthenticated: boolean;
  signIn: () => Promise<void>;
  signOut: () => Promise<void>;
  getUser: () => Promise<UserInterface | null>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const ACCESS_TOKEN = 'access_token';
const FAKE_USER: UserInterface = { name: 'Usuário Exemplo', email: 'usuario@example.com', image: 'https://i.pravatar.cc/150?img=3' };

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadAuthState = async () => {
      try {
        const token = await AsyncStorage.getItem(ACCESS_TOKEN);
        setIsAuthenticated(!!token);
      } catch (e) {
        console.error('Erro ao carregar estado de autenticação', e);
      } finally {
        setLoading(false);
      }
    };

    loadAuthState();
  }, []);

  const signIn = async () => {
    try {
      // Aqui você salvaria o JWT real do backend
      await AsyncStorage.setItem(ACCESS_TOKEN, 'fake-token');
      await AsyncStorage.setItem('user', JSON.stringify(FAKE_USER));
      setIsAuthenticated(true);
    } catch (e) {
      console.error('Erro ao fazer login', e);
    }
  };

  const signOut = async () => {
    try {
      await AsyncStorage.removeItem(ACCESS_TOKEN);
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
    return null; // ou um spinner, enquanto carrega
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, signIn, signOut, getUser }}>
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
