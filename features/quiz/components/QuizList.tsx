import { Text } from '@/components/ui/text';
import React from 'react';
import { ScrollView, View } from 'react-native';
import { QuizListItem } from '../types';
import { QuizCard } from './QuizCard';

interface QuizListProps {
  quizzes: QuizListItem[];
  onStartQuiz: (quizId: string) => void;
}

export const QuizList: React.FC<QuizListProps> = ({ quizzes, onStartQuiz }) => {
  if (quizzes.length === 0) {
    return (
      <View className="flex-1 items-center justify-center py-12">
        <Text className="text-center text-lg font-medium text-muted-foreground">
          Henüz hiç quiz bulunmamaktadır.
        </Text>
        <Text className="mt-2 text-center text-sm text-muted-foreground">
          Farklı filtreler deneyebilir veya yeni quiz oluşturabilirsiniz
        </Text>
      </View>
    );
  }

  return (
    <ScrollView
      className="flex-1"
      contentContainerStyle={{ paddingBottom: 20 }}
      showsVerticalScrollIndicator={false}>
      {quizzes.map((quiz) => (
        <QuizCard key={quiz.quizId} quiz={quiz} onStartQuiz={onStartQuiz} />
      ))}
    </ScrollView>
  );
};
