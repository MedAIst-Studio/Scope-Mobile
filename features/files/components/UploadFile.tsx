import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import * as DocumentPicker from 'expo-document-picker';
import React from 'react';
import { View } from 'react-native';
import { ArrowUpTrayIcon, PlusIcon } from 'react-native-heroicons/outline';
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
    <View className="mb-2 rounded-xl border border-dashed border-muted-foreground/30 bg-muted p-4">
      <View className="flex-row items-center gap-3">
        <View className="h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
          {isUploading ? (
            <View className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          ) : (
            <ArrowUpTrayIcon size={20} color="#3B82F6" />
          )}
        </View>

        <View className="flex-1">
          <Text className="font-medium text-foreground">Yeni PDF Yükle</Text>
          <Text className="text-xs text-muted-foreground">PDF • Maks 10MB</Text>
        </View>

        <Button
          onPress={handleFileUpload}
          disabled={isUploading}
          size="sm"
          className="rounded-full">
          <View className="flex-row items-center gap-1">
            {isUploading ? (
              <>
                <View className="h-3 w-3 animate-spin rounded-full border border-primary-foreground border-t-transparent" />
                <Text className="text-xs font-medium text-primary-foreground">Yükleniyor</Text>
              </>
            ) : (
              <>
                <PlusIcon size={14} color="white" />
                <Text className="text-xs font-medium text-primary-foreground">Ekle</Text>
              </>
            )}
          </View>
        </Button>
      </View>
    </View>
  );
};
