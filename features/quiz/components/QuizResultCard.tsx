import { Button } from '@/components/ui/button';
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Text } from '@/components/ui/text';
import { AttemptsResponseData } from '@/features/quiz/validation';
import React from 'react';
import { View } from 'react-native';
import { CalendarIcon, CheckCircleIcon } from 'react-native-heroicons/outline';

interface QuizResultCardProps {
  attempt: AttemptsResponseData['attempts'][0];
  onViewResult: (id: string) => void;
}

export const QuizResultCard: React.FC<QuizResultCardProps> = ({ attempt, onViewResult }) => {
  return (
    <Card className="mb-4">
      <CardHeader>
        <CardTitle>{attempt.quiz_title}</CardTitle>
        <CardDescription>
          <View className="flex-row items-center gap-4">
            <View className="flex-row items-center gap-1">
              <CalendarIcon size={14} color="#6B7280" />
              <Text className="text-xs text-muted-foreground">Tamamlandı</Text>
            </View>
          </View>
        </CardDescription>
      </CardHeader>

      <View className="px-6 pb-4">
        <View className="flex-row items-center justify-between rounded-lg bg-secondary/50 p-3">
          <View className="items-center">
            <Text className="text-lg font-bold text-primary">
              {Math.round(attempt.percentage)}%
            </Text>
            <Text className="text-xs text-muted-foreground">Başarı</Text>
          </View>
          <View className="h-8 w-[1px] bg-border" />
          <View className="items-center">
            <Text className="text-lg font-bold text-foreground">{attempt.score}</Text>
            <Text className="text-xs text-muted-foreground">Doğru</Text>
          </View>
          <View className="h-8 w-[1px] bg-border" />
          <View className="items-center">
            <Text className="text-lg font-bold text-foreground">{attempt.total_questions}</Text>
            <Text className="text-xs text-muted-foreground">Soru</Text>
          </View>
        </View>
      </View>

      <CardFooter>
        <Button
          variant="outline"
          onPress={() => onViewResult(attempt.id)}
          className="w-full border-primary/20 bg-primary/5">
          <View className="flex-row items-center gap-2">
            <CheckCircleIcon size={16} className="text-primary" />
            <Text className="font-medium text-primary">Sonuçları Gör</Text>
          </View>
        </Button>
      </CardFooter>
    </Card>
  );
};
