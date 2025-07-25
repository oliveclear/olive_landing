"use client";
import { useState, useEffect } from "react";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import FaceScanner from "../components/FaceScanner";

const token = Cookies.get("token");

const FaceScan = () => {
  const [currentView, setCurrentView] = useState('front');
  const [images, setImages] = useState({ front: null, left: null, right: null });
  const [skinType, setSkinType] = useState(null);
  const [confidenceScores, setConfidenceScores] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isScreen, setIsScreen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [showInstructions, setShowInstructions] = useState(true);
  const router = useRouter();

  // Add keyframe animation using useEffect
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
    `;
    document.head.appendChild(style);
    
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  useEffect(() => {
    if (!Cookies.get("token")) {
      router.replace("/login");
    }
  }, [router]);
  useEffect(() => {
    const handleResize = () => {
      setIsScreen(window.innerWidth <= 768);
      setIsMobile(window.innerWidth <= 430);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Reset function to clear all images and start over
  const resetAllImages = () => {
    setImages({ front: null, left: null, right: null });
    setSkinType(null);
    setConfidenceScores(null);
    setCurrentView('front');
  };
  // Handler for when FaceScanner completes a capture
  const handleScanComplete = (capturedImage) => {
    if (!capturedImage) {
      return;
    }
    
    const updatedImages = {
      ...images,
      [currentView]: capturedImage 
    };
    
    setImages(updatedImages);
    
    // Auto-analyze when all images are captured
    if (updatedImages.front && updatedImages.left && updatedImages.right) {
      setTimeout(() => {
        sendImagesToBackend(updatedImages);
      }, 500);
    }
  };

  // Send image to backend for analysis
  const sendImagesToBackend = async (imagesToAnalyze = null) => {
    const imagesToUse = imagesToAnalyze || images;
    setIsLoading(true);
    try {
      const formData = new FormData();
      
      // Convert base64 images to blobs and append to FormData
      if (imagesToUse.front) {
        const response = await fetch(imagesToUse.front);
        const blob = await response.blob();
        formData.append("image_front", blob, "image_front.jpg");
      }
      if (imagesToUse.left) {
        const response = await fetch(imagesToUse.left);
        const blob = await response.blob();
        formData.append("image_left", blob, "image_left.jpg");
      }
      if (imagesToUse.right) {
        const response = await fetch(imagesToUse.right);
        const blob = await response.blob();
        formData.append("image_right", blob, "image_right.jpg");
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_URL_HOST}/aiface/images`, {
        method: "POST",
        headers: { 
          Authorization: `Bearer ${token}`,
          "ngrok-skip-browser-warning": "true"
        },
        body: formData
      });

      if (response.status === 422) {
        const data = await response.json();
        alert(`Error: ${data.message || "Something went wrong!"}`);
        return;
      } else if (!response.ok) {
        alert("An unexpected error occurred!");
        return;
      }

      const result = await response.json();
      setSkinType(result.skinType);
      if (result.confidenceScores) {
        setConfidenceScores(result.confidenceScores);
      }
    } catch (error) {
      alert("Error processing images. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const getTextColor = (backgroundColor) => {
    return backgroundColor === "#BFD16D" ? "#000" : "#FFF";
  };

  const styles = {
    container: (isScreen, isMobile) => ({
      padding: "16px",
      paddingTop: "0px",
      display: "flex",
      flexDirection: isMobile ? "column" : (isScreen ? "column" : "row"), // Column on mobile, row on desktop
      justifyContent: "flex-start",
      alignItems: "flex-start",
      marginLeft: isScreen ? "0px" : (isMobile ? "0px" : "155px"),
      minHeight: "calc(100vh - 100px)",
      backgroundColor: "#171717",
      marginTop: "100px",
      color: "#EAEAEA",
      fontFamily: "Arial, sans-serif",
      overflowY: "unset",
      overflowX: "hidden",
      position: "relative",
      gap: "16px"
    }),
    leftPanel: {
      backgroundColor: "#2a2a2a",
      padding: "20px",
      borderRadius: "24px",
      textAlign: "left", // Changed from "center" to "left"
      width: isMobile ? "100%" : (isScreen ? "100%" : "48%"),
      minWidth: isMobile ? "auto" : "400px", 
      boxShadow: "0 8px 32px rgba(0, 0, 0, 0.3)",
      border: "1px solid #333",
      marginTop: isScreen ? "0" : "0"
    },
    rightPanel: {
      backgroundColor: "#2a2a2a",
      padding: "20px",
      borderRadius: "24px",
      width: isMobile ? "100%" : (isScreen ? "100%" : "48%"),
      minWidth: isMobile ? "auto" : "400px",
      boxShadow: "0 8px 32px rgba(0, 0, 0, 0.3)",
      border: "1px solid #333",
      marginTop: isScreen ? "0" : "0"
    },
    instructionsPanel: {
      backgroundColor: "#2a2a2a",
      padding: "20px",
      borderRadius: "24px",
      position: "fixed",
      bottom: "16px",
      left: "16px",
      width: "400px",
      maxWidth: "90vw",
      boxShadow: "0 8px 32px rgba(0, 0, 0, 0.3)",
      border: "1px solid #333",
      zIndex: 1000,
      display: showInstructions ? "block" : "none"
    },
    instructionsOverlay: {
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: "rgba(0, 0, 0, 0.5)",
      zIndex: 999,
      display: showInstructions ? "block" : "none"
    },
    okButton: {
      backgroundColor: "#BFD16D",
      border: "none",
      borderRadius: "12px",
      padding: "10px 20px",
      cursor: "pointer",
      fontSize: "14px",
      color: "#000",
      marginTop: "16px",
      fontWeight: "600",
      transition: "all 0.3s ease",
      boxShadow: "0 2px 8px rgba(191, 209, 109, 0.3)"
    },
    heading: {
      background: "linear-gradient(135deg, #BFD16D 0%, #CEDF9F 100%)",
      backgroundClip: "text",
      WebkitBackgroundClip: "text",
      WebkitTextFillColor: "transparent",
      fontFamily: "Outfit, sans-serif",
      fontSize: "32px",
      fontWeight: "700",
      marginBottom: "16px",
      letterSpacing: "-0.5px",
    },
    heading1: {
      color: "#EBEBEB", // Use 'color' instead of 'fontColor'
      fontFamily: "Outfit, sans-serif",
      fontSize: "32px",
      fontWeight: "700",
      marginBottom: "16px",
      letterSpacing: "-0.5px",
    },
    tabContainer: {
      display: "flex",
      justifyContent: "center",
      gap: isMobile ? "5px" : "60px"
    },
    tabButton: (isActive) => ({
      width: isMobile ? "100px" : "120px",
      height: "34px",
      flexShrink: 0,
      borderRadius: "28px",
      border: "1px solid #535353",
      background: "#1D1D1D"
    }),
    imagePreviewArea: {
      backgroundColor: "#333",
      minHeight: "300px",
      borderRadius: "20px",
      marginBottom: "20px",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      overflow: "hidden"
    },
    previewImage: {
      width: "100%",
      height: "auto",
      borderRadius: "20px"
    },
    videoPreview: {
      width: "100%",
      height: "100%",
      borderRadius: "20px"
    },
    hiddenCanvas: {
      display: "none"
    },
    buttonContainer: {
      display: "flex",
      flexDirection: "column",
      // gap: isMobile ? "8px" : "16px",
      marginTop: "24px"
    },
    loadingText: { color: "#BFD16D" },
    captureButton: {
      backgroundColor: "#BFD16D",
      border: "none",
      borderRadius: "20px",
      padding: "15px 30px",
      cursor: "pointer",
      fontSize: "18px",
      color: "#000",
      marginTop: "20px"
    },
    takePhotoButton: {
      backgroundColor: "#BFD16D",
      border: "none",
      borderRadius: "20px",
      padding: "15px 30px",
      cursor: "pointer",
      fontSize: "18px",
      color: "#000",
      marginTop: "20px"
    },
    resetButton: {
      backgroundColor: "#ff6b6b",
      border: "none",
      borderRadius: "20px",
      padding: "10px 20px",
      cursor: "pointer",
      fontSize: "16px",
      color: "#fff",
      margin: "5px",
      transition: "all 0.3s ease",
      boxShadow: "0 2px 8px rgba(255, 107, 107, 0.3)"
    },
    analyzeButton: {
      backgroundColor: "#BFD16D",
      border: "none",
      borderRadius: "20px",
      padding: "15px 30px",
      cursor: "pointer",
      fontSize: "18px",
      color: "#000",
      marginTop: "20px",
      width: "100%",
      fontWeight: "bold",
      transition: "all 0.3s ease",
      boxShadow: "0 2px 8px rgba(191, 209, 109, 0.3)"
    },
    progressIndicator: {
      marginTop: "15px",
      marginBottom: "10px"
    },
    progressText: {
      color: "#BFD16D",
      fontSize: "14px",
      margin: "0"
    },
    resultsContainer: { 
      marginTop: "16px",
      padding: "16px",
      backgroundColor: "rgba(191, 209, 109, 0.05)",
      borderRadius: "12px",
      border: "1px solid rgba(191, 209, 109, 0.2)"
    },
    skinTypeHeading: {
      background: "linear-gradient(135deg, #BFD16D 0%, #CEDF9F 100%)",
      backgroundClip: "text",
      WebkitBackgroundClip: "text",
      WebkitTextFillColor: "transparent",
      fontSize: "24px",
      fontWeight: "700",
      marginBottom: "16px",
      textAlign: "center"
    },
    analysisContainer: { marginTop: "20px" },
    analysisHeading: {
      color: "#EAEAEA",
      marginBottom: "15px",
      fontSize: "18px"
    },
    progressBarContainer: { width: "100%" },
    progressBarItem: { 
      marginBottom: "16px",
      padding: "8px",
    },
    progressBarHeader: {
      display: "flex",
      justifyContent: "space-between",
      marginBottom: "5px"
    },
    progressBarTrack: {
      width: "100%",
      height: "24px",
      backgroundColor: "#333",
      borderRadius: "12px",
      overflow: "hidden",
      boxShadow: "inset 0 2px 4px rgba(0, 0, 0, 0.3)"
    },
    progressBarFill: (width, backgroundColor) => ({
      width: `${width}%`,
      height: "100%",
      backgroundColor,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: "12px",
      fontWeight: "bold",
      color: getTextColor(backgroundColor)
    }),
  };

  return (
    <div style={styles.container(isScreen, isMobile)}>
      {/* Left Panel - Camera/Scanner */}
      <div style={styles.leftPanel}>
        <h2 style={styles.heading1}>detect your skin type</h2>
        
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
          position: 'relative'
        }}>
          <FaceScanner 
            key={currentView}
            onScanComplete={handleScanComplete}
            currentView={currentView}
            existingImage={images[currentView]}
          />
          
          {/* Tab Container Overlay */}
          <div style={{
            ...styles.tabContainer,
            position: 'absolute',
            top: isMobile ? '8px' : '16px',
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 30,
            backgroundColor: 'transparent',
            // backdropFilter: 'blur(8px)',
            borderRadius: '16px',
            padding: '4px'
          }}>
            {['left', 'center', 'right'].map((view) => (
              <button
                key={view}
                onClick={() => setCurrentView(view === 'center' ? 'front' : view)}
                style={styles.tabButton(currentView === (view === 'center' ? 'front' : view))}
              >
                {view.charAt(0).toUpperCase() + view.slice(1)} {images[view === 'center' ? 'front' : view] ? '✓' : ''}
              </button>
            ))}
          </div>
        </div>
        
        {/* Instructions below FaceScanner */}
        <div style={{
          marginTop: '0px',
          padding: '16px',
          backgroundColor: 'rgba(42, 42, 42, 0.5)',
          borderRadius: '12px',
          border: '1px solid #333'
        }}>
          <h3 style={{
            color: '#EAEAEA',
            fontSize: '18px',
            fontWeight: '600',
            marginBottom: '12px',
            textAlign: 'left'
          }}>
            things you should keep in mind while using
          </h3>
          <div style={{
            textAlign: 'left',
            color: '#EAEAEA',
            fontSize: '14px',
            lineHeight: '1.5'
          }}>
            <div style={{ marginBottom: '8px' }}>
              • keep your face in the circle
            </div>
            <div style={{ marginBottom: '8px' }}>
              • make sure your camera is clean
            </div>
            <div style={{ marginBottom: '8px' }}>
              • scan your face before you apply products or any cosmetics products
            </div>
            <div style={{ marginBottom: '8px' }}>
              • make sure to scan your face in good lighting
            </div>
          </div>
        </div>
      </div>
      
      {/* Right Panel - Results */}
      {skinType && (
        <div style={styles.rightPanel}>
          <h2 style={styles.heading}>results for your skin type</h2>
          
          {confidenceScores && (
            <div style={styles.analysisContainer}>
              <div style={styles.progressBarContainer}>
                {["dry", "normal", "oily"].map((type) => {
                  // Find the dominant skin type (highest percentage)
                  const dominantType = Object.keys(confidenceScores).reduce((a, b) => 
                    confidenceScores[a] > confidenceScores[b] ? a : b
                  );
                  
                  return (
                    <div key={type} style={styles.progressBarItem}>
                      <div style={styles.progressBarHeader}>
                        <span style={{ fontSize: '16px', fontWeight: '500' }}>
                          {type} <span style={{ color: '#888', fontWeight: '400' }}>skin type</span>
                        </span>
                        <span style={{ fontSize: '16px', fontWeight: '600' }}>
                          {parseFloat(confidenceScores[type]).toFixed(0)}%
                        </span>
                      </div>
                      <div style={styles.progressBarTrack}>
                        <div
                          style={styles.progressBarFill(
                            confidenceScores[type], 
                            type === dominantType ? "#BFD16D" : "#666"
                          )}
                        >
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
              
              <div style={{ marginTop: '24px' }}>
                <h3 style={{
                  color: '#EAEAEA',
                  fontSize: '18px',
                  fontWeight: '600',
                  marginBottom: '8px'
                }}>
                  skincare routine
                </h3>
                <p style={{
                  color: '#888',
                  fontSize: '14px',
                  marginBottom: '13px'
                }}>
                  you should follow to achieve your best skin
                </p>
                
                <div style={{
                  textAlign: 'left',
                  color: '#EAEAEA'
                }}>
                  <div style={{ marginBottom: '10px' }}>
                    <strong>• Cleanse (Morning & Night):</strong>
                    <div style={{ color: '#888', fontSize: '14px', marginLeft: '16px' }}>
                      Use a gentle, non-drying cleanser to wash your face
                    </div>
                  </div>
                  <div style={{ marginBottom: '10px' }}>
                    <strong>• Cleanse (Morning & Night):</strong>
                    <div style={{ color: '#888', fontSize: '14px', marginLeft: '16px' }}>
                      Use a gentle, non-drying cleanser to wash your face
                    </div>
                  </div>
                  <div style={{ marginBottom: '10px' }}>
                    <strong>• Cleanse (Morning & Night):</strong>
                    <div style={{ color: '#888', fontSize: '14px', marginLeft: '16px' }}>
                      Use a gentle, non-drying cleanser to wash your face
                    </div>
                  </div>
                  <div style={{ marginBottom: '10px' }}>
                    <strong>• Cleanse (Morning & Night):</strong>
                    <div style={{ color: '#888', fontSize: '14px', marginLeft: '16px' }}>
                      Use a gentle, non-drying cleanser to wash your face
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
      
      {/* Loading state */}
      {isLoading && (
        <div style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          padding: '20px',
          borderRadius: '12px',
          zIndex: 1000
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '10px'
          }}>
            <div style={{
              width: '20px',
              height: '20px',
              border: '2px solid rgba(191, 209, 109, 0.3)',
              borderTop: '2px solid #BFD16D',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite',
              WebkitAnimation: 'spin 1s linear infinite'
            }}></div>
            <p style={{
              color: '#BFD16D',
              margin: '0',
              fontSize: '14px',
              fontWeight: '500'
            }}>
              Hold On! We are cooking something amazing...
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default FaceScan;
