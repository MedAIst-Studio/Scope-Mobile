import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { Textarea } from '@/components/ui/textarea';
import { Send } from 'lucide-react-native';
import React from 'react';
import { View } from 'react-native';

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
  <View className="px-2 py-2">
    <View className="flex-row items-end gap-3">
      <Textarea
        value={message}
        onChangeText={onChangeText}
        placeholder="Sorunuzu yazın..."
        className="flex-1 bg-white text-sm dark:bg-transparent"
        style={{
          maxHeight: 120,
          minHeight: 48,
        }}
        onContentSizeChange={onContentSizeChange}
      />

      <Button
        variant={'outline'}
        onPress={onSend}
        className={`h-12 w-12 items-center justify-center rounded-full`}
        disabled={!message.trim()}>
        <Icon as={Send} size={18} />
      </Button>
    </View>
  </View>
);
