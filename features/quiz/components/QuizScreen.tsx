import React from 'react';
import { View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useQuiz } from '../hooks/useQuiz';
import { QuizList } from './QuizList';

export const QuizScreen: React.FC = () => {
  const { quizzes, filters, updateFilter, handleStartQuiz, handleCreateQuiz } = useQuiz();

  return (
    <SafeAreaView className="flex-1 bg-background" edges={['top', 'left', 'right']}>
      <View className="flex-1 px-4 pt-4">
        {/* Quiz List */}
        <QuizList quizzes={quizzes} onStartQuiz={handleStartQuiz} />
      </View>
    </SafeAreaView>
  );
};
