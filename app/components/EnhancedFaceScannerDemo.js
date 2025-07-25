'use client';

import { useState } from 'react';
import FaceScanner from './FaceScanner';
import { getStorageInfo } from '../utils/photoManager';

const EnhancedFaceScannerDemo = () => {
  const [scanHistory, setScanHistory] = useState([]);
  const [storageInfo] = useState(getStorageInfo());

  const handleScanComplete = (capturedImage) => {
    const newScan = {
      id: Date.now(),
      timestamp: new Date().toLocaleString(),
      image: capturedImage,
      size: Math.round((capturedImage.length * 3/4) / 1024) // Approximate size in KB
    };
    
    setScanHistory(prev => [newScan, ...prev.slice(0, 9)]); // Keep last 10 scans
    console.log('Enhanced scan completed:', newScan);
  };

  const clearHistory = () => {
    setScanHistory([]);
  };

  return (
    <div className="space-y-8">
      {/* Storage Info Banner */}
      <div className="max-w-2xl mx-auto">
        <div className="bg-blue-50 dark:bg-blue-900 p-4 rounded-lg border border-blue-200 dark:border-blue-700">
          <h3 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">
            📁 Photo Storage Features
          </h3>
          <div className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
            <div>✅ File System Access: {storageInfo.fileSystemAccess ? 'Supported' : 'Not Supported'}</div>
            <div>✅ Browser Download: {storageInfo.browserDownload ? 'Supported' : 'Not Supported'}</div>
            <div>🎯 Recommended: {storageInfo.recommendedMethod === 'folder_picker' ? 'Direct Folder Save' : 'Browser Download'}</div>
          </div>
        </div>
      </div>

      {/* Main Scanner */}
      <FaceScanner onScanComplete={handleScanComplete} />
      
      {/* Enhanced Features Info */}
      <div className="max-w-2xl mx-auto">
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900 dark:to-purple-900 p-6 rounded-lg">
          <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
            🆕 New Features
          </h3>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="font-medium text-blue-600 dark:text-blue-400">🔵 Vertical Countdown</div>
              <div className="text-sm text-gray-600 dark:text-gray-300">
                Large, animated 2-second countdown timer
              </div>
            </div>
            <div className="space-y-2">
              <div className="font-medium text-green-600 dark:text-green-400">📁 Folder Saving</div>
              <div className="text-sm text-gray-600 dark:text-gray-300">
                Direct save to custom folders with auto-naming
              </div>
            </div>
            <div className="space-y-2">
              <div className="font-medium text-purple-600 dark:text-purple-400">🔄 Smart Reset</div>
              <div className="text-sm text-gray-600 dark:text-gray-300">
                Countdown won't reset when face moves slightly
              </div>
            </div>
            <div className="space-y-2">
              <div className="font-medium text-orange-600 dark:text-orange-400">📱 Notifications</div>
              <div className="text-sm text-gray-600 dark:text-gray-300">
                Toast notifications for save status
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Scan History */}
      {scanHistory.length > 0 && (
        <div className="max-w-2xl mx-auto">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold text-gray-800 dark:text-white">
              📸 Recent Scans ({scanHistory.length})
            </h3>
            <button
              onClick={clearHistory}
              className="px-4 py-2 text-sm bg-gray-500 hover:bg-gray-600 text-white rounded-lg transition-colors"
            >
              Clear History
            </button>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {scanHistory.map((scan) => (
              <div
                key={scan.id}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden"
              >
                <img 
                  src={scan.image} 
                  alt={`Scan ${scan.id}`}
                  className="w-full h-32 object-cover"
                />
                <div className="p-3">
                  <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                    {scan.timestamp}
                  </div>
                  <div className="text-xs text-blue-600 dark:text-blue-400">
                    Size: {scan.size} KB
                  </div>
                  <a
                    href={scan.image}
                    download={`face-scan-${scan.id}.jpg`}
                    className="inline-block mt-2 px-2 py-1 text-xs bg-blue-500 hover:bg-blue-600 text-white rounded transition-colors"
                  >
                    Download
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* Statistics */}
      {scanHistory.length > 0 && (
        <div className="max-w-2xl mx-auto">
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow text-center">
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                {scanHistory.length}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Total Scans
              </div>
            </div>
            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow text-center">
              <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                {Math.round(scanHistory.reduce((acc, scan) => acc + scan.size, 0))}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Total KB
              </div>
            </div>
            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow text-center">
              <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                {scanHistory.length > 0 ? Math.round(scanHistory.reduce((acc, scan) => acc + scan.size, 0) / scanHistory.length) : 0}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Avg KB/Scan
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EnhancedFaceScannerDemo;
