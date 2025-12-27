import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { QuizListItem } from '@/features/quiz/types';
import { AttemptsResponseData } from '@/features/quiz/validation';
import React, { useMemo, useState } from 'react';
import { ActivityIndicator, TextInput, TouchableOpacity, View } from 'react-native';
import { MagnifyingGlassIcon, PlusIcon } from 'react-native-heroicons/outline';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useQuiz } from '../hooks/useQuiz';
import { QuizList } from './QuizList';
import { QuizResultList } from './QuizResultList';

type Tab = 'quizzes' | 'results';

export const QuizScreen: React.FC = () => {
  const {
    quizzes = [],
    submissions = [],
    isLoading,
    handleStartQuiz,
    handleCreateQuiz,
  } = useQuiz();

  const [activeTab, setActiveTab] = useState<Tab>('quizzes');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredQuizzes = useMemo(() => {
    if (!searchQuery) return quizzes;
    return quizzes.filter((quiz: QuizListItem) =>
      quiz.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [quizzes, searchQuery]);

  const filteredSubmissions = useMemo(() => {
    if (!searchQuery) return submissions;
    return submissions.filter((submission: AttemptsResponseData['attempts'][0]) =>
      submission.quiz_title.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [submissions, searchQuery]);

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-background">
        <ActivityIndicator size="large" className="text-primary" />
      </View>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-background" edges={['top', 'left', 'right']}>
      <View className="flex-1 px-4 pt-4">
        {/* Header */}
        <View className="mb-4 flex-row items-center justify-between">
          <Text className="text-xl font-bold text-foreground">Quizler</Text>
          <Button size="sm" onPress={handleCreateQuiz} className="flex-row items-center gap-2">
            <PlusIcon size={20} color="white" />
            <Text className="font-semibold text-primary-foreground">Yeni Quiz</Text>
          </Button>
        </View>

        {/* Search */}
        <View className="mb-4 flex-row items-center rounded-xl border border-border bg-card px-3 py-2.5">
          <MagnifyingGlassIcon size={20} className="mr-2 text-muted-foreground" />
          <TextInput
            className="flex-1 text-base text-foreground"
            placeholder="Ara..."
            placeholderTextColor="#6B7280"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        {/* Tabs */}
        <View className="mb-4 flex-row rounded-lg bg-secondary/50 p-1">
          <TouchableOpacity
            onPress={() => setActiveTab('quizzes')}
            className={`flex-1 items-center rounded-md py-2 ${
              activeTab === 'quizzes' ? 'bg-background shadow-sm' : ''
            }`}>
            <Text
              className={`font-medium ${
                activeTab === 'quizzes' ? 'text-primary' : 'text-muted-foreground'
              }`}>
              Quizler
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setActiveTab('results')}
            className={`flex-1 items-center rounded-md py-2 ${
              activeTab === 'results' ? 'bg-background shadow-sm' : ''
            }`}>
            <Text
              className={`font-medium ${
                activeTab === 'results' ? 'text-primary' : 'text-muted-foreground'
              }`}>
              Sonuçlar
            </Text>
          </TouchableOpacity>
        </View>

        {/* Content */}
        {activeTab === 'quizzes' ? (
          <QuizList quizzes={filteredQuizzes} onStartQuiz={handleStartQuiz} />
        ) : (
          <QuizResultList attempts={filteredSubmissions} />
        )}
      </View>
    </SafeAreaView>
  );
};
