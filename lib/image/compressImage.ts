// @ts-ignore: manipulateAsync deprecated warning
import { manipulateAsync, SaveFormat } from 'expo-image-manipulator';

export interface CompressImageOptions {
    /** Maximum width in pixels. Image will be resized proportionally if wider. Default: 1024 */
    maxWidth?: number;
    /** JPEG compression quality (0-1). Lower = smaller file. Default: 0.6 */
    quality?: number;
}

const DEFAULT_OPTIONS: Required<CompressImageOptions> = {
    maxWidth: 1024,
    quality: 0.6,
};

/**
 * Compresses and resizes an image before upload.
 * Uses expo-image-manipulator to:
 * 1. Resize if width exceeds maxWidth (preserving aspect ratio)
 * 2. Re-encode as JPEG with the given quality
 *
 * @param uri - The local file URI of the image
 * @param options - Optional compression settings
 * @returns The URI of the compressed image
 */
export async function compressImage(
    uri: string,
    options?: CompressImageOptions
): Promise<string> {
    const { maxWidth, quality } = { ...DEFAULT_OPTIONS, ...options };

    try {
        // @ts-ignore: manipulateAsync might be marked deprecated but is required for current sdk
        const result = await manipulateAsync(
            uri,
            [{ resize: { width: maxWidth } }],
            { compress: quality, format: SaveFormat.JPEG }
        );

        if (__DEV__) {
            console.log(
                `[compressImage] Compressed: maxWidth=${maxWidth}, quality=${quality} → ${result.uri.substring(result.uri.lastIndexOf('/') + 1)}`
            );
        }

        return result.uri;
    } catch (error) {
        console.error('[compressImage] Compression failed, using original:', error);
        return uri;
    }
}
