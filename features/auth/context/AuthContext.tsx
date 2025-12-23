import { AuthAPI } from '@/features/auth/api';
import { LoginFormData, SignupFormData } from '@/features/auth/utils/validation';
import { useRouter } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import React, { createContext, useContext, useEffect, useState } from 'react';

type User = {
  // Define user properties here based on your backend response
  id?: string;
  email?: string;
  username?: string;
};

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (data: LoginFormData) => Promise<void>;
  signup: (data: SignupFormData) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const accessToken = await SecureStore.getItemAsync('accessToken');
      const refreshToken = await SecureStore.getItemAsync('refreshToken');

      if (accessToken && refreshToken) {
        // Here you might want to validate the token or fetch user profile
        // For now, we assume if tokens exist, user is authenticated
        // await fetchUserProfile();
        setUser({ email: 'user@example.com' }); // Placeholder
      }
    } catch (error) {
      console.error('Auth status check failed:', error);
      await logout();
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (data: LoginFormData) => {
    setIsLoading(true);
    try {
      const response = await AuthAPI.login(data);

      if (!response.success || !response.data) {
        throw new Error(response.error?.message || 'Login failed');
      }

      await SecureStore.setItemAsync('accessToken', response.data.accessToken);
      await SecureStore.setItemAsync('refreshToken', response.data.refreshToken);

      setUser({ email: data.email }); // You should likely fetch the real user profile here or decode the token

      router.replace('/(app)/(drawer)/(tabs)/home'); // Navigate to main app
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (data: SignupFormData) => {
    setIsLoading(true);
    try {
      const response = await AuthAPI.signup(data);

      if (!response.success) {
        throw new Error(response.error?.message || 'Signup failed');
      }

      // Automatically login after signup if your API supports it, or redirect to login
      // For this example, let's say we redirect to login to be safe, or auto login
      // router.replace('/(auth)/login');
      await login({ email: data.email, password: data.password });
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      await AuthAPI.logout(); // Optional: Tell backend to invalidate token
    } catch (error) {
      console.warn('Logout API call failed', error);
    } finally {
      await SecureStore.deleteItemAsync('accessToken');
      await SecureStore.deleteItemAsync('refreshToken');
      setUser(null);
      router.replace('/(auth)/login');
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        signup,
        logout,
      }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
