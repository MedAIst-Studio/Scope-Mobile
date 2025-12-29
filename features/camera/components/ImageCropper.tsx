import { Text } from '@/components/ui/text';
// @ts-ignore: manipulateAsync deprecated warning
import { manipulateAsync, SaveFormat } from 'expo-image-manipulator';
import React, { useState } from 'react';
import { Dimensions, Image, StyleSheet, TouchableOpacity, View } from 'react-native';
import { Gesture, GestureDetector, GestureHandlerRootView } from 'react-native-gesture-handler';
import { CheckIcon, XMarkIcon } from 'react-native-heroicons/outline';
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

  // Shared values for transformations
  const scale = useSharedValue(1);
  const savedScale = useSharedValue(1);
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const savedTranslateX = useSharedValue(0);
  const savedTranslateY = useSharedValue(0);

  // Load image size to calculate initial fitting
  React.useEffect(() => {
    Image.getSize(imageUri, (w, h) => {
      setImageSize({ width: w, height: h });
    });
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
      { translateX: translateX.value },
      { translateY: translateY.value },
      { scale: scale.value },
    ],
  }));

  const handleCrop = async () => {
    if (!imageSize) return;

    try {
      // Calculate Display Dimensions
      const displayWidth = SCREEN_WIDTH;
      const displayHeight = (imageSize.height / imageSize.width) * displayWidth;

      // Current Transforms
      const s = scale.value;
      const tx = translateX.value;
      const ty = translateY.value;

      // Initial Center in Display Space
      const midX = displayWidth / 2;
      const midY = displayHeight / 2;

      // Map Crop Frame (Screen Standard) to Local Image Space (Inverse Transform)
      // The fixed crop frame is centered on screen.
      // Screen Center matches Image Center (midX, midY) BEFORE transform.
      // With transform: ScreenPoint = (LocalPoint - midPoint) * s + midPoint + translation
      // Inverse: LocalPoint = (ScreenPoint - midPoint - translation) / s + midPoint

      // Top-Left of Crop Frame in Screen Coordinates (Relative to Image View if it were 0,0 aligned)
      // Actually simpler: The crop frame top-left is at (ScreenW - CropCheck)/2.
      // Since Image View width is ScreenW, this is (displayWidth - CROP_SIZE) / 2.
      const cropScreenLeft = (displayWidth - CROP_SIZE) / 2;

      // Vertical requires offset adjustment if image height != screen height
      // The crop frame is vertically centered on SCREEN.
      // The Image View is vertically centered in the container?
      // Our Render:
      // <View style={{justifyContent: 'center'...}}> <Animated.View .../> </View>
      // So Image View is centered.
      // Thus DisplayHeight/2 aligns with ScreenHeight/2.
      // So crop frame vertical center aligns with DisplayHeight centricity.
      // Top-Left relative to Display center is just -CROP/2.
      // So relative to Image Top-Left (0,0):
      const cropScreenTop = midY - CROP_SIZE / 2;

      // Apply Inverse Transform
      // localX = (screenX - midX - tx) / s + midX
      const localX = (cropScreenLeft - midX - tx) / s + midX;
      const localY = (cropScreenTop - midY - ty) / s + midY;

      const localW = CROP_SIZE / s;
      const localH = CROP_SIZE / s;

      // Map to Original Image Pixels
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
        imageUri,
        [
          {
            crop: {
              originX,
              originY,
              width: cropWidth,
              height: cropHeight,
            },
          },
          { resize: { width: 1080 } }, // Resize after crop for upload optimization
        ],
        { compress: 0.8, format: SaveFormat.JPEG }
      );
      onCrop(result.uri);
    } catch (error) {
      console.error('Crop failed', error);
      onCancel();
    }
  };

  return (
    <GestureHandlerRootView style={{ flex: 1, backgroundColor: 'black' }}>
      <Animated.View
        entering={FadeIn}
        style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        {/* Crop Frame Overlay (Z-Index High) */}
        <View
          pointerEvents="none"
          style={[styles.cropFrame, { width: CROP_SIZE, height: CROP_SIZE, zIndex: 10 }]}>
          {/* Grid Lines */}
          <View className="w-full flex-1 justify-evenly border-b border-t border-white/20 opacity-50">
            <View className="mx-auto h-full w-1/3 border-l border-r border-white/20" />
          </View>

          {/* Corner Markers */}
          <View className="absolute left-0 top-0 h-6 w-6 rounded-tl-xl border-l-4 border-t-4 border-white" />
          <View className="absolute right-0 top-0 h-6 w-6 rounded-tr-xl border-r-4 border-t-4 border-white" />
          <View className="absolute bottom-0 left-0 h-6 w-6 rounded-bl-xl border-b-4 border-l-4 border-white" />
          <View className="absolute bottom-0 right-0 h-6 w-6 rounded-br-xl border-b-4 border-r-4 border-white" />
        </View>

        {/* Mask Overlay */}
        <View
          pointerEvents="none"
          style={[
            styles.mask,
            {
              width: SCREEN_WIDTH,
              height: (Dimensions.get('window').height - CROP_SIZE) / 2,
              top: 0,
            },
          ]}
        />
        <View
          pointerEvents="none"
          style={[
            styles.mask,
            {
              width: SCREEN_WIDTH,
              height: (Dimensions.get('window').height - CROP_SIZE) / 2,
              bottom: 0,
            },
          ]}
        />
        <View
          pointerEvents="none"
          style={[
            styles.mask,
            { width: (SCREEN_WIDTH - CROP_SIZE) / 2, height: CROP_SIZE, left: 0 },
          ]}
        />
        <View
          pointerEvents="none"
          style={[
            styles.mask,
            { width: (SCREEN_WIDTH - CROP_SIZE) / 2, height: CROP_SIZE, right: 0 },
          ]}
        />

        {/* Movable Image */}
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
              source={{ uri: imageUri }}
              style={{ flex: 1, width: undefined, height: undefined }}
              resizeMode="cover"
            />
          </Animated.View>
        </GestureDetector>

        {/* Controls */}
        <View className="absolute bottom-12 left-0 right-0 z-20 flex-row items-center justify-between px-8">
          <TouchableOpacity
            onPress={onCancel}
            className="h-14 w-14 items-center justify-center rounded-full border border-white/20 bg-white/10 backdrop-blur-md">
            <XMarkIcon size={24} color="white" />
          </TouchableOpacity>

          <View className="flex-1 px-6">
            <Text className="mb-2 overflow-hidden rounded-full bg-black/40 py-1 text-center text-xs font-medium text-white/70">
              Soruyu çerçeveye sığdırın
            </Text>
          </View>

          <TouchableOpacity
            onPress={handleCrop}
            className="h-16 w-16 items-center justify-center rounded-full border-4 border-white/10 bg-primary shadow-lg shadow-primary/40">
            <CheckIcon size={32} color="white" />
          </TouchableOpacity>
        </View>
      </Animated.View>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  cropFrame: {
    // borderWidth: 2,
    // borderColor: 'white', // Removed simple border for custom corners
    position: 'absolute',
  },
  mask: {
    position: 'absolute',
    backgroundColor: 'rgba(0,0,0,0.8)', // Darker mask for better focus
    zIndex: 5,
    backdropFilter: 'blur(10px)', // Web only support, good to keep
  },
});
