import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { Textarea } from '@/components/ui/textarea';
import React from 'react';
import { View } from 'react-native';
import { PaperAirplaneIcon } from 'react-native-heroicons/solid';

interface ChatInputProps {
  message: string;
  isSending?: boolean;
  inputHeight: number;
  onChangeText: (text: string) => void;
  onSend: () => void;
  onContentSizeChange: (event: any) => void;
}

export const ChatInput: React.FC<ChatInputProps> = ({
  message,
  isSending = false,
  inputHeight,
  onChangeText,
  onSend,
  onContentSizeChange,
}) => (
  <View className="bg-background px-4 pb-8 pt-2">
    <View className="flex-row items-end gap-2">
      <View className="flex-1">
        <Textarea
          value={message}
          onChangeText={onChangeText}
          placeholder="Sorunuzu buraya yazın..."
          className="min-h-[56px] border-border/40 bg-card shadow-md"
          style={{
            maxHeight: 140,
          }}
          onContentSizeChange={onContentSizeChange}
        />
      </View>

      <Button
        onPress={onSend}
        className={`h-14 w-14 rounded-2xl ${message.trim() ? 'bg-primary' : 'bg-muted opacity-50'}`}
        disabled={!message.trim() || isSending}
        size="icon">
        <Icon
          as={PaperAirplaneIcon}
          size={24}
          className={message.trim() ? 'text-primary-foreground' : 'text-muted-foreground'}
        />
      </Button>
    </View>
  </View>
);
