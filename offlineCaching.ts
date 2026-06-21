import { Filesystem, Directory } from '@capacitor/filesystem';

export const saveVocabulary = async (data: object) => {
  try {
    await Filesystem.writeFile({
      path: 'vocabulary.json',
      data: JSON.stringify(data),
      directory: Directory.Documents,
      recursive: true
    });
  } catch (error) {
    console.error('Error saving vocabulary:', error);
  }
};
