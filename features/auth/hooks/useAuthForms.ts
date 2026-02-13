import { zodResolver } from '@hookform/resolvers/zod';
import { GoogleSignin, statusCodes } from '@react-native-google-signin/google-signin';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { AccessToken, LoginManager, Settings } from 'react-native-fbsdk-next';
import { z } from 'zod';
import { useAuth } from '../context/AuthContext';
import { loginSchema, signupSchema } from '../utils/validation';

GoogleSignin.configure({
  webClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID,
  offlineAccess: true,
});

Settings.initializeSDK();

type LoginFormData = z.infer<typeof loginSchema>;
type SignupFormData = z.infer<typeof signupSchema>;

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
      const errorMessage = err?.message || 'Giriş yapılamadı. Lütfen bilgilerinizi kontrol edin.';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return { form, isLoading, error, onSubmit, setIsLoading };
}

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

export function useSocialAuth(setIsLoading: (loading: boolean) => void) {
  const { oauthLogin } = useAuth();

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();

      if (userInfo.data?.idToken) {
        await oauthLogin({
          provider: 'google',
          idToken: userInfo.data.idToken,
          accessToken: userInfo.data.serverAuthCode || '',
        });
      } else {
        throw new Error('Google Sign-In failed - no idToken');
      }
    } catch (error: any) {
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        console.log('User cancelled the login flow');
      } else if (error.code === statusCodes.IN_PROGRESS) {
        console.log('Sign in is in progress already');
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        console.log('Play services not available or outdated');
      } else {
        console.error('Google Sign-In error:', error);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleFacebookLogin = async () => {
    setIsLoading(true);
    try {
      const result = await LoginManager.logInWithPermissions(['public_profile', 'email']);

      if (result.isCancelled) {
        console.log('User cancelled the login flow');
      } else {
        const data = await AccessToken.getCurrentAccessToken();
        if (data) {
          await oauthLogin({
            provider: 'facebook',
            idToken: '',
            accessToken: data.accessToken.toString(),
          });
        } else {
          throw new Error('Facebook Sign-In failed - no access token');
        }
      }
    } catch (error) {
      console.error('Facebook Sign-In error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    handleGoogleLogin,
    handleFacebookLogin,
  };
}
