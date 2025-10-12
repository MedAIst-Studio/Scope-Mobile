import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import React from 'react';
import { View } from 'react-native';
import { QuickQuestion as QuickQuestionType } from '../types';

interface QuickQuestionProps {
  question: QuickQuestionType;
  onPress: (text: string) => void;
}

export const QuickQuestion: React.FC<QuickQuestionProps> = ({ question, onPress }) => (
  <Button variant={'outline'} onPress={() => onPress(question.text)} className="mb-2">
    <View className="flex-row items-center gap-2">
      <Text className="text-sm">🧠</Text>
      <Text className="flex-1 text-sm">{question.text}</Text>
    </View>
  </Button>
);
