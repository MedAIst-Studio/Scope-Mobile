import { GlobalErrorProvider } from '@/components/providers/GlobalErrorProvider';
import '@/global.css';

import { NAV_THEME } from '@/lib/theme';
import { ThemeProvider } from '@react-navigation/native';
import { PortalHost } from '@rn-primitives/portal';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useColorScheme } from 'nativewind';
import 'react-native-reanimated';
import { KeyboardProvider } from 'react-native-keyboard-controller';

export { ErrorBoundary } from 'expo-router';

import { AuthGuard, AuthProvider } from '@/features/auth';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
});

export default function RootLayout() {
  const { colorScheme } = useColorScheme();

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <GlobalErrorProvider>
          <KeyboardProvider>
            <ThemeProvider value={NAV_THEME[colorScheme ?? 'light']}>
              <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
              <AuthGuard>
                <Stack screenOptions={{ headerShown: false, keyboardHandlingEnabled: false }} />
                <PortalHost />
                <PortalHost name="navigation-portal" />
              </AuthGuard>
            </ThemeProvider>
          </KeyboardProvider>
        </GlobalErrorProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}
