import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Icon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import { AttemptDetailData } from '@/features/quiz/validation';
import { cn } from '@/lib/utils';
import React, { useState } from 'react';
import { Pressable, ScrollView, View } from 'react-native';
import {
  CheckCircleIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  InformationCircleIcon,
  QuestionMarkCircleIcon,
  TrophyIcon,
  XCircleIcon,
} from 'react-native-heroicons/solid';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';

interface QuizResultProps {
  result: AttemptDetailData;
  onBack: () => void;
}

const AccordionItem = ({
  answer,
  index,
}: {
  answer: AttemptDetailData['answers'][0];
  index: number;
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [measuredHeight, setMeasuredHeight] = useState(0);
  const animatedHeight = useSharedValue(0);

  const toggleAccordion = () => {
    const nextState = !isExpanded;
    setIsExpanded(nextState);
    animatedHeight.value = withTiming(nextState ? 1 : 0, { duration: 300 });
  };

  const bodyStyle = useAnimatedStyle(() => {
    return {
      height: withTiming(isExpanded ? measuredHeight : 0, { duration: 300 }),
      opacity: withTiming(isExpanded ? 1 : 0, { duration: 250 }),
      overflow: 'hidden',
    };
  });

  const renderContent = () => (
    <View className="gap-3 border-t border-border/5 px-5 pb-5 pt-4">
      <View>
        <Text className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60">
          Senin Cevabın
        </Text>
        <View
          className={cn(
            'mt-1 rounded-xl border px-4 py-3',
            answer.is_correct
              ? 'border-green-500/20 bg-green-500/5'
              : 'border-red-500/20 bg-red-500/5'
          )}>
          <Text
            className={cn('font-medium', answer.is_correct ? 'text-green-700' : 'text-red-700')}>
            {answer.selected_option}
          </Text>
        </View>
      </View>

      {!answer.is_correct && (
        <View>
          <Text className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60">
            Doğru Cevap
          </Text>
          <View className="mt-1 rounded-xl border border-green-500/20 bg-green-500/5 px-4 py-3">
            <Text className="font-medium text-green-700">{answer.correct_option}</Text>
          </View>
        </View>
      )}

      {answer.explanation && (
        <View className="mt-2 rounded-2xl bg-secondary/30 p-4">
          <View className="flex-row items-center gap-2">
            <Icon as={InformationCircleIcon} size={16} className="text-primary" />
            <Text className="text-[10px] font-bold uppercase tracking-widest text-primary">
              Çözüm Analizi
            </Text>
          </View>
          <Text className="mt-2 text-sm leading-relaxed text-muted-foreground">
            {answer.explanation}
          </Text>
        </View>
      )}
    </View>
  );

  return (
    <Card className="mb-4 overflow-hidden border-border/40 bg-card p-3">
      <Pressable
        onPress={toggleAccordion}
        className={cn(
          'flex-row items-start gap-4 p-4 active:bg-secondary/20',
          isExpanded && 'bg-secondary/10'
        )}>
        <View
          className={cn(
            'h-10 w-10 items-center justify-center rounded-2xl',
            answer.is_correct ? 'bg-green-500/10' : 'bg-red-500/10'
          )}>
          <Icon
            as={answer.is_correct ? CheckCircleIcon : XCircleIcon}
            size={24}
            className={answer.is_correct ? 'text-green-500' : 'text-red-500'}
          />
        </View>

        <View className="flex-1">
          <View className="flex-row items-center gap-2">
            <Text className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60">
              Soru {index + 1}
            </Text>
            <Badge
              variant="outline"
              className={cn(
                'h-5 border-0 px-2',
                answer.is_correct ? 'bg-green-500/10' : 'bg-red-500/10'
              )}>
              <Text
                className={cn(
                  'text-[8px] font-bold uppercase',
                  answer.is_correct ? 'text-green-600' : 'text-red-600'
                )}>
                {answer.is_correct ? 'Doğru' : 'Yanlış'}
              </Text>
            </Badge>
          </View>
          <Text className="mt-1 text-base font-bold leading-tight text-foreground">
            {answer.question_text}
          </Text>
        </View>

        <Icon
          as={isExpanded ? ChevronUpIcon : ChevronDownIcon}
          size={20}
          className="mt-1 text-muted-foreground/40"
        />
      </Pressable>

      {/* Hidden measurement view */}
      <View
        pointerEvents="none"
        style={{ position: 'absolute', opacity: 0, width: '100%', zIndex: -1 }}
        onLayout={(e) => {
          const height = e.nativeEvent.layout.height;
          if (height > 0 && measuredHeight !== height) {
            setMeasuredHeight(height);
          }
        }}>
        {renderContent()}
      </View>

      <Animated.View style={bodyStyle}>{renderContent()}</Animated.View>
    </Card>
  );
};

export const QuizResult: React.FC<QuizResultProps> = ({ result, onBack }) => {
  return (
    <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
      {/* Modern Header */}
      <View className="bg-card px-6 pb-10 pt-10">
        <View className="mb-6 flex-row items-center gap-3">
          <View className="h-12 w-12 items-center justify-center rounded-2xl bg-primary">
            <Icon as={TrophyIcon} size={24} className="text-primary-foreground" />
          </View>
          <View className="flex-1">
            <Text className="text-2xl font-bold tracking-tight text-foreground">Quiz Sonucu</Text>
            <Text className="text-sm font-medium text-muted-foreground">{result.quiz_title}</Text>
          </View>
        </View>

        {/* Success Rate Circle Alternative */}
        <View className="flex-row items-center gap-8 rounded-[2.5rem] bg-background p-8 shadow-sm">
          <View className="items-center">
            <View className="h-24 w-24 items-center justify-center rounded-full border-4 border-primary/20 bg-primary/5">
              <Text className="text-3xl font-bold text-primary">
                %{Math.round(result.percentage)}
              </Text>
            </View>
            <Text className="mt-2 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
              Başarı Oranı
            </Text>
          </View>

          <View className="flex-1 gap-4">
            <View className="flex-row justify-between">
              <View className="h-12 flex-1 items-center justify-center rounded-2xl bg-green-500/10 px-4">
                <Text className="text-lg font-bold text-green-600">{result.score}</Text>
                <Text className="text-[8px] font-bold uppercase text-green-600/60">Doğru</Text>
              </View>
              <View className="w-4" />
              <View className="h-12 flex-1 items-center justify-center rounded-2xl bg-red-500/10 px-4">
                <Text className="text-lg font-bold text-red-600">
                  {result.total_questions - result.score}
                </Text>
                <Text className="text-[8px] font-bold uppercase text-red-600/60">Yanlış</Text>
              </View>
            </View>

            <View className="flex-row items-center gap-2 rounded-xl bg-secondary/40 px-4 py-2">
              <Icon as={QuestionMarkCircleIcon} size={16} className="text-muted-foreground" />
              <Text className="text-[10px] font-bold text-muted-foreground">
                Toplam {result.total_questions} Soru Çözüldü
              </Text>
            </View>
          </View>
        </View>
      </View>

      {/* Detailed Solutions Section */}
      <View className="px-5 py-8">
        <View className="mb-6 flex-row items-center justify-between px-1">
          <View>
            <Text className="text-xl font-bold text-foreground">Soru Analizleri</Text>
            <Text className="text-xs text-muted-foreground">
              Tüm soruların detaylı çözümlerini inceleyin
            </Text>
          </View>
        </View>

        <View>
          {result.answers.map((answer, index) => (
            <AccordionItem key={index} answer={answer} index={index} />
          ))}
        </View>

        <Button
          className="mt-10 h-16 rounded-[2rem] shadow-lg shadow-primary/20"
          size="lg"
          onPress={onBack}>
          <Text className="text-base font-bold">Quiz Listesine Dön</Text>
        </Button>
      </View>
    </ScrollView>
  );
};
