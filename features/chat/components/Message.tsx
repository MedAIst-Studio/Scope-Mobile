import { Text } from '@/components/ui/text';
import React from 'react';
import { View } from 'react-native';
import { Message as MessageType } from '../validations';

interface MessageProps {
  message: MessageType;
}

export const Message: React.FC<MessageProps> = ({ message }) => (
  <View className={`mb-4 w-full flex-row ${message.is_user ? 'justify-end' : 'justify-start'}`}>
    <View
      className={`max-w-[85%] rounded-2xl px-4 py-3 ${message.is_user ? 'rounded-tr-sm bg-secondary' : ''}`}>
      <Text
        className={`text-base leading-6 ${message.is_user ? 'text-secondary-foreground' : 'text-foreground'}`}>
        {message.content}
      </Text>
    </View>
  </View>
);
