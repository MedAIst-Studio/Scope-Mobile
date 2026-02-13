import { Card } from '@/components/ui/card';
import { Icon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import { useFiles } from '@/features/files/hooks';
import { cn } from '@/lib/utils';
import { File, FileText, Image as ImageIcon, X } from 'lucide-react-native';
import React from 'react';
import { FlatList, Modal, TouchableOpacity, View } from 'react-native';

interface FileSelectorProps {
  isVisible: boolean;
  onClose: () => void;
  onSelect: (file: any) => void;
}

const getFileInfo = (fileName: string) => {
  const ext = fileName.toLowerCase().split('.').pop() || '';

  if (['pdf'].includes(ext)) {
    return {
      icon: FileText,
      bgColor: 'bg-red-500/10',
      iconColor: 'text-red-500',
      type: 'PDF',
    };
  }

  if (['jpg', 'jpeg', 'png', 'webp', 'heic'].includes(ext)) {
    return {
      icon: ImageIcon,
      bgColor: 'bg-blue-500/10',
      iconColor: 'text-blue-500',
      type: 'GÖRSEL',
    };
  }

  return {
    icon: File,
    bgColor: 'bg-zinc-500/10',
    iconColor: 'text-zinc-500',
    type: 'DOSYA',
  };
};

export const FileSelector: React.FC<FileSelectorProps> = ({ isVisible, onClose, onSelect }) => {
  const { data: files = [], isLoading } = useFiles();

  const isSupported = (fileName: string) => {
    const ext = fileName.toLowerCase().split('.').pop() || '';
    return ['pdf', 'jpg', 'jpeg', 'png', 'webp', 'heic'].includes(ext);
  };

  const selectableFiles = files.filter((f) => isSupported(f.title));

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
                Sohbet etmek için bir döküman veya görsel seçin
              </Text>
            </View>
            <TouchableOpacity
              onPress={onClose}
              className="h-10 w-10 items-center justify-center rounded-full bg-secondary">
              <Icon as={X} size={20} className="text-foreground" />
            </TouchableOpacity>
          </View>

          {isLoading ? (
            <View className="flex-1 items-center justify-center">
              <Text className="animate-pulse text-muted-foreground">Yükleniyor...</Text>
            </View>
          ) : (
            <FlatList
              data={selectableFiles}
              keyExtractor={(item) => item.id}
              showsVerticalScrollIndicator={false}
              renderItem={({ item }) => {
                const { icon, bgColor, iconColor, type } = getFileInfo(item.title);
                return (
                  <TouchableOpacity
                    onPress={() => handleSelect(item)}
                    className="mb-3"
                    activeOpacity={0.7}>
                    <Card className="flex-row items-center border-border/40 p-4">
                      <View
                        className={cn(
                          'mr-4 h-12 w-12 items-center justify-center rounded-2xl',
                          bgColor
                        )}>
                        <Icon as={icon} size={24} className={iconColor} />
                      </View>
                      <View className="flex-1">
                        <Text className="text-base font-bold text-foreground" numberOfLines={1}>
                          {item.title}
                        </Text>
                        <View className="mt-1 flex-row items-center gap-2">
                          <Text className="text-[10px] font-bold text-muted-foreground/60">
                            {type}
                          </Text>
                          <View className="h-1 w-1 rounded-full bg-muted-foreground/30" />
                          <Text className="text-xs text-muted-foreground">
                            {new Date(item.created_at).toLocaleDateString()}
                          </Text>
                        </View>
                      </View>
                    </Card>
                  </TouchableOpacity>
                );
              }}
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
