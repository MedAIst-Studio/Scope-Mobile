import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { AttemptDetailData } from '@/features/quiz/validation';
import { useRouter } from 'expo-router';
import React from 'react';
import { ScrollView, View } from 'react-native';
import { CheckCircleIcon, XCircleIcon } from 'react-native-heroicons/solid';

interface QuizResultProps {
  result: AttemptDetailData;
}

export const QuizResult: React.FC<QuizResultProps> = ({ result }) => {
  const router = useRouter();

  return (
    <ScrollView className="flex-1 bg-background" showsVerticalScrollIndicator={false}>
      {/* Header / Score */}
      <View className="items-center border-b border-border bg-card pb-8 pt-8">
        <Text className="mb-2 text-2xl font-bold text-foreground">{result.quiz_title}</Text>
        <Text className="text-muted-foreground">Sonuçlar</Text>

        <View className="mt-6 h-40 w-40 items-center justify-center rounded-full border-8 border-primary/20 bg-background">
          <Text className="text-4xl font-bold text-primary">{Math.round(result.percentage)}%</Text>
          <Text className="text-sm font-medium text-muted-foreground">Başarı</Text>
        </View>

        <View className="mt-6 flex-row gap-8">
          <View className="items-center">
            <Text className="text-2xl font-bold text-foreground">{result.score}</Text>
            <Text className="text-xs text-muted-foreground">Doğru</Text>
          </View>
          <View className="items-center">
            <Text className="text-2xl font-bold text-foreground">{result.total_questions}</Text>
            <Text className="text-xs text-muted-foreground">Toplam</Text>
          </View>
        </View>
      </View>

      {/* Answer Breakdown */}
      <View className="p-4 pb-8">
        <Text className="mb-4 text-lg font-bold text-foreground">Detaylı Çözümler</Text>

        <View className="gap-4">
          {result.answers.map((answer, index) => (
            <View
              key={index}
              className={`rounded-xl border p-4 ${
                answer.is_correct
                  ? 'border-green-500/30 bg-green-500/5'
                  : 'border-red-500/30 bg-red-500/5'
              }`}>
              <View className="mb-2 flex-row items-start justify-between">
                <Text className="flex-1 font-semibold text-foreground">
                  {index + 1}. {answer.question_text}
                </Text>
                {answer.is_correct ? (
                  <CheckCircleIcon className="text-green-500" size={24} />
                ) : (
                  <XCircleIcon className="text-red-500" size={24} />
                )}
              </View>

              <View className="mt-2 space-y-1">
                <Text className="text-sm">
                  <Text className="font-medium text-muted-foreground">Senin Cevabın: </Text>
                  <Text className={answer.is_correct ? 'text-green-600' : 'text-red-600'}>
                    {answer.selected_option}
                  </Text>
                </Text>

                {!answer.is_correct && (
                  <Text className="text-sm">
                    <Text className="font-medium text-muted-foreground">Doğru Cevap: </Text>
                    <Text className="text-green-600">{answer.correct_option}</Text>
                  </Text>
                )}
              </View>

              {answer.explanation && (
                <View className="bg-surface mt-3 rounded-lg p-3">
                  <Text className="text-xs font-bold text-muted-foreground">Açıklama:</Text>
                  <Text className="mt-1 text-sm text-foreground">{answer.explanation}</Text>
                </View>
              )}
            </View>
          ))}
        </View>

        <Button className="mt-8" size="lg" onPress={() => router.replace('/(tabs)/quiz')}>
          <Text>Quiz Listesine Dön</Text>
        </Button>
      </View>
    </ScrollView>
  );
};
