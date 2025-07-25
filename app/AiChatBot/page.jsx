'use client';
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Cookies from 'js-cookie';
import ReactDOM from 'react-dom';

const AIChatbot = () => {
  const [message, setMessage] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  const [typingMessage, setTypingMessage] = useState('');
  const [inputFocused, setInputFocused] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  
  // Get token from cookies for authentication
  const token = Cookies.get('token');
  
  // AI chatbot suggestions
  const chatSuggestions = [
    "solution for dry skin",
    "solution for oily skin (shining blocks)",
    "what products do you recommend for my skin",
    "solution for oily skin",
    "solution for dry skin"
  ];

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

  const handleInputChange = (e) => {
    setMessage(e.target.value);
  };

  const handleSend = async () => {
    if (message.trim() === '') return;

    // Add user message to chat history
    setChatHistory(prev => [...prev, { sender: 'user', text: message }]);
    const sentMessage = message;
    setMessage('');

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_URL_HOST}/aichat/chat`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ message: sentMessage }),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      if (data.response) {
        typeMessage(data.response);
      } else {
        typeMessage('No response from server');
      }
    } catch (error) {
      console.error('Error sending message:', error);
      typeMessage('Sorry, something went wrong.');
    }
  };

  const typeMessage = (fullMessage) => {
    setTypingMessage(''); // Reset typing effect
    let index = 0;

    const interval = setInterval(() => {
      if (index < fullMessage.length) {
        setTypingMessage(prev => prev + fullMessage[index]);
        index++;
      } else {
        clearInterval(interval);
        setChatHistory(prev => [...prev, { sender: 'bot', text: fullMessage }]);
        setTypingMessage(''); // Clear the typing effect state
      }
    }, 10); // Adjust typing speed here
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault(); // Prevents newline in input
      handleSend();
      if (isExpanded) {
        setIsExpanded(false);
      }
    }
    if (e.key === 'Escape') {
      setIsExpanded(false);
      setInputFocused(false);
      e.target.blur();
    }
  };

  const handleInputFocus = () => {
    if (!isMobile) {
      setIsExpanded(true);
    }
    setInputFocused(true);
  };

  const handleInputBlur = () => {
    setInputFocused(false);
    // Small delay to allow for clicking send button
    setTimeout(() => {
      if (!inputFocused) {
        setIsExpanded(false);
      }
    }, 100);
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      setIsExpanded(false);
      setInputFocused(false);
    }
  };

  const handleExpandedSend = () => {
    handleSend();
    setIsExpanded(false);
  };

  const [highlightedIndex, setHighlightedIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setHighlightedIndex((prevIndex) => (prevIndex + 1) % chatSuggestions.length);
    }, 3000); // rotates every 2 seconds

    return () => clearInterval(interval); // clean up
  }, [chatSuggestions.length]);


  const handleSuggestedQuestion = (questionText) => {
    setMessage(questionText);
    // Use setTimeout to ensure the state updates before sending
    setTimeout(() => {
      handleSend();
    }, 10);
  };

  // Mobile input redirect handler
  const handleMobileInput = (e) => {
    if (e.key === 'Enter' && !e.shiftKey && message.trim() !== '') {
      e.preventDefault();
      window.location.href = '/AiChatBot';
    }
  };

  // Add a ref for the input to auto-focus when expanded
  const inputRef = useRef(null);

  useEffect(() => {
    if (isExpanded && !isMobile && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isExpanded, isMobile]);

  // The expanded chatbot UI (for portal)
  const expandedChatbot = (
    <div
      style={{
        ...styles.chatbotContainer,
        ...styles.expandedChatbotContainer,
        ...styles.boldText,
        transition: 'all 0.3s ease-in-out',
        color: '#D0DFCA',
        zIndex: 1003,
        position: 'fixed',
        left: 190,
        top: 100,
        right: 40,
        bottom: 20,
        width: 'auto',
        height: 'auto',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'center',
        background: '#2F2F2F',
      }}
      onClick={() => {}}
    >
      <div style={{...styles.chatbotHeader, width: '100%',  margin: '0 auto'}}>
        <span style={styles.boldText}>Olivia</span>
        <button style={styles.closeButton} onClick={e => { e.stopPropagation(); setIsExpanded(false); }}>
          ×
        </button>
      </div>
      <div style={{...styles.chatSuggestionsContainer, flexDirection: 'column', width: '100%', margin: '0 auto'}}>
        {chatHistory.map((chat, index) => (
          <div 
            key={index} 
            style={chat.sender === 'user' ? styles.userMessage : styles.botMessage}
          >
            {chat.text}
          </div>
        ))}
        {typingMessage && (
          <div style={styles.botMessage}>
            {typingMessage}
          </div>
        )}
      </div>
      {chatHistory.length === 0 && (
        <div style={{...styles.chatSuggestionsContainer, width: '100%', margin: '0 auto'}}>
          {chatSuggestions.map((suggestion, index) => (
            <div 
              key={index} 
              style={{
                ...styles.suggestionBubble,
                ...(index === highlightedIndex ? styles.highlightedSuggestion : styles.lightSuggestion)
              }}
              onClick={e => {
                e.stopPropagation();
                handleSuggestedQuestion(suggestion);
              }}
            >
              {suggestion}
            </div>
          ))}
        </div>
      )}
      <div
        style={{
          ...styles.chatInputContainer,
          ...styles.expandedChatInputContainer,
          transition: 'all 0.3s cubic-bezier(.4,2,.6,1)',
          width: '100%',
          margin: '24px auto 0 auto',
        }}
        onClick={e => e.stopPropagation()}
      >
        <input
          ref={inputRef}
          type="text"
          value={message}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={handleInputFocus}
          onBlur={handleInputBlur}
          placeholder="Type your message..."
          style={{
            ...styles.chatInput,
            ...styles.expandedChatInput,
            transition: 'all 0.3s cubic-bezier(.4,2,.6,1)',
          }}
        />
        <button 
          onClick={handleSend} 
          style={styles.sendButton}
          disabled={message.trim() === ''}
        >
          →
        </button>
      </div>
    </div>
  );

  if (isMobile) {
    return (
      <div style={{
        backgroundColor: '#D0DFCA',
        borderRadius: '25px',
        height: '90px', // reduced height
        width: '100%',
        padding: '9px 16px', // less top/bottom padding
        display: 'flex',
        flexDirection: 'column',
        color: '#333',
        fontSize: '11px',
        position: 'relative',
        boxSizing: 'border-box',
      }}>
        <div style={{fontWeight: 'bold',top:1, position: 'relative' ,fontSize: '15px', marginBottom: '2px'}}>Olivia</div>
        
        <div style={{flex: 1}}></div>
        <div style={{
          width: '85%',
          position: 'absolute',
          left: 14,
          bottom: 9,
          padding: 0,
          
        }}>
          <input
            type="text"
            value={message}
            onChange={handleInputChange}
            onKeyDown={handleMobileInput}
            placeholder="Type your message..."
            style={{
              width: '100%',
              border: 'none',
              outline: 'none',
              backgroundColor: '#222',
              color: 'white',
              fontSize: '9px',
              borderRadius: '30px',
              padding: '9px 16px', // less top/bottom padding
              marginBottom: 0,
              boxSizing: 'border-box',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          />
        </div>
      </div>
    );
  }

  // Use portal for expanded desktop mode
  if (isExpanded && !isMobile && typeof window !== 'undefined') {
    return ReactDOM.createPortal(expandedChatbot, document.body);
  }

  // Default: render in grid as usual
  return (
    <div
      style={{
        ...styles.chatbotContainer,
        transition: 'all 0.3s ease-in-out',
        cursor: !isMobile ? 'pointer' : 'default',
        zIndex: 1,
        position: 'relative',
      }}
      onClick={() => {
        if (!isMobile && !isExpanded) setIsExpanded(true);
      }}
    >
      <div style={styles.chatbotHeader}>
        <span style={styles.boldText}>Olivia</span>
        <button style={styles.closeButton1} onClick={e => { e.stopPropagation(); setIsExpanded(false); }}>
          ×
        </button>
      </div>
      {/* Chat Messages */}
      <div style={{...styles.chatSuggestionsContainer, flexDirection: 'column'}}>
        {chatHistory.map((chat, index) => (
          <div 
            key={index} 
            style={chat.sender === 'user' ? styles.userMessage : styles.botMessage}
          >
            {chat.text}
          </div>
        ))}
        {typingMessage && (
          <div style={styles.botMessage}>
            {typingMessage}
          </div>
        )}
      </div>
      {/* Suggested Questions */}
      {chatHistory.length === 0 && (
        <div style={styles.chatSuggestionsContainer}>
          {chatSuggestions.map((suggestion, index) => (
            <div 
              key={index} 
              style={{
                ...styles.suggestionBubble,
                ...(index === highlightedIndex ? styles.highlightedSuggestion : styles.lightSuggestion)
              }}
              onClick={e => {
                e.stopPropagation();
                handleSuggestedQuestion(suggestion);
              }}
            >
              {suggestion}
            </div>
          ))}
        </div>
      )}
      {/* Chat Input */}
      <div
        style={styles.chatInputContainer}
        onClick={e => e.stopPropagation()}
      >
        <input
          ref={inputRef}
          type="text"
          value={message}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={handleInputFocus}
          onBlur={handleInputBlur}
          placeholder="Type your message..."
          style={styles.chatInput}
        />
        <button 
          onClick={handleSend} 
          style={styles.sendButton}
          disabled={message.trim() === ''}
        >
          →
        </button>
      </div>
    </div>
  );
};

// Styles
const styles = {
  chatbotContainer: {
    backgroundColor: '#D0DFCA',
    borderRadius: '35px',
    height: '100%',
    padding: '30px 33px',
    display: 'flex',
    flexDirection: 'column',
    color: '#333',
    fontSize: '20px',
  },
  chatbotHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px',
  },
  boldText: {
    fontWeight: 'bold',
  },
  closeButton: {
    backgroundColor: '#transparent',
    color: '#ffffff',
    border: 'none',
    fontSize: '20px',
    cursor: 'pointer',
  },
  closeButton1: {
    backgroundColor: '#transparent',
    color: '#000000',
    border: 'none',
    fontSize: '20px',
    cursor: 'pointer',
  },
  chatSuggestionsContainer: {
    display: 'flex',
    flexDirection: 'column-reverse',
    gap: '5px',
    flexGrow: 1,
    overflow: 'auto',
    // marginBottom: '20px',
  },
  suggestionBubble: {
    backgroundColor: '#000000',
    color: '#D0DFCA',
    padding: '8px 15px',
    borderRadius: '20px',
    // border: '1px solid #444',
    display: 'inline-block',
    marginBottom: '5px',
    fontSize: '14px',
    maxWidth: 'fit-content',
    cursor: 'pointer',
    fontWeight: '400',
  },
  chatInputContainer: {
    display: 'flex',
    backgroundColor: '#222',
    borderRadius: '30px',
    padding: '8px 15px',
    marginTop: '5px',
  },
  chatInput: {
    flex: '1',
    border: 'none',
    outline: 'none',
    backgroundColor: 'transparent',
    color: 'white',
    fontSize: '14px',
  },
  sendButton: {
    backgroundColor: 'transparent',
    border: 'none',
    color: '#D0DFCA',
    fontSize: '18px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  userMessage: {
    alignSelf: 'flex-end',
    fontSize: '15px',
    backgroundColor: '#222',
    color: 'white',
    padding: '8px 15px',
    borderRadius: '18px 18px 0 18px',
    marginBottom: '8px',
    maxWidth: '80%',
  },
  botMessage: {
    alignSelf: 'flex-start',
    backgroundColor: '#000000',
    color: '#D0DFCA',
    padding: '8px 15px',
    fontSize: '15px',
    borderRadius: '18px 18px 18px 0',
    marginBottom: '8px',
    maxWidth: '80%',
  },
  chatWithOlivoButton: {
    backgroundColor: '#222',
    color: 'white',
    padding: '12px',
    borderRadius: '30px',
    textAlign: 'center',
    fontWeight: 'bold',
    cursor: 'pointer',
  },
  highlightedSuggestion: {
    backgroundColor: 'rgba(0, 0, 0, 1)',  // solid black
    color: '#D0DFCA',
    fontWeight: '100',
    transition: 'background-color 1.5s ease',
  },

  lightSuggestion: {
    backgroundColor: 'rgba(0, 0, 0, 0.2)',  // black with 20% opacity
    color: '#D0DFCA',                      // keep same text color for contrast
    transition: 'background-color 0.5s ease',
  },

  // Expanded Input Styles - Desktop Only
  expandedChatbotContainer: {
    left: 180,
    top: 100,
    right: 20,
    bottom: 20,
    position: 'fixed',
    zIndex: 1003,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: '#2F2F2F',
    transition: 'all 1s ease-in-out', // Slower transition
    padding: '48px 48px 32px 48px',
    borderRadius: '35px',
    boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
  },
  expandedChatInputContainer: {
    padding: '12px 24px',
    borderRadius: '30px',
    background: '#222',
    marginTop: '12px',
    transition: 'all 1s ease-in-out', // Slower transition
  },
  expandedChatInput: {
    fontSize: '16px',
    padding: '12px 16px',
    borderRadius: '30px',
    background: 'transparent',
    color: 'white',
    transition: 'all 1s ease-in-out', // Slower transition
  },
};

export default AIChatbot;