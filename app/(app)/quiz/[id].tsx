import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { QuizProgressBar } from '@/features/quiz/components/QuizProgressBar';
import { QuizQuestion } from '@/features/quiz/components/QuizQuestion';
import { useQuiz as useQuizQuery, useSubmitQuiz } from '@/features/quiz/hooks/useQueries';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { ActivityIndicator, Alert, View } from 'react-native';
import { ChevronLeftIcon, ChevronRightIcon } from 'react-native-heroicons/outline';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function QuizDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();

  // Renamed to avoid confusion with the custom hook in useQuiz.ts
  const { data: quiz, isLoading, error } = useQuizQuery(id!);
  const { mutateAsync: submitQuiz, isPending: isSubmitting } = useSubmitQuiz();

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-background">
        <ActivityIndicator size="large" className="text-primary" />
      </View>
    );
  }

  if (error || !quiz) {
    return (
      <View className="flex-1 items-center justify-center bg-background p-4">
        <Text className="text-center text-destructive">Quiz yüklenirken bir hata oluştu.</Text>
        <Button onPress={() => router.back()} className="mt-4">
          <Text>Geri Dön</Text>
        </Button>
      </View>
    );
  }

  const questions = quiz.questions || [];
  const currentQuestion = questions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === questions.length - 1;
  const isFirstQuestion = currentQuestionIndex === 0;

  const handleSelectOption = (optionLabel: string) => {
    setAnswers((prev) => ({
      ...prev,
      [currentQuestion.no]: optionLabel,
    }));
  };

  const handleNext = () => {
    if (isLastQuestion) {
      handleSubmit();
    } else {
      setCurrentQuestionIndex((prev) => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (!isFirstQuestion) {
      setCurrentQuestionIndex((prev) => prev - 1);
    }
  };

  const handleSubmit = async () => {
    // Basic validation: ensure all questions are answered?
    // Or allow partial submission? Usually all answered for a quiz.
    const unansweredCount = questions.length - Object.keys(answers).length;

    if (unansweredCount > 0) {
      Alert.alert(
        'Eksik Cevaplar',
        `Lütfen tüm soruları cevaplayın. (${unansweredCount} soru boş)`,
        [{ text: 'Tamam' }]
      );
      return;
    }

    try {
      const formattedAnswers = Object.entries(answers).map(([questionNo, selectedOption]) => ({
        question_no: Number(questionNo),
        selected_option: selectedOption,
      }));

      const result = await submitQuiz({
        id: quiz.id,
        answers: formattedAnswers,
      });

      // Navigate to result screen with the attempt ID
      // API returns attempt_id in result
      if (result?.attempt_id) {
        router.replace(`/quiz/result/${result.attempt_id}`);
      } else {
        // Fallback if API structure differs
        Alert.alert('Hata', 'Sonuç ID alınamadı');
      }
    } catch (err: any) {
      Alert.alert('Hata', err.message || 'Quiz gönderilemedi');
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-background">
      <Stack.Screen
        options={{
          headerTitle: quiz.title || 'Quiz',
          headerBackTitle: 'Geri',
        }}
      />

      <View className="flex-1">
        {/* Progress Bar */}
        <View className="px-4 py-4">
          <View className="mb-2 flex-row justify-between">
            <Text className="text-sm font-medium text-muted-foreground">
              Soru {currentQuestionIndex + 1} / {questions.length}
            </Text>
            <Text className="text-sm font-medium text-muted-foreground">
              {Math.round(((currentQuestionIndex + 1) / questions.length) * 100)}%
            </Text>
          </View>
          <QuizProgressBar current={currentQuestionIndex + 1} total={questions.length} />
        </View>

        {/* Question Area */}
        {currentQuestion ? (
          <QuizQuestion
            question={currentQuestion}
            selectedOption={answers[currentQuestion.no]}
            onSelectOption={handleSelectOption}
          />
        ) : (
          <View className="flex-1 items-center justify-center">
            <Text>Soru bulunamadı</Text>
          </View>
        )}

        {/* Navigation Buttons */}
        <View className="border-t border-border p-4">
          <View className="flex-row gap-4">
            <Button
              variant="outline"
              className="flex-1 flex-row gap-2"
              onPress={handlePrevious}
              disabled={isFirstQuestion || isSubmitting}>
              <ChevronLeftIcon size={20} className="text-foreground" />
              <Text className="text-foreground">Önceki</Text>
            </Button>

            <Button className="flex-1 flex-row gap-2" onPress={handleNext} disabled={isSubmitting}>
              <Text>{isSubmitting ? 'Gönderiliyor...' : isLastQuestion ? 'Bitir' : 'Sonraki'}</Text>
              {!isLastQuestion && !isSubmitting && (
                <ChevronRightIcon size={20} className="text-primary-foreground" />
              )}
            </Button>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}
