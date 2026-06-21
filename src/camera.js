import { Plugins } from '@capacitor/core';

const { Camera } = Plugins;
// Function to use camera
const useCamera = async () => {
  const image = await Camera.getPhoto({
    quality: 90,
    allowEditing: false,
    resultType: CameraResultType.Uri
  });
  return image.webPath;
};