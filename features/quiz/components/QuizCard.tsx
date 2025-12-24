import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Text } from '@/components/ui/text';
import React from 'react';
import { View } from 'react-native';
import { CalendarIcon, PlayIcon } from 'react-native-heroicons/outline';
import { QuizListItem } from '../types';

interface QuizCardProps {
  quiz: QuizListItem;
  onStartQuiz: (quizId: string) => void;
}

export const QuizCard: React.FC<QuizCardProps> = ({ quiz, onStartQuiz }) => {
  return (
    <Card className="mb-4">
      <CardHeader>
        <CardTitle>{quiz.title}</CardTitle>
        <CardDescription>
          <View className="flex-row items-center gap-1">
            <CalendarIcon size={14} color="#6B7280" />
            <Text className="text-xs text-muted-foreground">
              {new Date(quiz.createdAt).toLocaleDateString('tr-TR', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
              })}
            </Text>
          </View>
        </CardDescription>
      </CardHeader>

      <CardContent>
        {/* API currently provides minimal info for the list, so we keep this clean */}
      </CardContent>

      <CardFooter>
        <Button onPress={() => onStartQuiz(quiz.quizId)} className="w-full">
          <View className="flex-row items-center gap-2">
            <PlayIcon size={16} color="white" />
            <Text className="font-medium text-primary-foreground">Sınavı Başlat</Text>
          </View>
        </Button>
      </CardFooter>
    </Card>
  );
};
