import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import React from 'react';
import { View } from 'react-native';
import {
  ArrowPathIcon,
  EllipsisHorizontalIcon,
  PencilSquareIcon,
} from 'react-native-heroicons/outline';

export const ChatHeader: React.FC = () => (
  <View className="absolute left-0 right-0 top-0 z-10 h-20 flex-row items-center justify-between border-b border-border bg-white px-4 pt-6 dark:bg-background">
    <View className="flex-row items-center gap-3">
      <Button size={'icon'} variant={'outline'}>
        <Icon as={ArrowPathIcon} size={20} />
      </Button>
      <Button size={'icon'} variant={'outline'}>
        <Icon as={PencilSquareIcon} size={20} />
      </Button>
    </View>

    <Button size={'icon'} variant={'outline'}>
      <Icon as={EllipsisHorizontalIcon} size={20} />
    </Button>
  </View>
);
