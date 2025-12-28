import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { FilesList } from '@/features/files/components/FilesList';
import { SearchBar } from '@/features/files/components/SearchBar';
import { UploadFile } from '@/features/files/components/UploadFile';
import { useDeleteFile, useFiles } from '@/features/files/hooks';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { ActivityIndicator, Alert, ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function FilesScreen() {
  const { data: files, isLoading, error, refetch } = useFiles();
  const { mutate: deleteFile } = useDeleteFile();
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();

  const filteredFiles =
    files?.filter((f) => f.title.toLowerCase().includes(searchQuery.toLowerCase())) || [];

  const handleChatStart = (fileId: string) => {
    // Navigate to chat with context of this file
    router.push({
      pathname: '/(tabs)/chat',
      params: { fileId },
    });
  };

  const handleDeleteFile = (fileId: string) => {
    Alert.alert('Dosyayı Sil', 'Bu dosyayı silmek istediğinizden emin misiniz?', [
      { text: 'İptal', style: 'cancel' },
      { text: 'Sil', style: 'destructive', onPress: () => deleteFile(fileId) },
    ]);
  };

  return (
    <SafeAreaView className="flex-1 bg-background px-4" edges={['top', 'left', 'right']}>
      <ScrollView>
        <SearchBar value={searchQuery} onChangeText={setSearchQuery} />

        <View className="mb-4">
          <UploadFile />
        </View>

        {isLoading ? (
          <View className="flex-1 items-center justify-center">
            <ActivityIndicator size="large" />
          </View>
        ) : error ? (
          <View className="flex-1 items-center justify-center">
            <Text className="mb-4 text-center text-red-500">Dosyalar yüklenirken hata oluştu.</Text>
            <Button onPress={() => refetch()} variant="outline">
              <Text>Tekrar Dene</Text>
            </Button>
          </View>
        ) : (
          <FilesList
            files={filteredFiles}
            onChatStart={handleChatStart}
            onDeleteFile={handleDeleteFile}
          />
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
