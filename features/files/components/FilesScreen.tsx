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
      <View className="flex-1 px-4">
        <SearchBar value={searchQuery} onChangeText={setSearchQuery} />

        {!searchQuery.trim() && <UploadFile onFileUpload={simulateFileUpload} />}
        <FilesList files={files} onChatStart={handleChatStart} onDeleteFile={handleDeleteFile} />
      </View>
    </SafeAreaView>
  );
};
