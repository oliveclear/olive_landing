// export default ProgressTrackingSection;
'use client'
import { useState, useEffect } from 'react';
import Cookies from "js-cookie";
// import MonthlySkinChart from './MonthlySkinChart';

const ProgressTrackingSection = () => {
  // State for carousel indices
  const [activeCarouselIndex1, setActiveCarouselIndex1] = useState(0);
  const [activeCarouselIndex2, setActiveCarouselIndex2] = useState(0);
  // State to store the tracking images data
  const [trackingData, setTrackingData] = useState([]);
  // State to track loading status
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Define the views (front, left, right)
  const views = ["frontImage", "leftImage", "rightImage"];
  const viewLabels = ["Front View", "Left View", "Right View"];

  // Fetch tracking data from API
  useEffect(() => {
    const fetchTrackingData = async () => {
      const token = Cookies.get("token");
      try {
        setIsLoading(true);
        
        console.log('Fetching tracking data from:', `${process.env.NEXT_PUBLIC_URL_HOST}/aiface/user-track-progress`);
        console.log('Token:', token);
        
        const response = await fetch(`${process.env.NEXT_PUBLIC_URL_HOST}/aiface/user-track-progress`, {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
            "ngrok-skip-browser-warning": "true"  // Skip ngrok browser warning
          }
        });
        
        console.log('Response status:', response.status);
        console.log('Response ok:', response.ok);
        
        if (!response.ok) {
          if (response.status === 404 || response.status === 400) {
            // No data found, set empty array instead of error
            console.log('No tracking data found (404/400)');
            setTrackingData([]);
            setIsLoading(false);
            return;
          }
          throw new Error(`HTTP ${response.status}: Failed to fetch tracking data`);
        }
        
        const data = await response.json();
        console.log('Tracking data response:', data);
        
        // Handle different response structures
        let recordsArray = [];
        if (data.success && data.records) {
          recordsArray = data.records;
        } else if (Array.isArray(data)) {
          recordsArray = data;
        } else if (data.data && Array.isArray(data.data)) {
          recordsArray = data.data;
        }
        
        console.log('Records array:', recordsArray);
        
        // Check if data is empty or null
        if (!recordsArray || recordsArray.length === 0) {
          console.log('Empty tracking data received');
          setTrackingData([]);
          setIsLoading(false);
          return;
        }
        
        // Get the last two entries if available and DON'T reverse them
        // This keeps the most recent as index 0 and the older one as index 1
        const lastTwoEntries = recordsArray.slice(-2);
        console.log('Last two entries:', lastTwoEntries);
        setTrackingData(lastTwoEntries);
        setIsLoading(false);
      } catch (err) {
        console.error('Error fetching tracking data:', err);
        setError(err.message);
        setIsLoading(false);
      }
    };
    
    fetchTrackingData();
  }, []);

  // Functions to navigate carousels
  const nextCarousel = () => {
    setActiveCarouselIndex1((prev) => (prev + 1) % views.length);
    setActiveCarouselIndex2((prev) => (prev + 1) % views.length);
  };

  // Function to render score bars
  const renderScoreBars = (entryData) => {
    if (!entryData) return null;
    
    const scoreTypes = [
      { type: "dryScore", label: "Dry", color: "#E74C3C" },
      { type: "oilyScore", label: "Oily", color: "#3498DB" },
      { type: "normalScore", label: "Normal", color: "#EBEBEB" }
    ];

    // Find dominant score
    const values = scoreTypes.map(score => entryData[score.type] || 0);
    const maxValue = Math.max(...values);

    return (
      <div className="scores-container">
        {scoreTypes.map((score, idx) => {
          const value = entryData[score.type] || 0;
          const isDominant = value === maxValue && maxValue > 0;
          return (
            <div key={score.type} className="score-item">
              <div className="score-label-container">
                <span
                  className="score-label"
                  style={{ color: isDominant ? '#EBEBEB' : '#636362' }}
                >
                  {score.label}:
                </span>
                <span
                  className="score-value"
                  style={{ color: isDominant ? '#EBEBEB' : '#636362' }}
                >
                  {value.toFixed(2)} %
                </span>
              </div>
              <div className="score-bar-container">
                <div 
                  className="score-bar" 
                  style={{ 
                    width: `${value}%`, 
                    backgroundColor: score.color
                  }}
                ></div>
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="progress-tracking-container">
      <div className="content-section">
        <div className="text-section">
          <h1 className="heading">
            Track your progress <br />
            outshine your past self!
          </h1>
        </div>
        
        <div className="carousels-section">
          <div className="boxes-container">
            {/* First Box - Most Recent Entry */}
            <div className="box">
              {isLoading ? (
                <div className="loading-state">Loading...</div>
              ) : error ? (
               
                <div className="error-state">Scan your face to track your progress</div>
                
              
              ) : trackingData.length === 0 ? (
                <div className="empty-state" onClick={() => window.location.href = '/FaceScan'}>Scan your face to track your progress</div>

              ) : (
                <div className="carousel-wrapper">
                  <div className="carousel">
                    {views.map((view, index) => (
                      <div 
                        key={view} 
                        className={`carousel-item ${index === activeCarouselIndex1 ? 'active' : 'hidden'}`}
                      >
                        <div className="image-container">
                          <div className="view-label">{viewLabels[index]}</div>
                          <img 
                            src={trackingData[0]?.[view] || '/placeholder.jpg'} 
                            alt={`${viewLabels[index]} - Recent`}
                            className="carousel-image"
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = '/placeholder.jpg';
                            }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="timestamp">Previous</div>
                  {renderScoreBars(trackingData[0])}
                </div>
              )}
            </div>

            <div className="navigation-button" onClick={nextCarousel}>
              <img 
                src="/assets/small logo (k) 5.png" 
                alt="Next" 
                className="chevron-icon" 
                style={{ width: '90.714px', height: '80px' }} 
              />
            </div>

            {/* Second Box - Previous Entry */}
            <div className="box">
              {isLoading ? (
                <div className="loading-state">Loading...</div>
              ) : error ? (
                <div className="error-state">Scan your face to track your progress</div>
              ) : trackingData.length < 2 ? (
                <div className="empty-state" onClick={() => window.location.href = '/FaceScan'}>No previous tracking data available</div>
              ) : (
                <div className="carousel-wrapper">
                  <div className="carousel">
                    {views.map((view, index) => (
                      <div 
                        key={view} 
                        className={`carousel-item ${index === activeCarouselIndex2 ? 'active' : 'hidden'}`}
                      >
                        <div className="image-container">
                          <div className="view-label">{viewLabels[index]}</div>
                          <img 
                            src={trackingData[1]?.[view] || '/placeholder.jpg'} 
                            alt={`${viewLabels[index]} - Previous`}
                            className="carousel-image"
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = '/placeholder.jpg';
                            }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="timestamp">Current</div>
                  {renderScoreBars(trackingData[1])}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      
  
      <style jsx>{`
        .progress-tracking-container {
          width: 100%;
          padding: 2rem 0;
          color: white;
        }
        
        .content-section {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 1.5rem;
          display: flex;
          align-items: center;
        }
        
        .text-section {
          flex: 1;
          padding-right: 2rem;
        }
        
        .heading {
          color: #EBEBEB;
          font-family: Outfit , sans-serif;
          font-size: 39px;
          font-style: normal;
          font-weight: 600;
          line-height: 57.355px;
          letter-spacing: -2.53px;
        }
        
        .carousels-section {
          flex: 2;
          display: flex;
          align-items: center;
          
        }
        
        .boxes-container {
          display: flex;
          flex-direction: row;
          flex: 1;
          gap: 1.5rem;
          
        }
        
        .box {
          background-color: #171717;
          border-radius: 1.5rem;
          overflow: hidden;
          height: 300px;
          width: 100%;
          // box-shadow: rgba(0, 0, 0, 0.19) 0px 0px 12.7px 7px inset;
          box-shadow: rgba(9, 9, 9, 0.18) 0px 0px 12.7px 7px inset;
        }
        
        .carousel-wrapper {
          display: flex;
          flex-direction: column;
          height: 100%;
        }
        
        .carousel {
          position: relative;
          height: 190px;
          width: 100%;
        }
        
        .carousel-item {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          opacity: 0;
          transition: opacity 0.5s ease;
        }
        
        .carousel-item.active {
          opacity: 1;
        }
        
        .carousel-item.hidden {
          opacity: 0;
        }
        
        .image-container {
          width: 100%;
          height: 100%;
          position: relative;
          boxShadow: "rgba(16, 16, 16, 0.46) 0px 0px 12.7px 7px inset",
        }
        
        .view-label {
          position: absolute;
          top: 10px;
          left: 10px;
          background-color: rgba(0, 0, 0, 0.7);
          padding: 4px 8px;
          border-radius: 4px;
          font-size: 12px;
          z-index: 2;
        }
        
        .carousel-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        
        .timestamp {
          text-align: center;
          font-size: 12px;
          padding: 5px 0;
          background-color: rgba(0, 0, 0, 0.5);
          color: #CEDF9F;
          font-weight: 500;
        }
        
        .scores-container {
          display: flex;
          flex-direction: column;
          gap: 5px;
          padding: 10px;
          background-color: rgba(0, 0, 0, 0.4);
          height: 100px;
          overflow: hidden;
          position: relative;
          padding-left: 20px;
        }
        
        .score-item {
          display: flex;
          flex-direction: column;
          width: 100%;
        }
        
        .score-label-container {
          display: flex;
          justify-content: space-between;
          margin-bottom: 2px;
        }
        
        .score-label {
          font-size: 12px;
          color: #aaa;
        }
        
        .score-value {
          font-size: 12px;
          font-weight: 600;
          color: #CEDF9F;
        }
        
        .score-bar-container {
          width: 100%;
          height: 8px;
          background-color: #333;
          border-radius: 4px;
          overflow: hidden;
        }
        
        .score-bar {
          height: 100%;
          min-width: 5px;
          border-radius: 4px;
          transition: width 0.5s ease;
        }
        
        .loading-state, .error-state, .empty-state {
          width: 100%;
          height: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          color: #666;
          font-size: 16px;
          background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
          border-radius: 16px;
          border: 2px dashed #dee2e6;
          text-align: center;
          padding: 2rem;
          transition: all 0.3s ease;
          cursor: pointer;
        }
        
        .empty-state:hover {
          background: linear-gradient(135deg, #e9ecef 0%, #dee2e6 100%);
          border-color: #adb5bd;
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(0,0,0,0.1);
        }
        
        .empty-state::before {
          content: "📸";
          font-size: 48px;
          margin-bottom: 16px;
          display: block;
        }
        
        .loading-state {
          background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
          border: 2px solid #dee2e6;
          border-radius: 16px;
          color: #495057;
        }
        
        .loading-state::before {
          content: "⏳";
          font-size: 32px;
          margin-bottom: 12px;
          display: block;
          animation: pulse 2s infinite;
        }
        
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
        
        .error-state {
          background: linear-gradient(135deg, #fff5f5 0%, #fed7d7 100%);
          border: 2px solid #feb2b2;
          border-radius: 16px;
          color: #c53030;
        }
        
        .error-state::before {
          content: "⚠️";
          font-size: 32px;
          margin-bottom: 12px;
          display: block;
        }
        
        .navigation-button {
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
        }
        
        .chevron-icon {
          color: black;
        }
        
        @media (max-width: 768px) {
          .content-section {
            flex-direction: column;
          }
          
          .text-section {
            width: 100%;
            padding-right: 0;
            margin-bottom: 2rem;
          }
          
          .heading {
            font-size: 2rem;
          }
          
          .carousels-section {
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
};

export default ProgressTrackingSection;