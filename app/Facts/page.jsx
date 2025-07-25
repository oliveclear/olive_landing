"use client";
import { useEffect, useState } from "react";

export default function Page() {

  const [userName, setUserName] = useState('');
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);

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


  const [index, setIndex] = useState(0);

  const messages = [
    "First message here",
    "Second message here",
    "Third message here",
  ];

  const boxHeight = 68;
  const boxMarginBottom = 10;
  const totalBoxHeight = boxHeight + boxMarginBottom;

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % messages.length);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div>
      <p
        style={{
          fontFamily: "Outfit, sans-serif",
          fontSize: "18px",
          marginBottom: "10px",
          color: "#EBEBEB",  
          paddingLeft: "10px",
          paddingRight: "10px",
          marginBottom: "10px",
        }}
      >
        Facts just for you ...
      </p>

      <div
        style={{
          width: "100%",
          height: isMobile
            ? `${boxHeight - 15 + boxMarginBottom + 10}px`
            : `${boxHeight + boxMarginBottom + 10}px`,
          borderRadius: "19px",
          padding: "10px",
          overflow: "hidden",
          position: "relative",
        }}
      >
        <div
          style={{
            transition: "transform 0.6s ease",
            transform: `translateY(-${index * totalBoxHeight}px)`,
          }}
        >
          {messages.map((msg, i) => (
            <input
              key={i}
              type="text"
              readOnly
              value={msg}
              style={{
                background: "#4a4a6a",
                borderRadius: "19px",
                padding: "12px",
                fontSize: "14px",
                width: "100%",
                // height: `${boxHeight}px`,
                height: isMobile ? `${boxHeight -15}px` : `${boxHeight}px`,
                marginBottom: isMobile ? `${boxMarginBottom+10}px` :`${boxMarginBottom}px`,
                border: "2px solid #555",
                outline: "none",
                fontSize: "16px",
                display: "block",
                color: "#fff",
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
