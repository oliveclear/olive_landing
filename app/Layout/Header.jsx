'use client';
import { Search, Bell, Settings, Menu, X } from "lucide-react";
import React, { useState, useEffect } from "react";
import { Outfit } from "next/font/google";
import Link from 'next/link';
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";

const token = Cookies.get("token");




const outfit = Outfit({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  display: 'swap',
});

export default function Header() {
  const [activeButton, setActiveButton] = useState('dashboard');
  const [hoveredButton, setHoveredButton] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState('');
  const [userName, setUserName] = useState('');
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  const router = useRouter();

  // Check if screen is mobile
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth >= 768) {
        setSidebarOpen(false);
      }
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  useEffect(() => {
  const fetchProfile = async () => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_URL_HOST}/userprofile`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        "ngrok-skip-browser-warning": "true" 
      }
    });
    const data = await res.json();
    const URL_IMG = JSON.stringify(data.profile.avatar);
    setUserName(data.profile.name);
    
    console.log("URL_IMG", URL_IMG);
    setAvatarUrl(data.profile.avatar);
  };
  
  fetchProfile();
}, []);

  const handleButtonClick = (buttonName) => {
    setActiveButton(buttonName);
    if (isMobile) {
      setSidebarOpen(false);
    }
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const toggleProfileDropdown = () => {
    setProfileDropdownOpen(!profileDropdownOpen);
  };

  const closeProfileDropdown = () => {
    setProfileDropdownOpen(false);
  };

  // Close profile dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileDropdownOpen && isMobile) {
        const userSection = event.target.closest('[data-user-section]');
        if (!userSection) {
          setProfileDropdownOpen(false);
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [profileDropdownOpen, isMobile]);

  const handleLogout = () => {
    Cookies.remove("token");
    router.push("/login");
  };

  const getButtonStyle = (buttonName, isInSidebar = false) => {
    const isActive = activeButton === buttonName;
    const isHovered = hoveredButton === buttonName;
    
    if (isInSidebar) {
      return {
        ...styles.sidebarNavButton(isActive),
        ...(isHovered && {
          backgroundColor: '#3F3F3F',
        })
      };
    }
    
    return {
      ...styles.navButton(isActive),
      ...(isHovered && {
        border: "2px solid #CEDF9F",
        backgroundColor: '#171717',
      })
    };
  };

  const styles = {
    header: {
      width: isMobile ? "100%" : "calc(100% - 155px)",
      marginLeft: isMobile ? "0" : "155px",
      backgroundColor: "#171717",
      color: "#ffffff",
      height: isMobile ? "70px": "100px",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      padding: "0 16px",
      fontFamily: outfit.style.fontFamily,
      position: "fixed",
      top: 0,
      zIndex: 1000,
    },
    leftSection: {
      display: "flex",
      alignItems: "center",
      gap: "16px",
    },
    hamburgerButton: {
      display: isMobile ? "flex" : "none",
      alignItems: "center",
      justifyContent: "center",
      padding: "8px",
      backgroundColor: "transparent",
      border: "none",
      cursor: "pointer",
      color: "#ffffff",
      borderRadius: "4px",
    },
    logo: {
      paddingLeft: isMobile ? "12px" : "0px",
      fontSize: "24px",
      fontWeight: "600",
      color: "#CEDF9F",
      fontFamily: outfit.style.fontFamily,
      display: isMobile ? "block" : "none",
    },
    desktopNav: {
      display: isMobile ? "none" : "flex",
      gap: "15px",
      flex: 1,
      // justifyContent: "center",
    },
    navButton: (isActive) => ({
      transform: "scale(1)",
      transition: "all 0.3s ease",
      display: "flex",
      alignItems: "center",
      gap: "8px",
      padding: "12px 30px",
      borderRadius: "30px",
      backgroundColor: isActive ? "#171717" : "#2F2F2F",
      fontSize: "14px",
      border: isActive ? "2px solid #CEDF9F" : "2px solid #2F2F2F",
      color: isActive ? "#CEDF9F" : "#ffffff",
      cursor: "pointer",
      fontFamily: outfit.style.fontFamily,
      textDecoration: "none",
    }),
    rightSection: {
      display: "flex",
      alignItems: "center",
      gap: "12px"
    },
    iconButton: {
      padding: "8px",
      backgroundColor: "#3a3a3a",
      borderRadius: "9999px",
      border: "none",
      cursor: "pointer",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      color: "#CEDF9F"
    },
    avatar: {
      height: "32px",
      width: "32px",
      borderRadius: "9999px",
      backgroundColor: "#e5e5e5",
      overflow: "hidden",
      display: isMobile ? "none" : "block",
    },
    avatarImg: {
      height: "100%",
      width: "100%",
      objectFit: "cover"
    },
    spanText: (isActive) => ({
      color: isActive ? "#CEDF9F" : "#FCFCFC",
      fontFamily: outfit.style.fontFamily,
      fontSize: "20px",
      fontStyle: "normal",
      fontWeight: 300,
      lineHeight: "normal",
      letterSpacing: "-0.96px",
    }),
    // Sidebar styles
    sidebarOverlay: {
      display: sidebarOpen && isMobile ? "block" : "none",
      position: "fixed",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      backgroundColor: "rgba(0, 0, 0, 0.5)",
      zIndex: 1001,
    },
    sidebar: {
      position: "fixed",
      top: 0,
      left: sidebarOpen ? "0" : "-280px",
      width: "280px",
      height: "100%",
      backgroundColor: "#171717",
      transition: "left 0.3s ease",
      zIndex: 1002,
      padding: "20px",
      display: "flex",
      flexDirection: "column",
      gap: "20px",
    },
    sidebarHeader: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      paddingBottom: "20px",
      borderBottom: "1px solid #2F2F2F",
    },
    closeButton: {
      backgroundColor: "transparent",
      border: "none",
      color: "#ffffff",
      cursor: "pointer",
      padding: "4px",
    },
    sidebarNav: {
      display: "flex",
      flexDirection: "column",
      gap: "12px",
    },
    sidebarNavButton: (isActive) => ({
      display: "flex",
      alignItems: "center",
      gap: "12px",
      padding: "16px",
      borderRadius: "12px",
      backgroundColor: isActive ? "#2F2F2F" : "transparent",
      color: isActive ? "#CEDF9F" : "#ffffff",
      cursor: "pointer",
      fontFamily: outfit.style.fontFamily,
      fontSize: "16px",
      fontWeight: "400",
      textDecoration: "none",
      border: "none",
      width: "100%",
      textAlign: "left",
      transition: "all 0.3s ease",
    }),
    sidebarBottom: {
      marginTop: "auto",
      paddingTop: "20px",
      borderTop: "1px solid #2F2F2F",
    },
    userSection: {
      display: "flex",
      alignItems: "center",
      gap: "12px",
      padding: "16px",
      backgroundColor: "#2F2F2F",
      borderRadius: "12px",
    },
    userAvatar: {
      height: "40px",
      width: "40px",
      borderRadius: "50%",
      backgroundColor: "#e5e5e5",
      overflow: "hidden",
    },
    userName: {
      color: "#ffffff",
      fontSize: "14px",
      fontWeight: "500",
    },
    // Profile dropdown styles
    profileDropdownOverlay: {
      display: profileDropdownOpen ? "block" : "none",
      position: "fixed",
      top: isMobile ? 0 : '12%',
      left: isMobile ? 0 : '13%',
      width: "100%",
      height: "100%",
      borderRadius: '20px',
      backgroundColor: isMobile ? "transparent" : "rgba(28, 28, 28, 0.5)",
      backdropFilter: isMobile ? "none" : "blur(5px)",
      zIndex: 1004,
    },
    profileDropdown: {
      position: "fixed",
      top: isMobile ? "70px" : "35%",
      left: isMobile ? "0" : "87%",
      transform: isMobile ? "none" : "translate(-50%, -50%)",
      width: isMobile ? "100%" : "320px",
      height: isMobile ? (profileDropdownOpen ? "auto" : "0") : "auto",
      maxHeight: isMobile ? "calc(100vh - 70px)" : "auto",
      backgroundColor: "#1F1F1F",
      borderRadius: isMobile ? "0" : "26px",
      padding: isMobile ? "20px" : "24px",
      zIndex: 1006,
      boxShadow: isMobile ? "0 -2px 10px rgba(0, 0, 0, 0.1)" : "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
      border: isMobile ? "none" : "1px solid #2F2F2F",
      borderTop: isMobile ? "1px solid #2F2F2F" : "1px solid #2F2F2F",
      transition: isMobile ? "height 0.3s ease, padding 0.3s ease" : "none",
      overflow: isMobile ? "hidden" : "visible",
    },
    profileHeader: {
      display: "flex",
      alignItems: "center",
      gap: "16px",
      paddingBottom: "20px",
      borderBottom: "1px solid #2F2F2F",
      marginBottom: "20px",
    },
    profileAvatar: {
      height: "60px",
      width: "60px",
      borderRadius: "50%",
      backgroundColor: "#e5e5e5",
      overflow: "hidden",
    },
    profileInfo: {
      flex: 1,
    },
    profileName: {
      color: "#ffffff",
      fontSize: "18px",
      fontWeight: "600",
      marginBottom: "4px",
      fontFamily: outfit.style.fontFamily,
    },
    profileEmail: {
      color: "#9CA3AF",
      fontSize: "14px",
      fontFamily: outfit.style.fontFamily,
    },
    profileMenu: {
      display: "flex",
      flexDirection: "column",
      gap: "8px",
      marginBottom: "20px",
    },
    profileMenuItem: {
      display: "flex",
      alignItems: "center",
      gap: "12px",
      padding: "12px 16px",
      backgroundColor: "transparent",
      border: "none",
      borderRadius: "8px",
      color: "#ffffff",
      fontSize: "14px",
      fontFamily: outfit.style.fontFamily,
      cursor: "pointer",
      transition: "all 0.2s ease",
      textAlign: "left",
      width: "100%",
    },
    profileMenuItemHover: {
      backgroundColor: "#2F2F2F",
    },
    profileMenuItemLogout: {
      color: "#EF4444",
    },
    themeToggle: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      padding: "16px",
      backgroundColor: "#2F2F2F",
      borderRadius: "8px",
      marginTop: "16px",
    },
    themeLabel: {
      color: "#ffffff",
      fontSize: "14px",
      fontFamily: outfit.style.fontFamily,
      display: "flex",
      alignItems: "center",
      gap: "8px",
    },
    themeSwitch: {
      width: "44px",
      height: "24px",
      backgroundColor: "#4F4F4F",
      borderRadius: "12px",
      position: "relative",
      cursor: "pointer",
      transition: "background-color 0.2s ease",
    },
    themeSwitchActive: {
      backgroundColor: "#CEDF9F",
    },
    themeSwitchKnob: {
      width: "20px",
      height: "20px",
      backgroundColor: "#ffffff",
      borderRadius: "50%",
      position: "absolute",
      top: "2px",
      left: "2px",
      transition: "transform 0.2s ease",
    },
    themeSwitchKnobActive: {
      transform: "translateX(20px)",
    },
    // Sidebar profile dropdown styles
    sidebarProfileDropdown: {
      marginTop: "12px",
      padding: "16px",
      backgroundColor: "#2F2F2F",
      borderRadius: "12px",
      animation: profileDropdownOpen ? "slideDown 0.3s ease" : "slideUp 0.3s ease",
    }
  };

  const navItems = [
    { key: 'dashboard', label: 'Dashboard', href: '/Landing/Dashboard', icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="20" height="16" x="2" y="4" rx="2" stroke="currentColor" strokeWidth="2" />
      </svg>
    )},
    { key: 'explore', label: 'Explore', href: '/Blog', icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M8 2V5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        <path d="M16 2V5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        <path d="M3 9H21" stroke="currentColor" strokeWidth="2" />
        <rect x="3" y="4" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="2" />
        <path d="M8 12H12L10 15H13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    )},
    { key: 'quiz', label: 'Quiz', href: '/RetakeQuiz', icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M9 11L12 14L15 11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M12 14V4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M20 16.7428C21.2215 15.734 22 14.2079 22 12.5C22 9.46243 19.5376 7 16.5 7C16.2815 7 16.0771 6.886 15.9661 6.69774C14.6621 4.48484 12.2544 3 9.5 3C5.35786 3 2 6.35786 2 10.5C2 12.5661 2.83545 14.4371 4.18695 15.7935" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M9 17H15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M12 14V20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    )},
  ];

  return (
    <>
      {/* Header */}
      <div style={styles.header}>
        {/* Left Section */}
        <div style={styles.leftSection}>
          <button style={styles.hamburgerButton} onClick={toggleSidebar}>
            <Menu size={24} />
          </button>
          {isMobile && (
            <div style={styles.logo}>
              <img src="/assets/Oliveclear-logo.png" alt="Oliveclear Logo" style={{ height: '23px', width: 'auto', display: 'block' }} />
            </div>
          )}
        </div>

        {/* Desktop Navigation */}
        <nav style={styles.desktopNav}>
          {navItems.map((item) => (
            <Link key={item.key} href={item.href}>
              <button 
                style={getButtonStyle(item.key)}
                onClick={() => handleButtonClick(item.key)}
                onMouseEnter={() => setHoveredButton(item.key)}
                onMouseLeave={() => setHoveredButton(null)}
              >
                {item.icon}
                <span style={styles.spanText(activeButton === item.key)}>{item.label}</span>
              </button>
            </Link>
          ))}
        </nav>
        
        {/* Right Section */}
        <div style={styles.rightSection}>
          <button style={styles.iconButton}>
            <Search size={20} />
          </button>
          <button style={styles.iconButton}>
            <Bell size={20} />
          </button>
          
          <button
          style={{
            ...styles.iconButton,
            border: activeButton === 'settings' ? '2px solid #CEDF9F' : styles.iconButton.border,
            backgroundColor: activeButton === 'settings' ? '#171717' : styles.iconButton.backgroundColor,
            color: activeButton === 'settings' ? '#CEDF9F' : styles.iconButton.color
          }}
          onClick={() => {
            setActiveButton('settings');
            window.location.href = "/Settings";
          }}
          onMouseEnter={() => setHoveredButton('settings')}
          onMouseLeave={() => setHoveredButton(null)}
        >
          <Settings size={24} />
        </button>
        <div style={styles.avatar}>
            <img 
              src={avatarUrl || "/default-avatar.png"} 
              alt="User avatar" 
              style={{...styles.avatarImg, cursor: "pointer"}}
              onClick={toggleProfileDropdown}
            />
          </div>
        </div>
      </div>

      {/* Sidebar Overlay */}
      <div style={styles.sidebarOverlay} onClick={toggleSidebar}></div>

      {/* Sidebar */}
      <div style={styles.sidebar}>
        <div style={styles.sidebarHeader}>
          {/* Replace text logo with image logo */}
          <div style={styles.logo}>
            <img src="/assets/Oliveclear-logo.png" alt="Oliveclear Logo" style={{ height: '23px', width: 'auto', display: 'block' }} />
          </div>
          <button style={styles.closeButton} onClick={toggleSidebar}>
            <X size={24} />
          </button>
        </div>

        <nav style={styles.sidebarNav}>
          {navItems.map((item) => (
            <Link key={item.key} href={item.href} style={{ textDecoration: 'none' }}>
              <button 
                style={getButtonStyle(item.key, true)}
                onClick={() => handleButtonClick(item.key)}
                onMouseEnter={() => setHoveredButton(item.key)}
                onMouseLeave={() => setHoveredButton(null)}
              >
                {item.icon}
                <span>{item.label}</span>
              </button>
            </Link>
          ))}
        </nav>

        <div style={styles.sidebarBottom}>
          <button 
            style={getButtonStyle('settings', true)}
            onClick={() => {
              setActiveButton('settings');
              window.location.href = "/Settings";
              setSidebarOpen(false);
            }}
            onMouseEnter={() => setHoveredButton('settings')}
            onMouseLeave={() => setHoveredButton(null)}
          >
            <Settings size={20} />
            <span>Settings</span>
          </button>
           <div 
            style={{
              ...styles.userSection,
              cursor: "pointer",
              flexDirection: "column",
              alignItems: "stretch",
              padding: profileDropdownOpen && isMobile ? "16px 16px 0 16px" : "16px"
            }}
            onClick={!profileDropdownOpen ? toggleProfileDropdown : undefined}
            data-user-section="true"
          >
            <div 
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                padding: profileDropdownOpen && isMobile ? "0 0 16px 0" : "0"
              }}
              onClick={profileDropdownOpen ? closeProfileDropdown : undefined}
            >
              <div style={styles.userAvatar}>
                <img src={avatarUrl || "/default-avatar.png"} alt="User avatar" style={styles.avatarImg} />
              </div>
              <div style={styles.userName}>{userName}</div>
            </div>

            {/* Mobile Profile Dropdown within same container */}
            {isMobile && profileDropdownOpen && (
              <div style={{
                borderTop: "1px solid #3F3F3F",
                paddingTop: "16px",
                marginTop: "8px"
              }}>
                <div style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "8px",
                  marginBottom: "16px"
                }}>
                  <button 
                    style={styles.profileMenuItem}
                    onMouseEnter={(e) => e.target.style.backgroundColor = styles.profileMenuItemHover.backgroundColor}
                    onMouseLeave={(e) => e.target.style.backgroundColor = "transparent"}
                    onClick={(e) => {
                      e.stopPropagation();
                      setProfileDropdownOpen(false);
                      // Add report functionality here
                    }}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <polyline points="14,2 14,8 20,8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <line x1="16" y1="13" x2="8" y2="13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <line x1="16" y1="17" x2="8" y2="17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <polyline points="10,9 9,9 8,9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    report
                  </button>

                  <button 
                    style={styles.profileMenuItem}
                    onMouseEnter={(e) => e.target.style.backgroundColor = styles.profileMenuItemHover.backgroundColor}
                    onMouseLeave={(e) => e.target.style.backgroundColor = "transparent"}
                    onClick={(e) => {
                      e.stopPropagation();
                      setProfileDropdownOpen(false);
                      setActiveButton('settings');
                      router.push("/Settings");
                      setSidebarOpen(false);
                    }}
                  >
                    <Settings size={16} />
                    settings
                  </button>

                  <button 
                    style={{...styles.profileMenuItem, ...styles.profileMenuItemLogout}}
                    onMouseEnter={(e) => e.target.style.backgroundColor = styles.profileMenuItemHover.backgroundColor}
                    onMouseLeave={(e) => e.target.style.backgroundColor = "transparent"}
                    onClick={(e) => {
                      e.stopPropagation();
                      setProfileDropdownOpen(false);
                      handleLogout();
                    }}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <polyline points="16 17 21 12 16 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <line x1="21" y1="12" x2="9" y2="12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    logout
                  </button>
                </div>

                <div style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "12px 16px",
                  backgroundColor: "#3F3F3F",
                  borderRadius: "8px",
                  marginBottom: "16px"
                }}>
                  <div style={styles.themeLabel}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <circle cx="12" cy="12" r="5" stroke="currentColor" strokeWidth="2"/>
                      <line x1="12" y1="1" x2="12" y2="3" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                      <line x1="12" y1="21" x2="12" y2="23" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                      <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                      <line x1="1" y1="12" x2="3" y2="12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                      <line x1="21" y1="12" x2="23" y2="12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                      <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                    </svg>
                    theme
                  </div>
                  <div 
                    style={styles.themeSwitch}
                    onClick={(e) => {
                      e.stopPropagation();
                      // Add theme toggle functionality here
                    }}
                  >
                    <div style={styles.themeSwitchKnob}></div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Profile Dropdown Overlay */}
      {!isMobile && <div style={styles.profileDropdownOverlay} onClick={toggleProfileDropdown}></div>}

      {/* Desktop Profile Dropdown */}
      {!isMobile && profileDropdownOpen && (
        <div style={styles.profileDropdown}>
          <div style={styles.profileHeader}>
            <div style={styles.profileAvatar}>
              <img src={avatarUrl || "/default-avatar.png"} alt="User avatar" style={styles.avatarImg} />
            </div>
            <div style={styles.profileInfo}>
              <div style={styles.profileName}>{userName || "User"}</div>
              <div style={styles.profileEmail}>user@example.com</div>
            </div>
          </div>

          <div style={styles.profileMenu}>
            <button 
              style={styles.profileMenuItem}
              onMouseEnter={(e) => e.target.style.backgroundColor = styles.profileMenuItemHover.backgroundColor}
              onMouseLeave={(e) => e.target.style.backgroundColor = "transparent"}
              onClick={() => {
                setProfileDropdownOpen(false);
                // Add report functionality here
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <polyline points="14,2 14,8 20,8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <line x1="16" y1="13" x2="8" y2="13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <line x1="16" y1="17" x2="8" y2="17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <polyline points="10,9 9,9 8,9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              report
            </button>

            <button 
              style={styles.profileMenuItem}
              onMouseEnter={(e) => e.target.style.backgroundColor = styles.profileMenuItemHover.backgroundColor}
              onMouseLeave={(e) => e.target.style.backgroundColor = "transparent"}
              onClick={() => {
                setProfileDropdownOpen(false);
                setActiveButton('settings');
                router.push("/Settings");
              }}
            >
              <Settings size={16} />
              settings
            </button>

            <button 
              style={{...styles.profileMenuItem, ...styles.profileMenuItemLogout}}
              onMouseEnter={(e) => e.target.style.backgroundColor = styles.profileMenuItemHover.backgroundColor}
              onMouseLeave={(e) => e.target.style.backgroundColor = "transparent"}
              onClick={() => {
                setProfileDropdownOpen(false);
                handleLogout();
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <polyline points="16 17 21 12 16 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <line x1="21" y1="12" x2="9" y2="12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              logout
            </button>
          </div>

          <div style={styles.themeToggle}>
            <div style={styles.themeLabel}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="12" cy="12" r="5" stroke="currentColor" strokeWidth="2"/>
                <line x1="12" y1="1" x2="12" y2="3" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                <line x1="12" y1="21" x2="12" y2="23" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                <line x1="1" y1="12" x2="3" y2="12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                <line x1="21" y1="12" x2="23" y2="12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
              theme
            </div>
            <div 
              style={styles.themeSwitch}
              onClick={() => {
                // Add theme toggle functionality here
              }}
            >
              <div style={styles.themeSwitchKnob}></div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}