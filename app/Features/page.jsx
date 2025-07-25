'use client';
import React, { useState, useEffect } from 'react';

const FeaturesPage = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [hasMounted, setHasMounted] = useState(false); // Fix: Only render after client-side mount to ensure isMobile is correct

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  const getResponsiveStyle = (base, mobile) => isMobile ? { ...base, ...mobile } : base;

  if (!hasMounted) return null;

  return (
    <div style={getResponsiveStyle(styles.container, mobileStyles.container)}>
      <h1 style={getResponsiveStyle(styles.title, mobileStyles.title)}>features</h1>
      <div style={getResponsiveStyle(styles.outerGrid, mobileStyles.outerGrid)}>
        {/* 1st div: Scan your skin */}
        <div style={getResponsiveStyle(styles.leftCol, mobileStyles.leftCol)}>
          <div style={getResponsiveStyle({ ...styles.featureCard, ...styles.scancard }, { ...mobileStyles.featureCard, ...mobileStyles.scancard })}>
            <div style={getResponsiveStyle(styles.featureContent, mobileStyles.featureContent)}>
              <h2 style={getResponsiveStyle(styles.featureTitle, mobileStyles.featureTitle)}>
                scan your skin<br />
                discover what<br />
                it needs
              </h2>
              <div style={getResponsiveStyle(styles.arrowCircle, mobileStyles.arrowCircle)}>
                <span style={getResponsiveStyle(styles.arrow, mobileStyles.arrow)}>↗</span>
              </div>
            </div>
            <div style={getResponsiveStyle(styles.imageWrapper, mobileStyles.imageWrapper)}>
              <img 
                src="./assets/traviskhopdi.png" 
                alt="Face wireframe scan" 
                style={getResponsiveStyle(styles.featureImage, mobileStyles.featureImage)}
              />
            </div>
          </div>
        </div>
        {/* 2nd div: AI Chatbot and Track Progress */}
        <div style={getResponsiveStyle(styles.rightCol, mobileStyles.rightCol)}>
          <div style={getResponsiveStyle({ ...styles.featureCard, ...styles.aiCard }, { ...mobileStyles.featureCard, ...mobileStyles.aiCard })}>
            <div style={getResponsiveStyle(styles.featureContent, mobileStyles.featureContent)}>
              <h2 style={getResponsiveStyle(styles.aiTitle, mobileStyles.aiTitle)}>olivia- ai skincare chatbot</h2>
            </div>
            <div>
              <div style={getResponsiveStyle(styles.appointmentList, mobileStyles.appointmentList)}>
              <div style={styles.appointmentItem}>having skin irritation...</div>
              <div style={styles.appointmentDivider}></div>
              <div style={styles.appointmentItem}>need product suggestions...</div>
              <div style={styles.appointmentDivider}></div>
              <div style={styles.appointmentItem}>my skin feels dry...</div>
            </div>
            <div style={getResponsiveStyle(styles.aiAssistantBar, mobileStyles.aiAssistantBar)}>
              <input
                type="text"
                placeholder="How can I assist you?"
                style={getResponsiveStyle(styles.aiInput, mobileStyles.aiInput)}
              />
            </div>
            </div>
          </div>
          <div style={getResponsiveStyle({ ...styles.featureCard, ...styles.trackCard }, { ...mobileStyles.featureCard, ...mobileStyles.trackCard })}>
            <div style={getResponsiveStyle(styles.featureContent, mobileStyles.featureContent)}>
              <h2 style={getResponsiveStyle(styles.featureTitle, mobileStyles.featureTitle)}>
                track your progress
              </h2>
            </div>
            <div style={getResponsiveStyle(styles.chartWrapper, mobileStyles.chartWrapper)}>
              <img 
                src="./assets/trackchart.png" 
                alt="Progress chart" 
                style={getResponsiveStyle(styles.chartImage, mobileStyles.chartImage)}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    width: '100%',
    // minHeight: '100vh',
    backgroundColor: '#171717',
    color: '#ffffff',
    fontFamily: 'sans-serif',
    paddingLeft: '40px',
    paddingRight: '40px',
    paddingTop: '10px',
    paddingBottom: '20px',
    boxSizing: 'border-box',
  },
  title: {
    fontSize: '80px',
    fontWeight: '300',
    color: '#cde196',
    marginBottom: '50px',
    fontFamily: 'sans-serif',
  },
  outerGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 2fr',
    gap: '32px',
    alignItems: 'stretch',
    width: '100%',
    // minHeight: '600px',
    maxWidth: '1100px',
    margin: '0 auto',
  },
  leftCol: {
    gridColumn: '1 / 2',
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
  },
  rightCol: {
    gridColumn: '2 / 3',
    display: 'flex',
    flexDirection: 'column',
    gap: '32px',
    height: '100%',
  },
  featureCard: {
    backgroundColor: '#121212',
    borderRadius: '38px',
    padding: '30px',
    position: 'relative',
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
    border: '1px solid #5f5f5f',
    height: '100%',
    minHeight: '320px',
    boxSizing: 'border-box',
  },
  aiCard: {
    backgroundColor: '#cde196',
    color: '#000000',
    border: '3px solid #687150',
    height: '100%',
    boxSizing: 'border-box',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    padding: '24px',
  },
  trackCard: {
    border: '1px solid #5f5f5f',
    height: '50%',
    boxSizing: 'border-box',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
  },
  featureContent: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '20px',
    zIndex: '2',
  },
  featureTitle: {
    color: '#EBEBEB',
    fontFamily: '"Outfit", sans-serif',
    fontSize: '46.807px',
    fontStyle: 'normal',
    fontWeight: 600,
    lineHeight: '46.807px',
    letterSpacing: '-1.872px',
    textTransform: 'lowercase',
  },
  arrowCircle: {
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    border: '2px solid #333333',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  arrow: {
    fontSize: '24px',
  },
  imageWrapper: {
    position: 'absolute',
    bottom: '0px',
    right: '0px',
    width: '65%',
    height: '65%',
    zIndex: '1',
  },
  imageWrapper2: {
    position: 'absolute',
    bottom: '30px',
    right: '-15px',
    width: '65%',
    height: '75%',
    zIndex: '1',
  },
  featureImage: {
    width: '100%',
    height: '100%',
    objectFit: 'contain',
    objectPosition: 'bottom right',
  },
  chartWrapper: {
    position: 'absolute',
    bottom: '20px',
    left: '20px',
    width: '80%',
    height: '50%',
  },
  chartImage: {
    width: '100%',
    height: '100%',
    objectFit: 'contain',
    objectPosition: 'bottom left',
  },
  aiTitle: {
    fontSize: '24px',
    fontWeight: 600,
    color: '#222',
    marginBottom: '10px',
  },
  aiAssistantBar: {
    // marginTop: 'auto',
    width: '100%',
  },
  aiAssistantText: {
    fontSize: '16px',
  },
  aiAssistantArrow: {
    fontSize: '24px',
  },
  aiInput: {
    width: '100%',
    padding: '12px 20px',
    borderRadius: '30px',
    border: 'none',
    backgroundColor: '#4c5542',
    color: '#ffffff',
    fontSize: '16px',
    outline: 'none',
    // marginTop: '10px',
    '::placeholder': {
      color: '#ffffff',
      opacity: 0.8,
    },
  },
  appointmentList: {
    // marginTop: '12px',
    // marginBottom: '12px',
    paddingTop: '12px',
    paddingBottom: '12px',
    // borderTop: '1px solid #333333',
    // borderBottom: '1px solid #333333',
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
  },
  appointmentItem: {
    fontSize: '14px',
    color: '#222222',
    // padding: '8px 12px',
    // borderRadius: '16px',
    backgroundColor: '',
    cursor: 'pointer',
    transition: 'background-color 0.2s ease',
    ':hover': {
      backgroundColor: '#f5f5f5',
    },
  },
  appointmentDivider: {
    height: '1px',
    backgroundColor: '#687150',
    opacity: 0.3,
    width: '100%',
  },
};

const mobileStyles = {
  container: {
    padding: '20px',
    boxSizing: 'border-box',
  },
  title: {
    fontSize: '38px',
    marginBottom: '24px',
    textAlign: 'center',
  },
  outerGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 2fr)',
    // gridTemplateRows: 'repeat(0, 0fr)',
    gridTemplateRows: 'repeat(2fr, 2fr)',
    gap: 'calc(100vh * 0.02)', // ~3% of viewport height for spacing
    width: '100%',
    maxWidth: 'calc(100vw - 40px)',
    height: '100%', // Full height minus header and padding
    margin: '0 auto',
    alignItems: 'start',
  },
  leftCol: {
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    // height: 'calc(100%)', // Full height minus header and padding
    height: 'auto', // Full height minus header and padding
    marginBottom: '0',
    gridRow: 'span 2 / span 2',
    gridArea: '1 / 1 / 2 / 2',
  },
  rightCol: {
    width: '100%',
    display: 'grid',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 'calc(14px)', // ~2% of viewport height
    height: 'auto', // Full height minus header and padding
    // gridRow: '1 / 2',
    gridColumn: '2 / 2',
  },
  featureCard: {
    minHeight: 'calc(100vh * 0.15)', // 15% of viewport height
    maxWidth: 'calc(100vw - 40px)', // Full width minus margins
    width: '100%',
    margin: '0 auto',
    borderRadius: '32px',
    padding: 'calc(100vh * 0.02) calc(100vh * 0.02) 0 calc(100vh * 0.02)',
    boxSizing: 'border-box',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
  },
  scancard: {
    minHeight: 'calc(100vw * 0.5)', // 50% of viewport width
    // height: '300px',
    height: 'calc(100%)', // 20% of viewport height
    justifyContent: 'flex-start',
  },
  aiCard: {
    height: 'calc(52%)', // 20% of viewport height
    maxWidth: 'calc(100vw - 40px)', // Full width minus margins
    minHeight: 'calc(100vh * 0.17)', // 15% of viewport height
    width: '100%',
    margin: '0 auto',
    padding: 'calc(100vh * 0.02)',
    paddingLeft: 'calc(100vh * 0.01)',
    paddingRight: 'calc(100vh * 0.01)',
    paddingBottom: 'calc(100vh * 0.01)',
    backgroundColor: '#cde196',
    border: '2px solid #687150',
    boxSizing: 'border-box',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  aiInput: {
    width: '100%',
    padding: '12px 5px',
    borderRadius: '30px',
    border: 'none',
    backgroundColor: '#4c5542',
    color: '#ffffff',
    fontSize: '13px',
    outline: 'none',
    // marginTop: '10px',
    '::placeholder': {
      color: '#ffffff',
      opacity: 0.8,
    },
  },
  trackCard: {
    height: 'calc(52%)', // 20% of viewport height
    maxWidth: 'calc(100vw - 40px)', // Full width minus margins
    width: '100%',
    margin: '0 auto',
    justifyContent: 'flex-start',
    minHeight: 'calc(100vh * 0.17)', // 15% of viewport height
  },
  featureContent: {
    flexDirection: 'column',
    marginBottom: '10px',
    gap: '8px',
    alignItems: 'flex-start',
  },
  featureTitle: {
    fontSize: '22px',
    lineHeight: '26px',
    letterSpacing: '-0.7px',
  },
  aiTitle: {
    fontSize: '18px',
    fontWeight: 600,
    color: '#222',
    marginBottom: 0,
    lineHeight: '22px',
    fontFamily: '"Outfit", sans-serif',
  },
  arrowCircle: {
    width: '28px',
    height: '28px',
    borderRadius: '50%',
    border: '1px solid #333333',
  },
  arrow: {
    fontSize: '16px',
  },
  imageWrapper: {
    position: 'absolute',
    bottom: '0',
    right: '0',
    width: '60%',
    height: '60%',
    zIndex: 1,
  },
  imageWrapper2: {
    position: 'absolute',
    bottom: '10px',
    right: '-10px',
    width: '60%',
    height: '60%',
    zIndex: 1,
  },
  featureImage: {
    width: '100%',
    height: '100%',
    objectFit: 'contain',
  },
  aiAssistantBar: {
    display: 'block',
    width: '100%',
  },
  aiAssistantText: {
    display: 'none',
  },
  aiAssistantArrow: {
    display: 'none',
  },
  appointmentList: {
    display: 'none',
  },
};

export default FeaturesPage;