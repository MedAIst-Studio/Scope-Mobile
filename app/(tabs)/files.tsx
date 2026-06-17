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
import { AlertCircle, FileText, Upload } from 'lucide-react-native';
import React, { useMemo, useState } from 'react';
import { ActivityIndicator, Alert, ScrollView, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function FilesScreen() {
  const { data: files, isLoading, error, refetch } = useFiles();
  const { mutate: deleteFile } = useDeleteFile();
  const { mutate: saveFile } = useSaveFile();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'images' | 'documents' | 'youtube' | 'audio'>('all');
  const [savingFileId, setSavingFileId] = useState<string | null>(null);
  const router = useRouter();
  const fileUploadLimit = useFeatureLimit('file_upload');
  const [activeTab, setActiveTab] = useState<'files' | 'upload'>('files');

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
      if (filterType === 'audio') return matchesSearch && f.file_type === 'audio';
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
        {/* Header */}
        <View className="mb-6 mt-8 flex-row items-center justify-between">
          <View>
            <Text className="text-3xl font-bold tracking-tight text-foreground">
              Kütüphanem
            </Text>
            <Text className="text-xs font-semibold text-muted-foreground/60">
              Tüm döküman, ses ve videoların
            </Text>
          </View>
        </View>

        {/* Segmented Tabs */}
        <View className="mb-6 flex-row rounded-2xl bg-secondary/50 p-1">
          <TouchableOpacity
            onPress={() => setActiveTab('files')}
            activeOpacity={0.8}
            className={cn(
              'flex-1 flex-row items-center justify-center gap-2 rounded-xl py-3',
              activeTab === 'files' ? 'bg-card' : ''
            )}>
            <Icon
              as={FileText}
              size={18}
              className={activeTab === 'files' ? 'text-primary' : 'text-muted-foreground'}
            />
            <Text
              className={cn(
                'text-sm font-semibold',
                activeTab === 'files' ? 'text-foreground' : 'text-muted-foreground'
              )}>
              Dosyalarım
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setActiveTab('upload')}
            activeOpacity={0.8}
            className={cn(
              'flex-1 flex-row items-center justify-center gap-2 rounded-xl py-3',
              activeTab === 'upload' ? 'bg-card' : ''
            )}>
            <Icon
              as={Upload}
              size={18}
              className={activeTab === 'upload' ? 'text-primary' : 'text-muted-foreground'}
            />
            <Text
              className={cn(
                'text-sm font-semibold',
                activeTab === 'upload' ? 'text-foreground' : 'text-muted-foreground'
              )}>
              Yeni Yükle
            </Text>
          </TouchableOpacity>
        </View>

        {activeTab === 'files' ? (
          <>
            <SearchBar value={searchQuery} onChangeText={setSearchQuery} />

            <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-6 flex-row gap-2">
              {[
                { id: 'all', label: 'Tümü' },
                { id: 'images', label: 'Resimler' },
                { id: 'documents', label: 'Belgeler' },
                { id: 'youtube', label: 'Videolar' },
                { id: 'audio', label: 'Sesler' },
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
            </ScrollView>

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

            {isLoading ? (
              <View className="flex-1 items-center justify-center py-20">
                <ActivityIndicator size="large" />
              </View>
            ) : error ? (
              <View className="flex-1 items-center justify-center py-20">
                <Text className="mb-4 text-center text-red-500">Dosyalar yüklenirken hata oluştu.</Text>
                <Button onPress={() => refetch()} variant="outline">
                  <Text>Tekrar Dene</Text>
                </Button>
              </View>
            ) : filteredFiles.length === 0 ? (
              <View className="flex-1 items-center justify-center py-20 px-6 bg-card/30 rounded-3xl border border-dashed border-border/40">
                <Icon as={FileText} size={48} className="text-muted-foreground/30 mb-4" />
                <Text className="text-center text-lg font-bold text-foreground">
                  {searchQuery || filterType !== 'all' ? 'Sonuç Bulunamadı' : 'Henüz Dosyanız Yok'}
                </Text>
                <Text className="mt-2 text-center text-sm text-muted-foreground/60">
                  {searchQuery || filterType !== 'all'
                    ? 'Arama kriterlerinize uygun dosya bulunamadı.'
                    : 'İlk dosyanızı yükleyerek hemen başlayın.'}
                </Text>
                {!searchQuery && filterType === 'all' && (
                  <Button
                    onPress={() => setActiveTab('upload')}
                    className="mt-6"
                    size="default">
                    <Text className="font-bold text-primary-foreground">Dosya Yükle</Text>
                  </Button>
                )}
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
          </>
        ) : (
          <View className="flex-1">
            {fileUploadLimit.isAtLimit ? (
              <TouchableOpacity
                onPress={() => errorEventBus.emit('SHOW_UPGRADE_MODAL', { feature: 'file_upload' })}
                className="items-center justify-center rounded-[2rem] border border-dashed border-border bg-muted/30 py-12 px-6"
                activeOpacity={0.7}>
                <Icon as={Upload} size={40} className="mb-3 text-muted-foreground/60" />
                <Text className="text-lg font-bold text-foreground mb-1 text-center">
                  Dosya yükleme limitine ulaştınız
                </Text>
                <Text className="text-sm text-muted-foreground/60 text-center">
                  Daha fazla dosya yüklemek ve sınırlar olmadan çalışmak için planınızı yükseltin.
                </Text>
              </TouchableOpacity>
            ) : (
              <UploadFile />
            )}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
