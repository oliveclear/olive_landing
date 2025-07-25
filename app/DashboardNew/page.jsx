'use client';  
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { X, Menu, Bell, Search } from 'lucide-react';

const DashboardNew = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (!mobile) setSidebarOpen(false);
    };

    handleResize();
    setHasMounted(true);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const onTouchStart = (e) => {
    setTouchEnd(null);
    setTouchStart(e.touches[0].clientX);
  };

  const onTouchMove = (e) => {
    setTouchEnd(e.touches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe && sidebarOpen) {
      setSidebarOpen(false);
    } else if (isRightSwipe && !sidebarOpen) {
      setSidebarOpen(true);
    }
  };
const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

const mobileStyles = {
  container: {
    width: '100%',
    minHeight: '100dvh',
    overflowY: 'hidden',
    overflowX: 'hidden',
    // WebkitOverflowScrolling: 'touch',
    // position: 'relative',
  },
  navbar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '10px 16px',
    width: '100%',
    gap: '0',
    background: '#171717',
    display: 'flex',
    position: 'fixed',
    height: '70px',
    zIndex: 1000,
  },
  loginButton: {
    backgroundColor: 'rgba(205, 225, 150, 0.8)',
    color: '#000000',
    border: 'none',
    padding: '6px 16px',
    borderRadius: '20px',
    fontSize: '14px',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    textDecoration: 'none',
    zIndex: 1001,
  },
  menuButton: {
    backgroundColor: 'transparent',
    border: 'none',
    color: '#ffffff',
    padding: '8px',
    cursor: 'pointer',
  },
  sidebarOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: 1000,
    opacity: sidebarOpen ? 1 : 0,
    visibility: sidebarOpen ? 'visible' : 'hidden',
    transition: 'opacity 0.3s ease, visibility 0.3s ease',
  },
  sidebar: {
    position: 'fixed',
    top: 0,
    left: sidebarOpen ? 0 : '-280px',
    width: '280px',
    height: '100%',
    backgroundColor: '#171717',
    zIndex: 1001,
    transition: 'left 0.3s ease',
    padding: '20px',
    boxSizing: 'border-box',
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  sidebarHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px',
  },
  sidebarNav: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  sidebarButton: {
    backgroundColor: 'transparent',
    color: '#ffffff',
    border: '1px solid #ffffff',
    borderRadius: '20px',
    padding: '12px 20px',
    fontSize: '16px',
    textAlign: 'left',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
  },
  navLeft: {
    flexDirection: 'row',
    gap: '6px',
    marginBottom: 0,
    display: 'flex',
    alignItems: 'center',
  },
  navRight: {
    flexDirection: 'row',
    gap: '6px',
    marginTop: 0,
    display: 'flex',
    alignItems: 'center',
  },
  navButton: {
    fontSize: '12px',
    padding: '6px 10px',
    borderRadius: '10px',
    minWidth: 'auto',
    width: 'auto',
    margin: 0,
  },
  navButtonOutline: {
    fontSize: '12px',
    padding: '6px 10px',
    borderRadius: '10px',
    minWidth: 'auto',
    width: 'auto',
    margin: 0,
  },
  navButtonOutlined: {
    fontSize: '12px',
    padding: '6px 10px',
    borderRadius: '10px',
    minWidth: 'auto',
    width: 'auto',
    margin: 0,
  },
  logoContainer: {
    position: 'static',
    left: 'unset',
    transform: 'none',
    margin: '0 10px',
    display: 'flex',
    alignItems: 'center',
    flex: 'none',
  },
  logo: {
    fontSize: '20px',
    textAlign: 'center',
    fontWeight: 'bold',
    margin: 0,
  },
  mainContent: {
    flexDirection: 'column',
    padding: '23px',
    marginTop: '70px',
    minHeight: 'calc(100dvh - 80px)',
    gap: '18px',
    width: '100%',
    overflowY: 'hiddden',
    // WebkitOverflowScrolling: 'touch',
  },
  leftContent: {
    width: '100%',
    paddingLeft: '0',
    marginBottom: '16px',
  },
  mainHeading: {
    color: '#EBEBEB',
    fontFamily: 'Outfit',
    fontSize: '44.724px',
    fontStyle: 'normal',
    fontWeight: 600,
    lineHeight: '44.724px',
    letterSpacing: '-1.789px',
    textTransform: 'lowercase'
  },
  trustedByText: {
    fontFamily: 'Outfit',
    fontSize: '15px',
    margin: '8px 0 18px 0',
  },
  doctorName: {
    fontFamily: 'Outfit',
    fontSize: '15px',
  },
  actionButtons: {
    marginTop: '0px',
    gap: '10px',
    maxWidth: '100%',
    width: '100%',
  },
  actionButton: {
    color: '#EBEBEB',
    fontFamily: 'Outfit',
    fontSize: '18.989px',
    fontStyle: 'normal',
    fontWeight: 400,
    lineHeight: '21.702px',
    letterSpacing: '-0.76px',
    textTransform: 'lowercase',
    padding: '14px 16px',
    borderRadius: '10px',
    width: '100%',
    margin: '0 0 10px 0',
    border: '2px solid #444',
    background: 'transparent',
    color: '#fff',
    textAlign: 'left',
  },
  rightContent: {
    display: 'none', // Hide GIF on mobile
  },
  mobileGifContainer: {
    width: '100%',
    height: '250px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    margin: '10px 0 10px 0',
    backgroundColor: '#171717',
    position: 'relative',
  },
  mobileGif: {
    width: '100%',
    height: '100%',
    objectFit: 'contain',
    opacity: '0.9',
    filter: 'brightness(0.95) contrast(1.1)',
    mixBlendMode: 'lighten',
  },
};

const getResponsiveStyle = (base, mobile) => isMobile ? { ...base, ...mobile } : base;

  if (!hasMounted) return null;

  return (
    <div style={styles.container}>
      {/* Mobile Sidebar */}
      {isMobile && (
        <>
          <div 
            style={mobileStyles.sidebarOverlay} 
            onClick={toggleSidebar}
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
          />
          <div 
            style={mobileStyles.sidebar}
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
          >
            <div style={mobileStyles.sidebarHeader}>
              <h1 style={getResponsiveStyle(styles.logo, mobileStyles.logo)}>
                olive<span style={styles.logoAccent}>clear</span>
              </h1>
              <button 
                onClick={toggleSidebar} 
                style={{ ...mobileStyles.menuButton, padding: '4px' }}
              >
                <X size={24} />
              </button>
            </div>
            <nav style={mobileStyles.sidebarNav}>
              <button style={mobileStyles.sidebarButton}>home</button>
              <button style={mobileStyles.sidebarButton}>features</button>
              <button style={mobileStyles.sidebarButton}>about us</button>
              <button style={mobileStyles.sidebarButton}>get in touch</button>
              <Link href="/login" style={{ textDecoration: 'none' }}>
                <button style={{
                  ...mobileStyles.sidebarButton,
                  backgroundColor: 'rgba(205, 225, 150, 0.8)',
                  color: '#000000',
                  border: 'none',
                }}>
                  login
                </button>
              </Link>
            </nav>
          </div>
        </>
      )}

      <nav style={getResponsiveStyle(styles.navbar, mobileStyles.navbar)}>
        {isMobile ? (
          <>
            <button style={mobileStyles.menuButton} onClick={toggleSidebar}>
              <Menu size={24} />
            </button>
            
            <div style={getResponsiveStyle(styles.logoContainer, mobileStyles.logoContainer)}>
              <h1 style={getResponsiveStyle(styles.logo, mobileStyles.logo)}>
                olive<span style={styles.logoAccent}>clear</span>
              </h1>
            </div>

            <Link href="/login">
              <button style={mobileStyles.loginButton}>
                login
              </button>
            </Link>
          </>
        ) : (
          <>
            <div style={styles.navLeft}>
              <button style={styles.navButton}>home</button>
              <button style={styles.navButtonOutline}>features</button>
              <button style={styles.navButtonOutline}>about us</button>
            </div>
            <div style={styles.logoContainer}>
              <h1 style={styles.logo}>
                olive<span style={styles.logoAccent}>clear</span>
              </h1>
            </div>
            <div style={styles.navRight}>
              <button style={styles.navButtonOutlined}>get in touch</button>
              <Link href="/login" style={styles.navButton}>login</Link>
            </div>
          </>
        )}
      </nav>
      <main style={getResponsiveStyle(styles.mainContent, mobileStyles.mainContent)}>
        <div style={getResponsiveStyle(styles.leftContent, mobileStyles.leftContent)}>
          <h1 style={getResponsiveStyle(styles.mainHeading, mobileStyles.mainHeading)}>
            unfolding skincare<br />layer by layer
          </h1>
          <p style={getResponsiveStyle(styles.trustedByText, mobileStyles.trustedByText)}>
            we are trusted by <span style={getResponsiveStyle(styles.doctorName, mobileStyles.doctorName)}>Dr. Yash Babbar</span>
          </p>
          
          {/* Show GIF in mobile view between trusted by and buttons */}
          {isMobile && (
            <div style={mobileStyles.mobileGifContainer}>
              <img 
                src="/assets/wireframe face.gif" 
                alt="Wireframe face animation" 
                style={mobileStyles.mobileGif} 
              />
            </div>
          )}

          <div style={getResponsiveStyle(styles.actionButtons, mobileStyles.actionButtons)}>
            <button style={getResponsiveStyle(styles.actionButton, mobileStyles.actionButton)}>ai skin analysis</button>
            <button style={getResponsiveStyle(styles.actionButton, mobileStyles.actionButton)}>
              get your personalized<br />dashboard
            </button>
          </div>
        </div>
        {/* Hide rightContent (GIF) on mobile */}
        {!isMobile && (
          <div style={styles.rightContent}>
            <div style={styles.wireframeContainer}>
              <img 
                src="/assets/wireframe face.gif" 
                alt="Wireframe face animation" 
                style={styles.wireframeGif} 
              />
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

const styles = {
  container: {
    width: '100%',
    height: 'calc(100dvh)',
    backgroundColor: '#171717',
    color: '#ffffff',
    fontFamily: 'sans-serif',
    padding: '0',
    margin: '0',
    boxSizing: 'border-box',
    position: 'relative',
    overflow: 'hidden',
  },
  navbar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '20px 40px',
    width: '100%',
    boxSizing: 'border-box',
  },
  
  navLeft: {
    display: 'flex',
    gap: '10px',
  },
  
  navRight: {
    display: 'flex',
    gap: '10px',
  },
  
  navButton: {
    backgroundColor: 'rgba(205, 225, 150, 0.8)',
    color: '#000000',
    border: 'none',
    borderRadius: '20px',
    padding: '8px 20px',
    fontSize: '16px',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
  },
  
  navButtonOutline: {
    backgroundColor: 'transparent',
    color: '#ffffff',
    border: '1px solid #ffffff',
    borderRadius: '20px',
    padding: '8px 20px',
    fontSize: '16px',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
  },
  
  navButtonOutlined: {
    backgroundColor: 'transparent',
    color: '#ffffff',
    border: '1px solid #ffffff',
    borderRadius: '20px',
    padding: '8px 20px',
    fontSize: '16px',
    fontWeight: '500',
    cursor: 'pointer',
  },
  
  logoContainer: {
    position: 'absolute',
    left: '50%',
    transform: 'translateX(-50%)',
  },
  
  logo: {
    fontSize: '28px',
    fontWeight: 'bold',
    textTransform: 'lowercase',
    margin: '0',
    letterSpacing: '0.5px',
  },
  
  logoAccent: {
    fontWeight: 'normal',
  },
  
  mainContent: {
    display: 'flex',
    paddingTop: '40px',
    paddingRight: '40px',
    paddingLeft: '40px',
    paddingBottom: '0px',
    marginTop: '40px',
    height: 'calc(100dvh - 120px)',
  },
  
  leftContent: {
    flex: '1',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    paddingLeft: '40px',
  },
  
  mainHeading: {
    fontSize: '70px',
    fontWeight: '400',
    fontFamily: '"Outfit", sans-serif',
    fontOpticalSizing: 'auto',
    lineHeight: '90px',
    letterSpacing: '-3.6px',
    textTransform: 'lowercase',
    color: '#EBEBEB',
    margin: '0 0 20px 0',
  },
  
  trustedByText: {
    fontSize: '18px',
    margin: '20px 0 60px 0',
  },
  
  doctorName: {
    fontWeight: 'bold',
    fontSize: '18px',
    color: '#CEDF9F',
  },
  
  actionButtons: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
    maxWidth: '400px',
  },
  
  actionButton: {
    backgroundColor: 'transparent',
    color: '#ffffff',
    border: '2px solid rgba(255, 255, 255, 0.2)',
    borderRadius: '10px',
    padding: '20px 30px',
    fontSize: '18px',
    textAlign: 'left',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
  },
  
  rightContent: {
    flex: '1',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  
  wireframeContainer: {
    position: 'relative',
    width: '100%',
    height: '100%',
    display: 'flex',
    justifyContent: 'flex-end',
    alignItems: 'center',

  },
  
  wireframeGif: {
    maxWidth: '100%',
    maxHeight: '100%',
    objectFit: 'contain',
    opacity: '0.9',
    filter: 'brightness(0.95) contrast(1.1)',
    mixBlendMode: 'lighten',
  },
};

export default DashboardNew;