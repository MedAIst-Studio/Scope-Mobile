import * as ImagePicker from 'expo-image-picker';
import { useLocalSearchParams } from 'expo-router';
import { useRef, useState } from 'react';
import {
  Alert,
  NativeSyntheticEvent,
  ScrollView,
  TextInputContentSizeChangeEventData,
} from 'react-native';
import { Message } from '../validations';
import { useChatMessages, useSendMessage } from './index';

export interface Attachment {
  type: 'image' | 'file';
  name: string;
  uri: string;
  id?: string;
}

export const useChat = () => {
  const { id, file_id } = useLocalSearchParams<{ id: string; file_id: string }>();

  const chatId = Array.isArray(id) ? id[0] : id;
  const fileId = Array.isArray(file_id) ? file_id[0] : file_id;

  const [message, setMessage] = useState('');
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [isFileSelectorVisible, setIsFileSelectorVisible] = useState(false);
  const [inputHeight, setInputHeight] = useState(40);
  const scrollViewRef = useRef<ScrollView>(null);

  const { data: messages = [], isLoading } = useChatMessages(chatId || null);
  const { mutate: sendMessage, isPending: isSending } = useSendMessage();

  const handleSendMessage = () => {
    if (!message.trim() && attachments.length === 0) return;

    sendMessage(
      {
        message: message.trim(),
        file_id: fileId,
        chatId: chatId,
        // attachments: attachments // Backend doesn't support yet, so we'll mock it locally if needed
      },
      {
        onSuccess: () => {
          setMessage('');
          setAttachments([]);
          setInputHeight(40);
        },
      }
    );
  };

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (status !== 'granted') {
      Alert.alert('İzin Gerekli', 'Fotoğraf seçmek için galeri erişimine izin vermeniz gerekiyor.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      quality: 0.8,
    });

    if (!result.canceled) {
      const newAttachment: Attachment = {
        type: 'image',
        name: result.assets[0].fileName || `img_${Date.now()}.jpg`,
        uri: result.assets[0].uri,
      };
      setAttachments((prev) => [...prev, newAttachment]);
    }
  };

  const handleFileSelect = (file: any) => {
    const newAttachment: Attachment = {
      type: 'file',
      name: file.title,
      uri: file.url || '', // Placeholder if URL isn't there
      id: file.id,
    };
    setAttachments((prev) => [...prev, newAttachment]);
    setIsFileSelectorVisible(false);
  };

  const removeAttachment = (index: number) => {
    setAttachments((prev) => prev.filter((_, i) => i !== index));
  };

  const handleContentSizeChange = (
    e: NativeSyntheticEvent<TextInputContentSizeChangeEventData>
  ) => {
    setInputHeight(e.nativeEvent.contentSize.height);
  };

  return {
    message,
    setMessage,
    attachments,
    setAttachments,
    isFileSelectorVisible,
    setIsFileSelectorVisible,
    messages: messages as Message[],
    isLoading,
    isSending,
    inputHeight,
    scrollViewRef,
    handleSendMessage,
    handleContentSizeChange,
    pickImage,
    handleFileSelect,
    removeAttachment,
  };
};
