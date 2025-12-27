import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import { useRouter } from 'expo-router';
import React, { useMemo, useState } from 'react';
import { ActivityIndicator, TextInput, View } from 'react-native';
import { ChartBarIcon, MagnifyingGlassIcon, PlusIcon } from 'react-native-heroicons/outline';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useQuizzes } from '../hooks/useQueries';
import { QuizListItem } from '../types';
import { QuizList } from './QuizList';

export const QuizListScreen: React.FC = () => {
  const router = useRouter();
  const { data: quizzes = [], isLoading, error, refetch } = useQuizzes();
  const [searchQuery, setSearchQuery] = useState('');

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
        <ActivityIndicator size="large" className="text-primary" />
      </View>
    );
  }

  if (error) {
    return (
      <View className="flex-1 items-center justify-center bg-background px-4">
        <Text className="mb-4 text-center text-lg text-red-500">
          Quizler yüklenirken bir hata oluştu.
        </Text>
        <Button onPress={() => refetch()} variant="outline">
          <Text>Tekrar Dene</Text>
        </Button>
      </View>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-background" edges={['top', 'left', 'right']}>
      <View className="flex-1 px-4 pt-4">
        {/* Header */}
        <View className="mb-4 flex-row items-center justify-between">
          <Text className="text-xl font-bold text-foreground">Quizler</Text>
          <View className="flex-row gap-2">
            <Button size="icon" variant="outline" onPress={handleGoToResults}>
              <Icon as={ChartBarIcon} size={20} className="text-foreground" />
            </Button>
            <Button size="sm" onPress={handleCreateQuiz} className="flex-row items-center gap-2">
              <Icon as={PlusIcon} size={20} color="white" />
              <Text className="font-semibold text-primary-foreground">Yeni Quiz</Text>
            </Button>
          </View>
        </View>

        {/* Search */}
        <View className="mb-4 flex-row items-center rounded-lg border border-border bg-card px-4 py-1">
          <Icon as={MagnifyingGlassIcon} size={20} className="mr-2 text-muted-foreground" />
          <TextInput
            className="flex-1 text-base text-foreground"
            placeholder="Ara..."
            placeholderTextColor="#6B7280"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        {/* Content */}
        <QuizList quizzes={filteredQuizzes} onStartQuiz={handleStartQuiz} />
      </View>
    </SafeAreaView>
  );
};
