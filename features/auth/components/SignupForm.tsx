import { DynamicFormField, FormFieldType } from '@/components/shared/DynamicFormField';
import { FormAlert } from '@/components/shared/FormAlert';
import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { Link } from 'expo-router';
import React from 'react';
import { ActivityIndicator, TouchableOpacity, View } from 'react-native';
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

        <DynamicFormField
          control={form.control}
          disabled={isLoading}
          label="Kullanım koşulları ve gizlilik politikasını kabul ediyorum"
          name="agreeToTerms"
          type={FormFieldType.CHECKBOX}
          required
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
  const { handleGoogleSignup, handleFacebookSignup } = useSocialAuth(setIsLoading);

  return (
    <SignupLayout
      onGoogleLogin={handleGoogleSignup}
      onFacebookLogin={handleFacebookSignup}
      isLoading={isLoading}>
      <SignupFormContent form={form} isLoading={isLoading} error={error} onSubmit={onSubmit} />
    </SignupLayout>
  );
}
