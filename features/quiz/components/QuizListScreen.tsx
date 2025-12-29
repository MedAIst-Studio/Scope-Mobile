import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { Input } from '@/components/ui/input';
import { Text } from '@/components/ui/text';
import { useRouter } from 'expo-router';
import React, { useMemo, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { ChartBarIcon, MagnifyingGlassIcon, PlusIcon } from 'react-native-heroicons/solid';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useQuizzes } from '../hooks/useQueries';
import { QuizListItem } from '../types';
import { QuizList } from './QuizList';

export const QuizListScreen: React.FC = () => {
  const router = useRouter();
  const { data: quizzesData, isLoading, error, refetch } = useQuizzes();
  const [searchQuery, setSearchQuery] = useState('');

  const quizzes = quizzesData || [];

  const filteredQuizzes = useMemo(() => {
    if (!searchQuery) return quizzes;
    return quizzes.filter((quiz: QuizListItem) =>
      quiz.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [quizzes, searchQuery]);

  const handleStartQuiz = (quizId: string) => {
    router.push({
      pathname: '/(app)/quiz/[id]',
      params: { id: quizId },
    });
  };

  const handleCreateQuiz = () => {
    router.push('/(app)/quiz/create');
  };

  const handleGoToResults = () => {
    router.push('/(app)/quiz/results');
  };

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-background">
        <ActivityIndicator size="large" color="#f97316" />
      </View>
    );
  }

  if (error) {
    return (
      <View className="flex-1 items-center justify-center bg-background px-6">
        <Text className="mb-6 text-center text-lg font-semibold text-foreground">
          Denemeler yüklenirken bir hata oluştu.
        </Text>
        <Button onPress={() => refetch()} variant="outline" className="w-full">
          <Text>Tekrar Dene</Text>
        </Button>
      </View>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-background" edges={['top', 'left', 'right']}>
      <View className="flex-1 px-4 pt-6">
        {/* Header */}
        <View className="mb-6 flex-row items-center justify-between">
          <View>
            <Text className="text-3xl font-bold tracking-tight text-foreground">Denemeler</Text>
            <Text className="text-sm text-muted-foreground">
              Toplam {quizzes.length} kayıtlı deneme
            </Text>
          </View>
          <View className="flex-row gap-2">
            <Button
              size="icon"
              variant="outline"
              onPress={handleGoToResults}
              className="h-12 w-12 rounded-xl">
              <Icon as={ChartBarIcon} size={22} className="text-foreground" />
            </Button>
            <Button size="icon" onPress={handleCreateQuiz} className="h-12 w-12 rounded-xl">
              <Icon as={PlusIcon} size={22} className="text-primary-foreground" />
            </Button>
          </View>
        </View>

        {/* Search */}
        <View className="mb-6">
          <View className="relative">
            <Input
              placeholder="Deneme ara..."
              value={searchQuery}
              onChangeText={setSearchQuery}
              className="pl-12"
            />
            <View className="absolute left-4 top-4">
              <Icon as={MagnifyingGlassIcon} size={20} className="text-muted-foreground/50" />
            </View>
          </View>
        </View>

        {/* Content */}
        <QuizList quizzes={filteredQuizzes} onStartQuiz={handleStartQuiz} />
      </View>
    </SafeAreaView>
  );
};
