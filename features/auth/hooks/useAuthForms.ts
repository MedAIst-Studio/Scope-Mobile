import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { useAuth } from '../context/AuthContext';
import { loginSchema, signupSchema } from '../utils/validation';

type LoginFormData = z.infer<typeof loginSchema>;
type SignupFormData = z.infer<typeof signupSchema>;

// Login form hook'u
export function useLoginForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { login } = useAuth();

  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  // Clear error when user changes input
  form.watch(() => {
    if (error) setError(null);
  });

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    setError(null);
    try {
      await login(data);
    } catch (err: any) {
      console.error('Login error', err);
      // Extract specific error message if available, otherwise generic
      const errorMessage = err?.message || 'Giriş yapılamadı. Lütfen bilgilerinizi kontrol edin.';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return { form, isLoading, error, onSubmit, setIsLoading };
}

// Signup form hook'u
export function useSignupForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
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

  // Clear error when user changes input
  form.watch(() => {
    if (error) setError(null);
  });

  const onSubmit = async (data: SignupFormData) => {
    setIsLoading(true);
    setError(null);
    try {
      await signup(data);
    } catch (err: any) {
      console.error('Signup error', err);
      const errorMessage = err?.message || 'Kayıt olunamadı. Lütfen bilgilerinizi kontrol edin.';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return { form, isLoading, error, onSubmit, setIsLoading };
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
