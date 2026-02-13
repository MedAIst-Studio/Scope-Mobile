import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import { useRouter } from 'expo-router';
import { ChevronLeft, Search } from 'lucide-react-native';
import React, { useMemo, useState } from 'react';
import { ActivityIndicator, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSubmissions } from '../hooks/useQueries';
import { AttemptsResponseData } from '../validation';
import { QuizResultList } from './QuizResultList';

export const QuizResultsScreen: React.FC = () => {
  const router = useRouter();
  const { data: submissionsData, isLoading, error, refetch } = useSubmissions();
  const [searchQuery, setSearchQuery] = useState('');

  const submissions = submissionsData?.attempts || [];

  const filteredSubmissions = useMemo(() => {
    if (!searchQuery) return submissions;
    return submissions.filter((submission: AttemptsResponseData['attempts'][0]) =>
      submission.quiz_title.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [submissions, searchQuery]);

  const handleViewResult = (attemptId: string) => {
    router.push({
      pathname: '/(app)/quiz/result/[id]',
      params: { id: attemptId },
    });
  };

  const handleBack = () => {
    router.back();
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
          Sonuçlar yüklenirken bir hata oluştu.
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
        <View className="mb-4 flex-row items-center gap-4">
          <TouchableOpacity onPress={handleBack} className="-ml-2 p-2">
            <Icon as={ChevronLeft} size={24} className="text-foreground" />
          </TouchableOpacity>
          <Text className="text-xl font-bold text-foreground">Sonuçlarım</Text>
        </View>

        {/* Search */}
        <View className="mb-4 flex-row items-center rounded-lg border border-border bg-card px-4 py-1">
          <Icon as={Search} size={20} className="mr-2 text-muted-foreground" />
          <TextInput
            className="flex-1 text-base text-foreground"
            placeholder="Sonuçlarda ara..."
            placeholderTextColor="#6B7280"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        {/* Content */}
        <QuizResultList attempts={filteredSubmissions} onViewResult={handleViewResult} />
      </View>
    </SafeAreaView>
  );
};
