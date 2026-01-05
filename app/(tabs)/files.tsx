import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { FilesList } from '@/features/files/components/FilesList';
import { SearchBar } from '@/features/files/components/SearchBar';
import { UploadFile } from '@/features/files/components/UploadFile';
import { useDeleteFile, useFiles } from '@/features/files/hooks';
import { cn } from '@/lib/utils';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { ActivityIndicator, Alert, ScrollView, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function FilesScreen() {
  const { data: files, isLoading, error, refetch } = useFiles();
  const { mutate: deleteFile } = useDeleteFile();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'images' | 'documents'>('all');
  const router = useRouter();

  const isImage = (fileName: string) => {
    const ext = fileName.toLowerCase().split('.').pop();
    return ['jpg', 'jpeg', 'png', 'webp', 'heic'].includes(ext || '');
  };

  const isDocument = (fileName: string) => {
    const ext = fileName.toLowerCase().split('.').pop();
    return ['pdf', 'docx', 'doc', 'txt', 'pptx'].includes(ext || '');
  };

  const filteredFiles =
    files?.filter((f) => {
      const matchesSearch = f.title.toLowerCase().includes(searchQuery.toLowerCase());
      if (filterType === 'images') return matchesSearch && isImage(f.title);
      if (filterType === 'documents') return matchesSearch && isDocument(f.title);
      return matchesSearch;
    }) || [];

  const handleChatStart = (file: { id: string; title: string }) => {
    router.push({
      pathname: '/(tabs)/chat',
      params: {
        file_id: file.id,
        fileName: file.title,
      },
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
      <ScrollView showsVerticalScrollIndicator={false}>
        <SearchBar value={searchQuery} onChangeText={setSearchQuery} />

        <View className="mb-6 flex-row gap-2">
          {[
            { id: 'all', label: 'Tümü' },
            { id: 'images', label: 'Resimler' },
            { id: 'documents', label: 'Belgeler' },
          ].map((tab) => (
            <TouchableOpacity
              key={tab.id}
              onPress={() => setFilterType(tab.id as any)}
              className={cn(
                'rounded-full border px-5 py-2.5',
                filterType === tab.id
                  ? 'border-primary bg-primary'
                  : 'border-border/40 bg-secondary/50'
              )}>
              <Text
                className={cn(
                  'text-xs font-bold uppercase tracking-wider',
                  filterType === tab.id ? 'text-primary-foreground' : 'text-muted-foreground'
                )}>
                {tab.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {!searchQuery.trim() && filterType === 'all' && (
          <View className="mb-4">
            <UploadFile />
          </View>
        )}

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
            onChatStart={(id) => {
              const file = files?.find((f) => f.id === id);
              if (file) handleChatStart(file);
            }}
            onDeleteFile={handleDeleteFile}
          />
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
