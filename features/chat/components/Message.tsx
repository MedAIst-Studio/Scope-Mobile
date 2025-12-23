import { Text } from '@/components/ui/text';
import React from 'react';
import { View } from 'react-native';
import { Message as MessageType } from '../types';

interface MessageProps {
  message: MessageType;
}

export const Message: React.FC<MessageProps> = ({ message }) => (
  <View className={`mb-6 ${message.isUser ? 'items-end' : 'items-start'}`}>
    <View className="max-w-[80%]">
      {message.isUser ? (
        <View className="rounded-2xl rounded-br-sm border-b-4 border-primary-darker bg-primary px-4 py-3">
          <Text className="text-sm leading-5 text-primary-foreground">{message.text}</Text>
        </View>
      ) : (
        <Text className="leading-5 text-foreground">{message.text}</Text>
      )}
    </View>
  </View>
);
