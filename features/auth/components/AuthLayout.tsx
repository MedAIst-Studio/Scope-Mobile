import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import { cn } from '@/lib/utils';
import { StatusBar } from 'expo-status-bar';
import { ArrowLeft, Box, Mail } from 'lucide-react-native';
import React, { ReactNode, useEffect, useRef, useState } from 'react';
import {
  Animated,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const google = require('@/assets/images/google.png');

interface SocialLoginButtonProps {
  provider: 'google' | 'facebook' | 'email';
  onPress: () => void;
  disabled?: boolean;
  className?: string;
  isLoading?: boolean;
}

const providerConfig = {
  google: {
    label: 'Google ile devam et',
    backgroundColor: 'bg-card',
    textColor: 'text-foreground',
    borderColor: 'border-border/40',
    icon: <Image source={google} className="h-5 w-5" />,
  },
  facebook: {
    label: 'Facebook ile devam et',
    backgroundColor: 'bg-[#1877F2]',
    textColor: 'text-white',
    borderColor: 'border-[#1877F2]',
    icon: <Icon as={Box} size={20} color="#FFFFFF" />,
  },
  email: {
    label: 'E-posta ile devam et',
    backgroundColor: 'bg-secondary/50',
    textColor: 'text-foreground',
    borderColor: 'border-transparent',
    icon: <Icon as={Mail} size={20} className="text-primary" />,
  },
};

function SocialLoginButton({
  provider,
  onPress,
  disabled = false,
  className,
  isLoading = false,
}: SocialLoginButtonProps) {
  const config = providerConfig[provider];

  return (
    <Button
      onPress={onPress}
      disabled={disabled || isLoading}
      variant="ghost"
      className={cn(
        'h-14 flex-row items-center justify-center rounded-2xl border px-4 shadow-sm active:scale-[0.98]',
        config.backgroundColor,
        config.borderColor,
        disabled && 'opacity-50',
        className
      )}>
      <View className="mr-3">{config.icon}</View>
      <Text className={cn('text-base font-bold tracking-tight', config.textColor)}>
        {isLoading ? 'Bağlanıyor...' : config.label}
      </Text>
    </Button>
  );
}

function SocialLoginDivider() {
  return (
    <View className="flex-row items-center gap-4 py-6">
      <View className="h-px flex-1 bg-border/40" />
      <Text className="text-xs font-bold uppercase tracking-widest text-muted-foreground/30">
        ya da
      </Text>
      <View className="h-px flex-1 bg-border/40" />
    </View>
  );
}

interface AuthLayoutProps {
  children: ReactNode;
  title: string;
  subtitle?: string;
  showLogo?: boolean;
  className?: string;
  onGoogleLogin?: () => void;
  onFacebookLogin?: () => void;
  isLoading?: boolean;
  enableSocialLogin?: boolean;
}

export function AuthLayout({
  children,
  className,
  onGoogleLogin,
  onFacebookLogin,
  isLoading = false,
  enableSocialLogin = false,
}: AuthLayoutProps) {
  const [showEmailForm, setShowEmailForm] = useState(!enableSocialLogin);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handleEmailLogin = () => setShowEmailForm(true);
  const handleBackToSocial = () => setShowEmailForm(false);

  return (
    <View className="flex-1 bg-background">
      <StatusBar style="auto" />

      <SafeAreaView className="flex-1">
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          className="flex-1"
          keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 60}>
          <ScrollView
            className="flex-1"
            contentContainerStyle={{ flexGrow: 1 }}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}>
            <View className="flex-1 justify-center px-4 py-6">
              <Animated.View
                style={{
                  opacity: fadeAnim,
                  transform: [{ translateY: slideAnim }],
                }}
                className={cn('mx-auto w-full max-w-sm', className)}>
                {enableSocialLogin && !showEmailForm ? (
                  <View className="flex flex-col gap-4">
                    {onGoogleLogin && (
                      <SocialLoginButton
                        provider="google"
                        onPress={onGoogleLogin}
                        disabled={isLoading}
                        isLoading={isLoading}
                      />
                    )}

                    {onFacebookLogin && (
                      <SocialLoginButton
                        provider="facebook"
                        onPress={onFacebookLogin}
                        disabled={isLoading}
                        isLoading={isLoading}
                      />
                    )}

                    <SocialLoginDivider />

                    <SocialLoginButton
                      provider="email"
                      onPress={handleEmailLogin}
                      disabled={isLoading}
                    />
                  </View>
                ) : (
                  <View>
                    {enableSocialLogin && (
                      <TouchableOpacity
                        onPress={handleBackToSocial}
                        className="mb-8 flex-row items-center">
                        <View className="mr-3 h-10 w-10 items-center justify-center rounded-xl bg-secondary/50">
                          <Icon as={ArrowLeft} size={18} className="text-muted-foreground" />
                        </View>
                        <Text className="font-bold text-muted-foreground/60">Sosyal Giriş</Text>
                      </TouchableOpacity>
                    )}

                    <View className="rounded-[2.5rem] border border-border/20 bg-card p-6 shadow-sm">
                      {children}
                    </View>
                  </View>
                )}
              </Animated.View>

              <View className="mt-8 items-center">
                <Text className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/20">
                  Kuaru Labs tarafından geliştirilmiştir
                </Text>
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
}

interface AuthPageLayoutProps {
  children: ReactNode;
  className?: string;
}

export function LoginLayout({
  children,
  className,
  onGoogleLogin,
  onFacebookLogin,
  isLoading,
}: AuthPageLayoutProps & {
  onGoogleLogin?: () => void;
  onFacebookLogin?: () => void;
  isLoading?: boolean;
}) {
  return (
    <AuthLayout
      title="Hoş Geldiniz"
      subtitle="YKS hazırlık asistanına erişmek için oturum açın."
      className={className}
      enableSocialLogin={true}
      onGoogleLogin={onGoogleLogin}
      onFacebookLogin={onFacebookLogin}
      isLoading={isLoading}>
      {children}
    </AuthLayout>
  );
}

export function SignupLayout({
  children,
  className,
  onGoogleLogin,
  onFacebookLogin,
  isLoading,
}: AuthPageLayoutProps & {
  onGoogleLogin?: () => void;
  onFacebookLogin?: () => void;
  isLoading?: boolean;
}) {
  return (
    <AuthLayout
      title="Bize Katılın"
      subtitle="Kendi başarı yolculuğunuzu başlatmak için hemen hesap oluşturun."
      className={className}
      enableSocialLogin={true}
      onGoogleLogin={onGoogleLogin}
      onFacebookLogin={onFacebookLogin}
      isLoading={isLoading}>
      {children}
    </AuthLayout>
  );
}

export function ForgotPasswordLayout({ children, className }: AuthPageLayoutProps) {
  return (
    <AuthLayout
      title="Şifre Kurtarma"
      subtitle="Hesap güvenliğiniz için e-posta adresinizi girmeniz yeterli."
      className={className}
      enableSocialLogin={false}>
      {children}
    </AuthLayout>
  );
}

export function AuthCard({ children, className }: AuthPageLayoutProps) {
  return (
    <View
      className={cn(
        'w-full rounded-[2.5rem] border border-border/20 bg-card p-8 shadow-sm',
        'web:mx-auto web:max-w-md',
        className
      )}>
      {children}
    </View>
  );
}

export { SocialLoginButton, SocialLoginDivider };
