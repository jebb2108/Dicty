import React from 'react';
import { NativeAudio } from '@capacitor-community/nativeaudio';
import useAudioStore from '../store/audioStore';

const PronunciationButton = ({ audioFile }: { audioFile: string }) => {
  const { playAudio, stopAudio } = useAudioStore();

  const handleAudioPlay = async () => {
    try {
      await NativeAudio.preloadSimple('pronunciation', audioFile);
      await NativeAudio.play('pronunciation');
      playAudio(audioFile);

      // Optionally, handle playback completion to update the state
      NativeAudio.onStatusChange((status) => {
        if (status === 'completed') {
          stopAudio();
        }
      });
    } catch (error) {
      console.error("Audio playback error:", error);
    }
  };

  return (
    <button onClick={handleAudioPlay}>
      Play Pronunciation
    </button>
  );
};

export default PronunciationButton;