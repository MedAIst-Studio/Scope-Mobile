import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import { useRouter } from 'expo-router';
import { Crown, ShieldCheck, Sparkles, X, Zap } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, View } from 'react-native';
import type { PurchasesOffering, PurchasesPackage } from 'react-native-purchases';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSubscription } from '../hooks/useSubscription';
import { PackageCard } from './PackageCard';

const FEATURES = [
    {
        icon: Sparkles,
        title: 'Sınırsız PDF Analizi',
        description: 'Tüm dökümanlarınızı yapay zeka ile anında analiz edin.',
    },
    {
        icon: Zap,
        title: 'Akıllı Soru Oluşturma',
        description: 'Seviyenize uygun, YKS tarzı sınırsız soru üretin.',
    },
    {
        icon: Crown,
        title: 'Öncelikli Destek',
        description: 'Sorularınız ve sorunlarınız için VIP destek hattı.',
    },
    {
        icon: ShieldCheck,
        title: 'Reklamsız Deneyim',
        description: 'Dikkatiniz dağılmadan sadece hedefinize odaklanın.',
    },
];

export const PaywallScreen: React.FC = () => {
    const router = useRouter();
    const { getOfferings, purchasePackage, isLoading, restorePurchases } = useSubscription();

    const [offering, setOffering] = useState<PurchasesOffering | null>(null);
    const [selectedPackage, setSelectedPackage] = useState<PurchasesPackage | null>(null);
    const [isPurchasing, setIsPurchasing] = useState(false);
    const [isInitialLoading, setIsInitialLoading] = useState(true);

    useEffect(() => {
        const load = async () => {
            const data = await getOfferings();
            if (data) {
                setOffering(data);
                // Default to yearly if available, otherwise first
                const yearly = data.availablePackages.find(p => p.packageType === 'ANNUAL');
                setSelectedPackage(yearly || data.availablePackages[0] || null);
            }
            setIsInitialLoading(false);
        };
        load();
    }, [getOfferings]);

    const handlePurchase = async () => {
        if (!selectedPackage) return;
        setIsPurchasing(true);
        const success = await purchasePackage(selectedPackage);
        setIsPurchasing(false);
        if (success) {
            router.back();
        }
    };

    if (isInitialLoading) {
        return (
            <View className="flex-1 items-center justify-center bg-background">
                <ActivityIndicator size="large" color="#FF6347" />
            </View>
        );
    }

    return (
        <SafeAreaView className="flex-1 bg-background">
            <View className="absolute right-6 top-12 z-50">
                <Pressable
                    onPress={() => router.back()}
                    className="h-10 w-10 items-center justify-center rounded-full bg-secondary/50"
                >
                    <Icon as={X} size={20} className="text-foreground/60" />
                </Pressable>
            </View>

            <ScrollView className="flex-1 px-6 pt-10" showsVerticalScrollIndicator={false}>
                {/* Header Section */}
                <View className="mb-10 items-center">
                    <View className="mb-6 h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 shadow-sm">
                        <Icon as={Crown} size={28} className="text-primary" />
                    </View>
                    <Text className="text-center text-3xl font-black tracking-tight text-foreground">
                        Scope Pro'ya Geçin
                    </Text>
                    <Text className="mt-2 text-center text-base font-medium text-muted-foreground/60">
                        Hayalindeki üniversiteye bir adım daha yaklaş.
                    </Text>
                </View>

                {/* Features List */}
                <View className="mb-10 space-y-5">
                    {FEATURES.map((feature, idx) => (
                        <View key={idx} className="flex-row items-start space-x-4">
                            <View className="h-10 w-10 items-center justify-center rounded-xl bg-secondary/50">
                                <Icon as={feature.icon} size={20} className="text-primary" />
                            </View>
                            <View className="flex-1">
                                <Text className="text-base font-bold text-foreground">{feature.title}</Text>
                                <Text className="text-sm font-medium text-muted-foreground/60">
                                    {feature.description}
                                </Text>
                            </View>
                        </View>
                    ))}
                </View>

                {/* Packages Section */}
                <View className="mb-10">
                    <Text className="mb-5 ml-1 text-xs font-bold uppercase tracking-widest text-muted-foreground/40">
                        Planınızı Seçin
                    </Text>
                    {offering?.availablePackages.map((pkg) => (
                        <PackageCard
                            key={pkg.identifier}
                            pkg={pkg}
                            isSelected={selectedPackage?.identifier === pkg.identifier}
                            onSelect={setSelectedPackage}
                            isMostPopular={pkg.packageType === 'ANNUAL'}
                        />
                    ))}
                </View>

                {/* Footer and Action */}
                <View className="mb-12">
                    <Button
                        className="mb-4 h-16 rounded-3xl"
                        size="lg"
                        onPress={handlePurchase}
                        disabled={isPurchasing || !selectedPackage}
                    >
                        {isPurchasing ? (
                            <ActivityIndicator color="white" />
                        ) : (
                            <Text className="text-lg font-bold text-primary-foreground">
                                Devam Et
                            </Text>
                        )}
                    </Button>

                    <View className="flex-row justify-center space-x-6">
                        <Pressable onPress={restorePurchases}>
                            <Text className="text-xs font-bold text-muted-foreground/40">Satın Alımları Geri Yükle</Text>
                        </Pressable>
                        <Text className="text-xs text-muted-foreground/20">•</Text>
                        <Pressable onPress={() => { }}>
                            <Text className="text-xs font-bold text-muted-foreground/40">Kullanım Koşulları</Text>
                        </Pressable>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};
