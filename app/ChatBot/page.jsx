"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import sherxSkinCareImage from "../../public/assets/sherxskinkare1.png";
import { Istok_Web } from "next/font/google";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
const token = Cookies.get("token");

const istokweb = Istok_Web({
  weight: ["400", "700"],
  subsets: ["latin"],
});

const Chatbot = () => {
  const [message, setMessage] = useState("");
  const [chatHistory, setChatHistory] = useState([]); // Store chat history
  const [screenWidth, setScreenWidth] = useState(0);
  const [typingMessage, setTypingMessage] = useState(""); // Track typing effect
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);
  const router = useRouter();

   useEffect(() => {
      if (!Cookies.get("token")) {
        router.replace("/login");
      }
    }, [router])

  useEffect(() => {
    // Disable body scroll when component mounts
    document.body.style.overflow = "auto";
    
    // Re-enable body scroll when component unmounts
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      setScreenWidth(width);
      setIsMobile(width < 768);
      setIsTablet(width >= 768 && width < 1024);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleInputChange = (e) => {
    setMessage(e.target.value);
  };

  const handleSend = async () => {
    if (message.trim() === "") return;

    setChatHistory((prev) => [...prev, { sender: "user", text: message }]);
    setMessage("");

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_URL_HOST}/aichat/chat`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ message }),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      if (data.response) {
        typeMessage(data.response);
      } else {
        typeMessage("No response from server");
      }
    } catch (error) {
      console.error("Error sending message:", error);
      typeMessage("Sorry, something went wrong.");
    }
  };

  const typeMessage = (fullMessage) => {
    setTypingMessage(""); // Reset typing effect
    let index = 0;

    const interval = setInterval(() => {
      if (index < fullMessage.length) {
        setTypingMessage((prev) => prev + fullMessage[index]);
        index++;
      } else {
        clearInterval(interval);
        setChatHistory((prev) => [...prev, { sender: "bot", text: fullMessage }]);
        setTypingMessage(""); // Clear the typing effect state
      }
    }, 10); // Adjust typing speed here
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault(); // Prevents newline in input
      handleSend();
    }
  };

  const handleSuggestedQuestion = (questionText) => {
    setMessage(questionText);
    // Use setTimeout to ensure the state updates before sending
    setTimeout(() => {
      handleSend();
    }, 10);
  };

  // Function to format and render markdown-like text
  const formatMessage = (text) => {
    if (!text) return '';
    
    // Split text into lines for processing
    const lines = text.split('\n');
    const formattedElements = [];
    
    lines.forEach((line, index) => {
      // Handle bold text **text**
      if (line.includes('**')) {
        const parts = line.split(/(\*\*.*?\*\*)/);
        const formattedLine = parts.map((part, partIndex) => {
          if (part.startsWith('**') && part.endsWith('**')) {
            return (
              <strong key={`${index}-${partIndex}`} style={{ fontWeight: 'bold', color: '#CEDF9F' }}>
                {part.slice(2, -2)}
              </strong>
            );
          }
          return part;
        });
        formattedElements.push(
          <div key={index} style={{ marginBottom: '8px' }}>
            {formattedLine}
          </div>
        );
      }
      // Handle bullet points starting with *
      else if (line.trim().startsWith('*')) {
        formattedElements.push(
          <div key={index} style={{ 
            marginLeft: '16px', 
            marginBottom: '4px',
            position: 'relative'
          }}>
            <span style={{ 
              position: 'absolute', 
              left: '-12px', 
              color: '#CEDF9F' 
            }}>•</span>
            {line.trim().substring(1).trim()}
          </div>
        );
      }
      // Handle numbered sections
      else if (line.trim().match(/^\d+\./)) {
        formattedElements.push(
          <div key={index} style={{ 
            marginTop: '12px',
            marginBottom: '8px',
            fontWeight: '600',
            color: '#CEDF9F'
          }}>
            {line.trim()}
          </div>
        );
      }
      // Handle empty lines
      else if (line.trim() === '') {
        formattedElements.push(
          <div key={index} style={{ height: '8px' }}></div>
        );
      }
      // Handle regular text
      else {
        formattedElements.push(
          <div key={index} style={{ marginBottom: '4px' }}>
            {line}
          </div>
        );
      }
    });
    
    return formattedElements;
  };

  return (
    <div
      style={{
        ...styles.container(isMobile, isTablet),
        marginLeft: isMobile ? "0" : "170px",
        marginTop: isMobile ? "90px" : "84px",
        padding: isMobile ? "20px 16px" : "20px",
      }}
    >
      {/* Header - only show logo on mobile */}
      {isMobile ? (
        <div style={styles.mobileHeader}>
          <h1 style={styles.mobileHeading}>Olive.ai</h1>
        </div>
      ) : (
        <>
          <h1 style={styles.heading}>Olive.ai</h1>
        </>
      )}

      <div style={styles.chatHistory(isMobile, isTablet)}>
        {chatHistory.map((chat, index) => (
          <div
            key={index}
            style={
              chat.sender === "user" 
                ? styles.userMessage(isMobile) 
                : styles.botMessage(isMobile)
            }
          >
            {chat.sender === "bot" ? formatMessage(chat.text) : chat.text}
          </div>
        ))}
        {typingMessage && (
          <div style={styles.botMessage(isMobile)}>
            {formatMessage(typingMessage)}
          </div>
        )}
      </div>

      <div style={styles.suggestedQuestionsContainer(isMobile, isTablet)}>
        <button
          onClick={() => handleSuggestedQuestion("What's the best way to treat my skin type?")}
          style={styles.suggestionButton(isMobile, isTablet)}
        >
          What's the best way to treat my skin type?
        </button>
        <button
          onClick={() => handleSuggestedQuestion("How can I improve my skincare routine?")}
          style={styles.suggestionButton(isMobile, isTablet)}
        >
          How can I improve my skincare routine?
        </button>
        <button
          onClick={() => handleSuggestedQuestion("How are my dietary habits affecting my skin?")}
          style={styles.suggestionButton(isMobile, isTablet)}
        >
          How are my dietary habits affecting my skin?
        </button>
      </div>

      <div style={styles.chatInputContainer(isMobile, isTablet)}>
        <input
          type="text"
          value={message}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          placeholder="Type your message..."
          style={styles.chatInput(isMobile)}
        />
        <button onClick={handleSend} style={styles.sendButton(isMobile)}>
          ➤
        </button>
      </div>
    </div>
  );
};

// Styles
const styles = {
  container: (isMobile, isTablet) => ({
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    height: isMobile ? "100vh" : "89vh",
    backgroundColor: "#171717",
    position: "relative",
    overflow: "hidden", // Disable main page scrolling
    justifyContent: isMobile ? "flex-start" : "",
    marginTop: isMobile ? "60px" : "87px",
  }),
  mobileHeader: {
    width: "100%",
    textAlign: "center",
    // marginBottom: "20px",
    paddingTop: "10px",
  },
  mobileHeading: {
    color: "rgba(206, 223, 159, 0.85)",
    fontFamily: istokweb.style.fontFamily,
    fontSize: "36px",
    fontWeight: "700",
    marginBottom: "0",
    opacity: 0.7,
  },
  heading: {
    color: "rgba(206, 223, 159, 0.85)",
    textAlign: "center",
    fontFamily: istokweb.style.fontFamily,
    fontSize: "50px",
    fontWeight: "700",
    lineHeight: "36px",
    width: "622px",
    marginBottom: "0",
    opacity: 0.7,
  },
  chatHistory: (isMobile, isTablet) => ({
    width: isMobile ? "100%" : "80%",
    maxWidth: isMobile ? "none" : "600px",
    borderRadius: "10px",
    padding: isMobile ? "15px" : "10px",
    marginBottom: isMobile ? "15px" : "20px",
    overflowY: "auto",
    maxHeight: isMobile ? "50vh" : "350px",
    height: isMobile ? "auto" : "80vh",
    flex: isMobile ? "1" : "none",
  }),
  userMessage: (isMobile) => ({
    textAlign: "right",
    color: "#fff",
    marginBottom: "10px",
    backgroundColor: "#2a2a2a",
    padding: isMobile ? "12px 16px" : "8px 12px",
    borderRadius: "18px 18px 4px 18px",
    marginLeft: isMobile ? "20%" : "30%",
    fontSize: isMobile ? "14px" : "16px",
  }),
  botMessage: (isMobile) => ({
    textAlign: "left",
    color: "#c7d0b8",
    marginBottom: "10px",
    whiteSpace: "normal", // Changed from pre-wrap to normal for better formatting
    backgroundColor: "#333",
    padding: isMobile ? "12px 16px" : "8px 12px",
    borderRadius: "18px 18px 18px 4px",
    marginRight: isMobile ? "20%" : "30%",
    fontSize: isMobile ? "14px" : "16px",
    lineHeight: "1.5", // Added line height for better readability
  }),
  chatInputContainer: (isMobile, isTablet) => ({
    position: "relative",
    display: "flex",
    alignItems: "center",
    backgroundColor: "#2a2a2a",
    borderRadius: "50px",
    padding: isMobile ? "12px 20px" : "10px 20px",
    width: isMobile ? "100%" : "80%",
    maxWidth: isMobile ? "none" : "600px",
    marginBottom: isMobile ? "20px" : "0",
  }),
  chatInput: (isMobile) => ({
    flex: 1,
    border: "none",
    outline: "none",
    backgroundColor: "transparent",
    color: "#fff",
    fontSize: isMobile ? "16px" : "1rem",
  }),
  sendButton: (isMobile) => ({
    backgroundColor: "transparent",
    border: "none",
    color: "#c7d0b8",
    fontSize: isMobile ? "20px" : "1.5rem",
    cursor: "pointer",
    padding: isMobile ? "5px" : "0",
  }),
  suggestedQuestionsContainer: (isMobile, isTablet) => ({
    display: "flex",
    justifyContent: "center",
    flexDirection: isMobile ? "column" : "row",
    flexWrap: isMobile ? "nowrap" : "wrap",
    gap: isMobile ? "8px" : "10px",
    width: isMobile ? "100%" : "80%",
    maxWidth: isMobile ? "none" : "800px",
    marginBottom: isMobile ? "15px" : "20px",
  }),
  suggestionButton: (isMobile, isTablet) => ({
    backgroundColor: "rgba(45, 45, 45, 0.8)",
    color: "rgba(206, 223, 159, 0.85)",
    border: "none",
    borderRadius: "25px",
    padding: isMobile ? "12px 16px" : "15px 20px",
    fontSize: isMobile ? "14px" : "16px",
    fontFamily: istokweb.style.fontFamily,
    cursor: "pointer",
    textAlign: "center",
    minWidth: isMobile ? "auto" : "250px",
    maxWidth: isMobile ? "none" : "300px",
    transition: "background-color 0.2s",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
    width: isMobile ? "100%" : "auto",
  }),
};

export default Chatbot;