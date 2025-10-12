import { useRef, useState } from 'react';
import { ScrollView } from 'react-native';
import { Message } from '../types';
import { getAIResponse, mockMessages } from '../utils/mockData';

export const useChat = () => {
  const [message, setMessage] = useState('');
  const [inputHeight, setInputHeight] = useState(40);
  const [messages, setMessages] = useState<Message[]>(mockMessages);
  const scrollViewRef = useRef<ScrollView>(null);

  const handleSendMessage = () => {
    if (message.trim()) {
      // Kullanıcı mesajını ekle
      const userMessage: Message = {
        id: Date.now().toString(),
        text: message.trim(),
        isUser: true,
        timestamp: new Date().toLocaleTimeString('tr-TR', {
          hour: '2-digit',
          minute: '2-digit',
        }),
      };

      setMessages((prev) => [...prev, userMessage]);
      setMessage('');

      // Auto scroll to bottom
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 100);

      // Mock AI yanıtı (2 saniye sonra)
      setTimeout(() => {
        const aiResponse: Message = {
          id: (Date.now() + 1).toString(),
          text: getAIResponse(message.trim()),
          isUser: false,
          timestamp: new Date().toLocaleTimeString('tr-TR', {
            hour: '2-digit',
            minute: '2-digit',
          }),
        };
        setMessages((prev) => [...prev, aiResponse]);

        // Auto scroll after AI response
        setTimeout(() => {
          scrollViewRef.current?.scrollToEnd({ animated: true });
        }, 100);
      }, 2000);
    }
  };

  const handleContentSizeChange = (event: any) => {
    setInputHeight(event.nativeEvent.contentSize.height);
  };

  return {
    message,
    setMessage,
    messages,
    inputHeight,
    scrollViewRef,
    handleSendMessage,
    handleContentSizeChange,
  };
};
