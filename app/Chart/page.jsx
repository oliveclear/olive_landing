"use client";

import Link from "next/link";
import { React, useState, useEffect } from "react";
import { Line } from "react-chartjs-2";
import TrackYourProgress from "../TrackYourProgress/page";

import Graph from "../Graph/page";

const getCurrentMonth = () => {
  const date = new Date();
  return date.toLocaleString("default", { month: "long" });
};

const lineData = {
  labels: ["Jan", "Mar", "May", "Jul", "Sep", "Now"],
  datasets: [
    {
      label: "Progress over Time",
      data: [0, 75, 50, 50, 50, 80],
      borderColor: "#b6e486",
      backgroundColor: "#b6e486",
      tension: 0.4,
      fill: false,
    },
    {
      label: "Hyperpigmentation",
      data: [0, 25, 40, 60, 60, 60],
      borderColor: "#8f8f8f",
      backgroundColor: "#8f8f8f",
      tension: 0.4,
      fill: false,
    },
  ],
};



const MeetingSchedule = () => {
  const [isScreen, setIsScreen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsScreen(window.innerWidth <= 768); // Adjust for Screen screen width
      setIsMobile(window.innerWidth <= 430);
    };

    // Initial check and adding a resize listener
    handleResize();
    window.addEventListener("resize", handleResize);

    // Cleanup listener on component unmount
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Inline styles
  const meetingStyles = {
    container: {
      position: "relative",
      // marginLeft: "250px",
      // top: "84px",
      padding: isMobile? "0px": "20px",
      backgroundColor: "#171717",
      color: "#EBEBEB",
      fontFamily: "Arial, sans-serif",
      height: "150vh",
      marginLeft: isScreen ? "0px" : "170px",
      marginTop: isScreen ? "50px" : "84px",
      // zIndex: isScreen ? "-1" : "",
      // zIndex: "-1",
      overflowY: "hidden"
    },
    monthTitle: {
      fontSize: "2em",
      fontWeight: "bold",
      marginBottom: "10px",
      fontFamily: "Outfit",
    },
    meetingItem: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      borderBottom: "1px solid #444",
      padding: "10px 0",
      fontFamily: "Istok Web",
    },
    meetingDetails: {
      flex: 1,
      paddingLeft: "10px",
      display: "flex",
    },
    dateCircle: {
      width: "40px",
      height: "40px",
      borderRadius: "50%",
      backgroundColor: "#CEDF9F",
      color: "#1D1D1D",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      fontSize: "1.2em",
      fontWeight: "bold",
    },
    button: {
      backgroundColor: "#CEDF9F",
      color: "#1D1D1D",
      border: "none",
      borderRadius: "5px",
      padding: "8px 16px",
      cursor: "pointer",
      fontSize: "14px",
      textDecoration: "none", // Remove underline from <a> tag
      display: "inline-block",
      textAlign: "center",
    },
    buttonContainer: {
      zIndex: "1",
      display: "flex",
      alignItems: "center",
    },
    activeButton: {
      padding: "10px 20px",
      backgroundColor: "#CEDF9F",
      border: "none",
      borderRadius: "15px",
      marginRight: "10px",
      fontWeight: "bold",
      cursor: "pointer",
      color: "#000000",
      transition: "transform 0.3s ease", // Smooth transition for scaling
    },
  };

  return (
    <div style={meetingStyles.container}>
      <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "space-between",
      }}>
      </div>

      <div>
        <TrackYourProgress />
      </div>

      <div style={{
        margin: "20px",
            padding: "20px",
            borderRadius: "28px",
            height: "auto",
            background: "#171717",
            boxShadow: "rgba(16, 16, 16, 0.46) 0px 0px 12.7px 7px inset",
            cursor: "pointer",
      }}>
        <Graph />
      </div>
    </div>
  );
};

export default MeetingSchedule;
