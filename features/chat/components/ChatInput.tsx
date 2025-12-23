import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { Textarea } from '@/components/ui/textarea';
import React from 'react';
import { View } from 'react-native';
import { PaperAirplaneIcon } from 'react-native-heroicons/outline';

interface ChatInputProps {
  message: string;
  inputHeight: number;
  onChangeText: (text: string) => void;
  onSend: () => void;
  onContentSizeChange: (event: any) => void;
}

export const ChatInput: React.FC<ChatInputProps> = ({
  message,
  inputHeight,
  onChangeText,
  onSend,
  onContentSizeChange,
}) => (
  <View className="bg-background px-4 pb-6">
    <View className="flex-row items-end gap-3 rounded-3xl bg-secondary px-4 py-2">
      <Textarea
        value={message}
        onChangeText={onChangeText}
        placeholder="Sorunuzu yazın..."
        className="min-h-[44px] flex-1 border-0 bg-transparent text-base leading-5 text-foreground dark:bg-transparent"
        style={{
          maxHeight: 120,
        }}
        onContentSizeChange={onContentSizeChange}
      />

      <Button
        variant={'ghost'}
        onPress={onSend}
        className="h-10 w-10 items-center justify-center rounded-full p-0 active:bg-transparent"
        disabled={!message.trim()}>
        <Icon
          as={PaperAirplaneIcon}
          size={22}
          className={message.trim() ? 'text-primary' : 'text-muted-foreground'}
        />
      </Button>
    </View>
  </View>
);
