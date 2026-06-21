import create from 'zustand';

const useAudioStore = create((set) => ({
  currentAudio: null,
  isPlaying: false,
  volume: 1.0,
  playAudio: (audioFile: string) => set({ currentAudio: audioFile, isPlaying: true }),
  stopAudio: () => set({ isPlaying: false }),
  setVolume: (volume: number) => set({ volume }),
}));

export default useAudioStore;