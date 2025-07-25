import React, { useState, useEffect } from "react";
import Image from "next/image";
import dynamic from "next/dynamic";
import sideImage from "../../public/assets/sidebarOlive.png"; // Replace with your full-sidebar image

const Sidebar = () => {
  const [isSidebarVisible, setIsSidebarVisible] = useState(false);
  const [screenWidth, setScreenWidth] = useState(0);

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      setScreenWidth(width);
      setIsSidebarVisible(width > 768);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const styles = {
    sidebar: {
      height: "100vh",
      width: isSidebarVisible ? "155px" : "0",
      marginRight: '15px',
      marginLeft: isSidebarVisible ? "0" : "-200px",
      transition: "margin-left 0.3s ease, width 0.3s ease",
      position: "fixed",
      top: 0,
      left: 0,
      zIndex: 1,
      overflow: "hidden",
    },
    fullImage: {
      width: "100%",
      height: "100%",
      objectFit: "cover",
      imageRendering: "-webkit-optimize-contrast",
      WebkitImageRendering: "crisp-edges",
      mozImageRendering: "crisp-edges",
      imageRendering: "pixelated"
    },
  };

  return (
    <div>
      <div style={styles.sidebar}>
        <Image
          src={sideImage}
          alt="Sidebar Background"
          layout="fill"
          objectFit="scale-down"
          // objectFit="fill"
          priority
        />
      </div>
    </div>
  );
};

export default dynamic(() => Promise.resolve(Sidebar), { ssr: false });
