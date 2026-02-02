import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import { CameraType, CameraView, useCameraPermissions } from 'expo-camera';
import { useRouter } from 'expo-router';
import { RefreshCw, X } from 'lucide-react-native';
import React, { useRef, useState } from 'react';
import { Image, StyleSheet, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ImageCropper } from '../components/ImageCropper';

export default function CameraScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const [facing, setFacing] = useState<CameraType>('back');
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [croppingImage, setCroppingImage] = useState<string | null>(null);
  const [resultImage, setResultImage] = useState<string | null>(null);
  const cameraRef = useRef<CameraView>(null);
  const router = useRouter();

  if (!permission) {
    return <View />;
  }

  if (!permission.granted) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center bg-background p-4">
        <Text className="mb-4 text-center">Soru çözmek için kamera iznine ihtiyacımız var.</Text>
        <Button onPress={requestPermission} className="w-full">
          <Text className="text-primary-foreground">İzin Ver</Text>
        </Button>
      </SafeAreaView>
    );
  }

  const toggleCameraFacing = () => {
    setFacing((current) => (current === 'back' ? 'front' : 'back'));
  };

  const takePicture = async () => {
    if (cameraRef.current) {
      try {
        const photo = await cameraRef.current.takePictureAsync({
          quality: 0.8,
          base64: true,
        });

        if (photo?.uri) {
          setCroppingImage(photo.uri);
        }
      } catch (error) {
        console.error('Failed to take picture:', error);
      }
    }
  };

  const handleCropConfirm = (croppedUri: string) => {
    setCroppingImage(null);
    setCapturedImage(croppedUri);

    router.push({
      pathname: '/(tabs)/chat',
      params: {
        initialMessage: 'Bu soruyu açıklar mısın?',
        imageUri: croppedUri,
      },
    });

    setTimeout(() => {
      setCapturedImage(null);
      setResultImage(null);
    }, 500);
  };

  const handleCropCancel = () => {
    setCroppingImage(null);
  };

  const closeCamera = () => {
    router.back();
  };

  const resetCamera = () => {
    setResultImage(null);
    setCapturedImage(null);
  };

  return (
    <View style={styles.container}>
      {resultImage ? (
        <SafeAreaView className="flex-1 items-center justify-center bg-black">
          <Image
            source={{ uri: resultImage }}
            style={StyleSheet.absoluteFill}
            resizeMode="contain"
          />
          <View className="absolute inset-x-0 bottom-10 items-center">
            <Button onPress={resetCamera} className="bg-white px-8">
              <Text className="font-bold text-black">Yeni Fotoğraf</Text>
            </Button>
          </View>
        </SafeAreaView>
      ) : croppingImage ? (
        <ImageCropper
          imageUri={croppingImage}
          onCrop={handleCropConfirm}
          onCancel={handleCropCancel}
        />
      ) : (
        <CameraView style={styles.camera} facing={facing} ref={cameraRef}>
          <SafeAreaView className="flex-1 justify-between">
            <View className="flex-row justify-between p-4">
              <TouchableOpacity onPress={closeCamera} className="rounded-full bg-black/40 p-2">
                <Icon as={X} color="white" size={24} />
              </TouchableOpacity>
            </View>

            <View className="flex-row items-center justify-between bg-black/20 p-8">
              <TouchableOpacity
                onPress={toggleCameraFacing}
                className="rounded-full bg-black/40 p-3">
                <Icon as={RefreshCw} color="white" size={24} />
              </TouchableOpacity>

              <TouchableOpacity
                onPress={takePicture}
                className="h-20 w-20 items-center justify-center rounded-full border-4 border-gray-300 bg-white">
                <View className="h-16 w-16 rounded-full border-2 border-black bg-white" />
              </TouchableOpacity>

              <View className="w-12" />
            </View>
          </SafeAreaView>
        </CameraView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  camera: {
    flex: 1,
  },
});
