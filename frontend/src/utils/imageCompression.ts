import { PROFILE_IMAGE_MAX_WIDTH, PROFILE_IMAGE_MAX_HEIGHT, PROFILE_IMAGE_QUALITY } from '../constants';

export const compressImage = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;

      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        if (width > PROFILE_IMAGE_MAX_WIDTH) {
          height = Math.round((height * PROFILE_IMAGE_MAX_WIDTH) / width);
          width = PROFILE_IMAGE_MAX_WIDTH;
        }
        if (height > PROFILE_IMAGE_MAX_HEIGHT) {
          width = Math.round((width * PROFILE_IMAGE_MAX_HEIGHT) / height);
          height = PROFILE_IMAGE_MAX_HEIGHT;
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Failed to get canvas context'));
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);
        const compressedBase64 = canvas.toDataURL('image/jpeg', PROFILE_IMAGE_QUALITY);
        resolve(compressedBase64);
      };

      img.onerror = () => reject(new Error('Failed to load image'));
    };

    reader.onerror = () => reject(new Error('Failed to read file'));
  });
};
