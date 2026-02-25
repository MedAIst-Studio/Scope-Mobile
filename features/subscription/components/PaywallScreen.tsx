import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import { X } from 'lucide-react-native';
import React from 'react';
import { ActivityIndicator, Pressable, ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { usePaywall } from '../hooks/usePaywall';
import { FeatureItem } from './FeatureItem';
import { IntervalSwitcher } from './IntervalSwitcher';
import { PlanItem } from './PlanItem';

export const PaywallScreen: React.FC = () => {
    const {
        activeInterval,
        setActiveInterval,
        isPurchasing,
        isInitialLoading,
        activeIndex,
        setActiveIndex,
        filteredPackages,
        activePackage,
        getFeaturesForPackage,
        handleAction,
        restorePurchases,
        router
    } = usePaywall();

    if (isInitialLoading) {
        return (
            <View className="flex-1 items-center justify-center bg-background">
                <ActivityIndicator size="large" color="hsl(var(--primary))" />
            </View>
        );
    }

    const currentFeatures = activePackage ? getFeaturesForPackage(activePackage) : [];

    return (
        <SafeAreaView className="flex-1 bg-background">


            <View className="flex-1" >
                {/* Close Button */}
                <View className="absolute right-6 top-10 z-50">
                    <Pressable
                        onPress={() => router.back()}
                        className="h-10 w-10 items-center justify-center rounded-full bg-secondary"
                    >
                        <Icon as={X} size={20} className="text-muted-foreground" />
                    </Pressable>
                </View>

                <View className="flex-1 px-6">
                    <ScrollView
                        className="flex-1"
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={{ paddingTop: 40, paddingBottom: 140 }}
                    >
                        {/* Header */}
                        <View className="mb-8 items-center">
                            <Text className="text-center text-3xl font-[1000] tracking-tighter text-foreground leading-9">
                                Paketler
                            </Text>
                            <Text className="mt-2 text-center text-[15px] font-medium text-muted-foreground px-8">
                                İhtiyaçlarınıza en uygun planı bulun. İstediğiniz zaman değiştirin.
                            </Text>
                        </View>

                        {/* Interval Switcher */}
                        <IntervalSwitcher
                            activeInterval={activeInterval}
                            onIntervalChange={setActiveInterval}
                        />

                        {/* Plan Selection */}
                        <View className="mb-8">
                            {filteredPackages.map((pkg, index) => (
                                <PlanItem
                                    key={pkg.identifier}
                                    pkg={pkg}
                                    isActive={activeIndex === index}
                                    onPress={() => setActiveIndex(index)}
                                    isMostPopular={pkg.identifier.toLowerCase().includes('pro')}
                                />
                            ))}
                        </View>

                        {/* Features List */}
                        <View className="rounded-3xl bg-muted/50 p-6 border border-border">
                            <Text className="mb-4 text-sm font-bold uppercase tracking-widest text-muted-foreground">
                                Özellikler:
                            </Text>
                            <View className="space-y-1">
                                {currentFeatures.map((feature: string, idx: number) => (
                                    <FeatureItem key={idx} label={feature} />
                                ))}
                            </View>
                        </View>

                        <Text className="mt-8 text-center text-[13px] font-medium text-muted-foreground">
                            Tüm planlar 7 günlük ücretsiz deneme içerir. İstediğiniz zaman iptal edin.
                        </Text>
                    </ScrollView>
                </View>

                {/* Bottom Action Area */}
                <View className="absolute bottom-0 left-0 right-0 px-8 pt-6">
                    <Button
                        variant="default"
                        className="h-16 rounded-2xl shadow-xl"
                        size="lg"
                        onPress={handleAction}
                        disabled={isPurchasing}
                    >
                        {isPurchasing ? (
                            <ActivityIndicator color="hsl(var(--primary-foreground))" />
                        ) : (
                            <Text className="text-lg font-bold text-primary-foreground tracking-tight">
                                {activePackage?.identifier?.includes('free') ? 'Ücretsiz Devam Et' : 'Tam Erişim Al'}
                            </Text>
                        )}
                    </Button>

                    <View className="mt-6 flex-row justify-center items-center space-x-6">
                        <Pressable onPress={restorePurchases}>
                            <Text className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest">Geri Yükle</Text>
                        </Pressable>
                        <View className="h-1 w-1 rounded-full bg-border" />
                        <Pressable onPress={() => { }}>
                            <Text className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest">Koşullar</Text>
                        </Pressable>
                    </View>
                </View>
            </View>
        </SafeAreaView>
    );
};
