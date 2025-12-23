import { DynamicFormField, FormFieldType } from '@/components/shared/DynamicFormField';
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
  onSubmit,
}: {
  form: ReturnType<typeof useSignupForm>['form'];
  isLoading: boolean;
  onSubmit: (data: SignupFormData) => void;
}) {
  return (
    <View className="flex flex-col gap-6">
      <View className="flex flex-col gap-4">
        <View className="flex-1">
          <DynamicFormField
            control={form.control}
            disabled={isLoading}
            label="Kullanıcı Adı"
            name="username"
            placeholder="Kullanıcı adınız"
            type={FormFieldType.INPUT}
            required
          />
        </View>

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
        className="w-full flex-row gap-2"
        size="lg">
        {isLoading && <ActivityIndicator color="white" />}
        <Text>{isLoading ? 'Hesap Oluşturuluyor...' : 'Hesap Oluştur'}</Text>
      </Button>

      <View className="flex-row items-center justify-center gap-1">
        <Text className="text-sm text-muted-foreground">Zaten hesabınız var mı?</Text>
        <Link href="/(auth)/login" asChild>
          <TouchableOpacity>
            <Text className="text-sm font-medium text-primary">Giriş Yap</Text>
          </TouchableOpacity>
        </Link>
      </View>
    </View>
  );
}

export function SignupForm() {
  const { form, isLoading, onSubmit, setIsLoading } = useSignupForm();
  const { handleGoogleSignup, handleFacebookSignup } = useSocialAuth(setIsLoading);

  return (
    <SignupLayout
      onGoogleLogin={handleGoogleSignup}
      onFacebookLogin={handleFacebookSignup}
      isLoading={isLoading}>
      <SignupFormContent form={form} isLoading={isLoading} onSubmit={onSubmit} />
    </SignupLayout>
  );
}
