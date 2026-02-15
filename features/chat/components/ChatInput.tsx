import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';

import { cn } from '@/lib/utils';
import { FileText, Plus, Send, X } from 'lucide-react-native';
import React from 'react';
import { FlatList, Image, TextInput, TouchableOpacity, View } from 'react-native';
import { Attachment } from '../hooks/useChat';

interface ChatInputProps {
  message: string;
  attachments: Attachment[];
  isSending?: boolean;
  inputHeight: number;
  onChangeText: (text: string) => void;
  onSend: () => void;
  onContentSizeChange: (event: any) => void;
  onAttachPress: () => void;
  onRemoveAttachment: (index: number) => void;
}

export const ChatInput: React.FC<ChatInputProps> = ({
  message,
  attachments,
  isSending = false,
  onChangeText,
  onSend,
  onContentSizeChange,
  onAttachPress,
  onRemoveAttachment,
}) => {
  const hasAttachments = attachments.length > 0;

  return (
    <View className="bg-background px-4 pb-8 pt-2">
      {hasAttachments && (
        <View className="mb-3">
          <FlatList
            horizontal
            data={attachments}
            keyExtractor={(_, index) => index.toString()}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ gap: 12 }}
            renderItem={({ item, index }) => (
              <View className="relative h-20 w-20 rounded-2xl bg-secondary/80 p-0.5 shadow-sm">
                {item.type === 'image' ? (
                  <Image source={{ uri: item.uri }} className="h-full w-full rounded-[14px]" />
                ) : (
                  <View className="h-full w-full items-center justify-center gap-1 p-2">
                    <Icon as={FileText} size={24} className="text-primary" />
                    <Text className="text-[10px] font-bold text-foreground" numberOfLines={1}>
                      {item.name}
                    </Text>
                  </View>
                )}
                <TouchableOpacity
                  onPress={() => onRemoveAttachment(index)}
                  className="absolute -right-2 -top-2 h-6 w-6 items-center justify-center rounded-full bg-destructive shadow-md">
                  <Icon as={X} size={14} color="white" />
                </TouchableOpacity>
              </View>
            )}
          />
        </View>
      )}

      <View className="min-h-[60px] flex-row items-center gap-2 rounded-[28px] border border-border/40 bg-card p-1.5 shadow-lg shadow-black/5">
        <TouchableOpacity
          onPress={onAttachPress}
          className="h-11 w-11 items-center justify-center rounded-full bg-secondary/50 active:scale-95">
          <Icon as={Plus} size={22} className="text-foreground/70" />
        </TouchableOpacity>

        <TextInput
          value={message}
          onChangeText={onChangeText}
          placeholder="Sorunuzu buraya yazın..."
          placeholderTextColor="rgba(150,150,150,0.5)"
          multiline
          className="flex-1 px-2 py-3 text-base text-foreground"
          style={{
            maxHeight: 140,
          }}
          onContentSizeChange={onContentSizeChange}
        />

        <Button
          onPress={onSend}
          className={cn(
            'h-11 w-11 rounded-full shadow-sm active:scale-95',
            message.trim() || hasAttachments
              ? 'bg-primary shadow-primary/30'
              : 'bg-muted opacity-50'
          )}
          disabled={(!message.trim() && !hasAttachments) || isSending}
          size="icon">
          <Icon
            as={Send}
            size={20}
            className={
              message.trim() || hasAttachments ? 'text-primary-foreground' : 'text-muted-foreground'
            }
          />
        </Button>
      </View>
    </View>
  );
};
