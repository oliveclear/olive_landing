"use client"; // This directive ensures the component runs on the client side

import { useEffect, useState } from "react";
import { Inter } from "next/font/google";
import Header from "./Layout/Header";
import Sidebar from "./Layout/Sidebar";
import QuizGuard from "./components/QuizGuard";
import Cookies from "js-cookie"; // Import js-cookie
import "./globals.css";


const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({ children }) {
  const [isClient, setIsClient] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(null); // Initial state is null for loading
  const [isMobile, setIsMobile] = useState(false); // Add isMobile state
  const [isTablet, setIsTablet] = useState(false); // Add isTablet state

  useEffect(() => {
    setIsClient(true);
    // Only run on client
    const token = Cookies.get("token");
    setIsLoggedIn(!!token);
  }, []);

  // Handle responsive breakpoints
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      setIsMobile(width < 768);
      setIsTablet(width >= 768 && width < 1024);
    };
    handleResize(); // Check initial size
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Always return <html> and <body> to avoid Next.js errors
  return (
    <html lang="en">
      <body className={styles.cont}>
        {!isClient ? (
          <div style={{ color: '#fff', textAlign: 'center', marginTop: '40vh' }}>Loading...</div>
        ) : isLoggedIn ? (
          <QuizGuard>
            <div style={styles.layout(isMobile)}>
              <div style={styles.sidebarHeaderContainer}>
                <div style={styles.sidebar}>
                  <Sidebar />
                </div>
                <div style={styles.header}>
                  <Header />
                  <div style={styles.content(isMobile)}>{children}</div>
                </div>
              </div>
            </div>
          </QuizGuard>
        ) : (
          <div style={styles.main}>{children}</div>
        )}
      </body>
    </html>
  );
}

const styles = {
  main: {
    display: "flex",
    flexDirection: "column",
    backgroundColor: "#1C1C1C",
    overflowY: "unset", // Enable scrolling for overflowing content
  },
  cont: {
    margin: "0",
    padding: "0",
  },
  layout: (isMobile) => ({
    display: "flex",
    flexDirection: "column",
    height: isMobile ? "100vh" : "auto", // Full height on mobile, auto on larger screens
    // overflowY: isMobile ? "auto" : "visible", // Enable scrolling on mobile, hide overflow on larger screens
    overflowY: "unset",
  }),
  sidebar: {
    position: "fixed",
  },
  header: {
    // width: "100%",
    // left: "250px",
  },
  content: (isMobile) => ({
    flexGrow: 1,
    left: "250px",
    // overflowY: "hidden", // Enable scrolling for overflowing content
    overflowX: "hidden", // Prevent horizontal scrolling
    overflowY: isMobile ? "unset" : "unset", // Enable vertical scrolling on mobile, hide overflow on larger screens
  }),
};
