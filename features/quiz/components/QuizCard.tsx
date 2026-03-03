import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Icon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import { Calendar, Play } from 'lucide-react-native';
import React from 'react';
import { View } from 'react-native';
import { QuizListItem } from '../types';

interface QuizCardProps {
  quiz: QuizListItem;
  onStartQuiz: (quizId: string) => void;
}

export const QuizCard: React.FC<QuizCardProps> = ({ quiz, onStartQuiz }) => {
  return (
    <Card className="mb-4">
      <CardHeader>
        <View className="mb-2 flex-row items-start justify-between">
          <Badge variant="default" className="bg-primary/10">
            <Icon as={Calendar} size={12} className="mr-1 text-primary" />
            <Text className="text-[10px] font-bold text-primary">
              {new Date(quiz.createdAt).toLocaleDateString('tr-TR', {
                day: 'numeric',
                month: 'short',
              })}
            </Text>
          </Badge>
        </View>
        <CardTitle className="text-xl">{quiz.title}</CardTitle>
      </CardHeader>

      <CardFooter>
        <Button onPress={() => onStartQuiz(quiz.id)} className="w-full" size="default">
          <Icon as={Play} size={18} className="text-primary-foreground" />
          <Text className="font-bold text-primary-foreground">Sınavı Başlat</Text>
        </Button>
      </CardFooter>
    </Card>
  );
};
