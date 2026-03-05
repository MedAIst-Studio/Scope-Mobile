import { Text } from '@/components/ui/text';
import { cn } from '@/lib/utils';
import React from 'react';
import { Pressable, View } from 'react-native';

interface PlanItemProps {
  pkg: any;
  isActive: boolean;
  onPress: () => void;
  isMostPopular?: boolean;
  savings?: string;
  trialDays?: number;
}

export const PlanItem: React.FC<PlanItemProps> = ({
  pkg,
  isActive,
  onPress,
  isMostPopular,
  savings,
  trialDays,
}) => {
  const { product } = pkg;
  const id = pkg.identifier.toLowerCase();

  let tierName = 'Pro';
  let description = 'Derece hedefleyenler için en iyisi';
  let icon = '🎯';

  if (id.includes('free')) {
    tierName = 'Ücretsiz';
    description = 'Sınav yolculuğuna ilk adım';
    icon = '🌱';
  } else if (id.includes('ultra')) {
    tierName = 'Ultra';
    description = 'Sınırsız güç, maksimum net';
    icon = '⚡';
  }

  const formatPrice = (price: string) => {
    if (!price || price === 'Ücretsiz') return price;
    return price
      .replace(/([.,])00(?![0-9])/, '')
      .replace(/[A-Z]{2,3}(?=\$|€|£|₺|¥)/g, '')
      .replace(/(?<=\$|€|£|₺|¥)\s*[A-Z]{2,3}/g, '')
      .replace(/\s+([^\d\s\.,]+)/, '$1')
      .replace(/([^\d\s\.,]+)\s+/, '$1')
      .trim();
  };

  const priceString = formatPrice(product.priceString);

  let period = 'ay';
  if (id.includes('annual') || id.includes('yearly')) {
    period = 'yıl';
  } else if (id.includes('three_month') || id.includes('semester') || id.includes('three_months')) {
    period = '3 ay';
  }

  return (
    <Pressable
      onPress={onPress}
      className={cn(
        'mb-5 flex-row items-center rounded-[32px] border-2 p-6 transition-all',
        isActive
          ? 'border-primary bg-primary/5 shadow-xl shadow-primary/20'
          : 'border-border bg-card'
      )}>
      {/* Tier Icon Container */}
      <View
        className={cn(
          'mr-5 h-14 w-14 items-center justify-center rounded-[20px]',
          isActive ? 'bg-primary shadow-lg shadow-primary/30' : 'bg-muted'
        )}>
        <Text className="text-2xl">{icon}</Text>
      </View>

      {/* Plan Details */}
      <View className="flex-1">
        <View className="flex-row flex-wrap items-center">
          <Text
            className={cn(
              'mb-1 mr-2 text-xl font-bold tracking-tight',
              isActive ? 'text-foreground' : 'text-foreground'
            )}>
            {tierName}
          </Text>
          {isMostPopular && (
            <View className="mb-1 mr-2 rounded-full border border-orange-500/20 bg-orange-500/10 px-2 py-0.5">
              <Text className="text-[10px] font-black uppercase text-orange-600">En Popüler</Text>
            </View>
          )}
          {savings && (
            <View className="mb-1 rounded-full border border-green-500/20 bg-green-500/10 px-2 py-0.5">
              <Text className="text-[10px] font-black uppercase text-green-600">
                %{savings} Kazanç
              </Text>
            </View>
          )}
        </View>
        <View className="flex-row items-center">
          <Text
            className="mr-2 flex-shrink text-[14px] font-medium text-muted-foreground"
            numberOfLines={1}>
            {description}
          </Text>
          {trialDays && (
            <View className="rounded-md bg-primary/10 px-1.5 py-0.5">
              <Text className="text-[10px] font-extrabold uppercase text-primary">
                {trialDays} GÜN DENEME
              </Text>
            </View>
          )}
        </View>
      </View>

      {/* Price */}
      <View className="ml-2 items-end">
        <Text className={cn('text-2xl font-black', isActive ? 'text-primary' : 'text-foreground')}>
          {priceString}
        </Text>
        {!id.includes('free') && (
          <Text className="text-[11px] font-black uppercase tracking-tighter text-muted-foreground">
            /{period}
          </Text>
        )}
      </View>
    </Pressable>
  );
};
