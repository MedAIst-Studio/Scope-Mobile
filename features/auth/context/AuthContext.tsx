import { AuthAPI } from '@/features/auth/api';
import {
  LoginFormData,
  OAuthLoginFormData,
  SignupFormData,
} from '@/features/auth/utils/validation';
import { useRouter } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import React, { createContext, useContext, useEffect, useState } from 'react';

import { User } from '@/features/users/types';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (data: LoginFormData) => Promise<void>;
  signup: (data: SignupFormData) => Promise<void>;
  oauthLogin: (data: OAuthLoginFormData) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

import { useUserDetails } from '@/features/users/hooks';
import { useQueryClient } from '@tanstack/react-query';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const queryClient = useQueryClient();
  const { data: user, isLoading: isUserLoading } = useUserDetails();
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const router = useRouter();

  const isLoading = isUserLoading || isAuthLoading;

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const accessToken = await SecureStore.getItemAsync('accessToken');
      const refreshToken = await SecureStore.getItemAsync('refreshToken');
    } catch (error) {
      console.error('Auth status check failed:', error);
      await logout();
    } finally {
      setIsAuthLoading(false);
    }
  };

  const login = async (data: LoginFormData) => {
    setIsAuthLoading(true);
    try {
      const response = await AuthAPI.login(data);

      if (!response.success || !response.data) {
        throw new Error(response.error?.message || 'Login failed');
      }

      await SecureStore.setItemAsync('accessToken', response.data.accessToken);
      await SecureStore.setItemAsync('refreshToken', response.data.refreshToken);

      await queryClient.invalidateQueries({ queryKey: ['user', 'profile'] });

      router.replace('/(tabs)' as any);
    } catch (error) {
      throw error;
    } finally {
      setIsAuthLoading(false);
    }
  };

  const signup = async (data: SignupFormData) => {
    setIsAuthLoading(true);
    try {
      const response = await AuthAPI.signup(data);

      if (!response.success) {
        throw new Error(response.error?.message || 'Signup failed');
      }
      await login({ email: data.email, password: data.password });
    } catch (error) {
      throw error;
    } finally {
      setIsAuthLoading(false);
    }
  };

  const oauthLogin = async (data: OAuthLoginFormData) => {
    setIsAuthLoading(true);
    try {
      const response = await AuthAPI.oauthLogin(data);

      if (!response.success || !response.data) {
        throw new Error(response.error?.message || 'OAuth login failed');
      }

      await SecureStore.setItemAsync('accessToken', response.data.access_token);
      await SecureStore.setItemAsync('refreshToken', response.data.refresh_token);

      await queryClient.invalidateQueries({ queryKey: ['user', 'profile'] });

      router.replace('/(tabs)' as any);
    } catch (error) {
      throw error;
    } finally {
      setIsAuthLoading(false);
    }
  };

  const logout = async () => {
    setIsAuthLoading(true);
    try {
      await AuthAPI.logout();
    } catch (error) {
      console.warn('Logout API call failed', error);
    } finally {
      await SecureStore.deleteItemAsync('accessToken');
      await SecureStore.deleteItemAsync('refreshToken');
      queryClient.setQueryData(['user', 'profile'], null);
      router.replace('/(auth)/login');
      setIsAuthLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user: user ?? null,
        isLoading,
        isAuthenticated: !!user,
        login,
        signup,
        oauthLogin,
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
