import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import LottieView from 'lottie-react-native';
import { Calendar, CheckCircle2, ChevronLeft, Flame, ShieldCheck, Star, Trophy, Zap } from 'lucide-react-native';
import React, { useEffect, useMemo } from 'react';
import { ActivityIndicator, Dimensions, ScrollView, View } from 'react-native';
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withDelay,
    withRepeat,
    withSpring,
    withTiming
} from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Text } from '@/components/ui/text';
import { useStreak } from '@/features/streaks/hooks';
import { cn } from '@/lib/utils';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const STREAK_RULES = [
    {
        id: 1,
        title: 'Günlük Soru Çöz',
        description: 'Her gün en az bir soru taratarak veya çözerek serini koru.',
        icon: Calendar,
    },
    {
        id: 2,
        title: 'Hedeflerine Ulaş',
        description: 'Günlük çalışma hedeflerini tamamla ve ekstra puan kazan.',
        icon: Trophy,
    },
    {
        id: 3,
        title: 'Düzenli Ol',
        description: 'Üst üste 7 gün aktif olursan özel rozet kazanırsın.',
        icon: CheckCircle2,
    },
];

const WEEK_DAYS = ['P', 'S', 'Ç', 'P', 'C', 'C', 'P'] as const;

function getCurrentWeekDates(): string[] {
    const today = new Date();
    const dayOfWeek = today.getDay();
    const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;

    return Array.from({ length: 7 }, (_, i) => {
        const d = new Date(today);
        d.setDate(today.getDate() + mondayOffset + i);
        return d.toISOString().split('T')[0];
    });
}

const GET_RANK = (count: number) => {
    if (count <= 2) return { label: 'Çaylak', icon: Star, color: '#94a3b8' };
    if (count <= 6) return { label: 'Ateş Parçası', icon: Flame, color: '#f97316' };
    if (count <= 14) return { label: 'Alev Ustası', icon: Zap, color: '#fbbf24' };
    if (count <= 29) return { label: 'Güneş Çocuğu', icon: ShieldCheck, color: '#f59e0b' };
    return { label: 'Kozmik Işık', icon: Trophy, color: '#8b5cf6' };
};

const BackgroundParticle = ({ delay = 0, duration = 3000, size = 20, x = 0, y = 0 }) => {
    const translateY = useSharedValue(0);
    const opacity = useSharedValue(0.4);

    useEffect(() => {
        translateY.value = withRepeat(
            withDelay(delay, withTiming(-50, { duration })),
            -1,
            true
        );
        opacity.value = withRepeat(
            withDelay(delay, withTiming(0.1, { duration })),
            -1,
            true
        );
    }, []);

    const style = useAnimatedStyle(() => ({
        transform: [{ translateY: translateY.value }],
        opacity: opacity.value,
    }));

    return (
        <Animated.View
            style={[{
                position: 'absolute',
                width: size,
                height: size,
                borderRadius: size,
                backgroundColor: 'rgba(255,255,255,0.2)',
                left: x,
                top: y
            }, style]}
        />
    );
};

export default function StreakScreen() {
    const router = useRouter();
    const { data: streak, isLoading } = useStreak();

    const lottieScale = useSharedValue(0.5);
    const lottieOpacity = useSharedValue(0);
    const cardTranslateY = useSharedValue(50);
    const cardOpacity = useSharedValue(0);

    useEffect(() => {
        if (!isLoading) {
            lottieScale.value = withSpring(1);
            lottieOpacity.value = withSpring(1);
            cardTranslateY.value = withDelay(200, withSpring(0));
            cardOpacity.value = withDelay(200, withSpring(1));
        }
    }, [isLoading]);

    const lottieStyle = useAnimatedStyle(() => ({
        opacity: lottieOpacity.value,
        transform: [{ scale: lottieScale.value }],
    }));

    const cardStyle = useAnimatedStyle(() => ({
        opacity: cardOpacity.value,
        transform: [{ translateY: cardTranslateY.value }],
    }));

    const weekDates = getCurrentWeekDates();
    const activeDatesSet = useMemo(() => new Set(streak?.recent_active_dates ?? []), [streak]);
    const hasStreak = (streak?.current_streak ?? 0) > 0;
    const rank = GET_RANK(streak?.current_streak ?? 0);

    if (isLoading) {
        return (
            <View className="flex-1 bg-background items-center justify-center">
                <ActivityIndicator size="large" color="#f97316" />
            </View>
        );
    }

    return (
        <View className="flex-1 bg-background pb-4">
            <ScrollView showsVerticalScrollIndicator={false} bounces={false}>
                <LinearGradient
                    colors={hasStreak ? ['#f97316', '#ea580c', '#c2410c'] : ['#334155', '#1e293b', '#0f172a']}
                    className="pb-24 pt-16 px-6 rounded-b-[4rem] overflow-hidden"
                >
                    {/* Background Particles */}
                    <BackgroundParticle x={50} y={150} size={40} duration={4000} delay={0} />
                    <BackgroundParticle x={SCREEN_WIDTH - 80} y={100} size={25} duration={3000} delay={500} />
                    <BackgroundParticle x={SCREEN_WIDTH / 2} y={250} size={15} duration={5000} delay={1000} />

                    <SafeAreaView edges={['top']}>
                        <Button
                            variant="ghost"
                            size="icon"
                            onPress={() => router.back()}
                            className="bg-white/20 self-start p-3 rounded-2xl mb-4 border border-white/10 h-12 w-12"
                        >
                            <ChevronLeft color="white" size={24} />
                        </Button>

                        <View className="items-center">
                            <Badge variant="outline" className="bg-white/20 border-white/20 mb-4 px-4 py-1.5 h-8">
                                <rank.icon size={14} color="white" className="mr-2" />
                                <Text className="text-white text-[10px] font-bold uppercase tracking-[2px]">
                                    {rank.label}
                                </Text>
                            </Badge>

                            <Animated.View style={lottieStyle}>
                                <View className="relative">
                                    <View className="absolute inset-0 bg-white/10 rounded-full scale-150 blur-2xl" />
                                    <LottieView
                                        autoPlay
                                        loop
                                        style={{
                                            width: 220,
                                            height: 220,
                                            opacity: hasStreak ? 1 : 0.6
                                        }}
                                        source={require("@/assets/animations/fire.json")}
                                    />
                                </View>
                            </Animated.View>

                            {hasStreak ? (
                                <View className="mt-2 items-center">
                                    <Text className="text-white text-7xl font-black tracking-tighter leading-none">
                                        {streak?.current_streak ?? 0}
                                    </Text>
                                    <Text className="text-white/80 text-lg font-bold uppercase tracking-[4px] mt-1 text-center">
                                        Günlük Seri
                                    </Text>
                                </View>
                            ) : (
                                <View className="mt-6 items-center">
                                    <Text className="text-white text-3xl font-black tracking-tight text-center px-4 leading-tight">
                                        Serin Henüz Başlamadı
                                    </Text>
                                    <Text className="text-white/70 text-sm mt-3 text-center px-12 leading-5 italic">
                                        "Her yolculuk ilk adımla başlar. Bugün o adımı at ve ilk serini başlat!"
                                    </Text>
                                </View>
                            )}

                            {(streak?.max_streak ?? 0) > 0 && (
                                <Badge variant="outline" className="mt-6 bg-white/20 px-6 py-2 rounded-2xl border border-white/20 shadow-lg h-10">
                                    <Text className="text-white font-bold text-xs uppercase tracking-wider">
                                        REKORUN: {streak?.max_streak} GÜN 🏆
                                    </Text>
                                </Badge>
                            )}
                        </View>
                    </SafeAreaView>
                </LinearGradient>

                <View className="px-6 -mt-12">
                    <Animated.View style={cardStyle}>
                        <Card className="p-8 rounded-[3rem] shadow-2xl shadow-black/10 border border-border/60 backdrop-blur-xl">
                            <CardHeader className="flex-row items-center justify-between mb-8 p-0">
                                <CardTitle className="text-2xl font-black tracking-tight">
                                    {hasStreak ? 'Serini Koru' : 'Hadi Başla!'}
                                </CardTitle>
                                <View className={cn("w-12 h-1 rounded-full", hasStreak ? 'bg-orange-500' : 'bg-slate-400')} />
                            </CardHeader>

                            <CardContent className="gap-8 p-0 pt-0">
                                {STREAK_RULES.map((item) => {
                                    const Icon = item.icon;
                                    return (
                                        <View key={item.id} className="flex-row items-center gap-5">
                                            <View
                                                className={cn(
                                                    "w-14 h-14 rounded-2xl items-center justify-center shadow-sm",
                                                    hasStreak ? 'bg-orange-500/10' : 'bg-secondary'
                                                )}
                                                style={{ transform: [{ rotate: '-10deg' }] }}
                                            >
                                                <Icon size={28} color={hasStreak ? "#f97316" : "#64748b"} />
                                            </View>
                                            <View className="flex-1">
                                                <Text className="text-lg font-bold leading-tight">{item.title}</Text>
                                                <CardDescription className="text-xs mt-1 leading-4">
                                                    {item.description}
                                                </CardDescription>
                                            </View>
                                        </View>
                                    );
                                })}
                            </CardContent>

                            {!hasStreak && (
                                <Button
                                    className="mt-10 overflow-hidden rounded-3xl h-16 p-0"
                                    variant={streak ? streak?.current_streak > 0 ? "default" : "secondary" : "secondary"}
                                    onPress={() => router.push('/(tabs)/scan')}
                                >
                                    <Text className="text-white font-bold text-lg uppercase tracking-wider">İLK SERİNİ BAŞLAT</Text>
                                </Button>
                            )}
                        </Card>
                    </Animated.View>

                    <View className="mt-10 mb-12">
                        <View className="flex-row items-center justify-between mb-5 px-2">
                            <Text className="text-xl font-black tracking-tight">Haftalık Yolculuk</Text>
                            <Text variant="muted" className="text-[10px] font-bold uppercase opacity-50">Özet</Text>
                        </View>

                        <Card className="px-0 py-6 rounded-[2.5rem] border border-border/40 shadow-lg shadow-black/5 overflow-hidden">
                            <ScrollView
                                horizontal
                                showsHorizontalScrollIndicator={false}
                                contentContainerStyle={{
                                    paddingHorizontal: 24,
                                    gap: 16,
                                    alignItems: 'center'
                                }}
                            >
                                {WEEK_DAYS.map((day, i) => {
                                    const isActive = activeDatesSet.has(weekDates[i]);
                                    const isToday = new Date().toISOString().split('T')[0] === weekDates[i];

                                    return (
                                        <View key={i} className="items-center gap-2">
                                            <View
                                                className={cn(
                                                    "w-12 h-12 rounded-2xl items-center justify-center border-2",
                                                    isActive
                                                        ? 'bg-orange-500 border-orange-400 shadow-lg shadow-orange-500/40'
                                                        : isToday
                                                            ? 'bg-secondary border-primary/30'
                                                            : 'bg-secondary/40 border-transparent'
                                                )}
                                            >
                                                {isActive ? (
                                                    <Flame size={20} color="white" />
                                                ) : (
                                                    <Text className={cn("font-black text-xs", isToday ? 'text-primary' : 'text-muted-foreground/30')}>
                                                        {day}
                                                    </Text>
                                                )}
                                            </View>
                                            {isToday && (
                                                <Badge variant="outline" className="h-5 px-2 bg-primary/10 border-primary/20">
                                                    <Text className="text-[8px] font-bold text-primary uppercase">BÜGÜN</Text>
                                                </Badge>
                                            )}
                                        </View>
                                    );
                                })}
                            </ScrollView>
                        </Card>
                    </View>
                </View>
            </ScrollView>
        </View>
    );
}
