import { CreateQuizForm } from '@/features/quiz/components/CreateQuizForm';
import { Stack, useRouter } from 'expo-router';
import React from 'react';
import { View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function CreateQuizPage() {
  const router = useRouter();

  return (
    <SafeAreaView className="flex-1 bg-background">
      <Stack.Screen
        options={{
          headerTitle: 'Yeni Quiz Oluştur',
          headerBackTitle: 'Geri',
        }}
      />
      <View className="flex-1 px-4 py-4">
        <CreateQuizForm
          onSuccess={() => {
            router.back();
          }}
          onCancel={() => {
            router.back();
          }}
        />
      </View>
    </SafeAreaView>
  );
}
