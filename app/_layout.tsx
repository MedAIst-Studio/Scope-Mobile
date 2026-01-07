import { GlobalErrorProvider } from '@/components/providers/GlobalErrorProvider';
import '@/global.css';

import { NAV_THEME } from '@/lib/theme';
import { ThemeProvider } from '@react-navigation/native';
import { PortalHost } from '@rn-primitives/portal';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useColorScheme } from 'nativewind';
import 'react-native-reanimated';

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from 'expo-router';

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
          <ThemeProvider value={NAV_THEME[colorScheme ?? 'light']}>
            <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
            <AuthGuard>
              <Stack screenOptions={{ headerShown: false, keyboardHandlingEnabled: true }} />
              <PortalHost />
              <PortalHost name="navigation-portal" />
            </AuthGuard>
          </ThemeProvider>
        </GlobalErrorProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}
