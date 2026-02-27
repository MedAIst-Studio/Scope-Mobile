import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Icon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import type { UpgradeFeature } from '@/lib/error-handling/ErrorEventBus';
import { cn } from '@/lib/utils';
import { useRouter } from 'expo-router';
import { Camera, Crown, FileText, GraduationCap, MessageSquare, Sparkles, Upload } from 'lucide-react-native';
import React from 'react';
import { ActivityIndicator, ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useUsageData } from '../context/UsageContext';

const FEATURE_CONFIG: Record<UpgradeFeature, { label: string; icon: any; action: string }> = {
    message: { label: 'Zeka Soruları', icon: MessageSquare, action: 'Konuşma' },
    ocr: { label: 'Soru Canavarı', icon: Camera, action: 'Tarama' },
    pdf_chat: { label: 'PDF Sohbeti', icon: FileText, action: 'Sohbet' },
    file_upload: { label: 'PDF Kütüphanesi', icon: Upload, action: 'Yükleme' },
    quiz: { label: 'Sınav Maratonu', icon: GraduationCap, action: 'Quiz' },
};

const PLAN_LABELS: Record<string, string> = {
    free: 'Ücretsiz Paket',
    "pro_monthly": 'Pro Plan',
    "pro_annual": 'Pro Plan',
    "pro_semester": 'Pro Plan',
    "ultra_monthly": 'Ultra Sınırsız',
    "ultra_annual": 'Ultra Sınırsız',
    "ultra_semester": 'Ultra Sınırsız',
};

interface FeatureCardProps {
    feature: UpgradeFeature;
    used: number;
    limit: number;
    unlimited: boolean;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ feature, used, limit, unlimited }) => {
    const config = FEATURE_CONFIG[feature];
    if (!config) return null;

    const percentage = unlimited ? 0 : limit > 0 ? Math.min((used / limit) * 100, 100) : 100;
    const isAtLimit = !unlimited && used >= limit;
    const isHighUsage = !unlimited && percentage > 80;

    return (
        <Card className="mb-4 overflow-hidden border-border/20 p-4 shadow-sm">
            <View className="flex-row items-center justify-between">
                <View className="flex-row items-center gap-4">
                    <View className={cn(
                        "h-12 w-12 items-center justify-center rounded-2xl",
                        isAtLimit ? "bg-destructive/10" : "bg-primary/5"
                    )}>
                        <Icon
                            as={config.icon}
                            size={24}
                            className={isAtLimit ? "text-destructive" : "text-primary"}
                        />
                    </View>
                    <View>
                        <Text className="text-lg font-bold tracking-tight text-foreground">{config.label}</Text>
                        <Text className="text-xs font-medium text-muted-foreground">
                            {unlimited
                                ? 'Sınırsız Kullanım'
                                : `${used} / ${limit} ${config.action} Yapıldı`
                            }
                        </Text>
                    </View>
                </View>
                {unlimited ? (
                    <View className="flex-row items-center rounded-full bg-primary/10 px-3 py-1">
                        <Icon as={Sparkles} size={12} className="mr-1 text-primary" />
                        <Text className="text-[10px] font-bold uppercase tracking-wider text-primary">Sınırsız</Text>
                    </View>
                ) : (
                    <View className="items-end">
                        <Text className={cn(
                            "text-sm font-black",
                            isAtLimit ? "text-destructive" : "text-foreground"
                        )}>
                            {limit - used > 0 ? `${limit - used}` : '0'}
                        </Text>
                        <Text className="text-[10px] font-bold uppercase tracking-tighter text-muted-foreground">Kalan</Text>
                    </View>
                )}
            </View>

            {!unlimited && (
                <View className="mt-4">
                    <View className="h-2 overflow-hidden rounded-full bg-muted/50">
                        <View
                            className={cn(
                                "h-full rounded-full",
                                isAtLimit ? "bg-destructive" : isHighUsage ? "bg-amber-500" : "bg-primary"
                            )}
                            style={{ width: `${percentage}%` }}
                        />
                    </View>
                    <View className="mt-2 flex-row justify-between">
                        <Text className="text-[10px] font-bold text-muted-foreground/40 uppercase">Kullanım: %{Math.round(percentage)}</Text>
                        {isHighLimit(limit) && !isAtLimit && (
                            <Text className="text-[10px] font-bold text-primary/60 uppercase">Pro Avantajı</Text>
                        )}
                    </View>
                </View>
            )}
        </Card>
    );
};

const isHighLimit = (limit: number) => limit > 50;

export const UsageScreen: React.FC = () => {
    const { usage, isLoading, isError, refetch } = useUsageData();
    const router = useRouter();

    if (isLoading) {
        return (
            <SafeAreaView className="flex-1 bg-background">
                <View className="flex-1 items-center justify-center">
                    <ActivityIndicator size="large" color="hsl(var(--primary))" />
                </View>
            </SafeAreaView>
        );
    }

    if (isError || !usage) {
        return (
            <SafeAreaView className="flex-1 bg-background">
                <View className="flex-1 items-center justify-center px-8">
                    <Text className="mb-4 text-center text-lg font-bold text-foreground">
                        Bilgiler Yüklenemedi
                    </Text>
                    <Button variant="outline" className="rounded-2xl" onPress={() => refetch()}>
                        <Text className="font-bold">Tekrar Dene</Text>
                    </Button>
                </View>
            </SafeAreaView>
        );
    }

    const planLabel = PLAN_LABELS[usage.plan] || usage.plan;
    const features = Object.entries(usage.usage) as [UpgradeFeature, { used: number; limit: number; unlimited: boolean }][];

    return (
        <SafeAreaView className="flex-1 bg-background">
            <ScrollView
                className="flex-1"
                contentContainerStyle={{ paddingBottom: 160 }}
                showsVerticalScrollIndicator={false}
            >
                {/* Header Card */}
                <View className="px-6 pt-8">

                    <View className="flex-row items-center justify-between">
                        <View>
                            <Text className="text-sm font-bold uppercase tracking-[0.2em] text-primary-foreground/70">
                                Aktif Paketin
                            </Text>
                            <Text className="mt-1 text-3xl font-black text-primary-foreground tracking-tighter">
                                {planLabel}
                            </Text>
                            <View className="mt-4 flex-row items-center rounded-full bg-white/20 px-3 py-1.5 self-start">
                                <Text className="text-xs font-bold text-primary-foreground">
                                    Yenilenme: {usage.period === 'monthly' ? 'Aylık' : usage.period === 'semester' ? 'Dönemlik (3 ay)' : 'Yıllık'}
                                </Text>
                            </View>
                        </View>
                        <View className="h-20 w-20 items-center justify-center rounded-3xl bg-white/20 rotate-12">
                            <Icon as={Crown} size={48} className="text-white" />
                        </View>
                    </View>
                </View>

                {/* Feature Usage Section */}
                <View className="mt-10 px-6">
                    <View className="mb-6 flex-row items-center justify-between px-2">
                        <Text className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground/50">
                            Limitlerin ve Kullanımın
                        </Text>
                        <View className="h-1 w-12 rounded-full bg-primary/10" />
                    </View>

                    {features.map(([feature, data]) => (
                        <FeatureCard
                            key={feature}
                            feature={feature}
                            used={data.used}
                            limit={data.limit}
                            unlimited={data.unlimited}
                        />
                    ))}

                </View>
            </ScrollView>

            {/* Floating Action Area */}
            {usage.plan === 'free' && (
                <View className="absolute bottom-12 left-0 right-0 px-6">
                    <Button
                        variant="default"
                        size="lg"
                        onPress={() => router.push('/(app)/subscription/paywall')}
                    >
                        <Icon as={Sparkles} size={20} className="text-primary-foreground" />
                        <Text className="text-xl font-black text-primary-foreground tracking-tight">Kısıtlamaları Kaldır</Text>
                    </Button>
                </View>
            )}
        </SafeAreaView>
    );
};
