import { Icon } from '@/components/ui/icon';
import { useNavigation } from 'expo-router';
import React, { useLayoutEffect } from 'react';
import { KeyboardAvoidingView, TouchableOpacity, View } from 'react-native';
import { EllipsisHorizontalIcon } from 'react-native-heroicons/outline';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useChat } from '../hooks/useChat';

import { ChatInput } from './ChatInput';
import { ChatMessageList } from './ChatMessageList';

export const ChatScreen: React.FC = () => {
  const navigation = useNavigation();
  const {
    message,
    setMessage,
    messages,
    isLoading,
    isSending,
    inputHeight,
    scrollViewRef,
    handleSendMessage,
    handleContentSizeChange,
  } = useChat();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: 'Yeni Sohbet',
      headerRight: () => (
        <View className="flex-row gap-2 pr-2">
          <TouchableOpacity className="p-2">
            <Icon as={EllipsisHorizontalIcon} size={24} className="text-foreground" />
          </TouchableOpacity>
        </View>
      ),
    });
  }, [navigation]);

  return (
    <SafeAreaView className="flex-1 bg-background" edges={['left', 'right', 'bottom']}>
      <KeyboardAvoidingView behavior={'padding'} className="flex-1">
        {isLoading ? (
          <View className="flex-1 items-center justify-center">
            <Icon
              as={EllipsisHorizontalIcon}
              size={24}
              className="animate-bounce text-muted-foreground"
            />
          </View>
        ) : (
          <ChatMessageList
            messages={messages}
            scrollViewRef={scrollViewRef}
            onQuestionPress={setMessage}
          />
        )}

        <ChatInput
          message={message}
          isSending={isSending}
          inputHeight={inputHeight}
          onChangeText={setMessage}
          onSend={handleSendMessage}
          onContentSizeChange={handleContentSizeChange}
        />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};
