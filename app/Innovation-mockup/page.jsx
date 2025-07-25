'use client';
import React, { useState, useEffect } from 'react';

const Mockup = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const getResponsiveStyle = (base, mobile) => isMobile ? { ...base, ...mobile } : base;

  const [hasMounted, setHasMounted] = useState(false);
  useEffect(() => {
    setHasMounted(true);
  }, []);

  if (!hasMounted) return null;

  return (
    <div style={getResponsiveStyle(styles.container, mobileStyles.container)}>
      <div style={getResponsiveStyle(styles.textContainer, mobileStyles.textContainer)}>
        <div style={getResponsiveStyle(styles.vidContainer, mobileStyles.vidContainer)}>
          <video 
            src="/assets/mockup.mp4" 
            alt="OliveClear Dashboard"
            style={getResponsiveStyle(styles.image, mobileStyles.image)}
            autoPlay
            muted
            loop
          ></video>
        </div>
        <div style={getResponsiveStyle(styles.textContainer2, mobileStyles.textContainer2)}>
          <h2 style={getResponsiveStyle(styles.heading, mobileStyles.heading)}>
            where skincare <br /> meets innovation
          </h2>
          <p style={getResponsiveStyle(styles.description, mobileStyles.description)}>
            where skincare meets innovation at oliveclear, we use ai to deliver personalized skincare solutions. 
            our platform analyzes your skin, recommends products, and tracks progress over time. 
            with expert advice, real-time consultations, and advanced face-scanning technology, 
            we make skincare simple, accessible, and effective, helping you achieve glowing, healthy skin.
          </p>
        </div>
      </div>
    </div>
  );
};

/* Styles Object */
const styles = {
  container: {
    display: "flex",
    alignItems: "center",
    height: "500px",
    backgroundColor: "#171717",
    padding: "50px 100px",
    gap: "40px",
    // marginBottom: '20px',
  },
  imageContainer: {
    flex: 1,
    display: "flex",
    justifyContent: "flex-end",
  },
  vidContainer: {
    marginLeft: "-50px",
  },
  image: {
    position: "relative",
    top: "50px",
    width: "100%",
    height: "100%",
    borderRadius: "15px",
    minWidth: "450px",
  },
  textContainer: {
    display: "flex",
    flex: 1,
    backgroundColor: "white",
    borderRadius: "30px",
    padding: "50px",
    maxWidth: "100%",
  },
  textContainer2: {
    display: "flex",
    flexDirection: "column",
    backgroundColor: "white",
    borderRadius: "30px",
    padding: "50px",
  },
  heading: {
    fontSize: "48px",
    fontWeight: "600",
    lineHeight: "1.2",
    color: "black",
  },
  description: {
    fontSize: "18px",
    color: "#333",
    marginTop: "20px",
    lineHeight: "1.6",
  },
};

const mobileStyles = {
  container: {
    flexDirection: 'column',
    height: 'auto',
    padding: '20px',
    gap: '20px',
  },
  textContainer: {
    flexDirection: 'column',
    padding: '20px',
    margin: '0',
    width: '100%',
    boxSizing: 'border-box',
  },
  vidContainer: {
    marginLeft: '0',
    width: '100%',
    marginBottom: '20px',
  },
  image: {
    position: 'relative',
    top: '0',
    width: '100%',
    height: 'auto',
    minWidth: 'unset',
    borderRadius: '10px',
  },
  textContainer2: {
    padding: '0',
    width: '100%',
  },
  heading: {
    fontSize: '32px',
    textAlign: 'center',
  },
  description: {
    fontSize: '16px',
    textAlign: 'center',
    marginTop: '15px',
  },
};

export default Mockup;