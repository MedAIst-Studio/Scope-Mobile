import { GlobalErrorProvider } from '@/components/providers/GlobalErrorProvider';
import '@/global.css';

import { NAV_THEME } from '@/lib/theme';
import { ThemeProvider } from '@react-navigation/native';
import { PortalHost } from '@rn-primitives/portal';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useColorScheme } from 'nativewind';
import React from 'react';
import { KeyboardProvider } from 'react-native-keyboard-controller';
import 'react-native-reanimated';
export { ErrorBoundary } from 'expo-router';

import { AuthGuard, AuthProvider } from '@/features/auth';
import { RevenueCatProvider } from '@/features/subscription';
import { UsageProvider } from '@/features/usage';

import { UpdateLockModal } from '@/components/update-lock-modal';
import * as Sentry from '@sentry/react-native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
});

const routingInstrumentation = Sentry.reactNavigationIntegration({
  enableTimeToInitialDisplay: true,
});

Sentry.init({
  dsn: 'https://e7c2e4e3685a2fe1ed37817059eb445b@o4510993796825088.ingest.de.sentry.io/4510993798201424',

  // Adds more context data to events (IP address, cookies, user, etc.)
  // For more information, visit: https://docs.sentry.io/platforms/react-native/data-management/data-collected/
  sendDefaultPii: true,

  // Enable Logs
  enableLogs: true,

  // Configure Session Replay
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1,
  integrations: [Sentry.mobileReplayIntegration(), routingInstrumentation],
  tracesSampleRate: 1.0,

  // uncomment the line below to enable Spotlight (https://spotlightjs.com)
  // spotlight: __DEV__,
});

import { useNavigationContainerRef } from 'expo-router';

export default Sentry.wrap(function RootLayout() {
  const { colorScheme } = useColorScheme();
  const ref = useNavigationContainerRef();

  React.useEffect(() => {
    if (ref) {
      routingInstrumentation.registerNavigationContainer(ref);
    }
  }, [ref]);

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <RevenueCatProvider>
          <UsageProvider>
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
          </UsageProvider>
        </RevenueCatProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
});
