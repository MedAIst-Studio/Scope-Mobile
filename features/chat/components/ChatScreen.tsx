import React from 'react';
import { KeyboardAvoidingView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useChat } from '../hooks/useChat';
import { quickQuestions } from '../utils/mockData';
import { ChatHeader } from './ChatHeader';
import { ChatInput } from './ChatInput';
import { ChatMessageList } from './ChatMessageList';

export const ChatScreen: React.FC = () => {
  const {
    message,
    setMessage,
    messages,
    inputHeight,
    scrollViewRef,
    handleSendMessage,
    handleContentSizeChange,
  } = useChat();

  return (
    <SafeAreaView className="flex-1 bg-background pt-12" edges={['top', 'left', 'right']}>
      <ChatHeader />

      <KeyboardAvoidingView behavior={'padding'} className="flex-1">
        <ChatMessageList
          messages={messages}
          quickQuestions={quickQuestions}
          scrollViewRef={scrollViewRef}
          onQuestionPress={setMessage}
        />

        <ChatInput
          message={message}
          inputHeight={inputHeight}
          onChangeText={setMessage}
          onSend={handleSendMessage}
          onContentSizeChange={handleContentSizeChange}
        />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};
