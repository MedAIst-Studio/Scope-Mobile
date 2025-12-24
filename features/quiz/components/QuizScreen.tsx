import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import React from 'react';
import { View } from 'react-native';
import { PlusIcon } from 'react-native-heroicons/outline';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useQuiz } from '../hooks/useQuiz';
import { QuizList } from './QuizList';

export const QuizScreen: React.FC = () => {
  const { quizzes = [], isLoading, handleStartQuiz, handleCreateQuiz } = useQuiz();

  return (
    <SafeAreaView className="flex-1 bg-background" edges={['top', 'left', 'right']}>
      <View className="flex-1 px-4 pt-4">
        <View className="mb-4 flex-row items-center justify-between">
          <Text className="text-xl font-bold text-foreground">Quizler</Text>
          <Button size="sm" onPress={handleCreateQuiz} className="flex-row items-center gap-2">
            <PlusIcon size={20} color="white" />
            <Text className="font-semibold text-primary-foreground">Yeni Quiz</Text>
          </Button>
        </View>

        {/* Quiz List */}
        <QuizList quizzes={quizzes} onStartQuiz={handleStartQuiz} />
      </View>
    </SafeAreaView>
  );
};
