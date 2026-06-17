import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import { Edit2, Save, X } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import { KeyboardAvoidingView, Modal, Platform, ScrollView, TextInput, TouchableOpacity, View } from 'react-native';
import { useUpdateNotes } from '../hooks';
import { MathMarkdownRenderer } from '@/features/chat/components/MathMarkdownRenderer';
import { useColorScheme } from 'nativewind';

interface NotesViewerModalProps {
  isVisible: boolean;
  onClose: () => void;
  fileId: string;
  initialText: string;
  title: string;
  onNotesUpdated?: (newText: string) => void;
}

export const NotesViewerModal: React.FC<NotesViewerModalProps> = ({
  isVisible,
  onClose,
  fileId,
  initialText,
  title,
  onNotesUpdated,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [text, setText] = useState(initialText);
  const { mutate: updateNotes, isPending } = useUpdateNotes();
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';

  useEffect(() => {
    if (isVisible) {
      setText(initialText);
      setIsEditing(false);
    }
  }, [isVisible, initialText]);

  const handleSave = () => {
    updateNotes(
      { fileId, text },
      {
        onSuccess: () => {
          setIsEditing(false);
          if (onNotesUpdated) {
            onNotesUpdated(text);
          }
        },
      }
    );
  };

  return (
    <Modal visible={isVisible} transparent animationType="slide" onRequestClose={onClose}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1 bg-background">
        <View className="flex-row items-center justify-between border-b border-border/40 bg-card px-4 pb-4 pt-12">
          <Text className="flex-1 text-lg font-bold text-foreground" numberOfLines={1}>
            {title} Notları
          </Text>
          <View className="flex-row items-center gap-2">
            {isEditing ? (
              <Button size="sm" onPress={handleSave} disabled={isPending} className="flex-row items-center gap-1">
                <Icon as={Save} size={16} className="text-primary-foreground" />
                <Text className="text-xs font-bold text-primary-foreground">
                  {isPending ? 'Kaydediliyor...' : 'Kaydet'}
                </Text>
              </Button>
            ) : (
              <Button size="sm" variant="outline" onPress={() => setIsEditing(true)} className="flex-row items-center gap-1">
                <Icon as={Edit2} size={16} className="text-foreground" />
                <Text className="text-xs font-bold text-foreground">Düzenle</Text>
              </Button>
            )}
            <TouchableOpacity onPress={onClose} className="ml-2 rounded-full bg-secondary p-2">
              <Icon as={X} size={20} className="text-foreground" />
            </TouchableOpacity>
          </View>
        </View>

        {isEditing ? (
          <TextInput
            value={text}
            onChangeText={setText}
            multiline
            autoFocus
            textAlignVertical="top"
            className="flex-1 p-4 text-base text-foreground"
            placeholder="Notlarınızı buraya yazın..."
            placeholderTextColor="#9ca3af"
          />
        ) : (
          <ScrollView className="flex-1 p-4">
            {text ? (
              <View className="pb-8">
                <MathMarkdownRenderer content={text} isUser={false} isDark={isDark} />
              </View>
            ) : (
              <Text className="pb-8 text-base leading-relaxed text-foreground">
                Henüz not bulunmuyor.
              </Text>
            )}
          </ScrollView>
        )}
      </KeyboardAvoidingView>
    </Modal>
  );
};
