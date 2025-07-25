'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import * as faceapi from 'face-api.js';
import { useCamera } from '../hooks/useCamera';
import { 
  FaceAnalysisConfig, 
  FeedbackMessages, 
  FeedbackTypes,
  analyzeFaceInOval, 
  drawOvalOverlay, 
  getFeedbackIcon, 
  getFeedbackColor,
  cropFaceFromVideo
} from '../utils/faceAnalysis';
import { savePhotoToFolder, compressImage } from '../utils/photoManager';
import { useNotification } from './Notification';

const FaceScanner = ({ onScanComplete, currentView, existingImage }) => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const detectionIntervalRef = useRef(null);
  const alignmentTimerRef = useRef(null);
  const { stream, isLoading: cameraLoading, error: cameraError, startCamera, stopCamera } = useCamera();
  
  const [isModelLoaded, setIsModelLoaded] = useState(false);
  const [feedback, setFeedback] = useState(FeedbackMessages.INITIALIZING);  const [feedbackType, setFeedbackType] = useState(FeedbackTypes.INFO);  const [isAligned, setIsAligned] = useState(false);
  const [alignmentCountdown, setAlignmentCountdown] = useState(0);
  const [scanComplete, setScanComplete] = useState(false);
  const [capturedImage, setCapturedImage] = useState(null);
  const [currentDetection, setCurrentDetection] = useState(null);
  const [isCountingDown, setIsCountingDown] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [alignmentStability, setAlignmentStability] = useState(0); // Track how long face has been aligned
  const { showNotification, NotificationContainer } = useNotification();

  const { ALIGNMENT_DURATION, DETECTION_INTERVAL } = FaceAnalysisConfig;
  // Load face-api.js models
  const loadModels = async () => {
    try {
      const MODEL_URL = '/models';
      await Promise.all([
        faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
        faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
        faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL),
      ]);
      setIsModelLoaded(true);
    } catch (error) {
      console.error('Error loading face-api models:', error);
      setFeedback(FeedbackMessages.MODEL_ERROR);
      setFeedbackType(FeedbackTypes.ERROR);
    }
  };  useEffect(() => {
    resetScan();
    // If there's an existing image for this view, set it
    if (existingImage) {
      setCapturedImage(existingImage);
      setScanComplete(true);
    }
  }, [currentView, existingImage]);

  // Initialize camera when models are loaded
  const initializeCamera = useCallback(async () => {
    if (!isModelLoaded) return;
    
    try {
      // More comprehensive browser support check
      if (!navigator.mediaDevices) {
        if (navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia) {
          setFeedback('Camera supported but requires HTTPS. Please use https:// or localhost');
          setFeedbackType(FeedbackTypes.ERROR);
          return;
        } else {
          setFeedback('Camera not supported on this browser');
          setFeedbackType(FeedbackTypes.ERROR);
          return;
        }
      }
      
      if (!navigator.mediaDevices.getUserMedia) {
        setFeedback('getUserMedia not supported. Please update your browser.');
        setFeedbackType(FeedbackTypes.ERROR);
        return;
      }
      
      setFeedback('Requesting camera access...');
      setFeedbackType(FeedbackTypes.INFO);
      
      const mediaStream = await startCamera();
      if (videoRef.current && mediaStream) {
        videoRef.current.srcObject = mediaStream;
        await videoRef.current.play();
        setFeedback(FeedbackMessages.LOOK_AT_CAMERA);
        setFeedbackType(FeedbackTypes.INFO);
        console.log('[FaceScanner] Stream assigned to video element:', mediaStream);
      } else {
        console.error('[FaceScanner] videoRef or mediaStream missing:', videoRef.current, mediaStream);
      }
    } catch (error) {
      console.error('Error accessing camera:', error);
      
      // Provide specific error messages based on error type
      if (error.name === 'NotAllowedError') {
        setFeedback('Camera access denied. Please click "Allow" when prompted.');
      } else if (error.name === 'NotFoundError') {
        setFeedback('No camera found. Please connect a camera and refresh.');
      } else if (error.name === 'NotReadableError') {
        setFeedback('Camera is being used by another application.');
      } else if (error.name === 'NotSupportedError') {
        setFeedback('Camera not supported. Try using HTTPS or localhost.');
      } else if (error.name === 'OverconstrainedError') {
        setFeedback('Camera constraints not supported. Trying with basic settings...');
        // Try with basic constraints
        try {
          const basicStream = await navigator.mediaDevices.getUserMedia({ video: true });
          if (videoRef.current && basicStream) {
            videoRef.current.srcObject = basicStream;
            await videoRef.current.play();
            setFeedback(FeedbackMessages.LOOK_AT_CAMERA);
            setFeedbackType(FeedbackTypes.INFO);
          }
        } catch (basicError) {
          setFeedback('Camera access failed. Please check permissions.');
          setFeedbackType(FeedbackTypes.ERROR);
        }
      } else {
        setFeedback(`Camera error: ${error.message || 'Unknown error'}`);
      }
      setFeedbackType(FeedbackTypes.ERROR);
    }
  }, [isModelLoaded, startCamera]);  // Detect faces
  const detectFaces = async () => {
    if (!videoRef.current || !isModelLoaded || videoRef.current.paused || videoRef.current.ended) {
      return;
    }

    try {
      const detections = await faceapi.detectAllFaces(
        videoRef.current,
        new faceapi.TinyFaceDetectorOptions()
      ).withFaceLandmarks().withFaceDescriptors();

      // Clear canvas
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (detections.length === 0) {
        setFeedback(FeedbackMessages.NO_FACE);
        setFeedbackType(FeedbackTypes.ERROR);
        setIsAligned(false);
        setCurrentDetection(null);
        setAlignmentStability(0);
        if (isCountingDown) clearAlignmentTimer();
        
        // Draw empty oval overlay
        drawOvalOverlay(null, ctx, canvas.width, canvas.height, null, null, false);
        return;
      }

      if (detections.length > 1) {
        setFeedback(FeedbackMessages.MULTIPLE_FACES);
        setFeedbackType(FeedbackTypes.WARNING);
        setIsAligned(false);
        setCurrentDetection(null);
        setAlignmentStability(0);
        if (isCountingDown) clearAlignmentTimer();
        
        // Draw empty oval overlay
        drawOvalOverlay(null, ctx, canvas.width, canvas.height, null, null, false);
        return;
      }

      // Analyze the single detected face
      const detection = detections[0];
      const videoWidth = videoRef.current.videoWidth;
      const videoHeight = videoRef.current.videoHeight;
      
      setCurrentDetection(detection);
      
      const analysis = analyzeFaceInOval(detection, videoWidth, videoHeight);
      
      setFeedback(analysis.message);
      setFeedbackType(analysis.type);
      setIsAligned(analysis.aligned);

      // Draw oval overlay
      drawOvalOverlay(detection, ctx, canvas.width, canvas.height, videoWidth, videoHeight, analysis.aligned);

      // Handle alignment timer with stability check
      if (analysis.aligned) {
        // Increment stability counter when face is aligned
        setAlignmentStability(prev => prev + 1);
        
        // Start countdown only after face has been stable for 3 detection cycles (300ms)
        if (alignmentStability >= 3 && !isCountingDown && !alignmentTimerRef.current) {
          console.log('Starting alignment timer - face is stable and aligned');
          startAlignmentTimer();
        }
        
        // During countdown, be more forgiving - only reset if face is severely misaligned
        if (isCountingDown && !analysis.aligned) {
          // Check if face is still somewhat close to aligned position
          const isStillClose = analysis.details?.isInOval && 
                              analysis.details?.faceSize >= 0.12 && 
                              analysis.details?.faceSize <= 0.55;
          
          if (!isStillClose) {
            console.log('Clearing alignment timer - face moved too far');
            clearAlignmentTimer();
            setAlignmentStability(0);
          } else {
            console.log('Face slightly misaligned but staying in countdown');
          }
        }
      } else {
        // Reset stability counter when face is not aligned
        setAlignmentStability(0);
        
        // Only clear countdown if we're not counting down or face is really misaligned
        if (isCountingDown) {
          // Be more forgiving during countdown
          const isCompletelyMisaligned = !analysis.details?.isInOval || 
                                       analysis.details?.faceSize < 0.10 || 
                                       analysis.details?.faceSize > 0.60;
          
          if (isCompletelyMisaligned) {
            console.log('Clearing alignment timer - face completely misaligned');
            clearAlignmentTimer();
          }
        }
      }

    } catch (error) {
      console.error('Face detection error:', error);
    }
  };// Start alignment timer
  const startAlignmentTimer = () => {
    console.log('Starting countdown timer...');
    setIsCountingDown(true);
    setAlignmentCountdown(2);
    
    alignmentTimerRef.current = setInterval(() => {
      setAlignmentCountdown(prev => {
        console.log('Countdown:', prev);
        if (prev <= 1) {
          console.log('Countdown complete, capturing image...');
          clearAlignmentTimer();
          captureFaceImage();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };  // Capture face image
  const captureFaceImage = async () => {
    console.log('[DEBUG] captureFaceImage called');
    if (!videoRef.current) {
      console.error('[DEBUG] No video element');
      return;
    }
    if (!currentDetection) {
      console.error('[DEBUG] No currentDetection');
      return;
    }
    try {
      const faceImage = cropFaceFromVideo(videoRef.current, currentDetection);
      console.log('[DEBUG] Cropped faceImage:', faceImage ? faceImage.substring(0, 50) : 'null');
      if (!faceImage) return;
      const compressedImage = await compressImage(faceImage, 0.9);
      setCapturedImage(compressedImage);
      setScanComplete(true);
      setFeedback(FeedbackMessages.SCAN_COMPLETE);
      setFeedbackType(FeedbackTypes.SUCCESS);
      console.log('[DEBUG] Image captured and set!');
      
      // Notify parent component that scan is complete
      if (onScanComplete) {
        console.log('[DEBUG] Calling onScanComplete with image');
        onScanComplete(compressedImage);
      }
      
      // Set local state for UI updates
      setCapturedImage(compressedImage);
      setScanComplete(true);
    } catch (err) {
      console.error('[DEBUG] Error in captureFaceImage:', err);
    }
  };// Clear alignment timer
  const clearAlignmentTimer = () => {
    console.log('Clearing alignment timer');
    if (alignmentTimerRef.current) {
      clearInterval(alignmentTimerRef.current);
      alignmentTimerRef.current = null;
    }
    setAlignmentCountdown(0);
    setIsCountingDown(false);
    setAlignmentStability(0);
  };  // Handle video load
  const handleVideoLoad = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      
      canvas.width = video.offsetWidth;
      canvas.height = video.offsetHeight;
      
      // Start face detection with adaptive intervals
      startDetectionLoop();
    }
  };

  // Adaptive detection loop
  const startDetectionLoop = () => {
    if (detectionIntervalRef.current) {
      clearInterval(detectionIntervalRef.current);
    }
    
    const runDetection = () => {
      detectFaces();
      
      // Use slower detection during countdown to reduce interference
      const interval = isCountingDown ? 200 : DETECTION_INTERVAL; // 200ms during countdown, 100ms normally
      detectionIntervalRef.current = setTimeout(runDetection, interval);
    };
    
    runDetection();
  };
  // Cleanup function
  const cleanup = useCallback(() => {
    if (detectionIntervalRef.current) {
      clearTimeout(detectionIntervalRef.current);
      clearInterval(detectionIntervalRef.current);
    }
    clearAlignmentTimer();
    stopCamera();
  }, [stopCamera]);// Reset scan
  const resetScan = () => {
    setScanComplete(false);
    setCapturedImage(null);
    setAlignmentCountdown(0);
    setIsAligned(false);
    setCurrentDetection(null);
    setIsCountingDown(false);
    setIsSaving(false);
    setAlignmentStability(0);
    setFeedback(FeedbackMessages.LOOK_AT_CAMERA);
    setFeedbackType(FeedbackTypes.INFO);
    clearAlignmentTimer();
  };

  // Save photo to custom folder
  const handleSaveToFolder = async () => {
    if (!capturedImage) return;
    
    setIsSaving(true);    try {
      const result = await savePhotoToFolder(capturedImage, 'FaceScans');
      if (result.success) {
        showNotification(
          `Photo saved to ${result.path}/${result.filename}`,
          'success',
          4000
        );
      }
    } catch (error) {
      showNotification(
        'Failed to save photo. Please try manual download.',
        'error',
        4000
      );
    } finally {
      setIsSaving(false);
    }
  };  // Debug function to check browser capabilities
  const getBrowserCapabilities = () => {
    const capabilities = {
      mediaDevices: !!navigator.mediaDevices,
      getUserMedia: !!navigator.mediaDevices?.getUserMedia,
      legacyGetUserMedia: !!(navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia),
      protocol: window.location.protocol,
      isLocalhost: window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1',
      isSecure: window.location.protocol === 'https:' || window.location.hostname === 'localhost'
    };
    
    console.log('Browser capabilities:', capabilities);
    return capabilities;
  };
  // Initialize component
  useEffect(() => {
    // Check browser capabilities first
    const capabilities = getBrowserCapabilities();
    
    loadModels();
    
    // Request camera access immediately when component mounts
    const requestCameraAccess = async () => {
      try {
        // Check if any form of getUserMedia is available
        if (!capabilities.mediaDevices && !capabilities.legacyGetUserMedia) {
          console.log('No camera APIs available');
          setFeedback('Camera not supported in this browser. Please use Chrome, Firefox, or Safari.');
          setFeedbackType(FeedbackTypes.ERROR);
          return;
        }
        
        if (!capabilities.isSecure && !capabilities.isLocalhost) {
          setFeedback('Camera requires HTTPS. Please use https:// or localhost.');
          setFeedbackType(FeedbackTypes.ERROR);
          return;
        }
        
        // Try to request camera permission immediately (only if mediaDevices exists)
        if (capabilities.getUserMedia) {
          await navigator.mediaDevices.getUserMedia({ video: true });
          console.log('Camera permission granted');
        } else {
          console.log('Using legacy getUserMedia methods');
        }
      } catch (error) {
        console.log('Initial camera permission check:', error.message);
        // This is expected on first load, user will need to click allow
      }
    };
    
    requestCameraAccess();
    
    return cleanup;
  }, [cleanup]);// Initialize camera when models are loaded
  useEffect(() => {
    if (isModelLoaded) {
      // Small delay to ensure DOM is ready
      const timer = setTimeout(() => {
        initializeCamera();
      }, 100);
      
      return () => clearTimeout(timer);
    }
  }, [isModelLoaded, initializeCamera]);
  // Get feedback color class and icon
  const feedbackColor = getFeedbackColor(feedbackType);
  const feedbackIcon = getFeedbackIcon(feedbackType);
  // Remove instructions and overlays, keep only video, move bar, and capture button
  // Add a bar for face alignment feedback
  let moveBarText = '';
  if (!currentDetection) moveBarText = 'No face detected';
  else if (!isAligned) moveBarText = 'Move face to center';
  else moveBarText = 'Face centered!';

  return (
    <div className="relative w-full max-w-2xl mx-auto bg-transparent rounded-xl overflow-hidden ">
      {/* Video Container */}
      <div className="relative aspect-[15/8]">
        {!scanComplete ? (
          <>
            <video
              ref={videoRef}
              className="w-full h-full object-cover rounded-[28px] face-scanner-video"
              autoPlay
              muted
              playsInline
              onLoadedMetadata={handleVideoLoad}
            />
            {/* Canvas Overlay for move bar only */}
            <canvas
              ref={canvasRef}
              className={`absolute top-0 rounded-[28px] left-0 w-full h-full face-scanner-canvas`}
            />
            {/* Move Bar */}
            <div className="absolute bottom-2.5 left-5 z-20 w-[25%] max-w-md">
              <div 
                style={{
                  backgroundColor: !currentDetection ? '#ff6b6b' : isAligned ? '#BFD16D' : '#CEDF9F',
                  color: !currentDetection ? '#161616' : isAligned ? '#161616' : '#161616',
                  borderRadius: '28px',
                  padding: '8px',
                  paddingTop: '3px',
                  paddingBottom: '3px',
                  textAlign: 'center',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
                  fontSize: '11px',
                  fontWeight: '600'
                }}
              >
                {moveBarText}
              </div>
            </div>
          </>
        ) : (
          /* Show captured image */
          <div className="w-full h-full flex items-center justify-center">
            <img 
              src={capturedImage} 
              alt="Captured face" 
              className="max-w-full max-h-full object-none rounded-lg"
              style={{
                width: 'auto',
                height: 'auto',
                maxWidth: '80%',
                maxHeight: '80%',
                // marginTop: '70px',
                marginTop: '70px',

              }}
            />
          </div>
        )}
      </div>
      {/* Capture/Retake Button below video */}
      <div className="flex flex-col items-center mt-4">
        {!scanComplete ? (
          <button
            onClick={captureFaceImage}
            disabled={!isAligned || isCountingDown}
            style={{
              backgroundColor: isAligned && !isCountingDown ? '#BFD16D' : '#666',
              color: isAligned && !isCountingDown ? '#000' : '#fff',
              border: 'none',
              borderRadius: '12px',
              padding: '12px 24px',
              fontSize: '16px',
              fontWeight: '600',
              cursor: isAligned && !isCountingDown ? 'pointer' : 'not-allowed',
              transition: 'all 0.3s ease',
              marginBottom: '8px'
            }}
          >
            Capture
          </button>
        ) : (
          <button
            onClick={resetScan}
            style={{
              backgroundColor: '#ff6b6b',
              color: '#fff',
              border: 'none',
              borderRadius: '12px',
              padding: '12px 24px',
              fontSize: '16px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              marginBottom: '8px'
            }}
          >
            Retake
          </button>
        )}
      </div>
    </div>
  );
};

export default FaceScanner;
