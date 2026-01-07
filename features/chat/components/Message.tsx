import { Icon } from '@/components/ui/icon';
import { cn } from '@/lib/utils';
import { useColorScheme } from 'nativewind';
import React from 'react';
import { Image, Platform, StyleSheet, Text, View } from 'react-native';
import { DocumentIcon } from 'react-native-heroicons/solid';
import Markdown from 'react-native-markdown-display';
import { Message as MessageType } from '../validations';

interface MessageProps {
  message: MessageType;
}

const MessageContext: React.FC<{
  context?: MessageType['context_snapshot'];
  isUser: boolean;
}> = ({ context, isUser }) => {
  if (!context) return null;

  return (
    <View
      className={cn(
        'mb-2 flex-row items-center self-start rounded-full border border-border/40 px-3 py-1',
        isUser ? 'border-white/20 bg-white/10' : 'border-secondary/50 bg-secondary/30'
      )}>
      <Icon
        as={DocumentIcon}
        size={14}
        className={cn('mr-1.5', isUser ? 'text-white/70' : 'text-primary')}
      />
      <Text
        className={cn(
          'text-[11px] font-medium tracking-tight',
          isUser ? 'text-white/80' : 'text-muted-foreground'
        )}
        numberOfLines={1}>
        {context.cached_title || 'Kaynak Döküman'}
      </Text>
    </View>
  );
};

const MessageAttachments: React.FC<{
  attachments?: MessageType['attachments'];
}> = ({ attachments }) => {
  if (!attachments || attachments.length === 0) return null;

  const imageAttachments = attachments.filter((a) => a.type === 'image');
  if (imageAttachments.length === 0) return null;

  return (
    <View className="mb-3 gap-2">
      {imageAttachments.map((attachment, index) => (
        <View key={index} className="overflow-hidden rounded-2xl border border-border/10">
          <Image source={{ uri: attachment.url }} className="h-48 w-full" resizeMode="cover" />
        </View>
      ))}
    </View>
  );
};

const MessageContent: React.FC<{
  content: string;
  isUser: boolean;
  isDark: boolean;
}> = ({ content, isUser, isDark }) => {
  const aiTextColor = isDark ? '#F1F5F9' : '#1E293B';
  const userTextColor = '#FFFFFF';
  const textColor = isUser ? userTextColor : aiTextColor;

  const styles = StyleSheet.create({
    body: { color: textColor, fontSize: 16, lineHeight: 24 },
    paragraph: { marginVertical: 2 },
    strong: { fontWeight: 'bold', color: textColor },
    em: { fontStyle: 'italic', color: textColor },
    heading1: { fontSize: 22, fontWeight: 'bold', marginVertical: 8, color: textColor },
    heading2: { fontSize: 18, fontWeight: 'bold', marginVertical: 6, color: textColor },
    heading3: { fontSize: 16, fontWeight: 'bold', marginVertical: 4, color: textColor },
    list_item: { flexDirection: 'row', alignItems: 'flex-start', marginVertical: 2 },
    bullet_list: { marginVertical: 4 },
    ordered_list: { marginVertical: 4 },
    bullet_list_icon: { color: textColor, marginRight: 8 },
    ordered_list_icon: { color: textColor, marginRight: 8 },
    link: {
      color: isUser ? '#E2E8F0' : '#F97316',
      textDecorationLine: 'underline',
    },
    code_inline: {
      backgroundColor: isUser
        ? 'rgba(255,255,255,0.1)'
        : isDark
          ? 'rgba(255,255,255,0.05)'
          : 'rgba(0,0,0,0.05)',
      borderRadius: 4,
      paddingHorizontal: 4,
      fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
      color: textColor,
    },
    code_block: {
      backgroundColor: isUser
        ? 'rgba(255,255,255,0.1)'
        : isDark
          ? 'rgba(255,255,255,0.05)'
          : 'rgba(0,0,0,0.05)',
      borderRadius: 8,
      padding: 12,
      marginVertical: 8,
      fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
      color: textColor,
    },
    fence: {
      backgroundColor: isUser
        ? 'rgba(255,255,255,0.1)'
        : isDark
          ? 'rgba(255,255,255,0.05)'
          : 'rgba(0,0,0,0.05)',
      borderRadius: 8,
      padding: 12,
      marginVertical: 8,
      fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
      color: textColor,
    },
  });

  return <Markdown style={styles as any}>{content}</Markdown>;
};

export const Message: React.FC<MessageProps> = ({ message }) => {
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';

  return (
    <View className={cn('mb-6 w-full flex-row', message.is_user ? 'justify-end' : 'justify-start')}>
      <View
        className={cn(
          message.is_user
            ? 'max-w-[82%] rounded-[2rem] rounded-tr-[4px] bg-primary px-5 py-3.5 shadow-md shadow-primary/20'
            : 'max-w-full flex-1'
        )}>
        <MessageContext context={message.context_snapshot} isUser={message.is_user} />
        <MessageAttachments attachments={message.attachments} />
        <MessageContent content={message.content} isUser={message.is_user} isDark={isDark} />
      </View>
    </View>
  );
};
