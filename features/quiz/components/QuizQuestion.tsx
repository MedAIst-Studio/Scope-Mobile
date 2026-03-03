import { Text } from '@/components/ui/text';
import { QuizResponseData } from '@/features/quiz/validation';
import React from 'react';
import { ScrollView, TouchableOpacity, View } from 'react-native';

type Question = QuizResponseData['questions'][number];

interface QuizQuestionProps {
  question: Question;
  selectedOption?: string;
  onSelectOption: (optionLabel: string) => void;
}

export const QuizQuestion: React.FC<QuizQuestionProps> = ({
  question,
  selectedOption,
  onSelectOption,
}) => {
  return (
    <ScrollView className="flex-1 px-4" showsVerticalScrollIndicator={false}>
      <View className="py-6">
        <Text className="mb-8 text-xl font-semibold leading-relaxed text-foreground">
          {question.questionText}
        </Text>

        <View className="gap-4">
          {question.options.map((option) => {
            const isSelected = selectedOption === option.label;

            return (
              <TouchableOpacity
                key={option.label}
                onPress={() => onSelectOption(option.label)}
                activeOpacity={0.7}
                className={`flex-row items-center rounded-lg border p-4 transition-all ${
                  isSelected ? 'border-primary bg-primary/10' : 'border-border bg-card'
                }`}>
                <View
                  className={`mr-4 h-8 w-8 items-center justify-center rounded-full border ${
                    isSelected
                      ? 'border-primary bg-primary text-primary-foreground'
                      : 'border-muted-foreground bg-transparent'
                  }`}>
                  <Text
                    className={`text-sm font-medium ${
                      isSelected ? 'text-primary-foreground' : 'text-muted-foreground'
                    }`}>
                    {option.label}
                  </Text>
                </View>
                <Text
                  className={`flex-1 text-base ${
                    isSelected ? 'font-medium text-foreground' : 'text-foreground/80'
                  }`}>
                  {option.text}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
    </ScrollView>
  );
};
