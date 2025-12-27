import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Text, View } from 'react-native';

interface FormAlertProps {
  message: string | null;
  type?: 'error' | 'success';
}

export function FormAlert({ message, type = 'error' }: FormAlertProps) {
  if (!message) return null;

  const isError = type === 'error';
  const backgroundColor = isError ? 'bg-red-50' : 'bg-green-50';
  const borderColor = isError ? 'border-red-200' : 'border-green-200';
  const textColor = isError ? 'text-red-700' : 'text-green-700';
  const iconName = isError ? 'alert-circle-outline' : 'checkmark-circle-outline';
  const iconColor = isError ? '#ef4444' : '#22c55e'; // red-500 : green-500

  return (
    <View
      className={`mb-4 flex-row items-center gap-2 rounded-lg border p-3 ${backgroundColor} ${borderColor}`}>
      <Ionicons name={iconName} size={20} color={iconColor} />
      <Text className={`flex-1 text-sm font-medium ${textColor}`}>{message}</Text>
    </View>
  );
}
