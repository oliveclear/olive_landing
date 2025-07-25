// Face Scanner Configuration
// Modify these values to customize the face detection behavior

export const FACE_SCANNER_CONFIG = {
  // Face size requirements (as percentage of video width)
  FACE_SIZE: {
    MIN: 0.15,    // Minimum face size (15% of video width)
    MAX: 0.35,    // Maximum face size (35% of video width)
  },
  
  // Position tolerance (as percentage from center)
  POSITION_TOLERANCE: {
    HORIZONTAL: 0.15,  // 15% tolerance from horizontal center
    VERTICAL: 0.15,    // 15% tolerance from vertical center
  },
  
  // Timing settings (in milliseconds)
  TIMING: {
    DETECTION_INTERVAL: 100,    // How often to run face detection (100ms)
    ALIGNMENT_DURATION: 3000,   // How long to stay aligned before capturing (3s)
    COUNTDOWN_INTERVAL: 1000,   // Countdown timer interval (1s)
  },
  
  // Camera settings
  CAMERA: {
    IDEAL_WIDTH: 640,
    IDEAL_HEIGHT: 480,
    FACING_MODE: 'user',  // 'user' for front camera, 'environment' for back
  },
  
  // UI settings
  UI: {
    SHOW_DEBUG_INFO: false,     // Show debug information overlay
    SHOW_TARGET_OVERLAY: true,  // Show target area overlay
    SHOW_FACE_BOX: true,        // Show face bounding box
    MIRROR_VIDEO: true,         // Mirror video for selfie-style view
  },
  
  // Model settings
  MODELS: {
    MODEL_URL: '/models',
    TINY_FACE_DETECTOR_OPTIONS: {
      inputSize: 416,
      scoreThreshold: 0.5,
    }
  },
  
  // Feedback messages customization
  MESSAGES: {
    INITIALIZING: 'Initializing face scanner...',
    LOADING_CAMERA: 'Accessing camera...',
    LOOK_AT_CAMERA: 'Position your face in the frame',
    NO_FACE: 'No face detected - please look at the camera',
    MULTIPLE_FACES: 'Multiple faces detected - only one person please',
    MOVE_INTO_FRAME: 'Please move your face into the frame',
    COME_CLOSER: 'Move closer to the camera',
    MOVE_BACK: 'Move back from the camera',
    MOVE_LEFT: 'Move slightly to your left',
    MOVE_RIGHT: 'Move slightly to your right',
    MOVE_UP: 'Move your head up slightly',
    MOVE_DOWN: 'Move your head down slightly',
    FACE_ALIGNED: 'Perfect! Hold steady...',
    SCAN_COMPLETE: 'Face scan completed successfully!',
    CAMERA_ERROR: 'Camera access denied. Please allow camera permissions.',
    MODEL_ERROR: 'Failed to load face detection models',
  },
  
  // Colors for different feedback states
  COLORS: {
    SUCCESS: '#10B981',    // Green
    ERROR: '#EF4444',      // Red
    WARNING: '#F59E0B',    // Yellow/Orange
    INFO: '#3B82F6',       // Blue
    TARGET_OVERLAY: 'rgba(255, 255, 255, 0.5)',
    FACE_BOX_ALIGNED: '#10B981',
    FACE_BOX_MISALIGNED: '#F59E0B',
  }
};

// Helper function to get configuration values
export const getConfig = (path) => {
  return path.split('.').reduce((obj, key) => obj?.[key], FACE_SCANNER_CONFIG);
};

// Validation function to ensure configuration values are valid
export const validateConfig = () => {
  const errors = [];
  
  if (FACE_SCANNER_CONFIG.FACE_SIZE.MIN >= FACE_SCANNER_CONFIG.FACE_SIZE.MAX) {
    errors.push('FACE_SIZE.MIN must be less than FACE_SIZE.MAX');
  }
  
  if (FACE_SCANNER_CONFIG.TIMING.DETECTION_INTERVAL < 50) {
    errors.push('DETECTION_INTERVAL should not be less than 50ms for performance');
  }
  
  if (FACE_SCANNER_CONFIG.TIMING.ALIGNMENT_DURATION < 1000) {
    errors.push('ALIGNMENT_DURATION should be at least 1000ms');
  }
  
  return errors;
};

export default FACE_SCANNER_CONFIG;
