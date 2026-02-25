import { Badge } from '@/components/ui/badge';
import { Text } from '@/components/ui/text';
import { cn } from '@/lib/utils';
import React from 'react';
import { Pressable, View } from 'react-native';

interface PlanItemProps {
    pkg: any;
    isActive: boolean;
    onPress: () => void;
    isMostPopular?: boolean;
}

export const PlanItem: React.FC<PlanItemProps> = ({
    pkg,
    isActive,
    onPress,
    isMostPopular,
}) => {
    const { product } = pkg;
    const id = pkg.identifier.toLowerCase();

    // Translation logic
    let tierName = 'Pro';
    let description = 'Profesyoneller için mükemmel';

    if (id.includes('free')) {
        tierName = 'Ücretsiz';
        description = 'Başlangıç için bireysel paket';
    } else if (id.includes('ultra')) {
        tierName = 'Ultra';
        description = 'Tüm sınırlar kaldırılsın';
    } else if (id.includes('basic')) {
        tierName = 'Başlangıç';
        description = 'Temel özelliklerle başlayın';
    }

    const priceString = product.priceString;

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
                "mb-3 flex-row items-center rounded-2xl border-2 p-4 transition-all",
                isActive
                    ? "border-primary bg-primary/10 shadow-sm"
                    : "border-border bg-card"
            )}
        >
            {/* Radio-like circle */}
            <View className={cn(
                "mr-4 h-6 w-6 items-center justify-center rounded-full border-2",
                isActive ? "border-primary bg-primary" : "border-muted-foreground/30"
            )}>
                {isActive && <View className="h-2 w-2 rounded-full bg-primary-foreground" />}
            </View>

            {/* Plan Details */}
            <View className="flex-1">
                <View className="flex-row items-center">
                    <Text className={cn(
                        "text-lg font-bold tracking-tight",
                        isActive ? "text-foreground" : "text-foreground"
                    )}>
                        {tierName}
                    </Text>
                    {isMostPopular && (
                        <Badge variant="default" className="ml-2 bg-primary/10 px-2 py-0.5 border-0">
                            <Text className="text-[10px] font-bold text-primary">Popüler</Text>
                        </Badge>
                    )}
                </View>
                <Text className="text-[13px] font-medium text-muted-foreground">
                    {description}
                </Text>
            </View>

            {/* Price */}
            <View className="items-end">
                <Text className="text-lg font-black text-foreground">{priceString}</Text>
                <Text className="text-[10px] font-bold text-muted-foreground uppercase">/{period}</Text>
            </View>
        </Pressable>
    );
};
