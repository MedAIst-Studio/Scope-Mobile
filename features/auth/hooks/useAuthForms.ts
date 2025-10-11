import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { loginSchema, signupSchema } from '../utils/validation';

type LoginFormData = z.infer<typeof loginSchema>;
type SignupFormData = z.infer<typeof signupSchema>;

// Login form hook'u
export function useLoginForm() {
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = (data: LoginFormData) => {
    setIsLoading(true);
    console.log('Email login data:', data);
    // API çağrısı burada yapılacak
    setTimeout(() => {
      setIsLoading(false);
    }, 2000);
  };

  return { form, isLoading, onSubmit, setIsLoading };
}

// Signup form hook'u
export function useSignupForm() {
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirmPassword: '',
      agreeToTerms: false,
    },
  });

  const onSubmit = (data: SignupFormData) => {
    setIsLoading(true);
    console.log('Email signup data:', data);
    // API çağrısı burada yapılacak
    setTimeout(() => {
      setIsLoading(false);
    }, 2000);
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
