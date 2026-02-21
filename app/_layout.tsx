import { GlobalErrorProvider } from '@/components/providers/GlobalErrorProvider';
import '@/global.css';

import { NAV_THEME } from '@/lib/theme';
import { ThemeProvider } from '@react-navigation/native';
import { PortalHost } from '@rn-primitives/portal';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useColorScheme } from 'nativewind';
import { KeyboardProvider } from 'react-native-keyboard-controller';
import 'react-native-reanimated';
import { configureReanimatedLogger, ReanimatedLogLevel } from 'react-native-reanimated';
export { ErrorBoundary } from 'expo-router';

import { AuthGuard, AuthProvider } from '@/features/auth';

import { UpdateLockModal } from '@/components/update-lock-modal';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

configureReanimatedLogger({
  level: ReanimatedLogLevel.warn,
  strict: false,
});


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
                <UpdateLockModal />
              </AuthGuard>
            </ThemeProvider>
          </KeyboardProvider>
        </GlobalErrorProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}
