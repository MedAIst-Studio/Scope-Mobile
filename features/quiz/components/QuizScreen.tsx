import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { Plus } from 'lucide-react-native';
import React from 'react';
import { View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useQuiz } from '../hooks/useQuiz';
import { FilterSection } from './FilterSection';
import { QuizList } from './QuizList';

export const QuizScreen: React.FC = () => {
  const { quizzes, filters, updateFilter, handleStartQuiz, handleCreateQuiz } = useQuiz();

  return (
    <SafeAreaView className="flex-1 bg-background" edges={['top', 'left', 'right']}>
      {/* Header */}
      <View className="border-b border-border bg-background px-4 py-4">
        <View className="flex-row items-center justify-between">
          <View>
            <Text className="text-2xl font-bold text-foreground">Quiz</Text>
            <Text className="text-sm text-muted-foreground">Bilgilerinizi test edin</Text>
          </View>

          <Button onPress={handleCreateQuiz} size="sm" className="rounded-full">
            <View className="flex-row items-center gap-1">
              <Plus size={16} color="white" />
              <Text className="text-xs font-medium text-primary-foreground">Yeni Quiz</Text>
            </View>
          </Button>
        </View>
      </View>

      <View className="flex-1 px-4 pt-4">
        {/* Filters */}
        <FilterSection filters={filters} onUpdateFilter={updateFilter} />

        {/* Quiz List */}
        <QuizList quizzes={quizzes} onStartQuiz={handleStartQuiz} />
      </View>
    </SafeAreaView>
  );
};
