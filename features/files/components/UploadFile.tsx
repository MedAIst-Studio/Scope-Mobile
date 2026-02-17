import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import * as DocumentPicker from 'expo-document-picker';
import { CloudUpload, Upload } from 'lucide-react-native';
import React, { useState } from 'react';
import { View } from 'react-native';
import { useSubscription } from '@/features/subscription/context/SubscriptionContext';
import { PremiumModal } from '@/features/subscription/components/PremiumModal';
import { useUploadFile } from '../hooks';

export const UploadFile: React.FC = () => {
  const { mutate: uploadFile, isPending: isUploading } = useUploadFile();
  const [isPremiumModalVisible, setIsPremiumModalVisible] = useState(false);
  const { isFeatureLocked, incrementFileUsage } = useSubscription();

  const handleFileUpload = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ['application/pdf', 'image/*'],
        copyToCacheDirectory: true,
      });

      if (result.canceled) return;

      const file = result.assets[0];

      if (isFeatureLocked('fileUploads')) {
        setIsPremiumModalVisible(true);
        return;
      }

      uploadFile({
        file_title: file.name,
        file_data: {
          uri: file.uri,
          name: file.name,
          type:
            file.mimeType ||
            (file.name.toLowerCase().endsWith('.pdf') ? 'application/pdf' : 'image/jpeg'),
        },
      }, {
        onSuccess: () => {
          incrementFileUsage();
        }
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
          <Icon as={CloudUpload} size={40} className="text-primary" />
        )}
      </View>

      <View className="mb-6 items-center">
        <Text className="mb-1 text-xl font-bold text-foreground">Yeni Dosya Yükle</Text>
        <Text className="px-4 text-center text-sm text-muted-foreground/60">
          Sohbetlerde analiz için döküman veya görsel ekleyin
        </Text>
      </View>

      <Button
        onPress={handleFileUpload}
        disabled={isUploading}
        size="lg"
        className="w-full shadow-lg shadow-primary/20">
        <Icon as={Upload} size={20} className="text-primary-foreground" />
        <Text className="font-bold text-primary-foreground">
          {isUploading ? 'Yükleniyor...' : 'Dosya Seç'}
        </Text>
      </Button>

      <Text className="mt-4 text-[10px] font-bold uppercase tracking-widest text-muted-foreground/40">
        PDF, FOTOĞRAF • MAKSİMUM 10MB
      </Text>

      <PremiumModal
        isVisible={isPremiumModalVisible}
        onClose={() => setIsPremiumModalVisible(false)}
        title="Dosya Sınırına Ulaştınız"
        description="Ücretsiz planda günlük 5 dosya yükleme hakkınız bulunmaktadır. Sınırsız yükleme için Paket Yükseltin."
      />
    </View>
  );
};
