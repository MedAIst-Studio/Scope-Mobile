import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Icon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import React from 'react';
import { View } from 'react-native';
import { ChatBubbleLeftIcon, DocumentTextIcon, TrashIcon } from 'react-native-heroicons/solid';
import { File } from '../types';

interface FileCardProps {
  file: File;
  onChatStart: (fileId: string) => void;
  onDelete?: (fileId: string) => void;
}

export const FileCard: React.FC<FileCardProps> = ({ file, onChatStart, onDelete }) => {
  const formattedSize = (file.size / 1024 / 1024).toFixed(2) + ' MB';
  const formattedDate = new Date(file.created_at).toLocaleDateString('tr-TR', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

  return (
    <Card className="mb-4">
      <CardHeader className="flex-row items-center gap-4">
        <View className="h-14 w-14 items-center justify-center rounded-2xl bg-secondary/50">
          <Icon as={DocumentTextIcon} size={28} className="text-primary" />
        </View>

        <View className="flex-1">
          <Text className="mb-1 text-lg font-bold leading-tight text-foreground" numberOfLines={1}>
            {file.title}
          </Text>
          <View className="flex-row items-center gap-2">
            <Text className="text-xs text-muted-foreground/60">{formattedDate}</Text>
            <View className="h-1 w-1 rounded-full bg-muted-foreground/30" />
            <Text className="text-xs text-muted-foreground/60">{formattedSize}</Text>
          </View>
        </View>

        {onDelete && (
          <Button
            size="icon-sm"
            variant="ghost"
            onPress={() => onDelete(file.id)}
            className="h-10 w-10">
            <Icon as={TrashIcon} size={20} className="text-destructive/60" />
          </Button>
        )}
      </CardHeader>

      <CardContent className="flex-row items-center justify-between pt-0">
        <Badge variant="default" className="bg-primary/5">
          <View className="mr-1.5 h-1.5 w-1.5 rounded-full bg-primary" />
          <Text className="text-[10px] font-bold text-primary">ANALİZ EDİLDİ</Text>
        </Badge>
      </CardContent>

      <CardFooter className="pt-2">
        <Button
          onPress={() => onChatStart(file.id)}
          className="w-full flex-row items-center justify-center"
          size="default">
          <Icon as={ChatBubbleLeftIcon} size={20} className="text-primary-foreground" />
          <Text className="font-bold text-primary-foreground">Sohbeti Başlat</Text>
        </Button>
      </CardFooter>
    </Card>
  );
};
