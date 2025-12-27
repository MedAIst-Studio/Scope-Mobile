import { Text } from '@/components/ui/text';
import React from 'react';
import { ScrollView, View } from 'react-native';
import { Message as MessageType } from '../validations';
import { Message } from './Message';

interface ChatMessageListProps {
  messages: MessageType[];
  scrollViewRef: React.RefObject<ScrollView | null>;
  onQuestionPress: (text: string) => void;
  isTyping?: boolean;
}

export const ChatMessageList: React.FC<ChatMessageListProps> = ({
  messages,
  scrollViewRef,
  onQuestionPress,
  isTyping,
}) => (
  <ScrollView
    ref={scrollViewRef}
    className="px-4"
    contentContainerStyle={{ paddingTop: 16, paddingBottom: 20 }}
    showsVerticalScrollIndicator={false}
    keyboardShouldPersistTaps="handled">
    {messages.map((message, index) => (
      <Message key={`${message.timestamp}-${index}`} message={message} />
    ))}

    {isTyping && (
      <View className="mb-4 flex-row justify-start">
        <View className="rounded-2xl rounded-tl-none bg-muted px-4 py-3">
          <Text className="text-sm text-foreground">AI yanıt yazıyor...</Text>
        </View>
      </View>
    )}

    {messages.length === 0 && !isTyping ? (
      <View className="items-center py-12">
        <Text className="mb-4 text-center text-lg font-semibold text-foreground">
          MedAIst ile Sohbet Edin 🤖
        </Text>
        <Text className="mb-6 text-center text-sm text-muted-foreground">
          Tıbbi sorularınızı sorun ve hızlı cevaplar alın
        </Text>
      </View>
    ) : null}
  </ScrollView>
);
