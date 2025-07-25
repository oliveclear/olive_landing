// Utility functions for face analysis and feedback

export const FaceAnalysisConfig = {
  TARGET_FACE_SIZE_MIN: 0.15, // Minimum face size (15% of video width)
  TARGET_FACE_SIZE_MAX: 0.50, // Maximum face size (50% of video width)
  TARGET_CENTER_TOLERANCE: 0.15, // Center tolerance (15% from center)
  ALIGNMENT_DURATION: 2000, // 2 seconds
  DETECTION_INTERVAL: 100, // 100ms
  OVAL_WIDTH_RATIO: 0.35, // Oval width as percentage of video width (narrower)
  OVAL_HEIGHT_RATIO: 0.7, // Oval height as percentage of video height (taller)
};

export const FeedbackTypes = {
  SUCCESS: 'success',
  ERROR: 'error',
  WARNING: 'warning',
  INFO: 'info'
};

export const FeedbackMessages = {
  INITIALIZING: 'Initializing...',
  LOADING_CAMERA: 'Loading camera...',
  LOOK_AT_CAMERA: 'Look at the camera',
  NO_FACE: 'No face detected',
  MULTIPLE_FACES: 'Only one face please',
  MOVE_INTO_FRAME: 'Move into frame',
  COME_CLOSER: 'Come closer',
  MOVE_BACK: 'Move back',
  MOVE_LEFT: 'Move left',
  MOVE_RIGHT: 'Move right',
  MOVE_UP: 'Move up',
  MOVE_DOWN: 'Move down',
  FACE_ALIGNED: 'Face aligned',
  SCAN_COMPLETE: 'Scan complete!',
  CAMERA_ERROR: 'Camera access denied. Please allow camera access and refresh.',
  MODEL_ERROR: 'Failed to load face detection models'
};

export const analyzeFaceInOval = (detection, videoWidth, videoHeight) => {
  const { TARGET_FACE_SIZE_MIN, TARGET_FACE_SIZE_MAX, TARGET_CENTER_TOLERANCE, OVAL_WIDTH_RATIO, OVAL_HEIGHT_RATIO } = FaceAnalysisConfig;
  
  const box = detection.detection.box;
  const faceWidth = box.width;
  const faceHeight = box.height;
  const faceCenterX = box.x + box.width / 2;
  const faceCenterY = box.y + box.height / 2;
  
  const videoCenterX = videoWidth / 2;
  const videoCenterY = videoHeight / 2;
  
  // Calculate face size relative to video
  const faceWidthRatio = faceWidth / videoWidth;
  
  // Calculate distance from center
  const horizontalDistance = Math.abs(faceCenterX - videoCenterX) / videoWidth;
  const verticalDistance = Math.abs(faceCenterY - videoCenterY) / videoHeight;
  
  // Define oval boundaries
  const ovalWidth = videoWidth * OVAL_WIDTH_RATIO;
  const ovalHeight = videoHeight * OVAL_HEIGHT_RATIO;
  const ovalCenterX = videoCenterX;
  const ovalCenterY = videoCenterY;
  
  // Check if face center is within oval using ellipse equation
  const normalizedX = (faceCenterX - ovalCenterX) / (ovalWidth / 2);
  const normalizedY = (faceCenterY - ovalCenterY) / (ovalHeight / 2);
  const isInOval = (normalizedX * normalizedX + normalizedY * normalizedY) <= 1;
    // Check alignment conditions with more forgiving tolerances
  const isSizeGood = faceWidthRatio >= TARGET_FACE_SIZE_MIN && faceWidthRatio <= TARGET_FACE_SIZE_MAX;
  const isCenteredHorizontally = horizontalDistance <= TARGET_CENTER_TOLERANCE;
  const isCenteredVertically = verticalDistance <= TARGET_CENTER_TOLERANCE;
  const isInFrame = box.x > 0 && box.y > 0 && (box.x + box.width) < videoWidth && (box.y + box.height) < videoHeight;
  
  // More forgiving alignment check - allow for slight movement
  const isWellAligned = isSizeGood && isInOval && 
    horizontalDistance <= (TARGET_CENTER_TOLERANCE * 1.2) && 
    verticalDistance <= (TARGET_CENTER_TOLERANCE * 1.2);
  
  // Provide feedback based on analysis
  if (!isInFrame) {
    return { 
      message: FeedbackMessages.MOVE_INTO_FRAME, 
      type: FeedbackTypes.ERROR, 
      aligned: false,
      details: { isInFrame: false, isInOval: false }
    };
  }
  
  if (!isInOval) {
    // Determine direction to move into oval
    if (Math.abs(normalizedX) > Math.abs(normalizedY)) {
      const direction = faceCenterX < videoCenterX ? 'right' : 'left';
      const message = direction === 'right' ? FeedbackMessages.MOVE_RIGHT : FeedbackMessages.MOVE_LEFT;
      return { 
        message, 
        type: FeedbackTypes.WARNING, 
        aligned: false,
        details: { isInOval: false, direction: 'horizontal' }
      };
    } else {
      const direction = faceCenterY < videoCenterY ? 'down' : 'up';
      const message = direction === 'down' ? FeedbackMessages.MOVE_DOWN : FeedbackMessages.MOVE_UP;
      return { 
        message, 
        type: FeedbackTypes.WARNING, 
        aligned: false,
        details: { isInOval: false, direction: 'vertical' }
      };
    }
  }
  
  if (faceWidthRatio < TARGET_FACE_SIZE_MIN) {
    return { 
      message: FeedbackMessages.COME_CLOSER, 
      type: FeedbackTypes.WARNING, 
      aligned: false,
      details: { tooFar: true, faceSize: faceWidthRatio, isInOval: true }
    };
  }
  
  if (faceWidthRatio > TARGET_FACE_SIZE_MAX) {
    return { 
      message: FeedbackMessages.MOVE_BACK, 
      type: FeedbackTypes.WARNING, 
      aligned: false,
      details: { tooClose: true, faceSize: faceWidthRatio, isInOval: true }
    };
  }
    if (isWellAligned) {
    return { 
      message: FeedbackMessages.FACE_ALIGNED, 
      type: FeedbackTypes.SUCCESS, 
      aligned: true,
      details: { 
        perfect: true, 
        faceSize: faceWidthRatio,
        isInOval: true,
        horizontalDistance,
        verticalDistance
      }
    };
  }
  
  return { 
    message: 'Center your face in the oval', 
    type: FeedbackTypes.WARNING, 
    aligned: false,
    details: { general: true, isInOval }
  };
};

export const drawOvalOverlay = (detection, ctx, canvasWidth, canvasHeight, videoWidth, videoHeight, isAligned) => {
  const { OVAL_WIDTH_RATIO, OVAL_HEIGHT_RATIO } = FaceAnalysisConfig;
  
  // Clear canvas first
  ctx.clearRect(0, 0, canvasWidth, canvasHeight);
  
  // Calculate oval dimensions and position
  const ovalWidth = canvasWidth * OVAL_WIDTH_RATIO;
  const ovalHeight = canvasHeight * OVAL_HEIGHT_RATIO;
  const ovalCenterX = canvasWidth / 2;
  const ovalCenterY = canvasHeight / 2 + 30;
  
  // Create dark overlay with oval cutout
  ctx.save();
  
  // Fill entire canvas with dark overlay
  ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
  ctx.fillRect(0, 0, canvasWidth, canvasHeight);
  
  // Cut out oval shape using composite operation
  ctx.globalCompositeOperation = 'destination-out';
  ctx.beginPath();
  ctx.ellipse(ovalCenterX, ovalCenterY, ovalWidth / 2, ovalHeight / 2, 0, 0, 2 * Math.PI);
  ctx.fill();
  
  // Reset composite operation
  ctx.globalCompositeOperation = 'source-over';
  
  // Draw oval border
  ctx.strokeStyle = isAligned ? '#BFD16D' : '#CEDF9F'; // Olive green color
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.ellipse(ovalCenterX, ovalCenterY, ovalWidth / 2, ovalHeight / 2, 0, 0, 2 * Math.PI);
  ctx.stroke();
  
  // Add inner glow effect for aligned state
  if (isAligned) {
    ctx.shadowColor = '#BFD16D';
    ctx.shadowBlur = 15;
    ctx.strokeStyle = '#BFD16D';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.ellipse(ovalCenterX, ovalCenterY, ovalWidth / 2, ovalHeight / 2, 0, 0, 2 * Math.PI);
    ctx.stroke();
    ctx.shadowBlur = 0;
  }
  
  ctx.restore();
  
  // Draw face bounding box if detection exists
  if (detection) {
    const box = detection.detection.box;
    const scaleX = canvasWidth / videoWidth;
    const scaleY = canvasHeight / videoHeight;
    
    const x = box.x * scaleX;
    const y = box.y * scaleY;
    const width = box.width * scaleX;
    const height = box.height * scaleY;
    
    // Draw face bounding box
    ctx.strokeStyle = isAligned ? '#10B981' : '#F59E0B';
    ctx.lineWidth = 2;
    ctx.strokeRect(x, y, width, height);
  }
};

export const cropFaceFromVideo = (videoElement, detection) => {
  if (!videoElement || !detection) return null;
  
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  
  const box = detection.detection.box;
  const padding = 20; // Add some padding around the face
  
  // Calculate crop area with padding
  const cropX = Math.max(0, box.x - padding);
  const cropY = Math.max(0, box.y - padding);
  const cropWidth = Math.min(videoElement.videoWidth - cropX, box.width + padding * 2);
  const cropHeight = Math.min(videoElement.videoHeight - cropY, box.height + padding * 2);
  
  // Set canvas size to crop area
  canvas.width = cropWidth;
  canvas.height = cropHeight;
  
  // Draw the cropped video frame
  ctx.drawImage(
    videoElement,
    cropX, cropY, cropWidth, cropHeight,  // Source rectangle
    0, 0, cropWidth, cropHeight           // Destination rectangle
  );
  
  // Convert to base64
  return canvas.toDataURL('image/jpeg', 0.9);
};

export const getFeedbackIcon = (type) => {
  switch (type) {
    case FeedbackTypes.SUCCESS: return '✅';
    case FeedbackTypes.ERROR: return '❌';
    case FeedbackTypes.WARNING: return '⚠️';
    default: return 'ℹ️';
  }
};

// Keep the original analyzeFace function for backward compatibility
export const analyzeFace = analyzeFaceInOval;

export const getFeedbackColor = (type) => {
  switch (type) {
    case FeedbackTypes.SUCCESS: return 'text-green-500';
    case FeedbackTypes.ERROR: return 'text-red-500';
    case FeedbackTypes.WARNING: return 'text-yellow-500';
    default: return 'text-blue-500';
  }
};
