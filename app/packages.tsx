import { LinearGradient } from 'expo-linear-gradient';
import { useRouter, Stack } from 'expo-router';
import { ArrowLeft, Check, Crown, Sparkles } from 'lucide-react-native';
import React, { useState } from 'react';
import { ScrollView, TouchableOpacity, View, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { Icon } from '@/components/ui/icon';
import { Badge } from '@/components/ui/badge';
import { useSubscription } from '@/features/subscription/context/SubscriptionContext';
import { cn } from '@/lib/utils';

const SUBSCRIPTION_PLANS = [
    {
        id: 'free',
        title: 'Ücretsiz',
        monthlyPrice: '0',
        yearlyPrice: '0',
        features: [
            'Günlük 3 Mesaj',
            '5 PDF Taraması',
            'Temel AI Modelleri',
            'Reklamlı İçerik'
        ],
        isPopular: false,
    },
    {
        id: 'pro',
        title: 'Pro',
        monthlyPrice: '149',
        yearlyPrice: '119',
        features: [
            'Sınırsız Mesajlaşma',
            'Sınırsız PDF Taraması',
            'Gelişmiş AI Modelleri',
            'Reklamsız Deneyim',
            'Öncelikli Destek',
            'Özel İçerikler'
        ],
        isPopular: true,
    }
];

const PricingCard = ({
    plan,
    isYearly,
    onSelect,
    isCurrent = false,
}: {
    plan: typeof SUBSCRIPTION_PLANS[0];
    isYearly: boolean;
    onSelect: () => void;
    isCurrent?: boolean;
}) => {
    const price = isYearly ? plan.yearlyPrice : plan.monthlyPrice;
    const isPro = plan.id === 'pro';

    return (
        <View className={cn(
            "bg-card rounded-[2.5rem] p-8 mx-5 mb-6 border overflow-hidden",
            plan.isPopular ? "border-primary/30 shadow-2xl" : "border-border/50 shadow-lg"
        )}>
            {isPro && (
                <LinearGradient
                    colors={['#3b82f6', '#1d4ed8']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, opacity: 0.03 }}
                />
            )}

            <View className="flex-row justify-between items-start mb-6">
                <View>
                    <Text className="text-2xl font-bold text-foreground mb-1">{plan.title}</Text>
                    {plan.isPopular && (
                        <Badge variant="solid" className="bg-primary/10 border border-primary/20">
                            <Text className="text-primary text-[10px] font-bold">EN POPÜLER</Text>
                        </Badge>
                    )}
                </View>
                {isPro && (
                    <View className="bg-yellow-500/10 p-2 rounded-2xl">
                        <Icon as={Crown} size={24} className="text-yellow-500 fill-yellow-500" />
                    </View>
                )}
            </View>

            <View className="flex-row items-baseline mb-8">
                <Text className="text-2xl font-semibold text-foreground mr-1">₺</Text>
                <Text className="text-5xl font-bold text-foreground">{price}</Text>
                <Text className="text-base text-muted-foreground ml-2">/ay</Text>
            </View>

            <View className="h-[1px] bg-border/50 w-full mb-8" />

            <View className="mb-8">
                {plan.features.map((feature, index) => (
                    <View key={index} className="flex-row items-center mb-4">
                        <View className={cn(
                            "w-6 h-6 rounded-full items-center justify-center mr-4",
                            isPro ? "bg-primary/10" : "bg-muted"
                        )}>
                            <Icon as={Check} size={14} className={isPro ? "text-primary" : "text-muted-foreground"} />
                        </View>
                        <Text className="text-[15px] font-medium text-muted-foreground">{feature}</Text>
                    </View>
                ))}
            </View>

            <Button
                variant={plan.isPopular ? 'default' : 'outline'}
                className={cn(
                    "w-full rounded-[1.5rem] h-16 shadow-lg shadow-primary/20",
                    isCurrent && "opacity-50"
                )}
                onPress={onSelect}
                disabled={isCurrent}
            >
                {isPro ? (
                    <View className="flex-row items-center justify-center">
                        <Icon as={Sparkles} size={18} className="text-primary-foreground mr-2" />
                        <Text className="text-primary-foreground font-bold text-lg">
                            {isCurrent ? 'Aktif Paket' : 'Pro\'ya Geç'}
                        </Text>
                    </View>
                ) : (
                    <Text className="font-bold text-lg">
                        {isCurrent ? 'Mevcut Paket' : 'Ücretsiz Devam Et'}
                    </Text>
                )}
            </Button>
        </View>
    );
};

export default function PackagesScreen() {
    const router = useRouter();
    const { upgrade, tier } = useSubscription();
    const [isYearly, setIsYearly] = useState(false);

    const handleSelect = (planId: string) => {
        if (planId === 'pro') {
            upgrade();
            router.back();
        } else {
            router.back();
        }
    };

    return (
        <SafeAreaView className="flex-1 bg-background" edges={['top']}>
            <Stack.Screen options={{ headerShown: false }} />

            {/* Header */}
            <View className="flex-row items-center justify-between px-6 py-4">
                <TouchableOpacity
                    onPress={() => router.back()}
                    className="w-12 h-12 rounded-2xl bg-muted/30 items-center justify-center border border-border/50"
                >
                    <Icon as={ArrowLeft} size={24} className="text-foreground" />
                </TouchableOpacity>
                <Text className="text-xl font-bold text-foreground">Üyelik Paketleri</Text>
                <View className="w-12 h-12" />
            </View>

            <ScrollView
                contentContainerStyle={{ paddingBottom: 60 }}
                showsVerticalScrollIndicator={false}
                className="flex-1"
            >
                {/* Hero */}
                <View className="items-center px-8 py-10">
                    <View className="w-24 h-24 rounded-[2rem] bg-primary/10 justify-center items-center mb-6 shadow-xl shadow-primary/10">
                        <Icon as={Sparkles} size={48} className="text-primary" />
                    </View>
                    <Text className="text-4xl font-bold text-foreground mb-4 text-center tracking-tight">Sınırsız Erişim</Text>
                    <Text className="text-lg text-muted-foreground text-center leading-7 px-4">
                        Tüm premium özellikleri açın ve öğrenme deneyiminizi en üst seviyeye taşıyın.
                    </Text>
                </View>

                {/* Billing Toggle */}
                <View className="flex-row justify-center items-center mb-10 px-6">
                    <View className="bg-muted/30 p-1.5 rounded-[1.5rem] flex-row border border-border/50">
                        <Pressable
                            onPress={() => setIsYearly(false)}
                            className={cn(
                                "px-8 py-3 rounded-[1.2rem]",
                                !isYearly ? "bg-background shadow-sm" : "bg-transparent"
                            )}
                        >
                            <Text className={cn(
                                "font-bold text-sm",
                                !isYearly ? "text-foreground" : "text-muted-foreground"
                            )}>Aylık</Text>
                        </Pressable>
                        <Pressable
                            onPress={() => setIsYearly(true)}
                            className={cn(
                                "px-8 py-3 rounded-[1.2rem] flex-row items-center",
                                isYearly ? "bg-background shadow-sm" : "bg-transparent"
                            )}
                        >
                            <Text className={cn(
                                "font-bold text-sm",
                                isYearly ? "text-foreground" : "text-muted-foreground"
                            )}>Yıllık</Text>
                            <View className="ml-2 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                                <Text className="text-[10px] font-bold text-emerald-600">%20 Tasarruf</Text>
                            </View>
                        </Pressable>
                    </View>
                </View>

                {/* Cards */}
                {SUBSCRIPTION_PLANS.map((plan) => (
                    <PricingCard
                        key={plan.id}
                        plan={plan}
                        isYearly={isYearly}
                        onSelect={() => handleSelect(plan.id)}
                        isCurrent={(plan.id === 'pro' && tier === 'PRO') || (plan.id === 'free' && tier === 'FREE')}
                    />
                ))}

                <View className="px-10 mt-4">
                    <Text className="text-[12px] text-muted-foreground text-center leading-5 uppercase tracking-widest opacity-60">
                        İstediğiniz zaman iptal edebilirsiniz • Güvenli Ödeme
                    </Text>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}
