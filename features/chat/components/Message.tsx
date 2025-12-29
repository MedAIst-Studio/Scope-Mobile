import { Icon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import { cn } from '@/lib/utils';
import React from 'react';
import { Image, View } from 'react-native';
import { DocumentIcon } from 'react-native-heroicons/solid';
import { Message as MessageType } from '../validations';

interface MessageProps {
  message: MessageType;
}

export const Message: React.FC<MessageProps> = ({ message }) => {
  const hasAttachments = message.attachments && message.attachments.length > 0;

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
