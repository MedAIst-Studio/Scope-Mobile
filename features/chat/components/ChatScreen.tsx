import { ActionMenu } from '@/components/shared/ActionMenu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Icon } from '@/components/ui/icon';
import { ImageCropper } from '@/features/camera/components/ImageCropper';
import { cn } from '@/lib/utils';
import { useLocalSearchParams, useNavigation, useRouter } from 'expo-router';
import React, { useLayoutEffect, useState } from 'react';
import { KeyboardAvoidingView, Platform, Text, TouchableOpacity, View } from 'react-native';
import {
  DocumentPlusIcon,
  DocumentTextIcon,
  EllipsisHorizontalIcon,
  PencilSquareIcon,
  PhotoIcon,
  TrashIcon,
  XMarkIcon,
} from 'react-native-heroicons/solid';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useChats, useDeleteChat, useUpdateChat } from '../hooks';
import { useChat } from '../hooks/useChat';

import { ChatInput } from './ChatInput';
import { ChatMessageList } from './ChatMessageList';
import { FileSelector } from './FileSelector';
import { RenameModal } from './RenameModal';

export const ChatScreen: React.FC = () => {
  const navigation = useNavigation();
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const chatId = Array.isArray(id) ? id[0] : id;

  const [renameModalVisible, setRenameModalVisible] = useState(false);
  const [isHeaderMenuVisible, setIsHeaderMenuVisible] = useState(false);
  const [isAttachMenuVisible, setIsAttachMenuVisible] = useState(false);
  const [isDeleteAlertVisible, setIsDeleteAlertVisible] = useState(false);

  const {
    message,
    setMessage,
    attachments,
    removeAttachment,
    isFileSelectorVisible,
    setIsFileSelectorVisible,
    messages,
    isLoading,
    isSending,
    inputHeight,
    scrollViewRef,
    handleSendMessage,
    handleContentSizeChange,
    pickImage,
    handleFileSelect,
    activeFile,
    setActiveFile,
    addAttachment,
    uploadFile,
  } = useChat();

  const [croppingImage, setCroppingImage] = useState<string | null>(null);

  const handlePickImage = async () => {
    const uri = await pickImage();
    if (uri) {
      setCroppingImage(uri);
    }
  };

  const handleCropConfirm = async (croppedUri: string) => {
    setCroppingImage(null);

    try {
      const result = await uploadFile({
        file_title: 'chat_image.jpg',
        file_data: {
          uri: croppedUri,
          name: 'chat_image.jpg',
          type: 'image/jpeg',
        },
      });

      console.log('Chat upload result:', JSON.stringify(result, null, 2));

      let uploadedUrl = result?.url || result?.uri || result?.file_url;
      if (!uploadedUrl && Array.isArray(result) && result[0]) {
        uploadedUrl = result[0].url || result[0].uri || result[0].file_url;
      }

      console.log('Extracted uploadedUrl:', uploadedUrl);

      if (uploadedUrl) {
        console.log('Adding attachment with URI:', uploadedUrl);
        addAttachment({
          type: 'image',
          name: 'chat_image.jpg',
          uri: uploadedUrl,
        });
      } else {
        console.error('FAILED to extract uploadedUrl from result');
      }
    } catch (error) {
      console.error('Failed to upload chat image:', error);
    }
  };

  const { data: chats } = useChats();
  const currentChat = (chats as any[])?.find((c) => c.id === chatId);

  const { mutate: deleteChat } = useDeleteChat();
  const { mutate: updateChat } = useUpdateChat();

  const handleDelete = () => {
    if (!chatId) return;
    deleteChat(chatId, {
      onSuccess: () => router.replace('/(tabs)/chat'),
    });
  };

  useLayoutEffect(() => {
    const title = chatId
      ? currentChat?.title || 'YKS Asistanı'
      : activeFile?.title || 'Yeni Sohbet';

    navigation.setOptions({
      headerTitle: title,
      headerRight: () => (
        <View className="flex-row gap-2 pr-2">
          {chatId && (
            <TouchableOpacity className="p-2" onPress={() => setIsHeaderMenuVisible(true)}>
              <Icon as={EllipsisHorizontalIcon} size={24} className="text-foreground" />
            </TouchableOpacity>
          )}
        </View>
      ),
    });
  }, [navigation, chatId, currentChat, activeFile]);

  const headerActions = [
    {
      label: 'Yeniden Adlandır',
      icon: PencilSquareIcon,
      onPress: () => setRenameModalVisible(true),
    },
    {
      label: 'Sohbeti Sil',
      icon: TrashIcon,
      variant: 'destructive' as const,
      onPress: () => setIsDeleteAlertVisible(true),
    },
  ];

  const attachActions = [
    {
      label: 'Fotoğraf Kitaplığı',
      icon: PhotoIcon,
      onPress: handlePickImage,
    },
    {
      label: 'Dosyalarım',
      icon: DocumentPlusIcon,
      onPress: () => setIsFileSelectorVisible(true),
    },
  ];

  return (
    <SafeAreaView className="flex-1 bg-background" edges={['left', 'right', 'bottom']}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 90}>
        {croppingImage ? (
          <View
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              zIndex: 50,
              backgroundColor: 'black',
            }}>
            <ImageCropper
              imageUri={croppingImage}
              onCrop={handleCropConfirm}
              onCancel={() => setCroppingImage(null)}
            />
          </View>
        ) : null}

        {activeFile && (
          <View className="mx-4 mt-2 flex-row items-center gap-3 rounded-2xl border border-primary/20 bg-primary/5 px-4 py-3">
            <View className="h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
              <Icon as={DocumentTextIcon} size={20} className="text-primary" />
            </View>
            <View className="flex-1">
              <Text className="text-sm font-bold text-foreground" numberOfLines={1}>
                {activeFile.title}
              </Text>
              <Text className="text-[10px] font-medium uppercase tracking-widest text-muted-foreground/60">
                Aktif Döküman
              </Text>
            </View>
            <TouchableOpacity
              onPress={() => setActiveFile(null)}
              className="h-8 w-8 items-center justify-center rounded-lg bg-background/50">
              <XMarkIcon size={18} color="#94a3b8" />
            </TouchableOpacity>
          </View>
        )}

        {isLoading ? (
          <View className="flex-1 px-4 py-6">
            <View className="flex-1 animate-pulse space-y-6">
              {[1, 2, 3, 4, 5].map((i) => (
                <View
                  key={i}
                  className={cn(
                    'max-w-[80%] rounded-2xl p-4',
                    i % 2 === 0 ? 'self-end bg-primary/10' : 'self-start bg-muted/20'
                  )}>
                  <View
                    className="mb-2 h-4 rounded-full bg-foreground/10"
                    style={{ width: i % 2 === 0 ? 120 : 180 }}
                  />
                  <View
                    className="h-3 rounded-full bg-foreground/5"
                    style={{ width: i % 2 === 0 ? 80 : 140 }}
                  />
                </View>
              ))}
            </View>
            <View className="absolute inset-0 items-center justify-center">
              <View className="rounded-full border border-border/20 bg-background/80 px-4 py-2 shadow-sm">
                <Text className="text-sm font-medium text-muted-foreground">
                  Asistan hazırlanıyor...
                </Text>
              </View>
            </View>
          </View>
        ) : (
          <ChatMessageList
            messages={messages}
            scrollViewRef={scrollViewRef}
            onQuestionPress={setMessage}
            isTyping={isSending}
          />
        )}

        <ChatInput
          message={message}
          attachments={attachments}
          isSending={isSending}
          inputHeight={inputHeight}
          onChangeText={setMessage}
          onSend={handleSendMessage}
          onContentSizeChange={handleContentSizeChange}
          onAttachPress={() => setIsAttachMenuVisible(true)}
          onRemoveAttachment={removeAttachment}
        />

        <ActionMenu
          isVisible={isHeaderMenuVisible}
          onClose={() => setIsHeaderMenuVisible(false)}
          title="Sohbet Ayarları"
          actions={headerActions}
        />

        <ActionMenu
          isVisible={isAttachMenuVisible}
          onClose={() => setIsAttachMenuVisible(false)}
          title="Dosya Ekle"
          actions={attachActions}
        />

        <AlertDialog open={isDeleteAlertVisible} onOpenChange={setIsDeleteAlertVisible}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Sohbeti Sil</AlertDialogTitle>
              <AlertDialogDescription>
                Bu sohbeti silmek istediğinize emin misiniz? Bu işlem geri alınamaz.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Vazgeç</AlertDialogCancel>
              <AlertDialogAction
                className="bg-destructive hover:bg-destructive/90"
                onPress={handleDelete}>
                <Text className="text-destructive-foreground">Sil</Text>
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        <FileSelector
          isVisible={isFileSelectorVisible}
          onClose={() => setIsFileSelectorVisible(false)}
          onSelect={handleFileSelect}
        />

        <RenameModal
          isVisible={renameModalVisible}
          onClose={() => setRenameModalVisible(false)}
          initialTitle="Soru Çözümü"
          onRename={(newTitle) => {
            if (chatId) {
              updateChat({ chatId, title: newTitle });
            }
          }}
        />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};
