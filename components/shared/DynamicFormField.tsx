import { Icon } from '@/components/ui/icon';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Text } from '@/components/ui/text';
import { cn } from '@/lib/utils';
import { Eye, EyeOff } from 'lucide-react-native';
import React, { useState } from 'react';
import { Control, Controller, FieldPath, FieldValues } from 'react-hook-form';
import { TouchableOpacity, View } from 'react-native';

export enum FormFieldType {
  INPUT = 'input',
  PASSWORD = 'password',
  EMAIL = 'email',
  PHONE = 'phone',
  TEXTAREA = 'textarea',
  NUMBER = 'number',
  CHECKBOX = 'checkbox',
}

interface DynamicFormFieldProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> {
  control: Control<TFieldValues>;
  name: TName;
  label?: string;
  placeholder?: string;
  type: FormFieldType;
  disabled?: boolean;
  className?: string;
  inputClassName?: string;
  labelClassName?: string;
  required?: boolean;
  description?: string;
}

function DynamicFormField<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  control,
  name,
  label,
  placeholder,
  type,
  disabled = false,
  className,
  inputClassName,
  labelClassName,
  required = false,
  description,
}: DynamicFormFieldProps<TFieldValues, TName>) {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const getInputType = () => {
    switch (type) {
      case FormFieldType.PASSWORD:
        return isPasswordVisible ? 'default' : 'password';
      case FormFieldType.EMAIL:
        return 'email-address';
      case FormFieldType.PHONE:
        return 'phone-pad';
      case FormFieldType.NUMBER:
        return 'numeric';
      default:
        return 'default';
    }
  };

  const getSecureTextEntry = () => {
    return type === FormFieldType.PASSWORD && !isPasswordVisible;
  };

  const renderPasswordToggle = () => {
    if (type !== FormFieldType.PASSWORD) return null;

    return (
      <TouchableOpacity
        onPress={() => setIsPasswordVisible(!isPasswordVisible)}
        className="absolute right-3 top-1/2 -translate-y-1/2"
        disabled={disabled}>
        <Icon as={isPasswordVisible ? EyeOff : Eye} size={20} className="text-muted-foreground" />
      </TouchableOpacity>
    );
  };

  const renderInput = (field: any, error?: string) => {
    const hasError = !!error;

    if (type === FormFieldType.CHECKBOX) {
      return (
        <TouchableOpacity
          onPress={() => field.onChange(!field.value)}
          disabled={disabled}
          className="flex-row items-start gap-2">
          <View className="pt-0.5">
            <View
              className={cn(
                'h-5 w-5 items-center justify-center rounded border-2',
                field.value ? 'border-primary bg-primary' : 'border-border bg-background',
                hasError && 'border-destructive',
                disabled && 'opacity-50'
              )}>
              {field.value && <Text className="text-xs text-primary-foreground">✓</Text>}
            </View>
          </View>
          {label && (
            <Text
              className={cn(
                'flex-1 text-sm',
                hasError ? 'text-destructive' : 'text-foreground',
                disabled && 'opacity-50'
              )}>
              {label}
              {required && <Text className="ml-1 text-destructive">*</Text>}
            </Text>
          )}
        </TouchableOpacity>
      );
    }

    return (
      <View className="relative w-full">
        <Input
          value={field.value || ''}
          onChangeText={field.onChange}
          onBlur={field.onBlur}
          placeholder={placeholder}
          editable={!disabled}
          secureTextEntry={getSecureTextEntry()}
          keyboardType={getInputType() as any}
          autoCapitalize={type === FormFieldType.EMAIL ? 'none' : 'sentences'}
          autoCorrect={type === FormFieldType.EMAIL ? false : true}
          className={cn(
            'pr-10',
            hasError && 'border-destructive focus-visible:ring-destructive/20',
            inputClassName
          )}
        />
        {renderPasswordToggle()}
      </View>
    );
  };

  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState: { error } }) => (
        <View className={cn('flex flex-col gap-2', className)}>
          {label && type !== FormFieldType.CHECKBOX && (
            <Label
              className={cn('text-sm font-medium', error && 'text-destructive', labelClassName)}>
              {label}
              {required && <Text className="ml-1 text-destructive">*</Text>}
            </Label>
          )}

          {renderInput(field, error?.message)}

          {description && !error && (
            <Text className="text-sm text-muted-foreground">{description}</Text>
          )}

          {error && <Text className="text-sm text-destructive">{error.message}</Text>}
        </View>
      )}
    />
  );
}

export { DynamicFormField };
export type { DynamicFormFieldProps };
