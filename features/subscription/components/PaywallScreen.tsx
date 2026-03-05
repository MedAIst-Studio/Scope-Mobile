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
    getSavings,
    getTrialDays,
    handleAction,
    restorePurchases,
    router,
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
      {/* Background Decoration */}
      <View className="absolute left-0 right-0 top-0 h-[40%] rounded-b-[100px] bg-primary/5" />
      <View className="absolute -left-20 top-20 h-64 w-64 rounded-full bg-primary/10 blur-[100px]" />
      <View className="absolute -right-20 top-40 h-64 w-64 rounded-full bg-secondary/10 blur-[100px]" />

      <View className="flex-1">
        {/* Close Button */}
        <View className="absolute right-6 top-6 z-50">
          <Pressable
            onPress={() => router.back()}
            className="h-10 w-10 items-center justify-center rounded-full bg-secondary/80 backdrop-blur-md">
            <Icon as={X} size={20} className="text-foreground" />
          </Pressable>
        </View>

        <View className="flex-1 px-6">
          <ScrollView
            className="flex-1"
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingTop: 60, paddingBottom: 160 }}>
            {/* Header */}
            <View className="mb-10 items-center">
              <View className="mb-4 h-16 w-16 items-center justify-center rounded-2xl bg-primary shadow-xl shadow-primary/30">
                <Text className="text-3xl">🚀</Text>
              </View>
              <Text className="text-center text-3xl font-black leading-tight tracking-tighter text-foreground">
                Sınav Başarını{'\n'}Hızlandır
              </Text>
              <Text className="mt-3 px-4 text-center text-[15px] font-medium leading-6 text-muted-foreground">
                Yapay zeka asistanınla rakiplerine fark at. İstediğin zaman iptal edebilirsin.
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
                  isMostPopular={
                    activeInterval === 'THREE_MONTH'
                      ? pkg.identifier.toLowerCase().includes('pro')
                      : activeInterval === 'ANNUAL'
                        ? pkg.identifier.toLowerCase().includes('ultra')
                        : false
                  }
                  savings={getSavings(pkg)}
                  trialDays={getTrialDays(pkg)}
                />
              ))}
            </View>

            {/* Features List */}
            <View className="rounded-[32px] border border-border bg-card p-7 shadow-sm">
              <View className="mb-6 flex-row items-center justify-between">
                <Text className="text-xs font-black uppercase tracking-[3px] text-primary">
                  Paket Özellikleri
                </Text>
                <View className="h-1.5 w-24 overflow-hidden rounded-full bg-muted">
                  <View
                    className="h-full bg-primary"
                    style={{
                      width: activePackage?.identifier?.includes('ultra')
                        ? '100%'
                        : activePackage?.identifier?.includes('pro')
                          ? '66%'
                          : '33%',
                    }}
                  />
                </View>
              </View>

              <View className="space-y-3">
                {currentFeatures.length > 0 ? (
                  currentFeatures.map((feature: string, idx: number) => (
                    <FeatureItem key={idx} label={feature} />
                  ))
                ) : (
                  <Text className="py-2 text-center text-sm italic text-muted-foreground">
                    Seçili paket için özellikler yükleniyor...
                  </Text>
                )}
              </View>
            </View>
          </ScrollView>
        </View>

        {/* Bottom Action Area */}
        <View className="absolute bottom-0 left-0 right-0 border-t border-border/50 bg-background/80 px-8 pb-4 pt-6 backdrop-blur-xl">
          <Button
            variant="default"
            className="h-16 rounded-[24px] bg-primary shadow-2xl shadow-primary/40"
            size="lg"
            onPress={handleAction}
            disabled={isPurchasing}>
            {isPurchasing ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text className="text-center text-lg font-black tracking-tight text-white">
                {activePackage?.identifier?.includes('free')
                  ? 'Ücretsiz Başla'
                  : getTrialDays(activePackage)
                    ? `${getTrialDays(activePackage)} Gün Ücretsiz Dene ve Başla`
                    : 'Hemen Başla'}
              </Text>
            )}
          </Button>

          <View className="mt-6 flex-row items-center justify-center">
            <Pressable onPress={restorePurchases}>
              <Text className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                Satın Alımı Geri Yükle
              </Text>
            </Pressable>
            <View className="mx-4 h-1 w-1 rounded-full bg-muted-foreground/30" />
            <Pressable onPress={() => {}}>
              <Text className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                Kullanım Koşulları
              </Text>
            </Pressable>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};
