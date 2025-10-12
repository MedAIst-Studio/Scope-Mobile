import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { Plus, Upload } from 'lucide-react-native';
import React, { useState } from 'react';
import { Alert, View } from 'react-native';

interface UploadFileProps {
  onFileUpload: (fileName: string, fileSize: string) => void;
}

export const UploadFile: React.FC<UploadFileProps> = ({ onFileUpload }) => {
  const [isUploading, setIsUploading] = useState(false);

  const handleFileUpload = () => {
    if (isUploading) return;

    // Simulate file picker
    Alert.alert('Dosya Seç', 'Hangi dosya türünü yüklemek istiyorsunuz?', [
      {
        text: 'PDF Dokümanı',
        onPress: () => simulateUpload('Yeni-Dokuman.pdf', '3.2 MB'),
      },
      {
        text: 'Tıbbi Rapor',
        onPress: () => simulateUpload('Tibbi-Rapor-2024.pdf', '1.8 MB'),
      },
      { text: 'İptal', style: 'cancel' },
    ]);
  };

  const simulateUpload = (fileName: string, fileSize: string) => {
    setIsUploading(true);

    // Simulate upload delay
    setTimeout(() => {
      onFileUpload(fileName, fileSize);
      setIsUploading(false);
    }, 1000);
  };

  return (
    <View className="mb-2 rounded-xl border border-dashed border-muted-foreground/30 bg-muted p-4">
      <View className="flex-row items-center gap-3">
        <View className="h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
          {isUploading ? (
            <View className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          ) : (
            <Upload size={20} color="#3B82F6" />
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
                <Plus size={14} color="white" />
                <Text className="text-xs font-medium text-primary-foreground">Ekle</Text>
              </>
            )}
          </View>
        </Button>
      </View>
    </View>
  );
};
