import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Alert } from 'react-native';
import { z } from 'zod';
import { useAuth } from '../context/AuthContext';
import { loginSchema, signupSchema } from '../utils/validation';

type LoginFormData = z.infer<typeof loginSchema>;
type SignupFormData = z.infer<typeof signupSchema>;

// Login form hook'u
export function useLoginForm() {
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();

  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    try {
      await login(data);
    } catch (error: any) {
      console.error('Login error', error);
      Alert.alert('Giriş Hatası', error.message || 'Bir hata oluştu');
    } finally {
      setIsLoading(false);
    }
  };

  return { form, isLoading, onSubmit, setIsLoading };
}

// Signup form hook'u
export function useSignupForm() {
  const [isLoading, setIsLoading] = useState(false);
  const { signup } = useAuth();

  const form = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
      agreeToTerms: false,
    },
  });

  const onSubmit = async (data: SignupFormData) => {
    setIsLoading(true);
    try {
      await signup(data);
    } catch (error: any) {
      console.error('Signup error', error);
      Alert.alert('Kayıt Hatası', error.message || 'Bir hata oluştu');
    } finally {
      setIsLoading(false);
    }
  };

  return { form, isLoading, onSubmit, setIsLoading };
}

// Social login hook'u
export function useSocialAuth(setIsLoading: (loading: boolean) => void) {
  const handleGoogleLogin = () => {
    setIsLoading(true);
    console.log('Google login');
    // Google API çağrısı
    setTimeout(() => {
      setIsLoading(false);
    }, 2000);
  };

  const handleFacebookLogin = () => {
    setIsLoading(true);
    console.log('Facebook login');
    // Facebook API çağrısı
    setTimeout(() => {
      setIsLoading(false);
    }, 2000);
  };

  const handleGoogleSignup = () => {
    setIsLoading(true);
    console.log('Google signup');
    // Google API çağrısı
    setTimeout(() => {
      setIsLoading(false);
    }, 2000);
  };

  const handleFacebookSignup = () => {
    setIsLoading(true);
    console.log('Facebook signup');
    // Facebook API çağrısı
    setTimeout(() => {
      setIsLoading(false);
    }, 2000);
  };

  return {
    handleGoogleLogin,
    handleFacebookLogin,
    handleGoogleSignup,
    handleFacebookSignup,
  };
}
