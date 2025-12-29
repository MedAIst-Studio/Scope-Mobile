import { Card } from '@/components/ui/card';
import { Icon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import { useFiles } from '@/features/files/hooks';
import React, { useEffect } from 'react';
import { FlatList, Modal, TouchableOpacity, View } from 'react-native';
import { DocumentIcon, XMarkIcon } from 'react-native-heroicons/solid';

interface FileSelectorProps {
  isVisible: boolean;
  onClose: () => void;
  onSelect: (file: any) => void;
}

export const FileSelector: React.FC<FileSelectorProps> = ({ isVisible, onClose, onSelect }) => {
  const { data: files = [], isLoading } = useFiles();

  useEffect(() => {
    console.log('Number of files:', files.length);
  }, [files]);

  const handleSelect = (item: any) => {
    onSelect(item);
  };

  return (
    <Modal visible={isVisible} animationType="slide" transparent={true}>
      <View className="flex-1 justify-end bg-black/40">
        <View className="h-[70%] w-full rounded-t-[2.5rem] bg-background p-6 shadow-2xl">
          <View className="mb-6 flex-row items-center justify-between">
            <View>
              <Text className="text-xl font-bold text-foreground">Dosyalarım</Text>
              <Text className="text-sm text-muted-foreground">
                Sohbet etmek istediğiniz dosyayı seçin
              </Text>
            </View>
            <TouchableOpacity
              onPress={onClose}
              className="h-10 w-10 items-center justify-center rounded-full bg-secondary">
              <Icon as={XMarkIcon} size={20} className="text-foreground" />
            </TouchableOpacity>
          </View>

          {isLoading ? (
            <View className="flex-1 items-center justify-center">
              <Text className="animate-pulse text-muted-foreground">Yükleniyor...</Text>
            </View>
          ) : (
            <FlatList
              data={files}
              keyExtractor={(item) => item.id}
              showsVerticalScrollIndicator={false}
              renderItem={({ item }) => (
                <TouchableOpacity
                  onPress={() => handleSelect(item)}
                  className="mb-3"
                  activeOpacity={0.7}>
                  <Card className="flex-row items-center border-border/40 p-4">
                    <View className="mr-4 h-12 w-12 items-center justify-center rounded-2xl bg-primary/10">
                      <Icon as={DocumentIcon} size={24} className="text-primary" />
                    </View>
                    <View className="flex-1">
                      <Text className="text-base font-bold text-foreground" numberOfLines={1}>
                        {item.title}
                      </Text>
                      <View className="mt-1 flex-row items-center gap-2">
                        <Text className="text-xs text-muted-foreground">PDF</Text>
                        <View className="h-1 w-1 rounded-full bg-muted-foreground/30" />
                        <Text className="text-xs text-muted-foreground">
                          {new Date(item.created_at).toLocaleDateString()}
                        </Text>
                      </View>
                    </View>
                  </Card>
                </TouchableOpacity>
              )}
              ListEmptyComponent={
                <View className="mt-10 items-center justify-center">
                  <Text className="text-muted-foreground">Herhangi bir dosya bulunamadı.</Text>
                </View>
              }
            />
          )}
        </View>
      </View>
    </Modal>
  );
};
