import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Text } from '@/components/ui/text';
import React, { useEffect, useState } from 'react';
import {
  Keyboard,
  KeyboardAvoidingView,
  Modal,
  Platform,
  TouchableWithoutFeedback,
  View,
} from 'react-native';

interface RenameModalProps {
  isVisible: boolean;
  onClose: () => void;
  onRename: (newTitle: string) => void;
  initialTitle: string;
}

export const RenameModal: React.FC<RenameModalProps> = ({
  isVisible,
  onClose,
  onRename,
  initialTitle,
}) => {
  const [title, setTitle] = useState(initialTitle);

  useEffect(() => {
    if (isVisible) {
      setTitle(initialTitle);
    }
  }, [isVisible, initialTitle]);

  const handleRename = () => {
    if (title.trim()) {
      onRename(title.trim());
      onClose();
    }
  };

  return (
    <Modal visible={isVisible} transparent animationType="fade" onRequestClose={onClose}>
      <TouchableWithoutFeedback onPress={onClose}>
        <View className="flex-1 items-center justify-center bg-black/60 px-6">
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <KeyboardAvoidingView
              behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
              className="w-full">
              <View className="w-full rounded-3xl border border-border/20 bg-background p-6 shadow-2xl">
                <Text className="mb-4 text-xl font-bold text-foreground">
                  Sohbeti Yeniden Adlandır
                </Text>

                <Input
                  value={title}
                  onChangeText={setTitle}
                  placeholder="Sohbet başlığı..."
                  autoFocus
                  className="mb-6"
                />

                <View className="flex-row gap-3">
                  <Button variant="ghost" className="flex-1" onPress={onClose}>
                    <Text className="font-semibold text-muted-foreground">İptal</Text>
                  </Button>
                  <Button className="flex-1" onPress={handleRename}>
                    <Text className="font-semibold text-primary-foreground">Kaydet</Text>
                  </Button>
                </View>
              </View>
            </KeyboardAvoidingView>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};
