import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { Input } from '@/components/ui/input';
import { Text } from '@/components/ui/text';
import { Link, Youtube } from 'lucide-react-native';
import React, { useState } from 'react';
import { View } from 'react-native';
import { useSubmitYouTubeLink } from '../hooks';

export const YouTubeInput: React.FC = () => {
  const [url, setUrl] = useState('');
  const { mutate: submitLink, isPending } = useSubmitYouTubeLink();

  const handleSubmit = () => {
    if (!url.trim()) return;
    submitLink(url, {
      onSuccess: () => {
        setUrl('');
      },
    });
  };

  return (
    <View className="mb-6 rounded-[2rem] border-2 border-border/40 bg-card/50 p-6">
      <View className="mb-4 flex-row items-center gap-3">
        <View className="h-12 w-12 items-center justify-center rounded-2xl bg-red-500/10">
          <Icon as={Youtube} size={24} className="text-red-500" />
        </View>
        <View>
          <Text className="text-lg font-bold text-foreground">YouTube Linki Ekle</Text>
          <Text className="text-xs text-muted-foreground/60">
            Videodan transkript çıkararak analiz et
          </Text>
        </View>
      </View>

      <View className="flex-row items-center gap-2">
        <View className="flex-1">
          <Input
            placeholder="https://youtube.com/watch?v=..."
            value={url}
            onChangeText={setUrl}
            editable={!isPending}
            className="bg-background/50"
          />
        </View>
        <Button
          onPress={handleSubmit}
          disabled={!url.trim() || isPending}
          size="icon"
          className="h-12 w-12 shadow-lg shadow-primary/20">
          {isPending ? (
            <View className="h-5 w-5 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
          ) : (
            <Icon as={Link} size={20} className="text-primary-foreground" />
          )}
        </Button>
      </View>
    </View>
  );
};
