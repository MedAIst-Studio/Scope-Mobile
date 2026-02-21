import { Badge } from '@/components/ui/badge';
import { Text } from '@/components/ui/text';
import { cn } from '@/lib/utils';
import React from 'react';
import { Pressable, View } from 'react-native';
import type { PurchasesPackage } from 'react-native-purchases';

interface PackageCardProps {
    pkg: PurchasesPackage;
    isSelected: boolean;
    onSelect: (pkg: PurchasesPackage) => void;
    isMostPopular?: boolean;
}

export const PackageCard: React.FC<PackageCardProps> = ({
    pkg,
    isSelected,
    onSelect,
    isMostPopular,
}) => {
    const { product } = pkg;

    return (
        <Pressable
            onPress={() => onSelect(pkg)}
            className={cn(
                'relative mb-4 flex-row items-center justify-between rounded-3xl border-2 p-5 transition-all',
                isSelected
                    ? 'border-primary bg-primary/5 shadow-sm'
                    : 'border-border/40 bg-card active:bg-secondary/50'
            )}
        >
            {isMostPopular && (
                <View className="absolute -top-3 left-6">
                    <Badge variant="default" className="bg-primary px-3 py-1">
                        <Text className="text-[10px] font-bold uppercase tracking-wider text-white">
                            En Popüler
                        </Text>
                    </Badge>
                </View>
            )}

            <View className="flex-1">
                <Text className={cn(
                    'text-lg font-bold transition-colors',
                    isSelected ? 'text-primary' : 'text-foreground'
                )}>
                    {product.title.split(' (')[0]}
                </Text>
                <Text className="text-xs font-medium text-muted-foreground/60">
                    {product.description || 'Sınırsız erişim ve premium özellikler.'}
                </Text>
            </View>

            <View className="items-end">
                <Text className="text-xl font-black text-foreground">
                    {product.priceString}
                </Text>
                <Text className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/40">
                    {pkg.packageType.toLowerCase() === 'annual' ? 'Yıllık' :
                        pkg.packageType.toLowerCase() === 'monthly' ? 'Aylık' :
                            pkg.packageType.toLowerCase() === 'three_month' ? '3 Aylık' : 'Tek Seferlik'}
                </Text>
            </View>
        </Pressable>
    );
};
