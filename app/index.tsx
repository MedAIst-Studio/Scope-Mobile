import { useAuth } from '@/features/auth/context/AuthContext';
import { Onboarding } from '@/features/onboarding/components/Onboarding';
import { Stack, useRouter } from 'expo-router';
import * as React from 'react';
import { ActivityIndicator, View } from 'react-native';

export default function Screen() {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  React.useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.replace('/(tabs)');
    }
  }, [isAuthenticated, isLoading]);

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-background">
        <ActivityIndicator size="large" color="#F97316" />
      </View>
    );
  }

  if (isAuthenticated) return null;

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <Onboarding />
    </>
  );
}
