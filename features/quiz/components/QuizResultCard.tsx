import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Text } from '@/components/ui/text';
import { AttemptsResponseData } from '@/features/quiz/validation';
import React from 'react';
import { View } from 'react-native';
import { ChevronRightIcon } from 'react-native-heroicons/solid';

interface QuizResultCardProps {
  attempt: AttemptsResponseData['attempts'][0];
  onViewResult: (id: string) => void;
}

export const QuizResultCard: React.FC<QuizResultCardProps> = ({ attempt, onViewResult }) => {
  const percentage = Math.round(attempt.percentage);

  return (
    <Card className="mb-4">
      <CardHeader>
        <View className="mb-2 flex-row items-start justify-between">
          <Badge variant={percentage >= 50 ? 'solid' : 'destructive'} className="px-2">
            <Text className="text-[10px] font-bold">%{percentage} Başarı</Text>
          </Badge>
        </View>
        <CardTitle className="mb-1 text-xl">{attempt.quiz_title}</CardTitle>
        <CardDescription>Sınav sonuçlarınız ve detaylı analiz.</CardDescription>
      </CardHeader>

      <View className="px-6 py-2">
        <View className="flex-row items-center justify-between rounded-2xl bg-secondary/30 p-4">
          <View className="flex-1 items-center">
            <Text className="text-lg font-bold text-foreground">{attempt.score}</Text>
            <Text className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
              Doğru
            </Text>
          </View>
          <View className="bg-border/40mx-4 h-8 w-px" />
          <View className="flex-1 items-center">
            <Text className="text-lg font-bold text-foreground">{attempt.total_questions}</Text>
            <Text className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
              Soru
            </Text>
          </View>
        </View>
      </View>

      <CardFooter>
        <Button
          variant="outline"
          onPress={() => onViewResult(attempt.id)}
          className="w-full flex-row items-center justify-center"
          size="default">
          <Text className="font-bold text-foreground">Detayları İncele</Text>
          <ChevronRightIcon size={16} className="text-foreground" />
        </Button>
      </CardFooter>
    </Card>
  );
};
