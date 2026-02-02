import { Icon } from '@/components/ui/icon';
import { cn } from '@/lib/utils';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { Camera, ChevronRight, GraduationCap, MessageSquare, Sparkles } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import { Dimensions, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Animated, {
  FadeInDown,
  FadeInRight,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width, height } = Dimensions.get('window');

const ONBOARDING_DATA = [
  {
    title: 'Hedeflerine Odaklan,\nBaşarıyı Yakala',
    description:
      'YKS hazırlık sürecinde yapay zeka desteğiyle rakiplerinin önüne geç. Her an yanında!',
    icon: Sparkles,
    colors: ['#F97316', '#FB923C', '#FDBA74'],
    demo: 'welcome',
  },
  {
    title: 'Saniyeler İçinde\nDetaylı Çözüm',
    description:
      'Çözemediğin sorunun fotoğrafını çek, yapay zeka saniyeler içinde adım adım anlatsın.',
    icon: Camera,
    colors: ['#8B5CF6', '#A78BFA', '#C4B5FD'],
    demo: 'scan',
  },
  {
    title: 'Anlamadığın\nKonu Kalmasın',
    description:
      '7/24 yanındaki özel hocanla sohbet et, takıldığın yerleri en ince ayrıntısına kadar öğren.',
    icon: MessageSquare,
    colors: ['#06B6D4', '#22D3EE', '#67E8F9'],
    demo: 'chat',
  },
  {
    title: 'Gelişimini Kararlılıkla\nKanıtla',
    description:
      'Kişiselleştirilmiş testlerle eksiklerini kapat, ilerlemeni istatistiklerle takip et.',
    icon: GraduationCap,
    colors: ['#10B981', '#34D399', '#6EE7B7'],
    demo: 'quiz',
  },
];

const WelcomeDemo = () => {
  const rotation = useSharedValue(0);
  const scale = useSharedValue(1);

  useEffect(() => {
    rotation.value = withRepeat(withTiming(360, { duration: 10000 }), -1, false);
    scale.value = withRepeat(
      withSequence(withTiming(1.2, { duration: 2000 }), withTiming(1, { duration: 2000 })),
      -1,
      true
    );
  }, []);

  const style = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation.value}deg` }, { scale: scale.value }],
  }));

  return (
    <View className="items-center justify-center">
      <Animated.View style={style} className="h-40 w-40 items-center justify-center">
        <LinearGradient
          colors={['rgba(249, 115, 22, 0.4)', 'transparent']}
          style={{ borderRadius: 9999 }}
          className="absolute h-full w-full"
        />
        <Icon as={Sparkles} size={88} className="text-primary" />
      </Animated.View>
    </View>
  );
};

const ScanDemo = () => {
  const scanPos = useSharedValue(-80);
  const iconPulse = useSharedValue(1);

  useEffect(() => {
    scanPos.value = withRepeat(
      withSequence(withTiming(80, { duration: 1500 }), withTiming(-80, { duration: 1500 })),
      -1,
      true
    );
    iconPulse.value = withRepeat(
      withSequence(withTiming(1.1, { duration: 1000 }), withTiming(1, { duration: 1000 })),
      -1,
      true
    );
  }, []);

  const lineStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: scanPos.value }],
  }));

  const iconStyle = useAnimatedStyle(() => ({
    transform: [{ scale: iconPulse.value }],
    opacity: 0.2 + (iconPulse.value - 1) * 2,
  }));

  return (
    <View className="h-48 w-48 items-center justify-center overflow-hidden rounded-[2.5rem] border-2 border-white/20 bg-white/5">
      <Animated.View style={iconStyle}>
        <Icon as={Camera} size={80} className="text-white" />
      </Animated.View>
      <Animated.View
        style={[
          lineStyle,
          {
            height: 3,
            width: '100%',
            backgroundColor: '#F97316',
            position: 'absolute',
            shadowColor: '#F97316',
            shadowOpacity: 1,
            shadowRadius: 15,
            elevation: 15,
          },
        ]}
      />
    </View>
  );
};

const ChatDemo = () => {
  return (
    <View className="w-full gap-4 px-12">
      <Animated.View
        entering={FadeInRight.delay(500)}
        className="max-w-[80%] self-start rounded-2xl rounded-tl-none bg-white/10 p-4">
        <Text className="text-xs text-white/60">AI Hoca</Text>
        <Text className="mt-1 font-medium text-white">Bu konuyu anlamana yardımcı olabilirim!</Text>
      </Animated.View>
      <Animated.View
        entering={FadeInRight.delay(1500)}
        className="max-w-[80%] self-end rounded-2xl rounded-tr-none bg-primary p-4">
        <Text className="font-medium text-white">Logaritma mantığını anlatır mısın?</Text>
      </Animated.View>
    </View>
  );
};

const QuizDemo = () => {
  const progress = useSharedValue(0);

  useEffect(() => {
    progress.value = withRepeat(withTiming(1, { duration: 3000 }), -1, true);
  }, []);

  const progressStyle = useAnimatedStyle(() => ({
    width: `${progress.value * 100}%`,
  }));

  return (
    <View className="w-64 gap-6">
      <View className="h-6 w-full overflow-hidden rounded-full bg-white/10">
        <Animated.View style={progressStyle} className="h-full bg-emerald-500" />
      </View>
      <View className="flex-row justify-between">
        {[1, 2, 3].map((i) => (
          <Animated.View
            key={i}
            entering={FadeInDown.delay(i * 300)}
            className="h-12 w-12 items-center justify-center rounded-2xl border border-emerald-500/40 bg-emerald-500/20">
            <Icon as={GraduationCap} size={24} className="text-emerald-500" />
          </Animated.View>
        ))}
      </View>
    </View>
  );
};

export const Onboarding: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const router = useRouter();

  const handleNext = () => {
    if (currentIndex < ONBOARDING_DATA.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      router.replace('/(auth)/login');
    }
  };

  const currentStep = ONBOARDING_DATA[currentIndex] || ONBOARDING_DATA[0];
  const primaryColor = currentStep.colors[0];

  return (
    <View className="flex-1 bg-[#09090B]">
      <LinearGradient
        colors={[`${primaryColor}33`, 'transparent']}
        style={StyleSheet.absoluteFill}
      />

      <SafeAreaView className="flex-1">
        {/* Skip Button */}
        <View className="flex-row justify-end px-6 pt-4">
          <TouchableOpacity onPress={() => router.replace('/(auth)/login')}>
            <Text className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
              Atla
            </Text>
          </TouchableOpacity>
        </View>

        {/* Content Area */}
        <View className="flex-1 items-center justify-center px-8">
          <View className="mb-12 h-64 w-full items-center justify-center">
            <Animated.View
              key={`demo-${currentIndex}`}
              entering={FadeInDown.duration(1000).springify()}
              className="w-full items-center justify-center">
              {currentIndex === 0 && <WelcomeDemo />}
              {currentIndex === 1 && <ScanDemo />}
              {currentIndex === 2 && <ChatDemo />}
              {currentIndex === 3 && <QuizDemo />}
            </Animated.View>
          </View>

          <Animated.View
            key={`title-${currentIndex}`}
            entering={FadeInDown.duration(800).springify()}
            className="items-center px-4">
            <Text className="mb-4 px-2 text-center text-3xl font-bold leading-tight tracking-tight text-white">
              {currentStep.title}
            </Text>
            <Animated.View entering={FadeInDown.delay(200).duration(800).springify()}>
              <Text className="text-center text-base leading-relaxed text-muted-foreground/80">
                {currentStep.description}
              </Text>
            </Animated.View>
          </Animated.View>
        </View>

        {/* Footer */}
        <View className="px-8 pb-12">
          {/* Progress Indicators */}
          <View className="mb-10 flex-row justify-center gap-2">
            {ONBOARDING_DATA.map((_, i) => (
              <View
                key={i}
                className={cn(
                  'h-1.5 rounded-full transition-all duration-300',
                  i === currentIndex ? 'w-8 bg-primary' : 'w-1.5 bg-white/20'
                )}
              />
            ))}
          </View>

          {/* Action Button */}
          <TouchableOpacity
            onPress={handleNext}
            activeOpacity={0.8}
            className="h-20 w-full flex-row items-center justify-center rounded-[2rem] bg-primary shadow-xl shadow-primary/30">
            <Text className="mr-2 text-xl font-bold text-white">
              {currentIndex === ONBOARDING_DATA.length - 1 ? 'Hemen Başla' : 'Devam Et'}
            </Text>
            <Icon as={ChevronRight} size={24} className="text-white" />
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </View>
  );
};
