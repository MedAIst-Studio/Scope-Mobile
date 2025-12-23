import { Text } from '@/components/ui/text';
import React from 'react';
import { View } from 'react-native';
import { Message as MessageType } from '../types';

interface MessageProps {
  message: MessageType;
}

export const Message: React.FC<MessageProps> = ({ message }) => (
  <View className={`mb-4 w-full flex-row ${message.isUser ? 'justify-end' : 'justify-start'}`}>
    <View
      className={`max-w-[85%] rounded-2xl px-4 py-3 ${message.isUser ? 'rounded-tr-sm bg-secondary' : ''}`}>
      <Text
        className={`text-base leading-6 ${message.isUser ? 'text-secondary-foreground' : 'text-foreground'}`}>
        {message.text}
      </Text>
    </View>
  </View>
);
