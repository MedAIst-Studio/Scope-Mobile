import { Icon } from '@/components/ui/icon';
import { Images } from 'lucide-react-native';
import React from 'react';
import { ActivityIndicator, TouchableOpacity } from 'react-native';

interface GalleryPickerButtonProps {
  onPress: () => void;
  isLoading?: boolean;
}

/**
 * Kamera alt çubuğunda galeriden görsel seçmek için kullanılan buton.
 *
 * Tek sorumluluğu: galeri açma eyleminin görsel karşılığını sunmak.
 * İş mantığı içermez; tüm davranış `onPress` callback'i üzerinden dışarıdan enjekte edilir (DIP).
 */
export const GalleryPickerButton = ({ onPress, isLoading = false }: GalleryPickerButtonProps) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={isLoading}
      className="h-12 w-12 items-center justify-center rounded-full bg-black/40"
      accessibilityLabel="Galeriden resim seç"
      accessibilityRole="button">
      {isLoading ? (
        <ActivityIndicator color="white" size="small" />
      ) : (
        <Icon as={Images} color="white" size={24} />
      )}
    </TouchableOpacity>
  );
};
