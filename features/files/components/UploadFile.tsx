import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import * as DocumentPicker from 'expo-document-picker';
import React from 'react';
import { View } from 'react-native';
import { ArrowUpTrayIcon, CloudArrowUpIcon } from 'react-native-heroicons/solid';
import { useUploadFile } from '../hooks';

export const UploadFile: React.FC = () => {
  const { mutate: uploadFile, isPending: isUploading } = useUploadFile();

  const handleFileUpload = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: 'application/pdf',
        copyToCacheDirectory: true,
      });

      if (result.canceled) return;

      const file = result.assets[0];

      uploadFile({
        file_title: file.name,
        file_data: {
          uri: file.uri,
          name: file.name,
          type: file.mimeType || 'application/pdf',
        },
      });
    } catch (error) {
      console.error('File pick error', error);
    }
  };

  return (
    <View className="mb-6 items-center justify-center rounded-[2rem] border-2 border-dashed border-border/40 bg-card/50 p-6">
      <View className="mb-4 h-20 w-20 items-center justify-center rounded-3xl bg-primary/10">
        {isUploading ? (
          <View className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        ) : (
          <CloudArrowUpIcon size={40} className="text-primary" />
        )}
      </View>

      <View className="mb-6 items-center">
        <Text className="mb-1 text-xl font-bold text-foreground">Yeni PDF Yükle</Text>
        <Text className="text-sm text-muted-foreground/60">
          Tıbbi analiz için dosyanızı ekleyin
        </Text>
      </View>

      <Button
        onPress={handleFileUpload}
        disabled={isUploading}
        size="lg"
        className="w-full shadow-lg shadow-primary/20">
        <Icon as={ArrowUpTrayIcon} size={20} className="text-primary-foreground" />
        <Text className="font-bold text-primary-foreground">
          {isUploading ? 'Yükleniyor...' : 'Dosya Seç'}
        </Text>
      </Button>

      <Text className="mt-4 text-[10px] font-bold uppercase tracking-widest text-muted-foreground/40">
        PDF • MAKSİMUM 10MB
      </Text>
    </View>
  );
};
