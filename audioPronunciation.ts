import { Capacitor } from '@capacitor/core';
import { NativeAudio } from 'capacitor-native-audio';

export const playAudio = async (audioFile: string) => {
  try {
    await NativeAudio.preloadSimple('audio', audioFile);
    await NativeAudio.play('audio');
  } catch (error) {
    console.error('Error playing audio:', error);
    if (Capacitor.platform === 'web') {
      // Fallback to TextToSpeech (assume we have a TTS function)
      await textToSpeech(audioFile);
    }
  }
};
