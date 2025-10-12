import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Text } from '@/components/ui/text';
import React from 'react';
import { View } from 'react-native';
import { Theme } from '../types';
import { themeOptions } from '../utils/mockData';

interface ThemeSelectorProps {
  selectedTheme: Theme;
  onThemeChange: (theme: Theme) => void;
}

export const ThemeSelector: React.FC<ThemeSelectorProps> = ({ selectedTheme, onThemeChange }) => {
  const selectedOption = themeOptions.find((option) => option.value === selectedTheme);

  return (
    <View className="ml-2 flex-1">
      <Select
        value={{ value: selectedTheme, label: selectedOption?.label || 'Sistem' }}
        onValueChange={(option) => onThemeChange(option?.value as Theme)}>
        <SelectTrigger className="h-8 justify-end border-0 bg-transparent p-0">
          <SelectValue placeholder="Tema seç" />
        </SelectTrigger>
        <SelectContent>
          {themeOptions.map((option) => (
            <SelectItem key={option.value} value={option.value} label={option.label}>
              <Text>{option.label}</Text>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </View>
  );
};
