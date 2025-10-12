import { Badge } from '@/components/ui/badge';
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
import { cn } from '@/lib/utils';
import { Clock, HelpCircle, Play } from 'lucide-react-native';
import React from 'react';
import { View } from 'react-native';
import { Quiz } from '../types';
import { getDifficultyColor, getStatusColor, getStatusText } from '../utils/mockData';

interface QuizCardProps {
  quiz: Quiz;
  onStartQuiz: (quizId: string) => void;
}

export const QuizCard: React.FC<QuizCardProps> = ({ quiz, onStartQuiz }) => {
  const difficultyColorClass = getDifficultyColor(quiz.difficulty);
  const statusColorClass = getStatusColor(quiz.status);
  const statusText = getStatusText(quiz.status);

  return (
    <Card className="mb-4">
      <CardHeader>
        <CardTitle>{quiz.title}</CardTitle>
        <CardDescription>{quiz.description}</CardDescription>
      </CardHeader>

      <CardContent>
        {/* Badges */}
        <View className="mb-3 flex-row items-center gap-2">
          <Badge variant="secondary">
            <Text className="text-xs font-medium">{quiz.difficulty}</Text>
          </Badge>

          <Badge variant="outline">
            <Text className="text-xs font-medium">{statusText}</Text>
          </Badge>
        </View>

        {/* Quiz Stats */}
        <View className="mb-4 flex-row items-center gap-4">
          <View className="flex-row items-center gap-1">
            <HelpCircle size={16} color="#6B7280" />
            <Text className="text-sm text-muted-foreground">{quiz.questionCount} soru</Text>
          </View>

          <View className="flex-row items-center gap-1">
            <Clock size={16} color="#6B7280" />
            <Text className="text-sm text-muted-foreground">{quiz.duration} dk</Text>
          </View>

          {quiz.lastScore && (
            <Text className="text-sm font-medium text-primary">
              Son Skor: {quiz.lastScore}/{quiz.questionCount}
            </Text>
          )}
        </View>

        {/* Progress Bar (if completed) */}
        {quiz.completionRate && (
          <View className="mb-4">
            <Text className="mb-2 text-xs text-muted-foreground">
              Tamamlanma: %{quiz.completionRate}
            </Text>
            <View className="h-2 rounded-full bg-muted">
              <View
                className="h-full rounded-full bg-green-500"
                style={{ width: `${quiz.completionRate}%` }}
              />
            </View>
          </View>
        )}
      </CardContent>

      <CardFooter>
        <Button
          onPress={() => onStartQuiz(quiz.id)}
          className={cn('w-full', quiz.status === 'completed' && '!border-zinc-700 !bg-background')}
          variant={quiz.status === 'completed' ? 'outline' : 'default'}>
          <View className="flex-row items-center gap-2">
            <Play size={16} color={quiz.status === 'completed' ? '#6B7280' : 'white'} />
            <Text
              className={`font-medium ${
                quiz.status === 'completed' ? 'text-foreground' : 'text-primary-foreground'
              }`}>
              {quiz.status === 'completed'
                ? 'Tekrar Çöz'
                : quiz.status === 'in-progress'
                  ? 'Devam Et'
                  : "Quiz'i Başlat"}
            </Text>
          </View>
        </Button>
      </CardFooter>
    </Card>
  );
};
