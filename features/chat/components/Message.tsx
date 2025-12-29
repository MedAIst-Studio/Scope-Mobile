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

export const Message: React.FC<MessageProps> = ({ message }) => {
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';
  const hasAttachments = message.attachments && message.attachments.length > 0;

  // AI Text Color: Dark gray/slate in light mode, Slate-100 in dark mode
  const aiTextColor = isDark ? '#F1F5F9' : '#1E293B';
  const userTextColor = '#FFFFFF';
  const textColor = message.is_user ? userTextColor : aiTextColor;

  const markdownStyles = StyleSheet.create({
    body: {
      color: textColor,
      fontSize: 15,
      lineHeight: 22,
    },
    paragraph: {
      marginVertical: 2,
    },
    strong: {
      fontWeight: 'bold',
      color: textColor,
    },
    em: {
      fontStyle: 'italic',
      color: textColor,
    },
    heading1: {
      fontSize: 22,
      fontWeight: 'bold',
      marginVertical: 8,
      color: textColor,
    },
    heading2: {
      fontSize: 18,
      fontWeight: 'bold',
      marginVertical: 6,
      color: textColor,
    },
    heading3: {
      fontSize: 16,
      fontWeight: 'bold',
      marginVertical: 4,
      color: textColor,
    },
    list_item: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      marginVertical: 2,
    },
    bullet_list: {
      marginVertical: 4,
    },
    ordered_list: {
      marginVertical: 4,
    },
    bullet_list_icon: {
      color: textColor,
      marginRight: 8,
    },
    ordered_list_icon: {
      color: textColor,
      marginRight: 8,
    },
    link: {
      color: message.is_user ? '#E2E8F0' : '#F97316',
      textDecorationLine: 'underline',
    },
    code_inline: {
      backgroundColor: message.is_user
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
      backgroundColor: message.is_user
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
      backgroundColor: message.is_user
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

  return (
    <View className={cn('mb-6 w-full flex-row', message.is_user ? 'justify-end' : 'justify-start')}>
      <View
        className={cn(
          message.is_user
            ? 'max-w-[82%] rounded-[2rem] rounded-tr-[4px] bg-primary px-5 py-3.5 shadow-md shadow-primary/20'
            : 'max-w-full flex-1'
        )}>
        {hasAttachments && (
          <View className="mb-3 gap-3">
            {message.attachments?.map((attachment, index) => (
              <View key={index} className="overflow-hidden rounded-2xl bg-secondary/30">
                {attachment.type === 'image' ? (
                  <Image
                    source={{ uri: attachment.uri }}
                    className="h-48 w-full"
                    resizeMode="cover"
                  />
                ) : (
                  <View className="flex-row items-center px-3 py-2">
                    <View className="mr-3 h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                      <Icon as={DocumentIcon} size={20} className="text-primary" />
                    </View>
                    <Text
                      className={cn(
                        'flex-1 text-sm font-bold',
                        message.is_user ? 'text-primary-foreground' : 'text-foreground'
                      )}
                      numberOfLines={1}>
                      {attachment.name}
                    </Text>
                  </View>
                )}
              </View>
            ))}
          </View>
        )}

        <Markdown style={markdownStyles as any}>{message.content}</Markdown>
      </View>
    </View>
  );
};
