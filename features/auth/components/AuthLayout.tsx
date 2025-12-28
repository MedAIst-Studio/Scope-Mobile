import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import { cn } from '@/lib/utils';
import { StatusBar } from 'expo-status-bar';
import React, { ReactNode, useState } from 'react';
import { Animated, Image, KeyboardAvoidingView, Platform, ScrollView, View } from 'react-native';
import { ArrowLeftIcon, EnvelopeIcon, GlobeAltIcon } from 'react-native-heroicons/outline';
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
    backgroundColor: 'bg-white',
    textColor: 'text-gray-900',
    borderColor: 'border-gray-300',
    icon: <Image source={google} className="h-4 w-4" />,
  },
  facebook: {
    label: 'Facebook ile devam et',
    backgroundColor: 'bg-primary',
    textColor: 'text-white',
    borderColor: 'border-primary-darker',
    icon: <Icon as={GlobeAltIcon} size={20} color="#FFFFFF" />,
  },
  email: {
    label: 'E-posta ile devam et',
    backgroundColor: 'bg-gray-100',
    textColor: 'text-gray-900',
    borderColor: 'border-gray-300',
    icon: <Icon as={EnvelopeIcon} size={20} />,
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
      className={cn(
        config.backgroundColor,
        config.borderColor,
        'active:opacity-80',
        disabled && 'opacity-50',
        className
      )}>
      {config.icon}
      <Text className={cn('font-medium', config.textColor)}>
        {isLoading ? 'Bağlanıyor...' : config.label}
      </Text>
    </Button>
  );
}

function SocialLoginDivider() {
  return (
    <View className="flex-row items-center gap-4 py-4">
      <View className="h-px flex-1 bg-border" />
      <Text className="text-sm text-muted-foreground">veya</Text>
      <View className="h-px flex-1 bg-border" />
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
  title,
  subtitle,
  className,
  onGoogleLogin,
  onFacebookLogin,
  isLoading = false,
  enableSocialLogin = false,
}: AuthLayoutProps) {
  const [showEmailForm, setShowEmailForm] = useState(!enableSocialLogin);
  const [fadeAnim] = useState(new Animated.Value(enableSocialLogin ? 0 : 1));
  const [slideAnim] = useState(new Animated.Value(enableSocialLogin ? -20 : 0));

  const handleEmailLogin = () => {
    setShowEmailForm(true);
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const handleBackToSocial = () => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: -20,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setShowEmailForm(false);
    });
  };
  return (
    <SafeAreaView className="flex-1 bg-white dark:bg-background">
      <StatusBar style="auto" />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 100}>
        <ScrollView
          className="flex-1"
          contentContainerStyle={{
            flexGrow: 1,
            paddingBottom: Platform.OS === 'ios' ? 20 : 40,
          }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}>
          <View className="flex-1 justify-center px-6 py-12">
            <View className="mb-8 items-center">
              <Text className="mb-2 text-center text-3xl font-bold text-foreground">{title}</Text>

              {subtitle && (
                <Text className="max-w-sm text-center text-base text-muted-foreground">
                  {subtitle}
                </Text>
              )}
            </View>

            <View className={cn('mx-auto w-full max-w-sm', className)}>
              {enableSocialLogin && !showEmailForm ? (
                <View className="flex flex-col gap-3">
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
                <Animated.View
                  style={
                    enableSocialLogin
                      ? {
                          opacity: fadeAnim,
                          transform: [{ translateY: slideAnim }],
                        }
                      : {}
                  }>
                  {enableSocialLogin && (
                    <View className="mb-4">
                      <Button variant={'outline'} onPress={handleBackToSocial}>
                        <Icon as={ArrowLeftIcon} />
                        <Text>Geri Dön</Text>
                      </Button>
                    </View>
                  )}

                  {children}
                </Animated.View>
              )}
            </View>

            <View className="mt-8" />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
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
      subtitle="Hesabınıza giriş yapın"
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
      title="Hesap Oluşturun"
      subtitle="Yeni bir hesap oluşturun ve başlayın"
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
      title="Şifremi Unuttum"
      subtitle="E-posta adresinizi girin, size şifre sıfırlama bağlantısı gönderelim"
      showLogo={false}
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
        'w-full rounded-lg border border-border bg-card p-6 shadow-sm',
        'web:mx-auto web:max-w-md',
        className
      )}>
      {children}
    </View>
  );
}

export { SocialLoginButton, SocialLoginDivider };
