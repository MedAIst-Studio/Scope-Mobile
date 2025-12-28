import { Text } from '@/components/ui/text';
import React from 'react';
import { View } from 'react-native';
import { Message as MessageType } from '../validations';

interface MessageProps {
  message: MessageType;
}

export const Message: React.FC<MessageProps> = ({ message }) => (
  <View className={`mb-5 w-full flex-row ${message.is_user ? 'justify-end' : 'justify-start'}`}>
    {!message.is_user && (
      <View className="mr-2 mt-auto h-8 w-8 items-center justify-center rounded-xl bg-primary/10">
        <Text className="text-xs">🤖</Text>
      </View>
    )}
    <View
      className={`max-w-[80%] rounded-3xl px-5 py-3.5 ${
        message.is_user
          ? 'bg-primary shadow-sm shadow-primary/20'
          : 'border border-border/50 bg-card shadow-sm'
      }`}>
      <Text
        className={`text-[15px] leading-6 ${
          message.is_user ? 'font-medium text-primary-foreground' : 'text-foreground'
        }`}>
        {message.content}
      </Text>
    </View>
  </View>
);
