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
        'relative mb-4 flex-row items-center rounded-3xl border-2 p-4 transition-all',
        isActive
          ? 'border-primary bg-primary/5 shadow-lg shadow-primary/10'
          : 'border-border bg-card'
      )}>
      {/* Most Popular Absolute Badge */}
      {isMostPopular && (
        <View className="absolute -top-3 left-6 rounded-full bg-orange-500 px-3 py-1 shadow-sm shadow-orange-500/30">
          <Text className="text-[10px] font-black uppercase text-white">En Popüler</Text>
        </View>
      )}

      {/* Tier Icon Container */}
      <View
        className={cn(
          'mr-4 h-12 w-12 items-center justify-center rounded-2xl',
          isActive ? 'bg-primary shadow-md shadow-primary/20' : 'bg-muted'
        )}>
        <Text className="text-xl">{icon}</Text>
      </View>

      {/* Plan Details */}
      <View className="flex-1">
        <View className="flex-row items-baseline justify-between">
          <Text
            className={cn(
              'text-lg font-bold tracking-tight',
              isActive ? 'text-primary' : 'text-foreground'
            )}>
            {tierName}
          </Text>
        </View>

        <Text
          className="mt-0.5 text-xs font-medium text-muted-foreground"
          numberOfLines={1}
          ellipsizeMode="tail">
          {description}
        </Text>

        {/* Secondary Badges Row */}
        {(savings || trialDays) && (
          <View className="mt-2 flex-row items-center gap-2">
            {savings && (
              <View className="rounded-full border border-green-500/20 bg-green-500/10 px-2 py-0.5">
                <Text className="text-[9px] font-black uppercase text-green-600">
                  %{savings} Kazanç
                </Text>
              </View>
            )}
            {trialDays && (
              <View className="rounded-md bg-primary/10 px-1.5 py-0.5">
                <Text className="text-[9px] font-extrabold uppercase text-primary">
                  {trialDays} Gün Deneme
                </Text>
              </View>
            )}
          </View>
        )}
      </View>

      {/* Price Section */}
      <View className="ml-3 items-end">
        <Text className={cn('text-xl font-black', isActive ? 'text-primary' : 'text-foreground')}>
          {priceString}
        </Text>
        {!id.includes('free') && (
          <Text className="text-[10px] font-bold uppercase tracking-tighter text-muted-foreground/60">
            /{period}
          </Text>
        )}
      </View>
    </Pressable>
  );
};
