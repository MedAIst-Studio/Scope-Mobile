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
  onSave?: (fileId: string) => void;
  isSaving?: boolean;
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

export const FileCard: React.FC<FileCardProps> = ({
  file,
  onChatStart,
  onDelete,
  onPreview,
  onSave,
  isSaving,
}) => {
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
  const isSaved = file.is_saved ?? false;

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
        <View className="flex-1">
          {isImage && !isSaved ? (
            <>
              <Badge variant="outline" className="self-start border-amber-500/40 bg-amber-500/10">
                <View className="mr-1.5 h-1.5 w-1.5 rounded-full bg-amber-500" />
                <Text className="text-[10px] font-bold text-amber-600 uppercase">Geçici Görsel</Text>
              </Badge>
            </>
          ) : (
            <Badge
              variant="default"
              className={cn(
                'self-start bg-primary/5',
                isSaved && 'border border-emerald-500/40 bg-emerald-500/10'
              )}>
              <View
                className={cn(
                  'mr-1.5 h-1.5 w-1.5 rounded-full bg-primary',
                  isSaved && 'bg-emerald-500'
                )}
              />
              <Text
                className={cn(
                  'text-[10px] font-bold text-primary uppercase',
                  isSaved && 'text-emerald-600'
                )}>
                {isSaved ? 'Kalıcı Olarak Kayıtlı' : 'Analiz Edildi'}
              </Text>
            </Badge>
          )}
        </View>
      </CardContent>

      <CardFooter className="flex-row gap-2 pt-2">
        {isImage && onSave && (
          <Button
            onPress={() => onSave(file.id)}
            disabled={isSaving}
            variant="outline"
            className={cn(
              "flex-1 h-11 flex-row items-center justify-center",
              isSaved ? "border-destructive/40 bg-destructive/5" : "border-primary/40 bg-primary/5"
            )}>
            <Text className={cn("text-xs font-semibold", isSaved ? "text-destructive" : "text-primary")}>
              {isSaving ? '...' : (isSaved ? 'Kaydı Kaldır' : 'Kaydet')}
            </Text>
          </Button>
        )}
        <Button
          onPress={() => onChatStart(file.id)}
          className={cn('h-11 flex-row items-center justify-center gap-2', isImage ? 'flex-[2]' : 'w-full')}
          size="default">
          <Icon as={MessageCircle} size={18} className="text-primary-foreground" />
          <Text className="text-sm font-bold text-primary-foreground">Sohbeti Başlat</Text>
        </Button>
      </CardFooter>
    </Card>
  );
};
