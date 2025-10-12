import { Text } from '@/components/ui/text';
import React from 'react';
import { ScrollView, View } from 'react-native';
import { Message as MessageType, QuickQuestion as QuickQuestionType } from '../types';
import { Message } from './Message';
import { QuickQuestion } from './QuickQuestion';

interface ChatMessageListProps {
  messages: MessageType[];
  quickQuestions: QuickQuestionType[];
  scrollViewRef: React.RefObject<ScrollView | null>;
  onQuestionPress: (text: string) => void;
}

export const ChatMessageList: React.FC<ChatMessageListProps> = ({
  messages,
  quickQuestions,
  scrollViewRef,
  onQuestionPress,
}) => (
  <ScrollView
    ref={scrollViewRef}
    className="px-4"
    contentContainerStyle={{ paddingTop: 16, paddingBottom: 20 }}
    showsVerticalScrollIndicator={false}
    keyboardShouldPersistTaps="handled">
    {messages.map((message) => (
      <Message key={message.id} message={message} />
    ))}

    {messages.length === 0 ? (
      <View className="items-center py-12">
        <Text className="mb-4 text-center text-lg font-semibold text-foreground">
          MedAIst ile Sohbet Edin 🤖
        </Text>
        <Text className="mb-6 text-center text-sm text-muted-foreground">
          Tıbbi sorularınızı sorun ve hızlı cevaplar alın
        </Text>
        <View className="w-full gap-2">
          {quickQuestions.map((question) => (
            <QuickQuestion key={question.id} question={question} onPress={onQuestionPress} />
          ))}
        </View>
      </View>
    ) : (
      <View className="mt-4 gap-2">
        <Text className="mb-2 text-center text-sm text-muted-foreground">Hızlı sorular:</Text>
        {quickQuestions.map((question) => (
          <QuickQuestion key={question.id} question={question} onPress={onQuestionPress} />
        ))}
      </View>
    )}
  </ScrollView>
);
