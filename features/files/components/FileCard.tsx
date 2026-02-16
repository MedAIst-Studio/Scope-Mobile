import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Icon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import { cn } from '@/lib/utils';
import {
  File as FileIcon,
  FileText,
  Image as ImageIcon,
  MessageCircle,
  Trash2,
} from 'lucide-react-native';
import React from 'react';
import { Image, TouchableOpacity, View } from 'react-native';
import { File as FileType } from '../types';

interface FileCardProps {
  file: FileType;
  onChatStart: (fileId: string) => void;
  onDelete?: (fileId: string) => void;
  onPreview?: (file: FileType) => void;
}

const getFileInfo = (fileName: string) => {
  const ext = fileName.toLowerCase().split('.').pop() || '';

  if (['pdf'].includes(ext)) {
    return {
      icon: FileText,
      bgColor: 'bg-red-500/10',
      iconColor: 'text-red-500',
    };
  }

  if (['jpg', 'jpeg', 'png', 'webp', 'heic'].includes(ext)) {
    return {
      icon: ImageIcon,
      bgColor: 'bg-blue-500/10',
      iconColor: 'text-blue-500',
    };
  }

  return {
    icon: FileIcon,
    bgColor: 'bg-zinc-500/10',
    iconColor: 'text-zinc-500',
  };
};

export const FileCard: React.FC<FileCardProps> = ({ file, onChatStart, onDelete, onPreview }) => {
  const formattedSize = (file.size / 1024 / 1024).toFixed(2) + ' MB';
  const formattedDate = new Date(file.created_at).toLocaleDateString('tr-TR', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

  const { icon, bgColor, iconColor } = getFileInfo(file.title);

  const isImage = ['jpg', 'jpeg', 'png', 'webp', 'heic'].includes(
    file.title.toLowerCase().split('.').pop() || ''
  );

  return (
    <Card className="mb-4">
      <CardHeader className="flex-row items-center gap-4">
        <TouchableOpacity
          activeOpacity={isImage ? 0.7 : 1}
          onPress={() => isImage && onPreview?.(file)}
          className={cn(
            'h-14 w-14 items-center justify-center overflow-hidden rounded-2xl',
            bgColor
          )}>
          {isImage && file.url ? (
            <Image source={{ uri: file.url }} className="h-full w-full" resizeMode="cover" />
          ) : (
            <Icon as={icon} size={28} className={iconColor} />
          )}
        </TouchableOpacity>

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
            <Icon as={Trash2} size={20} className="text-destructive/60" />
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
          <Icon as={MessageCircle} size={20} className="text-primary-foreground" />
          <Text className="font-bold text-primary-foreground">Sohbeti Başlat</Text>
        </Button>
      </CardFooter>
    </Card>
  );
};
