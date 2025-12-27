import { useLocalSearchParams } from 'expo-router';
import { useRef, useState } from 'react';
import {
  NativeSyntheticEvent,
  ScrollView,
  TextInputContentSizeChangeEventData,
} from 'react-native';
import { Message } from '../validations';
import { useChatMessages, useSendMessage } from './index';

export const useChat = () => {
  const { id, file_id } = useLocalSearchParams<{ id: string; file_id: string }>();

  const chatId = Array.isArray(id) ? id[0] : id;
  const fileId = Array.isArray(file_id) ? file_id[0] : file_id;

  const [message, setMessage] = useState('');
  const [inputHeight, setInputHeight] = useState(40);
  const scrollViewRef = useRef<ScrollView>(null);

  const { data: messages = [], isLoading } = useChatMessages(chatId || null);
  const { mutate: sendMessage, isPending: isSending } = useSendMessage();

  const handleSendMessage = () => {
    if (!message.trim()) return;

    sendMessage(
      {
        message: message.trim(),
        file_id: fileId,
        chatId: chatId,
      },
      {
        onSuccess: () => {
          setMessage('');
          setInputHeight(40);
        },
      }
    );
  };

  const handleContentSizeChange = (
    e: NativeSyntheticEvent<TextInputContentSizeChangeEventData>
  ) => {
    setInputHeight(e.nativeEvent.contentSize.height);
  };

  return {
    message,
    setMessage,
    messages: messages as Message[],
    isLoading,
    isSending,
    inputHeight,
    scrollViewRef,
    handleSendMessage,
    handleContentSizeChange,
  };
};
