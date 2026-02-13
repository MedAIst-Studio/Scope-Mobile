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
    <View className="ml-2">
      <Select
        value={{ value: selectedTheme, label: selectedOption?.label || 'Sistem' }}
        onValueChange={(option) => onThemeChange(option?.value as Theme)}>
        <SelectTrigger className="h-10 justify-end border-0 bg-transparent p-0 web:w-24">
          <SelectValue className="text-right text-sm font-bold text-primary" placeholder="Seç" />
        </SelectTrigger>
        <SelectContent className="rounded-3xl border-border/20 shadow-xl">
          {themeOptions.map((option) => (
            <SelectItem
              key={option.value}
              value={option.value}
              label={option.label}
              className="mx-1 my-0.5 rounded-2xl">
              <Text className="font-medium">{option.label}</Text>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </View>
  );
};
