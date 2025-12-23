import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Icon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import React from 'react';
import { View } from 'react-native';
import { ChatBubbleLeftIcon, DocumentTextIcon, TrashIcon } from 'react-native-heroicons/outline';
import { File } from '../types';

interface FileCardProps {
  file: File;
  onChatStart: (fileId: string) => void;
  onDelete?: (fileId: string) => void;
}

export const FileCard: React.FC<FileCardProps> = ({ file, onChatStart, onDelete }) => {
  const formattedSize = (file.size / 1024 / 1024).toFixed(2) + ' MB';
  const formattedDate = new Date(file.created_at).toLocaleDateString('tr-TR');

  return (
    <Card className="mb-4">
      {/* File Header */}
      <CardHeader className="flex-row items-start gap-3">
        <View className="h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
          <DocumentTextIcon size={24} color="#3B82F6" />
        </View>

        <View className="flex-1">
          <Text className="text-base font-semibold text-foreground">{file.title}</Text>
          <Text className="text-xs text-muted-foreground">{formattedDate}</Text>
        </View>

        {onDelete && (
          <Button size="icon-sm" variant="ghost" onPress={() => onDelete(file.id)}>
            <Icon as={TrashIcon} size={20} className="text-red-500" />
          </Button>
        )}
      </CardHeader>

      {/* File Info */}
      <CardContent className="flex-row items-center justify-between pb-2">
        <Text className="text-sm text-muted-foreground">Boyut: {formattedSize}</Text>
        <Badge variant="default" className="bg-green-500/10">
          <Text className="text-xs text-green-600">Hazır</Text>
        </Badge>
      </CardContent>

      {/* Actions */}
      <CardFooter className="flex-row items-center justify-end py-3">
        <Button onPress={() => onChatStart(file.id)} className="h-8 rounded-full px-4" size="sm">
          <View className="flex-row items-center gap-2">
            <Icon as={ChatBubbleLeftIcon} size={14} color="white" />
            <Text className="text-xs font-medium text-primary-foreground">Sohbet</Text>
          </View>
        </Button>
      </CardFooter>
    </Card>
  );
};
