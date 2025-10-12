import { Text } from '@/components/ui/text';
import React from 'react';
import { View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFiles } from '../hooks/useFiles';
import { FilesList } from './FilesList';
import { SearchBar } from './SearchBar';
import { UploadFile } from './UploadFile';

export const FilesScreen: React.FC = () => {
  const {
    files,
    searchQuery,
    setSearchQuery,
    handleChatStart,
    handleDeleteFile,
    simulateFileUpload,
  } = useFiles();

  return (
    <SafeAreaView className="flex-1 bg-background" edges={['top', 'left', 'right']}>
      {/* Header */}
      <View className="border-b border-border bg-background px-4 py-4">
        <Text className="text-2xl font-bold text-foreground">PDF Chat</Text>
        <Text className="text-sm text-muted-foreground">
          Dosyalarınızı yükleyin ve AI ile sohbet edin
        </Text>
      </View>

      <View className="flex-1 px-4 pt-4">
        {/* Search Bar */}
        <SearchBar value={searchQuery} onChangeText={setSearchQuery} />

        {/* Upload Section - Hide when searching */}
        {!searchQuery.trim() && <UploadFile onFileUpload={simulateFileUpload} />}

        {/* Files List */}
        <FilesList files={files} onChatStart={handleChatStart} onDeleteFile={handleDeleteFile} />
      </View>
    </SafeAreaView>
  );
};
