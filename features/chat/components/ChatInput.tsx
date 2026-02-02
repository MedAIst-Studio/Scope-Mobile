import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import { FileText, Plus, Send, X } from 'lucide-react-native';
import React from 'react';
import { FlatList, Image, TouchableOpacity, View } from 'react-native';
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
  inputHeight,
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

      <View className="flex-row items-end gap-2">
        <TouchableOpacity
          onPress={onAttachPress}
          className="h-14 w-14 items-center justify-center rounded-2xl bg-secondary/80 shadow-sm active:scale-95">
          <Icon as={Plus} size={28} className="text-foreground" />
        </TouchableOpacity>

        <View className="flex-1">
          <Textarea
            value={message}
            onChangeText={onChangeText}
            placeholder="Sorunuzu buraya yazın..."
            className="min-h-[56px] border-border/40 bg-card shadow-lg shadow-black/5"
            style={{
              maxHeight: 140,
            }}
            onContentSizeChange={onContentSizeChange}
          />
        </View>

        <Button
          onPress={onSend}
          className={cn(
            'h-14 w-14 rounded-2xl shadow-lg active:scale-95',
            message.trim() || hasAttachments
              ? 'bg-primary shadow-primary/30'
              : 'bg-muted opacity-50'
          )}
          disabled={(!message.trim() && !hasAttachments) || isSending}
          size="icon">
          <Icon
            as={Send}
            size={24}
            className={
              message.trim() || hasAttachments ? 'text-primary-foreground' : 'text-muted-foreground'
            }
          />
        </Button>
      </View>
    </View>
  );
};
