import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import { FilesList } from '@/features/files/components/FilesList';
import { SearchBar } from '@/features/files/components/SearchBar';
import { UploadFile } from '@/features/files/components/UploadFile';
import { useDeleteFile, useFiles, useSaveFile } from '@/features/files/hooks';
import { useFeatureLimit } from '@/features/usage';
import { errorEventBus } from '@/lib/error-handling/ErrorEventBus';
import { cn } from '@/lib/utils';
import { useRouter } from 'expo-router';
import { AlertCircle, Upload } from 'lucide-react-native';
import React, { useMemo, useState } from 'react';
import { ActivityIndicator, Alert, ScrollView, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function FilesScreen() {
  const { data: files, isLoading, error, refetch } = useFiles();
  const { mutate: deleteFile } = useDeleteFile();
  const { mutate: saveFile } = useSaveFile();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'images' | 'documents' | 'youtube'>('all');
  const [savingFileId, setSavingFileId] = useState<string | null>(null);
  const router = useRouter();
  const fileUploadLimit = useFeatureLimit('file_upload');

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
      if (filterType === 'images') return matchesSearch && f.file_type === 'image';
      if (filterType === 'documents') return matchesSearch && f.file_type === 'pdf';
      if (filterType === 'youtube') return matchesSearch && f.file_type === 'youtube';
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

  const handleSaveFile = (fileId: string) => {
    setSavingFileId(fileId);
    saveFile(fileId, {
      onSettled: () => {
        setSavingFileId((current) => (current === fileId ? null : current));
      },
    });
  };

  const hasTemporaryImages = useMemo(() => {
    return files?.some((f) => isImage(f.title) && !f.is_saved) ?? false;
  }, [files]);

  return (
    <SafeAreaView className="flex-1 bg-background px-4" edges={['top', 'left', 'right']}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <SearchBar value={searchQuery} onChangeText={setSearchQuery} />

        <View className="mb-6 flex-row gap-2">
          {[
            { id: 'all', label: 'Tümü' },
            { id: 'images', label: 'Resimler' },
            { id: 'documents', label: 'Belgeler' },
            { id: 'youtube', label: 'Videolar' },
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

        {hasTemporaryImages && (
          <View className="mb-4 flex-row items-center gap-3 rounded-2xl border border-amber-500/20 bg-amber-500/5 p-4">
            <View className="rounded-full bg-amber-500/10 p-2">
              <Icon as={AlertCircle} size={20} className="text-amber-600" />
            </View>
            <View className="flex-1">
              <Text className="text-[13px] font-semibold text-amber-900">Önemli Hatırlatma</Text>
              <Text className="text-xs text-amber-700/80">
                Geçici resim dosyaları 7 gün sonra silinir. Kalıcı hale getirmek için kaydedin.
              </Text>
            </View>
          </View>
        )}

        {!searchQuery.trim() && filterType === 'all' && (
          <View className="mb-4">
            {fileUploadLimit.isAtLimit ? (
              <TouchableOpacity
                onPress={() => errorEventBus.emit('SHOW_UPGRADE_MODAL', { feature: 'file_upload' })}
                className="items-center justify-center rounded-2xl border border-dashed border-border bg-muted/30 py-8"
                activeOpacity={0.7}
              >
                <Icon as={Upload} size={28} className="mb-2 text-muted-foreground" />
                <Text className="text-sm text-muted-foreground">Dosya yükleme limitine ulaştınız</Text>
              </TouchableOpacity>
            ) : (
              <UploadFile />
            )}
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
            onSaveFile={handleSaveFile}
            savingFileId={savingFileId}
          />
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
