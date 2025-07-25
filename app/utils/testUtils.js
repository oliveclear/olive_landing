/**
 * Test utilities for face scanning functionality
 */

export const testFaceCropping = (imageDataUrl) => {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      console.log('✅ Face image loaded successfully');
      console.log('📏 Image dimensions:', img.width, 'x', img.height);
      console.log('📦 Image size (KB):', Math.round((imageDataUrl.length * 3/4) / 1024));
      resolve(true);
    };
    img.onerror = () => {
      console.error('❌ Failed to load face image');
      resolve(false);
    };
    img.src = imageDataUrl;
  });
};

export const downloadFaceImage = (imageDataUrl, filename = 'face-scan.jpg') => {
  const link = document.createElement('a');
  link.href = imageDataUrl;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  console.log('💾 Face image downloaded as:', filename);
};

export const analyzeImageQuality = (imageDataUrl) => {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      canvas.width = img.width;
      canvas.height = img.height;
      
      ctx.drawImage(img, 0, 0);
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;
      
      let brightness = 0;
      let pixels = 0;
      
      for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];
        brightness += (r * 0.299 + g * 0.587 + b * 0.114);
        pixels++;
      }
      
      const avgBrightness = brightness / pixels;
      const quality = {
        width: img.width,
        height: img.height,
        brightness: Math.round(avgBrightness),
        qualityScore: avgBrightness > 50 && avgBrightness < 200 ? 'Good' : 'Poor'
      };
      
      console.log('🔍 Image Quality Analysis:', quality);
      resolve(quality);
    };
    img.src = imageDataUrl;
  });
};

export default {
  testFaceCropping,
  downloadFaceImage,
  analyzeImageQuality
};
