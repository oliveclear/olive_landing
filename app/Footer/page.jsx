'use client';
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';

const Footer = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      setIsMobile(width < 768);
      setIsTablet(width >= 768 && width < 1024);
    };
    
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  return (
    <div style={styles.container}>
      <footer style={styles.footer(isMobile, isTablet)}>
        <div style={styles.footerContainer(isMobile, isTablet)}>
          <div style={styles.column}>
            <h3 style={styles.heading(isMobile)}>features</h3>
            <Link href="/features" style={styles.link(isMobile)}>
              testimonials
            </Link>
            <Link href="/about" style={styles.link(isMobile)}>
              about us
            </Link>
          </div>

          <div style={styles.column}>
            <h3 style={styles.heading(isMobile)}>face scan</h3>
            <Link href="/buy-products" style={styles.link(isMobile)}>
              buy products
            </Link>
            <Link href="/olive-ai" style={styles.link(isMobile)}>
              olive.ai
            </Link>
          </div>

          <div style={styles.column}>
            <h3 style={styles.heading(isMobile)}>contact us:</h3>
            <a href="mailto:oliveclear@gmail.com" style={styles.link(isMobile)}>
              oliveclear@gmail.com
            </a>
            <a href="tel:+918920576770" style={styles.link(isMobile)}>
              +91 89205 76770
            </a>
          </div>

          {!isMobile && (
            <div style={styles.logoSection}>
              <Image 
                src="/assets/footerimg.png" 
                alt="Olive tree in frame" 
                width={isTablet ? 150 : 200} 
                height={isTablet ? 150 : 200} 
                style={styles.footerImage}
              />
            </div>
          )}
        </div>

        <div style={styles.bottomRow(isMobile, isTablet)}>
          <div style={styles.logoContainer}>
            <Image 
              src="/assets/Oliveclear-logo.png" 
              alt="Olive Clear Logo" 
              width={isMobile ? 120 : isTablet ? 150 : 180} 
              height={isMobile ? 40 : isTablet ? 50 : 60} 
              style={styles.logoImage}
            />
          </div>
          <div style={styles.copyrightSection(isMobile)}>
            <Link href="/terms" style={styles.termsLink(isMobile)}>
              Terms & Conditions
            </Link>
            <p style={styles.copyright(isMobile)}>
              Copyright © 2024 Amscay Technologies - All Rights Reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

const styles = {
  container:{
    backgroundColor: '#171717',
  },
  footer: (isMobile, isTablet) => ({
    top: '10',
    backgroundColor: "#111",
    color: '#ffffff',
    padding: isMobile ? '30px 20px 20px' : isTablet ? '40px 50px 25px' : '50px 90px 30px',
    borderTopLeftRadius: '30px',
    borderTopRightRadius: '30px',
    height: '100%',
  }),
  footerContainer: (isMobile, isTablet) => ({
    display: 'flex',
    justifyContent: 'space-between',
    flexDirection: isMobile ? 'row' : 'row',
    gap: isMobile ? '25px' : isTablet ? '20px' : '0',
  }),
  column: {
    display: 'flex',
    flexDirection: 'column',
    gap: '15px',
  },
  heading: (isMobile) => ({
    fontSize: isMobile ? '18px' : '22px',
    fontWeight: '500',
    marginBottom: '10px',
    fontFamily: 'sans-serif',
  }),
  link: (isMobile) => ({
    color: '#ffffff',
    textDecoration: 'none',
    fontSize: isMobile ? '16px' : '20px',
    fontWeight: '300',
    transition: 'color 0.3s ease',
    fontFamily: 'sans-serif',
    '&:hover': {
      color: '#CEDF9F',
    }
  }),
  logoSection: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  footerImage: {
    objectFit: 'contain',
  },
  bottomRow: (isMobile, isTablet) => ({
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: isMobile ? 'flex-start' : 'center',
    flexDirection: isMobile ? 'column' : 'row',
    gap: isMobile ? '15px' : '0',
    paddingTop: '20px',
    borderTop: '1px solid rgba(255, 255, 255, 0.1)',
  }),
  logoContainer: {
    flex: 1,
  },
  logoImage: {
    objectFit: 'contain',
  },
  logoAccent: {
    color: '#ffffff',
  },
  copyrightSection: (isMobile) => ({
    textAlign: isMobile ? 'left' : 'right',
  }),
  termsLink: (isMobile) => ({
    color: '#ffffff',
    textDecoration: 'none',
    fontSize: isMobile ? '14px' : '16px',
    marginBottom: '10px',
    display: 'block',
  }),
  copyright: (isMobile) => ({
    fontSize: isMobile ? '12px' : '14px',
    color: '#999999',
    margin: 0,
  }),
};

export default Footer;