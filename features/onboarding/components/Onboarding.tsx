import { Icon } from '@/components/ui/icon';
import { cn } from '@/lib/utils';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { Camera, ChevronRight, FileText, GraduationCap, MessageSquare, Search, Sparkles } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
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


const ONBOARDING_DATA = [
  {
    title: 'Notlarını Yükle,\nSınavını Garantile.',
    description:
      "Binlerce sayfa okumakla vakit kaybetme. PDF'lerini veya ders notlarını yükle, Scope senin için özetlesin ve anında Quiz yapsın.",
    icon: FileText,
    colors: ['#3B82F6', '#60A5FA', '#93C5FD'],
    demo: 'pdf',
  },
  {
    title: "Ezberleme,\nScope ile 'Hack'le.",
    description:
      'Sadece sohbet etme; yüklediğin kitaplardan ve notlardan nokta atışı cevaplar al. Senin arşivin, senin kuralların.',
    icon: MessageSquare,
    colors: ['#06B6D4', '#22D3EE', '#67E8F9'],
    demo: 'chat',
  },
  {
    title: 'Tıkandığın Yerde\nFotoğrafını Çek.',
    description:
      'Test kitabında çözemediğin soru mu var? Çek gönder, sadece cevabı değil mantığını öğren.',
    icon: Camera,
    colors: ['#8B5CF6', '#A78BFA', '#C4B5FD'],
    demo: 'scan',
  },
  {
    title: 'Üniversite Hayaline\n1 Tık Uzaktasın.',
    description:
      'YKS hazırlık sürecinde yapay zeka desteğiyle rakiplerinin önüne geç. Her an yanında!',
    icon: Sparkles,
    colors: ['#F97316', '#FB923C', '#FDBA74'],
    demo: 'welcome',
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
    <View className="h-48 w-48 items-center justify-center overflow-hidden rounded-[2.5rem] border-2 border-border bg-muted">
      <Animated.View style={iconStyle}>
        <Icon as={Camera} size={80} className="text-foreground" />
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

const PdfDemo = () => {
  const searchX = useSharedValue(-40);
  const searchY = useSharedValue(-40);
  const fileScale = useSharedValue(1);

  useEffect(() => {
    searchX.value = withRepeat(
      withSequence(
        withTiming(40, { duration: 2000 }),
        withTiming(40, { duration: 2000 }),
        withTiming(-40, { duration: 2000 }),
        withTiming(-40, { duration: 2000 })
      ),
      -1,
      true
    );
    searchY.value = withRepeat(
      withSequence(
        withTiming(-40, { duration: 2000 }),
        withTiming(40, { duration: 2000 }),
        withTiming(40, { duration: 2000 }),
        withTiming(-40, { duration: 2000 })
      ),
      -1,
      true
    );
    fileScale.value = withRepeat(
      withSequence(withTiming(1.05, { duration: 1000 }), withTiming(1, { duration: 1000 })),
      -1,
      true
    );
  }, []);

  const searchStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: searchX.value }, { translateY: searchY.value }],
  }));

  const fileStyle = useAnimatedStyle(() => ({
    transform: [{ scale: fileScale.value }],
  }));

  return (
    <View className="h-48 w-48 items-center justify-center">
      <Animated.View
        style={fileStyle}
        className="h-40 w-32 items-center justify-center rounded-2xl border-2 border-primary/20 bg-primary/10">
        <Icon as={FileText} size={64} className="text-primary" />
        <View className="absolute bottom-4 left-4 right-4 h-1 rounded-full bg-primary/20" />
        <View className="absolute bottom-8 left-4 right-8 h-1 rounded-full bg-primary/20" />
        <View className="absolute bottom-12 left-4 right-6 h-1 rounded-full bg-primary/20" />
      </Animated.View>
      <Animated.View
        style={[
          searchStyle,
          {
            position: 'absolute',
            backgroundColor: 'white',
            padding: 12,
            borderRadius: 999,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.1,
            shadowRadius: 10,
            elevation: 5,
          },
        ]}>
        <Icon as={Search} size={24} className="text-primary" />
      </Animated.View>
    </View>
  );
};

const ChatDemo = () => {
  return (
    <View className="w-full gap-4 px-12">
      <Animated.View
        entering={FadeInRight.delay(500)}
        className="max-w-[80%] self-start rounded-2xl rounded-tl-none bg-secondary p-4">
        <Text className="text-xs text-muted-foreground">AI Hoca</Text>
        <Text className="mt-1 font-medium text-foreground">Bu konuyu anlamana yardımcı olabilirim!</Text>
      </Animated.View>
      <Animated.View
        entering={FadeInRight.delay(1500)}
        className="max-w-[80%] self-end rounded-2xl rounded-tr-none bg-primary p-4">
        <Text className="font-medium text-primary-foreground">Logaritma mantığını anlatır mısın?</Text>
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
      <View className="h-6 w-full overflow-hidden rounded-full bg-muted">
        <Animated.View style={progressStyle} className="h-full bg-primary" />
      </View>
      <View className="flex-row justify-between">
        {[1, 2, 3].map((i) => (
          <Animated.View
            key={i}
            entering={FadeInDown.delay(i * 300)}
            className="h-12 w-12 items-center justify-center rounded-2xl border border-primary/40 bg-primary/20">
            <Icon as={GraduationCap} size={24} className="text-primary" />
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
    <View className="flex-1 bg-background">
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
              {currentIndex === 0 && <PdfDemo />}
              {currentIndex === 1 && <ChatDemo />}
              {currentIndex === 2 && <ScanDemo />}
              {currentIndex === 3 && <WelcomeDemo />}
            </Animated.View>
          </View>

          <Animated.View
            key={`title-${currentIndex}`}
            entering={FadeInDown.duration(800).springify()}
            className="items-center px-4">
            <Text className="mb-4 px-2 text-center text-3xl font-bold leading-tight tracking-tight text-foreground">
              {currentStep.title}
            </Text>
            <Animated.View entering={FadeInDown.delay(200).duration(800).springify()}>
              <Text className="text-center text-base leading-relaxed text-muted-foreground">
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
                  i === currentIndex ? 'w-8 bg-primary' : 'w-1.5 bg-muted'
                )}
              />
            ))}
          </View>

          {/* Action Button */}
          <TouchableOpacity
            onPress={handleNext}
            activeOpacity={0.8}
            className="h-20 w-full flex-row items-center justify-center rounded-[2rem] bg-primary shadow-lg shadow-primary/20">
            <Text className="mr-2 text-xl font-bold text-primary-foreground">
              {currentIndex === ONBOARDING_DATA.length - 1 ? 'Kendi Arşivini Oluştur' : 'Devam Et'}
            </Text>
            <Icon as={ChevronRight} size={24} className="text-primary-foreground" />
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </View>
  );
};
