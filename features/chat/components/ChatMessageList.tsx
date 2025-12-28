import { Card } from '@/components/ui/card';
import { Icon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import React from 'react';
import { ScrollView, TouchableOpacity, View } from 'react-native';
import { ChevronRightIcon, SparklesIcon } from 'react-native-heroicons/solid';
import { Message as MessageType } from '../validations';
import { Message } from './Message';

interface ChatMessageListProps {
  messages: MessageType[];
  scrollViewRef: React.RefObject<ScrollView | null>;
  onQuestionPress: (text: string) => void;
  isTyping?: boolean;
}

const SUGGESTED_QUESTIONS = [
  'Baş ağrısı için ne yapmalıyım?',
  'Sağlıklı beslenme önerileri nelerdir?',
  'D vitamini eksikliği belirtileri?',
  'Nasıl daha kaliteli uyuyabilirim?',
];

export const ChatMessageList: React.FC<ChatMessageListProps> = ({
  messages,
  scrollViewRef,
  onQuestionPress,
  isTyping,
}) => (
  <ScrollView
    ref={scrollViewRef}
    className="flex-1 px-4"
    contentContainerStyle={{ paddingTop: 16, paddingBottom: 24 }}
    showsVerticalScrollIndicator={false}
    keyboardShouldPersistTaps="handled">
    {messages.map((message, index) => (
      <Message key={`${message.timestamp}-${index}`} message={message} />
    ))}

    {isTyping && (
      <View className="mb-6 flex-row justify-start pl-1">
        <View className="rounded-[1.5rem] rounded-tl-[4px] border border-border/40 bg-card px-5 py-3 shadow-sm">
          <View className="flex-row items-center gap-2">
            <View className="h-2 w-2 animate-bounce rounded-full bg-primary/40" />
            <View
              className="h-2 w-2 animate-bounce rounded-full bg-primary/40"
              style={{ animationDelay: '0.2s' }}
            />
            <View
              className="h-2 w-2 animate-bounce rounded-full bg-primary/40"
              style={{ animationDelay: '0.4s' }}
            />
          </View>
        </View>
      </View>
    )}

    {messages.length === 0 && !isTyping ? (
      <View className="mt-12 items-center px-6">
        <View className="mb-8 h-20 w-20 items-center justify-center rounded-[2.5rem] bg-primary/10 shadow-xl shadow-primary/10">
          <Icon as={SparklesIcon} size={40} className="text-primary" />
        </View>
        <Text className="mb-3 text-center text-3xl font-bold tracking-tighter text-foreground">
          Merhaba!
        </Text>
        <Text className="mb-10 text-center text-base leading-6 text-muted-foreground/70">
          Tıbbi konularda merak ettiğiniz her şeyi sorabilirsiniz. Size yardımcı olmaktan mutluluk
          duyarım.
        </Text>

        <View className="w-full gap-3">
          <Text className="mb-1 text-sm font-bold uppercase tracking-wider text-muted-foreground/50">
            Önerilen Sorular
          </Text>
          {SUGGESTED_QUESTIONS.map((q, i) => (
            <TouchableOpacity key={i} onPress={() => onQuestionPress(q)} activeOpacity={0.7}>
              <Card className="flex-row items-center justify-between border-border/40 bg-card/50 p-4 active:scale-[0.98]">
                <Text className="flex-1 text-[15px] font-medium text-foreground">{q}</Text>
                <Icon as={ChevronRightIcon} size={18} className="text-muted-foreground/40" />
              </Card>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    ) : null}
  </ScrollView>
);
