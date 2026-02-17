import { Text } from '@/components/ui/text';
import React, { useState } from 'react';
import { ScrollView, View } from 'react-native';
import { useSubscription } from '@/features/subscription/context/SubscriptionContext';
import { PremiumModal } from '@/features/subscription/components/PremiumModal';
import { File } from '../types';
import { FileCard } from './FileCard';
import { ImagePreviewModal } from './ImagePreviewModal';

interface FilesListProps {
  files: File[];
  onChatStart: (fileId: string) => void;
  onDeleteFile?: (fileId: string) => void;
}

export const FilesList: React.FC<FilesListProps> = ({ files, onChatStart, onDeleteFile }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isPremiumModalVisible, setIsPremiumModalVisible] = useState(false);
  const { isFeatureLocked } = useSubscription();

  const handleChatStart = (fileId: string) => {
    // In this mock, we limit based on total file count if they try to interact? 
    // Or maybe we limit the upload. Let's limit the chat start as well as a fallback.
    onChatStart(fileId);
  };

  if (files.length === 0) {
    return (
      <View className="flex-1 items-center justify-center py-12">
        <Text className="text-center text-lg font-medium text-muted-foreground">
          Henüz dokümanınız yok
        </Text>
        <Text className="mt-2 text-center text-sm text-muted-foreground">
          İlk dosyanızı yükleyerek başlayın
        </Text>
      </View>
    );
  }

  return (
    <>
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 20 }}
        showsVerticalScrollIndicator={false}>
        {files.map((file) => (
          <FileCard
            key={file.id}
            file={file}
            onChatStart={handleChatStart}
            onDelete={onDeleteFile}
            onPreview={setSelectedFile}
          />
        ))}
      </ScrollView>

      <ImagePreviewModal
        isVisible={!!selectedFile}
        onClose={() => setSelectedFile(null)}
        imageUrl={selectedFile?.url}
        title={selectedFile?.title || ''}
        size={selectedFile?.size}
      />

      <PremiumModal
        isVisible={isPremiumModalVisible}
        onClose={() => setIsPremiumModalVisible(false)}
        title="Dosya Sınırına Ulaştınız"
        description="Ücretsiz planda günlük 5 dosya yükleme hakkınız bulunmaktadır. Sınırsız yükleme için Paket Yükseltin."
      />
    </>
  );
};
