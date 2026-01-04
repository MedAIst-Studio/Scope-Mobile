import { useUploadFile } from '@/features/files/hooks';
import * as ImagePicker from 'expo-image-picker';
import { useLocalSearchParams } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import {
  Alert,
  Keyboard,
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
}

export const useChat = () => {
  const { id, file_id, initialMessage, imageUri, fileName } = useLocalSearchParams<{
    id: string;
    file_id: string;
    initialMessage: string;
    imageUri: string;
    fileName: string;
  }>();

  const chatId = Array.isArray(id) ? id[0] : id;
  const initialFileId = Array.isArray(file_id) ? file_id[0] : file_id;
  const initialFileName = Array.isArray(fileName) ? fileName[0] : fileName;
  const initialMsg = Array.isArray(initialMessage) ? initialMessage[0] : initialMessage;
  const initialImg = Array.isArray(imageUri) ? imageUri[0] : imageUri;

  const [activeFile, setActiveFile] = useState<{ id: string; title: string } | null>(
    initialFileId ? { id: initialFileId, title: initialFileName || 'Dosya' } : null
  );

  const [message, setMessage] = useState(initialMsg || '');
  const resolveUri = (uri: string) => {
    if (!uri) return '';
    if (uri.startsWith('http') || uri.startsWith('file://')) return uri;
    // Remove double slash if present
    const cleanUri = uri.startsWith('/') ? uri.substring(1) : uri;
    const apiUrl = process.env.EXPO_PUBLIC_API_URL || '';
    const cleanBase = apiUrl.endsWith('/') ? apiUrl.slice(0, -1) : apiUrl;
    return `${cleanBase}/${cleanUri}`;
  };

  const [attachments, setAttachments] = useState<Attachment[]>(
    initialImg
      ? [
          {
            type: 'image',
            name: 'captured_image.jpg',
            uri: resolveUri(initialImg),
          },
        ]
      : []
  );

  const prevParams = useRef({ initialImg, initialMsg, initialFileId });

  useEffect(() => {
    // Only synchronize from URL parameters if they have actually changed
    // or if we are initializing. This prevents manual state changes (like picking a different file)
    // from being overwritten by the static URL parameters.

    if (initialImg && initialImg !== prevParams.current.initialImg) {
      setAttachments([
        {
          type: 'image',
          name: 'captured_image.jpg',
          uri: resolveUri(initialImg),
        },
      ]);
      prevParams.current.initialImg = initialImg;
    }

    if (initialMsg && initialMsg !== prevParams.current.initialMsg) {
      setMessage(initialMsg);
      prevParams.current.initialMsg = initialMsg;
    }

    if (initialFileId && (initialFileId !== prevParams.current.initialFileId || !activeFile)) {
      setActiveFile({ id: initialFileId, title: initialFileName || 'Dosya' });
      prevParams.current.initialFileId = initialFileId;
    }
  }, [initialImg, initialMsg, initialFileId, initialFileName]);
  const [isFileSelectorVisible, setIsFileSelectorVisible] = useState(false);
  const [inputHeight, setInputHeight] = useState(40);
  const scrollViewRef = useRef<ScrollView>(null);

  const { data: messagesData, isLoading } = useChatMessages(chatId || null);
  const messages = messagesData || [];
  const { mutate: sendMessage, isPending: isSending } = useSendMessage();
  const { mutateAsync: uploadFile, isPending: isUploading } = useUploadFile();

  const handleSendMessage = async () => {
    if (!message.trim() && attachments.length === 0) return;

    Keyboard.dismiss();

    let imageUrl: string | undefined;

    const imageAttachment = attachments.find((a) => a.type === 'image');

    if (imageAttachment) {
      // If it's not a local file (file://), assume it's a remote URL and use it directly
      if (!imageAttachment.uri.startsWith('file://')) {
        imageUrl = imageAttachment.uri;
      } else {
        try {
          const response = await uploadFile({
            file_title: imageAttachment.name,
            file_data: {
              uri: imageAttachment.uri,
              name: imageAttachment.name,
              type: 'image/jpeg',
            },
          });

          imageUrl = response?.url || response?.uri || response?.file_url;

          if (!imageUrl && Array.isArray(response) && response[0]) {
            imageUrl = response[0].url || response[0].uri;
          }
        } catch (error) {
          return;
        }
      }
    }

    sendMessage(
      {
        message: message.trim(),
        file_id: activeFile?.id,
        chatId: chatId,
        image_url: imageUrl,
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

  const addAttachment = (attachment: Attachment) => {
    setAttachments((prev) => [...prev, attachment]);
  };

  const pickImage = async (): Promise<string | null> => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (status !== 'granted') {
      Alert.alert('İzin Gerekli', 'Fotoğraf seçmek için galeri erişimine izin vermeniz gerekiyor.');
      return null;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      quality: 0.8,
      allowsEditing: false, // We use custom cropper
      aspect: [4, 3],
    });

    if (!result.canceled && result.assets[0].uri) {
      return result.assets[0].uri;
    }
    return null;
  };

  const handleFileSelect = (file: any) => {
    console.log('[useChat] handleFileSelect called with:', file);
    setActiveFile({ id: file.id, title: file.title });
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
    addAttachment,
    isFileSelectorVisible,
    setIsFileSelectorVisible,
    messages: messages as Message[],
    isLoading,
    isSending: isSending || isUploading,
    inputHeight,
    scrollViewRef,
    activeFile,
    setActiveFile,
    handleSendMessage,
    handleContentSizeChange,
    pickImage,
    handleFileSelect,
    removeAttachment,
    uploadFile, // Exposed for manual upload flow
  };
};
