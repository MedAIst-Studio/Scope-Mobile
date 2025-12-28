import { Icon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import { cn } from '@/lib/utils';
import React from 'react';
import { Image, View } from 'react-native';
import { AcademicCapIcon, DocumentIcon } from 'react-native-heroicons/solid';
import { Message as MessageType } from '../validations';

interface MessageProps {
  message: MessageType;
}

export const Message: React.FC<MessageProps> = ({ message }) => {
  const hasAttachments = message.attachments && message.attachments.length > 0;

  return (
    <View className={cn('mb-6 w-full flex-row', message.is_user ? 'justify-end' : 'justify-start')}>
      {!message.is_user && (
        <View className="mr-3 mt-auto h-9 w-9 items-center justify-center rounded-[14px] bg-primary/10 shadow-sm shadow-primary/10">
          <Icon as={AcademicCapIcon} size={20} className="text-primary" />
        </View>
      )}
      <View
        className={cn(
          'max-w-[82%] rounded-[2rem] px-5 py-3.5',
          message.is_user
            ? 'rounded-tr-[4px] bg-primary shadow-md shadow-primary/20'
            : 'rounded-tl-[4px] border border-border/40 bg-card shadow-sm'
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
                  <View className="flex-row items-center p-3">
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

        <Text
          className={cn(
            'text-[15px] leading-6',
            message.is_user ? 'font-medium text-primary-foreground' : 'text-foreground'
          )}>
          {message.content}
        </Text>
      </View>
    </View>
  );
};
