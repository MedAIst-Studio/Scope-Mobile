import { DynamicFormField, FormFieldType } from '@/components/shared/DynamicFormField';
import { FormAlert } from '@/components/shared/FormAlert';
import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { useLegalStore } from '@/features/legal/stores/useLegalStore';
import { cn } from '@/lib/utils';
import { Link, useRouter } from 'expo-router';
import React from 'react';
import { Controller } from 'react-hook-form';
import { ActivityIndicator, Alert, TouchableOpacity, View } from 'react-native';
import { useSignupForm, useSocialAuth } from '../hooks/useAuthForms';
import { SignupLayout } from './AuthLayout';

type SignupFormData = Parameters<ReturnType<typeof useSignupForm>['onSubmit']>[0];

function SignupFormContent({
  form,
  isLoading,
  error,
  onSubmit,
}: {
  form: ReturnType<typeof useSignupForm>['form'];
  isLoading: boolean;
  error: string | null;
  onSubmit: (data: SignupFormData) => void;
}) {
  const router = useRouter();
  return (
    <View className="flex flex-col gap-6">
      <View className="flex flex-col gap-4">
        <FormAlert message={error} />
        <DynamicFormField
          control={form.control}
          disabled={isLoading}
          label="Kullanıcı Adı"
          name="username"
          placeholder="Kullanıcı adınız"
          type={FormFieldType.INPUT}
          required
        />

        <DynamicFormField
          control={form.control}
          disabled={isLoading}
          label="E-posta"
          name="email"
          placeholder="E-posta adresiniz"
          type={FormFieldType.EMAIL}
          required
        />

        <DynamicFormField
          control={form.control}
          disabled={isLoading}
          label="Şifre"
          name="password"
          placeholder="Şifreniz"
          type={FormFieldType.PASSWORD}
          required
          description="En az 8 karakter, 1 büyük harf, 1 küçük harf ve 1 rakam"
        />

        <DynamicFormField
          control={form.control}
          disabled={isLoading}
          label="Şifre Tekrar"
          name="confirmPassword"
          placeholder="Şifrenizi tekrar girin"
          type={FormFieldType.PASSWORD}
          required
        />

        <Controller
          control={form.control}
          name="agreeToTerms"
          render={({ field, fieldState: { error } }) => {
            const { isTermsRead, isPrivacyRead } = useLegalStore();
            const hasError = !!error;

            const handleCheck = () => {
              if (!isTermsRead || !isPrivacyRead) {
                Alert.alert(
                  'Hukuki Onay Gerekli',
                  'Lütfen devam etmeden önce Kullanım Koşulları ve Gizlilik Politikasını okuyup onaylayınız.',
                  [{ text: 'Tamam', style: 'default' }]
                );
                return;
              }
              field.onChange(!field.value);
            };

            return (
              <View className="flex flex-col gap-2">
                <TouchableOpacity
                  onPress={handleCheck}
                  disabled={isLoading}
                  className="flex-row items-start gap-2">
                  <View className="pt-0.5">
                    <View
                      className={cn(
                        'h-5 w-5 items-center justify-center rounded border-2',
                        field.value ? 'border-primary bg-primary' : 'border-border bg-background',
                        hasError && 'border-destructive',
                        isLoading && 'opacity-50'
                      )}>
                      {field.value && <Text className="text-xs text-primary-foreground">✓</Text>}
                    </View>
                  </View>
                  <Text
                    className={cn(
                      'flex-1 text-sm text-foreground',
                      hasError && 'text-destructive',
                      isLoading && 'opacity-50'
                    )}>
                    <Text
                      onPress={() => router.push('/legal/terms')}
                      className="font-bold text-primary underline">
                      Kullanım Koşulları
                    </Text>
                    'nı ve{' '}
                    <Text
                      onPress={() => router.push('/legal/privacy')}
                      className="font-bold text-primary underline">
                      Gizlilik Politikası
                    </Text>
                    'nı okudum, anladım ve kabul ediyorum
                  </Text>
                </TouchableOpacity>
                {error && <Text className="text-sm text-destructive">{error.message}</Text>}
              </View>
            );
          }}
        />
      </View>

      <Button
        onPress={form.handleSubmit(onSubmit)}
        disabled={isLoading}
        className="h-14 w-full flex-row items-center justify-center rounded-2xl bg-primary shadow-xl shadow-primary/30"
        size="lg">
        {isLoading ? (
          <ActivityIndicator color="white" />
        ) : (
          <Text className="text-lg font-bold tracking-tight text-primary-foreground">
            Hesap Oluştur
          </Text>
        )}
      </Button>

      <View className="flex-row items-center justify-center gap-2">
        <Text className="text-sm font-medium text-muted-foreground/50">Zaten hesabın var mı?</Text>
        <Link href="/(auth)/login" asChild>
          <TouchableOpacity activeOpacity={0.7}>
            <Text className="text-sm font-bold text-primary">Giriş Yap</Text>
          </TouchableOpacity>
        </Link>
      </View>
    </View>
  );
}

export function SignupForm() {
  const { form, isLoading, error, onSubmit, setIsLoading } = useSignupForm();
  const { handleGoogleLogin, handleFacebookLogin } = useSocialAuth(setIsLoading);

  return (
    <SignupLayout
      onGoogleLogin={handleGoogleLogin}
      onFacebookLogin={handleFacebookLogin}
      isLoading={isLoading}>
      <SignupFormContent form={form} isLoading={isLoading} error={error} onSubmit={onSubmit} />
    </SignupLayout>
  );
}
