import { Text } from '@/components/ui/text';
import React, { useState } from 'react';
import { ScrollView, View } from 'react-native';
import { File } from '../types';
import { FileCard } from './FileCard';
import { ImagePreviewModal } from './ImagePreviewModal';

interface FilesListProps {
  files: File[];
  onChatStart: (fileId: string) => void;
  onDeleteFile?: (fileId: string) => void;
  onSaveFile?: (fileId: string) => void;
  savingFileId?: string | null;
}

export const FilesList: React.FC<FilesListProps> = ({
  files,
  onChatStart,
  onDeleteFile,
  onSaveFile,
  savingFileId,
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

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
            onChatStart={onChatStart}
            onDelete={onDeleteFile}
            onSave={onSaveFile}
            isSaving={savingFileId === file.id}
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
    </>
  );
};
