import { Icon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import { Audio } from 'expo-av';
import { Mic, Send, Square, Trash2 } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import { Platform, TouchableOpacity, View } from 'react-native';
import { useUploadFile } from '../hooks';

export const AudioRecorder: React.FC = () => {
  const [recording, setRecording] = useState<Audio.Recording | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [recordedUri, setRecordedUri] = useState<string | null>(null);
  const [duration, setDuration] = useState(0);
  const [timerInterval, setTimerInterval] = useState<any>(null);

  const { mutate: uploadFile, isPending: isUploading } = useUploadFile();

  useEffect(() => {
    return () => {
      if (recording) {
        recording.stopAndUnloadAsync();
      }
      if (timerInterval) clearInterval(timerInterval);
    };
  }, [recording, timerInterval]);

  const startRecording = async () => {
    try {
      const permission = await Audio.requestPermissionsAsync();
      if (permission.status !== 'granted') {
        alert('Ses kaydı için mikrofon izni gereklidir.');
        return;
      }

      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      const { recording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );
      setRecording(recording);
      setIsRecording(true);
      setDuration(0);

      const interval = setInterval(() => {
        setDuration((prev) => prev + 1);
      }, 1000);
      setTimerInterval(interval);
    } catch (err) {
      console.error('Failed to start recording', err);
    }
  };

  const stopRecording = async () => {
    if (!recording) return;
    try {
      if (timerInterval) clearInterval(timerInterval);
      await recording.stopAndUnloadAsync();
      const uri = recording.getURI();
      setRecordedUri(uri);
      setRecording(null);
      setIsRecording(false);
    } catch (error) {
      console.error('Failed to stop recording', error);
    }
  };

  const cancelRecording = () => {
    setRecordedUri(null);
    setDuration(0);
  };

  const handleUpload = () => {
    if (!recordedUri) return;

    const ext = Platform.OS === 'ios' ? 'm4a' : 'm4a';
    const filename = `Ses_Kaydi_${new Date().getTime()}.${ext}`;

    uploadFile(
      {
        file_title: filename,
        file_data: {
          uri: recordedUri,
          name: filename,
          type: 'audio/m4a',
        },
      },
      {
        onSuccess: () => {
          setRecordedUri(null);
          setDuration(0);
        },
      }
    );
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <View className="mb-6 rounded-[2rem] border-2 border-dashed border-border/40 bg-card/50 p-6">
      <View className="mb-4 items-center">
        <Text className="text-xl font-bold text-foreground">Ses Kaydı Oluştur</Text>
        <Text className="text-sm text-muted-foreground">Kendi sesinizle bir not oluşturun</Text>
      </View>

      {!recordedUri ? (
        <View className="items-center">
          <Text className="mb-4 font-mono text-2xl text-primary">{formatTime(duration)}</Text>
          <TouchableOpacity
            onPress={isRecording ? stopRecording : startRecording}
            className={`h-16 w-16 items-center justify-center rounded-full ${
              isRecording ? 'bg-destructive' : 'bg-primary'
            }`}>
            <Icon as={isRecording ? Square : Mic} size={28} className="text-primary-foreground" />
          </TouchableOpacity>
          <Text className="mt-3 text-sm text-muted-foreground">
            {isRecording ? 'Kaydı Durdur' : 'Kayda Başla'}
          </Text>
        </View>
      ) : (
        <View className="w-full items-center">
          <Text className="mb-4 font-mono text-xl text-primary">{formatTime(duration)}</Text>
          <View className="w-full flex-row gap-4 px-4">
            <TouchableOpacity
              onPress={cancelRecording}
              disabled={isUploading}
              className="flex-1 h-12 flex-row items-center justify-center rounded-2xl border border-destructive/20 bg-destructive/10">
              <Icon as={Trash2} size={20} className="mr-2 text-destructive" />
              <Text className="font-bold text-destructive">Sil</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleUpload}
              disabled={isUploading}
              className="flex-1 h-12 flex-row items-center justify-center rounded-2xl bg-primary">
              {isUploading ? (
                <View className="h-5 w-5 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
              ) : (
                <>
                  <Icon as={Send} size={20} className="mr-2 text-primary-foreground" />
                  <Text className="font-bold text-primary-foreground">Yükle</Text>
                </>
              )}
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
};
