import { Text } from '@/components/ui/text';
// @ts-ignore: manipulateAsync deprecated warning
import { manipulateAsync, SaveFormat } from 'expo-image-manipulator';
import { Check, X } from 'lucide-react-native';
import React, { useState } from 'react';
import { Dimensions, Image, StyleSheet, TouchableOpacity, View } from 'react-native';
import { Gesture, GestureDetector, GestureHandlerRootView } from 'react-native-gesture-handler';
import Animated, { FadeIn, useAnimatedStyle, useSharedValue } from 'react-native-reanimated';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CROP_SIZE = SCREEN_WIDTH - 40; // Square crop area with padding

interface ImageCropperProps {
  imageUri: string;
  onCrop: (uri: string) => void;
  onCancel: () => void;
}

export const ImageCropper = ({ imageUri, onCrop, onCancel }: ImageCropperProps) => {
  const [imageSize, setImageSize] = useState<{ width: number; height: number } | null>(null);
  const [normalizedUri, setNormalizedUri] = useState<string | null>(null);

  const scale = useSharedValue(1);
  const savedScale = useSharedValue(1);
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const savedTranslateX = useSharedValue(0);
  const savedTranslateY = useSharedValue(0);

  React.useEffect(() => {
    const normalizeImage = async () => {
      try {
        const result = await manipulateAsync(imageUri, [{ rotate: 0 }], {
          format: SaveFormat.JPEG,
        });

        setNormalizedUri(result.uri);
        setImageSize({ width: result.width, height: result.height });
      } catch (error) {
        console.error('Failed to normalize image:', error);
        setNormalizedUri(imageUri);
        Image.getSize(imageUri, (w, h) => {
          setImageSize({ width: w, height: h });
        });
      }
    };

    normalizeImage();
  }, [imageUri]);

  const pinchGesture = Gesture.Pinch()
    .onUpdate((e) => {
      scale.value = savedScale.value * e.scale;
    })
    .onEnd(() => {
      savedScale.value = scale.value;
    });

  const panGesture = Gesture.Pan()
    .onUpdate((e) => {
      translateX.value = savedTranslateX.value + e.translationX;
      translateY.value = savedTranslateY.value + e.translationY;
    })
    .onEnd(() => {
      savedTranslateX.value = translateX.value;
      savedTranslateY.value = translateY.value;
    });

  const composedGesture = Gesture.Simultaneous(pinchGesture, panGesture);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: scale.value },
      { translateX: translateX.value },
      { translateY: translateY.value },
    ],
  }));

  const handleCrop = async () => {
    if (!imageSize || !normalizedUri) return;

    try {
      const displayWidth = SCREEN_WIDTH;
      const displayHeight = (imageSize.height / imageSize.width) * displayWidth;

      const s = scale.value;
      const tx = translateX.value;
      const ty = translateY.value;

      const midX = displayWidth / 2;
      const midY = displayHeight / 2;

      const cropScreenLeft = (displayWidth - CROP_SIZE) / 2;
      const cropScreenTop = midY - CROP_SIZE / 2;

      const localX = (cropScreenLeft - midX - tx) / s + midX;
      const localY = (cropScreenTop - midY - ty) / s + midY;

      const localW = CROP_SIZE / s;
      const localH = CROP_SIZE / s;

      const ratio = imageSize.width / displayWidth;

      const originX = Math.max(0, localX * ratio);
      const originY = Math.max(0, localY * ratio);
      const cropWidth = Math.min(localW * ratio, imageSize.width - originX);
      const cropHeight = Math.min(localH * ratio, imageSize.height - originY);

      if (cropWidth <= 0 || cropHeight <= 0) {
        throw new Error('Invalid crop area');
      }

      // @ts-ignore: manipulateAsync might be marked deprecated but is required for current sdk
      const result = await manipulateAsync(
        normalizedUri,
        [
          {
            crop: {
              originX,
              originY,
              width: cropWidth,
              height: cropHeight,
            },
          },
          { resize: { width: 1080 } },
        ],
        { compress: 0.8, format: SaveFormat.JPEG }
      );

      onCrop(result.uri);
    } catch (error) {
      console.error('Crop failed', error);
      onCancel();
    }
  };

  if (!normalizedUri || !imageSize) {
    return (
      <View className="flex-1 items-center justify-center bg-black">
        <Text className="text-white">Resim hazırlanıyor...</Text>
      </View>
    );
  }

  return (
    <GestureHandlerRootView style={{ flex: 1, backgroundColor: 'black' }}>
      <Animated.View
        entering={FadeIn}
        style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <GestureDetector gesture={composedGesture}>
          <Animated.View
            style={[
              {
                width: SCREEN_WIDTH,
                height: imageSize
                  ? (imageSize.height / imageSize.width) * SCREEN_WIDTH
                  : SCREEN_WIDTH,
              },
              animatedStyle,
            ]}>
            <Image
              source={{ uri: normalizedUri }}
              style={{ flex: 1, width: undefined, height: undefined }}
              resizeMode="cover"
            />
          </Animated.View>
        </GestureDetector>

        <View pointerEvents="none" style={StyleSheet.absoluteFill}>
          <View style={styles.mask} className="w-full flex-1" />

          {/* Middle Row */}
          <View style={{ height: CROP_SIZE, flexDirection: 'row' }}>
            {/* Left Mask */}
            <View style={styles.mask} className="flex-1" />

            {/* Crop Window (Transparent) */}
            <View style={{ width: CROP_SIZE, height: CROP_SIZE, overflow: 'hidden' }}>
              {/* Grid Lines */}
              <View className="h-full w-full flex-row justify-evenly opacity-50">
                <View className="h-full w-[1px] bg-white/30" />
                <View className="h-full w-[1px] bg-white/30" />
              </View>
              <View className="absolute inset-0 h-full w-full flex-col justify-evenly opacity-50">
                <View className="h-[1px] w-full bg-white/30" />
                <View className="h-[1px] w-full bg-white/30" />
              </View>

              {/* Corners */}
              <View className="absolute left-0 top-0 h-6 w-6 rounded-tl-lg border-l-4 border-t-4 border-white" />
              <View className="absolute right-0 top-0 h-6 w-6 rounded-tr-lg border-r-4 border-t-4 border-white" />
              <View className="absolute bottom-0 left-0 h-6 w-6 rounded-bl-lg border-b-4 border-l-4 border-white" />
              <View className="absolute bottom-0 right-0 h-6 w-6 rounded-br-lg border-b-4 border-r-4 border-white" />
            </View>

            {/* Right Mask */}
            <View style={styles.mask} className="flex-1" />
          </View>

          {/* Bottom Mask */}
          <View style={styles.mask} className="w-full flex-1" />
        </View>

        {/* LIVE DEBUG OVERLAY */}

        {/* Controls */}
        <View className="absolute bottom-12 left-0 right-0 z-20 flex-row items-center justify-between px-8">
          <TouchableOpacity
            onPress={onCancel}
            className="h-14 w-14 items-center justify-center rounded-full border border-white/20 bg-white/10 backdrop-blur-md">
            <X size={24} color="white" />
          </TouchableOpacity>

          <View className="flex-1 px-6">
            <Text className="mb-2 overflow-hidden rounded-full bg-black/40 py-1 text-center text-xs font-medium text-white/70">
              Soruyu çerçeveye sığdırın
            </Text>
          </View>

          <TouchableOpacity
            onPress={handleCrop}
            className="h-16 w-16 items-center justify-center rounded-full border-4 border-white/10 bg-primary shadow-lg shadow-primary/40">
            <Check size={32} color="white" />
          </TouchableOpacity>
        </View>
      </Animated.View>

      {/* DEBUG: Show Result Modal */}
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  // cropFrame: { ... }, // Removed
  mask: {
    backgroundColor: 'rgba(0,0,0,0.8)',
    // backdropFilter: 'blur(10px)', // removed web only
  },
});
