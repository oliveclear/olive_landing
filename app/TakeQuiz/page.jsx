"use client";
import { use, useEffect, useState } from "react";
import Image from "next/image";
import {useRouter} from "next/navigation";
import Cookies from "js-cookie";

const token = Cookies.get("token");

export default function Page() {

  const message = "Take your Skin Quiz Here.";
  const [text, setText] = useState("");
  const [index, setIndex] = useState(0);
  const router = useRouter();
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
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

  useEffect(() => {
    if (!Cookies.get("token")) {
      router.replace("/login");
    }
  }, [router]);

  useEffect(() => {
    if (index < message.length) {
      const timeout = setTimeout(() => {
        setText((prev) => prev + message[index]);
        setIndex(index + 1);
      }, 100);

      return () => clearTimeout(timeout);
    }
  }, [index, message]);

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        width: "fit-content",
        maxWidth: "100%",
        borderRadius: "8px",
        padding: isMobile ? "4px" : "8px",
        fontSize: isMobile ? "14px" : "18px",
        fontFamily: "outfit, sans-serif",
        color: "#ebebeb",
        gap: "10px",
      }}
    >
      <Image
        src="/assets/quizIcon.png"
        alt="Quiz Icon"
        width={18}
        height={18}
      />
      <span>
        {text}
        <span className="blinker">|</span>
      </span>
      <style>
        {`
          .blinker {
            display: inline-block;
            animation: blink 1s step-start infinite;
          }
          @keyframes blink {
            50% { opacity: 0; }
          }
        `}
      </style>
    </div>
  );
}
