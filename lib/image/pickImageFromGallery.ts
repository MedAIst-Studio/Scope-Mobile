import * as ImagePicker from 'expo-image-picker';

export interface GalleryPickerResult {
  /** Seçilen görselin local URI'si */
  uri: string;
}

/**
 * Galeride görsel seçim diyaloğunu açar.
 *
 * İzin reddi de dahil olmak üzere başarısız senaryolarda `null` döner,
 * bu sayede çağıran katman null check dışında ek hata yönetimi yapmak
 * zorunda kalmaz.
 *
 * @returns Seçilen görselin URI'sini içeren obje ya da null
 */
export async function pickImageFromGallery(): Promise<GalleryPickerResult | null> {
  const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

  if (status !== 'granted') {
    return null;
  }

  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ['images'],
    allowsEditing: false,
    quality: 1,
  });

  if (result.canceled || result.assets.length === 0) {
    return null;
  }

  return { uri: result.assets[0].uri };
}
