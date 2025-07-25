'use client';

/**
 * Photo management utilities for face scanner
 */

// Save photo to Downloads folder with timestamp
export const savePhotoToFolder = async (imageDataUrl, folderName = 'FaceScans') => {
  try {
    // Check if File System Access API is supported
    if ('showDirectoryPicker' in window) {
      // Modern browsers with File System Access API
      const directoryHandle = await window.showDirectoryPicker({
        mode: 'readwrite'
      });
      
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const filename = `face-scan-${timestamp}.jpg`;
      
      // Convert base64 to blob
      const response = await fetch(imageDataUrl);
      const blob = await response.blob();
      
      // Create file in selected directory
      const fileHandle = await directoryHandle.getFileHandle(filename, {
        create: true
      });
      
      const writable = await fileHandle.createWritable();
      await writable.write(blob);
      await writable.close();
      
      return { success: true, filename, path: directoryHandle.name };
    } else {
      // Fallback for browsers without File System Access API
      return downloadToDownloads(imageDataUrl);
    }
  } catch (error) {
    console.error('Error saving photo:', error);
    // Fallback to download
    return downloadToDownloads(imageDataUrl);
  }
};

// Fallback download function
const downloadToDownloads = (imageDataUrl) => {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const filename = `face-scan-${timestamp}.jpg`;
  
  const link = document.createElement('a');
  link.href = imageDataUrl;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  return { 
    success: true, 
    filename, 
    path: 'Downloads',
    method: 'browser_download'
  };
};

// Save multiple photos as a batch
export const saveBatchPhotos = async (imageDataUrls, folderName = 'FaceScans') => {
  const results = [];
  
  try {
    if ('showDirectoryPicker' in window) {
      const directoryHandle = await window.showDirectoryPicker({
        mode: 'readwrite'
      });
      
      for (let i = 0; i < imageDataUrls.length; i++) {
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const filename = `face-scan-${i + 1}-${timestamp}.jpg`;
        
        const response = await fetch(imageDataUrls[i]);
        const blob = await response.blob();
        
        const fileHandle = await directoryHandle.getFileHandle(filename, {
          create: true
        });
        
        const writable = await fileHandle.createWritable();
        await writable.write(blob);
        await writable.close();
        
        results.push({ success: true, filename });
      }
      
      return { success: true, saved: results.length, results };
    }
  } catch (error) {
    console.error('Batch save error:', error);
    // Fallback to individual downloads
    imageDataUrls.forEach((url, index) => {
      setTimeout(() => downloadToDownloads(url), index * 500);
    });
    
    return { 
      success: true, 
      saved: imageDataUrls.length, 
      method: 'browser_download' 
    };
  }
};

// Create a photo gallery from saved images
export const createPhotoGallery = (images) => {
  return images.map((image, index) => ({
    id: index + 1,
    src: image,
    timestamp: new Date().toISOString(),
    filename: `face-scan-${index + 1}.jpg`
  }));
};

// Compress image before saving
export const compressImage = (imageDataUrl, quality = 0.8) => {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      canvas.width = img.width;
      canvas.height = img.height;
      
      ctx.drawImage(img, 0, 0);
      
      const compressedDataUrl = canvas.toDataURL('image/jpeg', quality);
      resolve(compressedDataUrl);
    };
    img.src = imageDataUrl;
  });
};

// Get storage info
export const getStorageInfo = () => {
  const isFileSystemSupported = 'showDirectoryPicker' in window;
  const isDownloadSupported = 'download' in document.createElement('a');
  
  return {
    fileSystemAccess: isFileSystemSupported,
    browserDownload: isDownloadSupported,
    recommendedMethod: isFileSystemSupported ? 'folder_picker' : 'browser_download'
  };
};

export default {
  savePhotoToFolder,
  saveBatchPhotos,
  createPhotoGallery,
  compressImage,
  getStorageInfo
};
