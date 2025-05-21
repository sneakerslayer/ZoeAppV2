import { createContext, useContext, useState, useEffect } from 'react';
import * as SecureStore from 'expo-secure-store';
import { router } from 'expo-router';

interface AuthState {
  isAuthenticated: boolean;
  userId: string | null;
  email: string | null;
  name: string | null;
  loading: boolean;
}

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AuthState>({
    isAuthenticated: false,
    userId: null,
    email: null,
    name: null,
    loading: true,
  });

  useEffect(() => {
    loadAuthState();
  }, []);

  const loadAuthState = async () => {
    try {
      const userId = await SecureStore.getItemAsync('userId');
      const email = await SecureStore.getItemAsync('email');

      setState(prev => ({
        ...prev,
        isAuthenticated: !!userId,
        userId,
        email,
        loading: false,
      }));
    } catch (error) {
      console.error('Error loading auth state:', error);
      setState(prev => ({ ...prev, loading: false }));
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const response = await APIClient.request('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });

      await SecureStore.setItemAsync('authToken', response.token);
      await SecureStore.setItemAsync('userId', response.userId);
      await SecureStore.setItemAsync('email', email);

      setState({
        isAuthenticated: true,
        userId: mockUserId,
        email,
        loading: false,
      });

      router.replace('/(tabs)');
    } catch (error) {
      console.error('Login error:', error);
      throw new Error('Login failed');
    }
  };

  const signup = async (name: string, email: string, password: string) => {
    try {
      // TODO: Implement actual API call to create user account
      const mockUserId = 'new-user-' + Date.now();

      await SecureStore.setItemAsync('userId', mockUserId);
      await SecureStore.setItemAsync('email', email);
      await SecureStore.setItemAsync('name', name);

      setState({
        isAuthenticated: true,
        userId: mockUserId,
        email,
        loading: false,
      });

      router.replace('/(tabs)');
    } catch (error) {
      console.error('Signup error:', error);
      throw new Error('Signup failed');
    }
  };

  const logout = async () => {
    try {
      await SecureStore.deleteItemAsync('userId');
      await SecureStore.deleteItemAsync('email');

      setState({
        isAuthenticated: false,
        userId: null,
        email: null,
        loading: false,
      });

      router.replace('/login');
    } catch (error) {
      console.error('Logout error:', error);
      throw new Error('Logout failed');
    }
  };

  return (
    <AuthContext.Provider value={{ ...state, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}