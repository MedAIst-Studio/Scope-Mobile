import { DynamicFormField, FormFieldType } from '@/components/shared/DynamicFormField';
import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { Link } from 'expo-router';
import React from 'react';
import { ActivityIndicator, TouchableOpacity, View } from 'react-native';
import { useLoginForm, useSocialAuth } from '../hooks/useAuthForms';
import { LoginLayout } from './AuthLayout';

type LoginFormData = Parameters<ReturnType<typeof useLoginForm>['onSubmit']>[0];

function LoginFormContent({
  form,
  isLoading,
  onSubmit,
}: {
  form: ReturnType<typeof useLoginForm>['form'];
  isLoading: boolean;
  onSubmit: (data: LoginFormData) => void;
}) {
  return (
    <View className="flex flex-col gap-6">
      <View className="flex flex-col gap-4">
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
        />

        <View className="items-end">
          <Link href="/(auth)/forgot-password" asChild>
            <TouchableOpacity>
              <Text className="text-sm font-medium text-primary">Şifremi Unuttum</Text>
            </TouchableOpacity>
          </Link>
        </View>
      </View>

      <Button
        onPress={form.handleSubmit(onSubmit)}
        disabled={isLoading}
        className="w-full flex-row gap-2"
        size="lg">
        {isLoading && <ActivityIndicator color="white" />}
        <Text>{isLoading ? 'Giriş Yapılıyor...' : 'Giriş Yap'}</Text>
      </Button>

      <View className="flex-row items-center justify-center gap-1">
        <Text className="text-sm text-muted-foreground">Hesabınız yok mu?</Text>
        <Link href="/(auth)/signup" asChild>
          <TouchableOpacity>
            <Text className="text-sm font-medium text-primary">Kayıt Ol</Text>
          </TouchableOpacity>
        </Link>
      </View>
    </View>
  );
}

export function LoginForm() {
  const { form, isLoading, onSubmit, setIsLoading } = useLoginForm();
  const { handleGoogleLogin, handleFacebookLogin } = useSocialAuth(setIsLoading);

  return (
    <LoginLayout
      onGoogleLogin={handleGoogleLogin}
      onFacebookLogin={handleFacebookLogin}
      isLoading={isLoading}>
      <LoginFormContent form={form} isLoading={isLoading} onSubmit={onSubmit} />
    </LoginLayout>
  );
}
