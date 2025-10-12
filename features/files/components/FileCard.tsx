import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Icon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import { FileText, MessageSquare, MoreVertical } from 'lucide-react-native';
import React from 'react';
import { View } from 'react-native';
import { PDFFile } from '../types';
import { getFileStatusBadge } from '../utils/mockData';

interface FileCardProps {
  file: PDFFile;
  onChatStart: (fileId: string) => void;
  onDelete?: (fileId: string) => void;
}

export const FileCard: React.FC<FileCardProps> = ({ file, onChatStart, onDelete }) => {
  const statusBadge = getFileStatusBadge(file);

  return (
    <Card className="mb-4">
      {/* File Header */}
      <CardHeader className="flex-row items-start gap-3">
        <View className="h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
          <FileText size={24} color="#3B82F6" />
        </View>

        <View className="flex-1">
          <Text className="text-base font-semibold text-foreground">{file.name}</Text>
          <Text className="text-sm text-muted-foreground">{file.fileName}</Text>
        </View>

        <Badge variant={statusBadge.variant}>
          <Text>{statusBadge.text}</Text>
        </Badge>

        <Button size="icon-sm" variant="outline" className="!border-zinc-700 !bg-background">
          <Icon as={MoreVertical} size={16} />
        </Button>
      </CardHeader>

      {/* Processing Progress */}
      {file.isProcessing && file.processingProgress !== undefined && (
        <CardContent>
          <View className="h-2 rounded-full bg-muted">
            <View
              className="h-full rounded-full bg-orange-500"
              style={{ width: `${file.processingProgress}%` }}
            />
          </View>
          <Text className="mt-1 text-xs text-muted-foreground">
            Doküman işleniyor... {file.processingProgress}%
          </Text>
        </CardContent>
      )}

      {/* File Info */}
      <CardContent className="flex-row items-center justify-between">
        <Text className="text-sm text-muted-foreground">Boyut: {file.size}</Text>
        <Text className="text-sm text-muted-foreground">{file.uploadDate}</Text>
      </CardContent>

      {/* Message Count & Chat Button */}
      {file.status === 'ready' ? (
        <CardFooter className="flex-row items-center justify-between">
          <View className="flex-row items-center gap-1">
            <MessageSquare size={16} color="#6B7280" />
            <Text className="text-sm text-muted-foreground">{file.messageCount} mesaj</Text>
          </View>

          <Button onPress={() => onChatStart(file.id)} className="rounded-full">
            <Text className="font-medium text-primary-foreground">Chat Başlat</Text>
          </Button>
        </CardFooter>
      ) : (
        <CardFooter className="items-center">
          <Text className="text-sm text-muted-foreground">
            {file.isProcessing ? 'Doküman hazırlanıyor...' : 'Sohbet için hazırlanıyor'}
          </Text>
        </CardFooter>
      )}
    </Card>
  );
};
