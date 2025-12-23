import { Icon } from '@/components/ui/icon';
import { Input } from '@/components/ui/input';
import React from 'react';
import { View } from 'react-native';
import { MagnifyingGlassIcon } from 'react-native-heroicons/outline';

interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  value,
  onChangeText,
  placeholder = 'Doküman ara...',
}) => (
  <View className="relative mb-4">
    <View className="absolute left-3 top-1/2 z-10 -translate-y-1/2">
      <Icon as={MagnifyingGlassIcon} size={20} className="text-muted-foreground" />
    </View>
    <Input value={value} onChangeText={onChangeText} placeholder={placeholder} className="pl-10" />
  </View>
);
