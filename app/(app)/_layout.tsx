import { Stack } from 'expo-router';
import React from 'react';

export default function AppLayout() {
  return (
    <Stack>
      <Stack.Screen name="quiz/index" options={{ headerShown: false }} />
      <Stack.Screen name="quiz/[id]" options={{ headerShown: false }} />
      <Stack.Screen name="quiz/create" options={{ presentation: 'modal', headerShown: false }} />
      <Stack.Screen name="quiz/results/index" options={{ headerShown: false }} />
      <Stack.Screen name="quiz/result/[id]" options={{ headerShown: false }} />
      <Stack.Screen name="profile/index" options={{ headerShown: false }} />
      <Stack.Screen name="profile/password" options={{ headerShown: false }} />
    </Stack>
  );
}
