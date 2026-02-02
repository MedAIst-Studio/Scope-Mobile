import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { MoreHorizontal, RefreshCw, SquarePen } from 'lucide-react-native';
import React from 'react';
import { View } from 'react-native';

export const ChatHeader: React.FC = () => (
  <View className="absolute left-0 right-0 top-0 z-10 h-20 flex-row items-center justify-between border-b border-border bg-white px-4 pt-6 dark:bg-background">
    <View className="flex-row items-center gap-3">
      <Button size={'icon'} variant={'outline'}>
        <Icon as={RefreshCw} size={20} />
      </Button>
      <Button size={'icon'} variant={'outline'}>
        <Icon as={SquarePen} size={20} />
      </Button>
    </View>

    <Button size={'icon'} variant={'outline'}>
      <Icon as={MoreHorizontal} size={20} />
    </Button>
  </View>
);
