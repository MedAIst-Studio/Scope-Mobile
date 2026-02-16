import { Icon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import { X } from 'lucide-react-native';
import React from 'react';
import { Image, Modal, TouchableOpacity, View, StyleSheet, Dimensions } from 'react-native';
import Animated, { FadeIn, FadeOut, ZoomIn, ZoomOut } from 'react-native-reanimated';

interface ImagePreviewModalProps {
    isVisible: boolean;
    onClose: () => void;
    imageUrl?: string;
    title: string;
    size?: number;
}

export const ImagePreviewModal: React.FC<ImagePreviewModalProps> = ({
    isVisible,
    onClose,
    imageUrl,
    title,
    size,
}) => {
    if (!imageUrl) return null;

    const formattedSize = size ? (size / 1024 / 1024).toFixed(2) + ' MB' : '';

    return (
        <Modal visible={isVisible} transparent animationType="none" onRequestClose={onClose}>
            <View style={StyleSheet.absoluteFill}>
                <Animated.View
                    entering={FadeIn.duration(300)}
                    exiting={FadeOut.duration(200)}
                    className="flex-1 items-center justify-center bg-black/90 px-4">

                    {/* Header */}
                    <View className="absolute top-12 left-0 right-0 z-10 flex-row items-center justify-between px-6">
                        <View className="flex-1 mr-4">
                            <Text className="text-lg font-bold text-white" numberOfLines={1}>
                                {title}
                            </Text>
                            {formattedSize && (
                                <Text className="text-xs text-white/60 font-medium tracking-wide">
                                    {formattedSize}
                                </Text>
                            )}
                        </View>
                        <TouchableOpacity
                            onPress={onClose}
                            className="h-10 w-10 items-center justify-center rounded-full bg-white/10 active:bg-white/20">
                            <Icon as={X} size={24} color="white" />
                        </TouchableOpacity>
                    </View>

                    {/* Image Container */}
                    <Animated.View
                        entering={ZoomIn.duration(400).springify()}
                        exiting={ZoomOut.duration(300)}
                        className="h-4/5 w-full overflow-hidden rounded-3xl shadow-2xl">
                        <Image
                            source={{ uri: imageUrl }}
                            className="h-full w-full"
                            resizeMode="contain"
                        />
                    </Animated.View>

                    {/* Bottom Hint */}
                    <View className="absolute bottom-12 items-center">
                        <Text className="text-white/40 text-xs font-medium uppercase tracking-widest">
                            Görsel Önizleme
                        </Text>
                    </View>
                </Animated.View>
            </View>
        </Modal>
    );
};
