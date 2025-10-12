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
import { QuizFilters } from '../types';
import { categories, difficulties, statuses } from '../utils/mockData';

interface FilterSectionProps {
  filters: QuizFilters;
  onUpdateFilter: <K extends keyof QuizFilters>(key: K, value: QuizFilters[K]) => void;
}

export const FilterSection: React.FC<FilterSectionProps> = ({ filters, onUpdateFilter }) => (
  <View className="mb-2">
    <View className="flex-row gap-2">
      {/* Category Filter */}
      <View className="flex-1">
        <Text className="mb-1 text-xs font-medium text-foreground">Kategori</Text>
        <Select
          value={{ value: filters.category, label: filters.category }}
          onValueChange={(option) => onUpdateFilter('category', option?.value as any)}>
          <SelectTrigger className="h-10">
            <SelectValue placeholder="Kategori" />
          </SelectTrigger>
          <SelectContent>
            {categories.map((category) => (
              <SelectItem key={category} value={category} label={category}>
                <Text>{category}</Text>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </View>

      {/* Difficulty Filter */}
      <View className="flex-1">
        <Text className="mb-1 text-xs font-medium text-foreground">Zorluk</Text>
        <Select
          value={{ value: filters.difficulty, label: filters.difficulty }}
          onValueChange={(option) => onUpdateFilter('difficulty', option?.value as any)}>
          <SelectTrigger className="h-10">
            <SelectValue placeholder="Zorluk" />
          </SelectTrigger>
          <SelectContent>
            {difficulties.map((difficulty) => (
              <SelectItem key={difficulty} value={difficulty} label={difficulty}>
                <Text>{difficulty}</Text>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </View>

      {/* Status Filter */}
      <View className="flex-1">
        <Text className="mb-1 text-xs font-medium text-foreground">Durum</Text>
        <Select
          value={{ value: filters.status, label: filters.status }}
          onValueChange={(option) => onUpdateFilter('status', option?.value as any)}>
          <SelectTrigger className="h-10">
            <SelectValue placeholder="Durum" />
          </SelectTrigger>
          <SelectContent>
            {statuses.map((status) => (
              <SelectItem key={status} value={status} label={status}>
                <Text>{status}</Text>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </View>
    </View>
  </View>
);
