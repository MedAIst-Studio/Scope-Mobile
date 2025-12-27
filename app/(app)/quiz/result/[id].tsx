import { QuizResult } from '@/features/quiz/components/QuizResult';
import { useSubmissionDetails } from '@/features/quiz/hooks/useQueries';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import { ActivityIndicator, SafeAreaView, Text, View } from 'react-native';

export default function QuizResultScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();

  const { data: result, isLoading, error } = useSubmissionDetails(id!);

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-background">
        <ActivityIndicator size="large" className="text-primary" />
      </View>
    );
  }

  if (error || !result) {
    return (
      <View className="flex-1 items-center justify-center bg-background p-4">
        <Text className="text-center text-destructive">Sonuçlar yüklenirken bir hata oluştu.</Text>
      </View>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-background">
      <Stack.Screen
        options={{
          headerTitle: 'Quiz Sonucu',
          headerBackTitle: 'Quizler',
          headerLeft: () => null, // Prevent going back to quiz solving screen
          gestureEnabled: false,
        }}
      />
      <QuizResult result={result} />
    </SafeAreaView>
  );
}
