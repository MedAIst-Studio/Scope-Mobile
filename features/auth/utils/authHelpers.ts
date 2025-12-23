import * as Linking from 'expo-linking';
import { router } from 'expo-router';
import * as SecureStore from 'expo-secure-store';

/**
 * Authentication utility functions
 * Centralized token management
 */

/**
 * Token configuration
 */
const TOKEN_KEYS = {
  accessToken: 'accessToken',
  refreshToken: 'refreshToken',
} as const;

/**
 * Check if user is authenticated (has both tokens)
 * Note: checks existence only, not validity
 */
export async function isAuthenticatedAsync(): Promise<boolean> {
  const accessToken = await SecureStore.getItemAsync(TOKEN_KEYS.accessToken);
  const refreshToken = await SecureStore.getItemAsync(TOKEN_KEYS.refreshToken);

  return !!(accessToken && refreshToken);
}

/**
 * Redirect to login page
 */
export function redirectToLogin(): void {
  router.replace('/(auth)/login');
}

/**
 * Handle logout - clear tokens and redirect
 */
export async function handleLogout(redirectUrl = '/(auth)/login'): Promise<void> {
  await SecureStore.deleteItemAsync(TOKEN_KEYS.accessToken);
  await SecureStore.deleteItemAsync(TOKEN_KEYS.refreshToken);

  router.replace(redirectUrl as any);
}

/**
 * Handle social login (Google, Facebook, etc.)
 */
export async function handleSocialLogin(provider: 'google' | 'facebook'): Promise<void> {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  if (!apiUrl) {
    console.error('NEXT_PUBLIC_API_URL is not defined');
    return;
  }

  switch (provider) {
    case 'google':
      await Linking.openURL(`${apiUrl}/auth/google`);
      break;
    case 'facebook':
      await Linking.openURL(`${apiUrl}/auth/facebook`);
      break;
    default:
      throw new Error('Desteklenmeyen sosyal giriş sağlayıcısı');
  }
}
