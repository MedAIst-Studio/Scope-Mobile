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
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useNavigation, useRouter } from 'expo-router';
import {
  FileText,
  FileUp,
  Image as ImageIcon,
  MoreHorizontal,
  SquarePen,
  Trash2,
  X,
} from 'lucide-react-native';
import React, { useEffect, useLayoutEffect, useState } from 'react';
import {
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { KeyboardStickyView } from 'react-native-keyboard-controller';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useChat } from '../hooks/useChat';

import { useChats, useDeleteChat, useUpdateChat } from '../hooks/queries';
import { ChatInput } from './ChatInput';
import { ChatMessageList } from './ChatMessageList';
import { FileSelector } from './FileSelector';
import { RenameModal } from './RenameModal';

const SkeletonItem = ({ index }: { index: number }) => {
  const shimmerPosition = useSharedValue(-100);
  const isRight = index % 2 === 0;

  useEffect(() => {
    shimmerPosition.value = withRepeat(withTiming(400, { duration: 1500 }), -1, false);
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: 0.8,
  }));

  const shimmerStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: shimmerPosition.value }],
  }));

  return (
    <Animated.View
      style={animatedStyle}
      className={cn(
        'max-w-[80%] overflow-hidden rounded-2xl p-4',
        isRight ? 'self-end bg-primary/10' : 'self-start bg-muted/20'
      )}>
      <Animated.View style={[StyleSheet.absoluteFill, shimmerStyle]}>
        <LinearGradient
          colors={['transparent', 'rgba(255,255,255,0.1)', 'transparent']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={{ borderRadius: 16 }}
          className="h-full w-24"
        />
      </Animated.View>
      <View
        className="mb-2 h-4 rounded-full bg-foreground/10"
        style={{ width: isRight ? 120 : 180 }}
      />
      <View className="h-3 rounded-full bg-foreground/5" style={{ width: isRight ? 80 : 140 }} />
    </Animated.View>
  );
};

const StatusIndicator = () => {
  const glowScale = useSharedValue(1);
  const glowOpacity = useSharedValue(1);

  useEffect(() => {
    glowScale.value = withRepeat(
      withSequence(withTiming(1.4, { duration: 1200 }), withTiming(1, { duration: 1200 })),
      -1,
      true
    );
    glowOpacity.value = withRepeat(
      withSequence(withTiming(0.4, { duration: 1200 }), withTiming(0.8, { duration: 1200 })),
      -1,
      true
    );
  }, []);

  const glowStyle = useAnimatedStyle(() => ({
    transform: [{ scale: glowScale.value }],
    opacity: glowOpacity.value,
  }));

  return (
    <View className="items-center justify-center">
      <Animated.View style={glowStyle} className="absolute h-32 w-32 items-center justify-center">
        <LinearGradient
          colors={['rgba(249, 115, 22, 0.4)', 'transparent']}
          style={{ borderRadius: 9999 }}
          className="h-full w-full"
        />
      </Animated.View>
      <LinearGradient
        colors={['rgba(249, 115, 22, 0.2)', 'rgba(249, 115, 22, 0.05)']}
        style={{ borderRadius: 9999 }}
        className="flex-row items-center gap-3 border border-primary/30 px-8 py-4 shadow-2xl shadow-primary/20">
        <View className="h-3 w-3 rounded-full bg-primary" />
        <Text className="text-base font-bold tracking-tight text-primary">
          Scope sohbet hazırlanıyor...
        </Text>
      </LinearGradient>
    </View>
  );
};

export const ChatScreen: React.FC = () => {
  const navigation = useNavigation();
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const chatId = Array.isArray(id) ? id[0] : id;
  const insets = useSafeAreaInsets();

  const [renameModalVisible, setRenameModalVisible] = useState(false);
  const [isHeaderMenuVisible, setIsHeaderMenuVisible] = useState(false);
  const [isAttachMenuVisible, setIsAttachMenuVisible] = useState(false);
  const [isDeleteAlertVisible, setIsDeleteAlertVisible] = useState(false);

  const {
    message,
    setMessage,
    attachments,
    setAttachments,
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

    addAttachment({
      type: 'image',
      name: 'chat_image.jpg',
      uri: croppedUri,
    });

    try {
      uploadFile({
        file_title: 'chat_image.jpg',
        file_data: {
          uri: croppedUri,
          name: 'chat_image.jpg',
          type: 'image/jpeg',
        },
      });
    } catch (error) {
      console.error('Failed to initiate chat image upload:', error);
    }
  };

  const { data: chats } = useChats();
  const currentChat = (chats as any[])?.find((c) => c.id === chatId);

  const { mutate: deleteChat } = useDeleteChat();
  const { mutate: updateChat } = useUpdateChat();

  const handleDelete = () => {
    if (!chatId) return;
    deleteChat(chatId, {
      onSuccess: () => {
        router.replace('/(tabs)/chat');
        setActiveFile(null);
        setMessage('');
        setAttachments([]);
      },
    });
  };

  useLayoutEffect(() => {
    const title = chatId
      ? currentChat?.title || 'Scope Sohbet'
      : activeFile?.title || 'Yeni Sohbet';

    navigation.setOptions({
      headerTitle: title,
      headerRight: () => (
        <View className="flex-row gap-2 pr-2">
          {chatId && (
            <TouchableOpacity className="p-2" onPress={() => setIsHeaderMenuVisible(true)}>
              <Icon as={MoreHorizontal} size={24} className="text-foreground" />
            </TouchableOpacity>
          )}
        </View>
      ),
    });
  }, [navigation, chatId, currentChat, activeFile]);

  const headerActions = [
    {
      label: 'Yeniden Adlandır',
      icon: SquarePen,
      onPress: () => setRenameModalVisible(true),
    },
    {
      label: 'Sohbeti Sil',
      icon: Trash2,
      variant: 'destructive' as const,
      onPress: () => setIsDeleteAlertVisible(true),
    },
  ];

  const attachActions = [
    {
      label: 'Fotoğraflar',
      icon: ImageIcon,
      onPress: handlePickImage,
    },
    {
      label: 'Dosyalarım',
      icon: FileUp,
      onPress: () => setIsFileSelectorVisible(true),
    },
  ];

  return (
    <View className="flex-1 bg-background">
      <Modal
        visible={!!croppingImage}
        animationType="fade"
        transparent={false}
        onRequestClose={() => setCroppingImage(null)}>
        {croppingImage && (
          <ImageCropper
            imageUri={croppingImage}
            onCrop={handleCropConfirm}
            onCancel={() => setCroppingImage(null)}
          />
        )}
      </Modal>

      {activeFile && (
        <View className="mx-4 mt-2 mb-2 flex-row items-center gap-3 rounded-2xl border border-primary/20 bg-primary/5 px-4 py-3">
          <View className="h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
            <Icon as={FileText} size={20} className="text-primary" />
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
            <Icon as={X} size={18} className="text-muted-foreground/60" />
          </TouchableOpacity>
        </View>
      )}

      <View className="flex-1">
        {isLoading ? (
          <View className="flex-1 px-4 py-6">
            <View className="flex-1 space-y-6">
              {[1, 2, 3, 4, 5].map((i) => (
                <SkeletonItem key={i} index={i} />
              ))}
            </View>
            <View className="absolute inset-0 items-center justify-center">
              <StatusIndicator />
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

        <KeyboardStickyView offset={{ closed: -insets.bottom, opened: 0 }}>
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
        </KeyboardStickyView>
      </View>

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
            <AlertDialogCancel>
              <Text className="text-muted-foreground">Vazgeç</Text>
            </AlertDialogCancel>
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
    </View>
  );
};
