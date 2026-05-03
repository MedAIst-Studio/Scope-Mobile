import { errorEventBus } from '@/lib/error-handling/ErrorEventBus';
import { pickImageFromGallery } from '@/lib/image/pickImageFromGallery';
import { useCallback, useState } from 'react';

interface UseGalleryPickerOptions {
  /** Görsel seçilip croplama aşamasına geçince çağrılır */
  onImageSelected: (uri: string) => void;
}

interface UseGalleryPickerReturn {
  /** Galeri diyaloğunu açar */
  openGallery: () => Promise<void>;
  /** Galeri işlemi devam ederken true */
  isLoading: boolean;
}

/**
 * Galeri görsel seçimi için iş mantığını yöneten hook.
 *
 * Sorumlulukları:
 * - expo-image-picker'ı `pickImageFromGallery` utility'si üzerinden çağırmak
 * - Yükleme durumunu yönetmek
 * - İzin reddini hata event bus'a iletmek
 */
export function useGalleryPicker({ onImageSelected }: UseGalleryPickerOptions): UseGalleryPickerReturn {
  const [isLoading, setIsLoading] = useState(false);

  const openGallery = useCallback(async () => {
    setIsLoading(true);
    try {
      const result = await pickImageFromGallery();

      if (result === null) {
        // Kullanıcı iptal etti ya da izin vermedi — sessizce geç
        return;
      }

      onImageSelected(result.uri);
    } catch (error) {
      errorEventBus.emit('SHOW_TOAST', { message: 'Galeri açılırken bir hata oluştu.', type: 'error' });
    } finally {
      setIsLoading(false);
    }
  }, [onImageSelected]);

  return { openGallery, isLoading };
}
