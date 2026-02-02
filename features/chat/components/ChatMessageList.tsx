import { Icon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import { LinearGradient } from 'expo-linear-gradient';
import { ChevronRight, Sparkles } from 'lucide-react-native';
import React, { useEffect } from 'react';
import { ScrollView, TouchableOpacity, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { Message as MessageType } from '../validations';
import { Message } from './Message';

interface ChatMessageListProps {
  messages: MessageType[];
  scrollViewRef: React.RefObject<ScrollView | null>;
  onQuestionPress: (text: string) => void;
  isTyping?: boolean;
}

const TypingIndicator = () => {
  const dot1 = useSharedValue(0.4);
  const dot2 = useSharedValue(0.4);
  const dot3 = useSharedValue(0.4);
  const sparklesRotation = useSharedValue(0);
  const sparklesScale = useSharedValue(1);

  useEffect(() => {
    const duration = 600;
    dot1.value = withRepeat(
      withSequence(withTiming(1, { duration }), withTiming(0.4, { duration })),
      -1,
      true
    );
    dot2.value = withDelay(
      200,
      withRepeat(withSequence(withTiming(1, { duration }), withTiming(0.4, { duration })), -1, true)
    );
    dot3.value = withDelay(
      400,
      withRepeat(withSequence(withTiming(1, { duration }), withTiming(0.4, { duration })), -1, true)
    );

    sparklesRotation.value = withRepeat(withTiming(360, { duration: 4000 }), -1, false);
    sparklesScale.value = withRepeat(
      withSequence(withTiming(1.3, { duration: 1000 }), withTiming(1, { duration: 1000 })),
      -1,
      true
    );
  }, []);

  const animatedStyle1 = useAnimatedStyle(() => ({
    opacity: dot1.value,
    transform: [{ scale: dot1.value }],
  }));
  const animatedStyle2 = useAnimatedStyle(() => ({
    opacity: dot2.value,
    transform: [{ scale: dot2.value }],
  }));
  const animatedStyle3 = useAnimatedStyle(() => ({
    opacity: dot3.value,
    transform: [{ scale: dot3.value }],
  }));
  const sparklesStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${sparklesRotation.value}deg` }, { scale: sparklesScale.value }],
  }));

  return (
    <View className="mb-6 flex-row items-center gap-3 pl-1">
      <View className="relative h-10 w-10 items-center justify-center">
        <Animated.View style={sparklesStyle}>
          <Icon as={Sparkles} size={26} className="text-primary" />
        </Animated.View>
        <View className="absolute inset-0 items-center justify-center">
          <View className="h-8 w-8 rounded-full bg-primary/10 blur-xl" />
        </View>
      </View>
      <LinearGradient
        colors={['rgba(249, 115, 22, 0.15)', 'rgba(249, 115, 22, 0.05)']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{ borderTopLeftRadius: 0, borderRadius: 16 }}
        className="flex-row items-center gap-2 border border-primary/20 px-5 py-3.5 shadow-sm shadow-primary/10">
        <Animated.View style={animatedStyle1} className="h-2 w-2 rounded-full bg-primary" />
        <Animated.View style={animatedStyle2} className="h-2 w-2 rounded-full bg-primary" />
        <Animated.View style={animatedStyle3} className="h-2 w-2 rounded-full bg-primary" />
      </LinearGradient>
    </View>
  );
};

const SUGGESTED_QUESTIONS = [
  'Bu soruyu çözmeme yardım eder misin?',
  'Problemin mantığını anlatır mısın?',
  'Bu konuyu özetleyip püf noktalarını söyler misin?',
  'Hatalı yaptığım yeri bulabilir misin?',
];

export const ChatMessageList: React.FC<ChatMessageListProps> = ({
  messages,
  scrollViewRef,
  onQuestionPress,
  isTyping,
}) => (
  <ScrollView
    ref={scrollViewRef}
    className="flex-1 px-4"
    contentContainerStyle={{ paddingTop: 16, paddingBottom: 24 }}
    showsVerticalScrollIndicator={false}
    keyboardShouldPersistTaps="handled">
    {messages.map((message, index) => (
      <Message key={`${message.timestamp}-${index}`} message={message} />
    ))}

    {isTyping && <TypingIndicator />}

    {messages.length === 0 && !isTyping ? (
      <View className="mt-16 items-center px-6">
        <Text className="mb-2 text-center text-3xl font-bold tracking-tight text-foreground">
          Başarılar!
        </Text>
        <Text className="mb-12 text-center text-[15px] leading-relaxed text-muted-foreground/60">
          Sınav hazırlık sürecinde çözemediğin soruları veya anlamadığın konuları sorabilirsin.
        </Text>

        <View className="w-full gap-3">
          <View className="mb-1 flex-row items-center gap-2">
            <View className="h-[1px] flex-1 bg-border/40" />
            <Text className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground/40">
              Hızlı Başlangıç
            </Text>
            <View className="h-[1px] flex-1 bg-border/40" />
          </View>

          {SUGGESTED_QUESTIONS.map((q, i) => (
            <TouchableOpacity
              key={i}
              onPress={() => onQuestionPress(q)}
              activeOpacity={0.7}
              className="active:scale-[0.98]">
              <LinearGradient
                colors={['transparent', 'rgba(249, 115, 22, 0.02)']}
                style={{ borderRadius: 16 }}
                className="flex-row items-center justify-between border border-border/40 bg-card/30 p-4">
                <Text className="flex-1 text-[14px] font-semibold text-foreground/80">{q}</Text>
                <Icon as={ChevronRight} size={16} className="text-muted-foreground/30" />
              </LinearGradient>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    ) : null}
  </ScrollView>
);
