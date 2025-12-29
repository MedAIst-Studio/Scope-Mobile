import { Icon } from '@/components/ui/icon';
import { cn } from '@/lib/utils';
import { useNavigation } from 'expo-router';
import React, { useLayoutEffect } from 'react';
import { Alert, KeyboardAvoidingView, Platform, Text, TouchableOpacity, View } from 'react-native';
import { EllipsisHorizontalIcon } from 'react-native-heroicons/outline';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useChat } from '../hooks/useChat';

import { ChatInput } from './ChatInput';
import { ChatMessageList } from './ChatMessageList';
import { FileSelector } from './FileSelector';

export const ChatScreen: React.FC = () => {
  const navigation = useNavigation();
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
  } = useChat();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: 'Sohbet',
      headerRight: () => (
        <View className="flex-row gap-2 pr-2">
          <TouchableOpacity className="p-2">
            <Icon as={EllipsisHorizontalIcon} size={24} className="text-foreground" />
          </TouchableOpacity>
        </View>
      ),
    });
  }, [navigation]);

  const handleAttachAction = () => {
    Alert.alert('Eklenti Ekle', 'Lütfen eklemek istediğiniz dosya türünü seçin', [
      {
        text: 'Fotoğraf Kitaplığı',
        onPress: pickImage,
      },
      {
        text: 'Dosyalarım',
        onPress: () => setIsFileSelectorVisible(true),
      },
      {
        text: 'Vazgeç',
        style: 'cancel',
      },
    ]);
  };

  return (
    <SafeAreaView className="flex-1 bg-background" edges={['left', 'right', 'bottom']}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 90}>
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
                  Sohbet yükleniyor...
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
          onAttachPress={handleAttachAction}
          onRemoveAttachment={removeAttachment}
        />

        <FileSelector
          isVisible={isFileSelectorVisible}
          onClose={() => setIsFileSelectorVisible(false)}
          onSelect={handleFileSelect}
        />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};
