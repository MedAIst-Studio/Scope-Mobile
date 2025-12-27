import { Icon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import React, { useState } from 'react';
import { Modal, ScrollView, TouchableOpacity, View } from 'react-native';
import { DocumentTextIcon, XMarkIcon } from 'react-native-heroicons/outline';
import { useFiles } from '../../files/hooks';

interface FileSelectorProps {
  selectedFileId?: string;
  onSelect: (fileId: string) => void;
  error?: string;
}

export const FileSelector: React.FC<FileSelectorProps> = ({ selectedFileId, onSelect, error }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const { data: files = [], isLoading } = useFiles();

  const selectedFile = files.find((f) => f.id === selectedFileId);

  return (
    <View className="mb-4">
      <Text className="mb-2 text-sm font-medium text-foreground">Kaynak Dosya</Text>

      <TouchableOpacity
        onPress={() => setModalVisible(true)}
        className={`flex-row items-center justify-between rounded-lg border bg-card p-3 ${
          error ? 'border-destructive' : 'border-border'
        }`}>
        {selectedFile ? (
          <View className="flex-row items-center gap-2">
            <Icon as={DocumentTextIcon} size={20} className="text-primary" />
            <Text className="text-foreground">{selectedFile.title}</Text>
          </View>
        ) : (
          <Text className="text-muted-foreground">Dosya Seçin</Text>
        )}
      </TouchableOpacity>

      {error && <Text className="mt-1 text-sm text-destructive">{error}</Text>}

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}>
        <View className="flex-1 justify-end bg-black/50">
          <View className="h-2/3 rounded-t-3xl bg-background">
            <View className="flex-row items-center justify-between border-b border-border p-4">
              <Text className="text-lg font-bold text-foreground">Dosya Seçin</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Icon as={XMarkIcon} size={24} className="text-muted-foreground" />
              </TouchableOpacity>
            </View>

            <ScrollView className="flex-1 p-4">
              {isLoading ? (
                <Text className="text-center text-muted-foreground">Yükleniyor...</Text>
              ) : files.length === 0 ? (
                <Text className="text-center text-muted-foreground">Hiç dosya bulunamadı.</Text>
              ) : (
                files.map((file) => (
                  <TouchableOpacity
                    key={file.id}
                    onPress={() => {
                      onSelect(file.id);
                      setModalVisible(false);
                    }}
                    className={`mb-3 flex-row items-center gap-3 rounded-xl border p-4 ${
                      file.id === selectedFileId
                        ? 'border-primary bg-primary/10'
                        : 'border-border bg-card'
                    }`}>
                    <Icon
                      as={DocumentTextIcon}
                      size={24}
                      className={
                        file.id === selectedFileId ? 'text-primary' : 'text-muted-foreground'
                      }
                    />
                    <View className="flex-1">
                      <Text className="font-medium text-foreground">{file.title}</Text>
                      <Text className="text-xs text-muted-foreground">
                        {new Date(file.created_at).toLocaleDateString()}
                      </Text>
                    </View>
                  </TouchableOpacity>
                ))
              )}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
};
