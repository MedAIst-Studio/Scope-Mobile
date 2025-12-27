import { Text } from '@/components/ui/text';
import { AttemptsResponseData } from '@/features/quiz/validation';
import React from 'react';
import { ScrollView, View } from 'react-native';
import { QuizResultCard } from './QuizResultCard';

interface QuizResultListProps {
  attempts: AttemptsResponseData['attempts'];
  onViewResult: (id: string) => void;
}

export const QuizResultList: React.FC<QuizResultListProps> = ({ attempts, onViewResult }) => {
  if (!attempts || attempts.length === 0) {
    return (
      <View className="flex-1 items-center justify-center py-12">
        <Text className="text-center text-lg font-medium text-muted-foreground">
          Henüz çözülmüş quiz bulunmamaktadır.
        </Text>
        <Text className="mt-2 text-center text-sm text-muted-foreground">
          Quizler sekmesinden yeni bir quiz çözmeye başlayabilirsiniz.
        </Text>
      </View>
    );
  }

  return (
    <ScrollView
      className="flex-1"
      contentContainerStyle={{ paddingBottom: 20 }}
      showsVerticalScrollIndicator={false}>
      {attempts.map((attempt) => (
        <QuizResultCard key={attempt.id} attempt={attempt} onViewResult={onViewResult} />
      ))}
    </ScrollView>
  );
};
