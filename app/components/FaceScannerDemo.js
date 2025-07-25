'use client';

import { useState } from 'react';
import FaceScanner from './FaceScanner';

const FaceScannerDemo = () => {
  const [scanResults, setScanResults] = useState([]);
  const [currentScanId, setCurrentScanId] = useState(0);
  const handleScanComplete = (capturedImage) => {
    const newScan = {
      id: currentScanId + 1,
      timestamp: new Date().toLocaleString(),
      status: 'completed',
      image: capturedImage
    };
    
    setScanResults(prev => [newScan, ...prev.slice(0, 4)]); // Keep last 5 scans
    setCurrentScanId(prev => prev + 1);
    
    console.log('Face scan completed:', newScan);
  };

  const clearHistory = () => {
    setScanResults([]);
    setCurrentScanId(0);
  };

  return (
    <div className="space-y-8">
      {/* Main Scanner */}
      <FaceScanner onScanComplete={handleScanComplete} />
      
      {/* Scan History */}
      {scanResults.length > 0 && (
        <div className="max-w-2xl mx-auto">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold text-gray-800 dark:text-white">
              Scan History
            </h3>
            <button
              onClick={clearHistory}
              className="px-4 py-2 text-sm bg-gray-500 hover:bg-gray-600 text-white rounded-lg transition-colors"
            >
              Clear History
            </button>
          </div>
          
          <div className="space-y-2">
            {scanResults.map((scan) => (
              <div
                key={scan.id}
                className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 rounded-lg shadow"
              >                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
                    <span className="text-green-600 dark:text-green-400 font-semibold text-sm">
                      {scan.id}
                    </span>
                  </div>
                  {scan.image && (
                    <img 
                      src={scan.image} 
                      alt={`Scan ${scan.id}`}
                      className="w-12 h-12 rounded-full object-cover border-2 border-gray-300 dark:border-gray-600"
                    />
                  )}
                  <div>
                    <p className="font-medium text-gray-800 dark:text-white">
                      Scan #{scan.id}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {scan.timestamp}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="px-2 py-1 text-xs bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded-full">
                    ✅ {scan.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* Statistics */}
      {scanResults.length > 0 && (
        <div className="max-w-2xl mx-auto">
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow text-center">
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                {scanResults.length}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Total Scans
              </div>
            </div>
            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow text-center">
              <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                {scanResults.filter(s => s.status === 'completed').length}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Successful
              </div>
            </div>
            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow text-center">
              <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                100%
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Success Rate
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FaceScannerDemo;
