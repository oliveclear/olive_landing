"use client";
import { useEffect, useState, useRef } from "react";
import { Edit3, Info, Search, Users } from "lucide-react";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import Image from "next/image";

const SettingsPage = () => {
  const [userName, setUserName] = useState('');
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const hasAutoScrolledRef = useRef(false);

  // Handle responsive breakpoints
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

  // Start with empty fields, will be filled by API
  const [formData, setFormData] = useState({
    userName: "",
    name: "",
    userEmail: "",
    gender: "",
    phoneNumber: "",
    skinType: "",
    skinIssues: "",
    periodType: "",
    lastPeriodDate: "",
    cycleLength: "",
    periodDuration: "",
    monthlyReport: "",
    trackProgress: "",
    pushNotifications: true,
    theme: "Night"
  });

  // Avatar selection state
  const [selectedAvatar, setSelectedAvatar] = useState("A"); // A, M, J, Y, S

  const router = useRouter();
  const [showDeleteOptions, setShowDeleteOptions] = useState(false);

  // Custom success alert state
  const [showSuccess, setShowSuccess] = useState(false);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };
  
  const handleLogout = () => {
    Cookies.remove("token");
    window.location.href = "/";
    // setTimeout(() => {
    //   window.location.reload();
    // }, 100); // 100ms delay to ensure navigation
  };

  // Delete Data
  const handleDeleteData = async () => {
    if (window.confirm("This is a dangerous action and can't be reversed. Are you sure you want to delete all your data except profile?")) {
      const token = Cookies.get('token');
      if (!token) return;
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_URL_HOST}/delete-data`, {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        const data = await res.json();
        alert(data.message || 'Data deleted.');
      } catch (err) {
        alert('Failed to delete data.');
      }
    }
  };

  // Delete Skin Type
  const handleDeleteSkinData = async () => {
    if (window.confirm("This is a dangerous action and can't be reversed. Are you sure you want to delete your skin type data?")) {
      const token = Cookies.get('token');
      if (!token) return;
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_URL_HOST}/delete-skin-type`, {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        const data = await res.json();
        alert(data.message || 'Skin type data deleted.');
      } catch (err) {
        alert('Failed to delete skin type data.');
      }
    }
  };

  // Delete Account
  const handleDeleteAccount = async () => {
    if (window.confirm("This is a dangerous action and can't be reversed. Are you sure you want to delete your account?")) {
      const token = Cookies.get('token');
      if (!token) return;
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_URL_HOST}/delete-account`, {
          method: 'PUT',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        const data = await res.json();
        alert(data.message || 'Account deleted.');
        // Optionally, log out or redirect the user
        window.location.href = '/';
      } catch (err) {
        alert('Failed to delete account.');
      }
    }
  };

  // --- API integration for profile ---
  // Get user profile
  const getProfile = async (token) => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_URL_HOST}/userprofile`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        "ngrok-skip-browser-warning": "true"  // Skip ngrok browser warning
      }
    
    });
    console.log("Response is:", response);
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch profile');
    }
    console.log("Profile data fetched:", data);
    return data;
    
    
  };

  // Update user profile
  const updateProfile = async (profileData, token) => {
    try{
    
    const response = await fetch(`${process.env.NEXT_PUBLIC_URL_HOST}/updateuser`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(profileData)
    });
    return response.json();
    console.log("Response is:", response);
  }catch (error) {
    console.error("Error updating profile:", error);
    throw error; // Re-throw to handle in calling function
  }};

  // Fetch profile on mount and set form data
  useEffect(() => {
    const fetchProfile = async () => {
      const token = Cookies.get('token');
      if (!token) {
        console.log("No token found, redirecting to login...");
        return;}
      console.log("Calling getProfile...");
      try{
      const res = await getProfile(token);
      console.log("Fetched profile:", res);
      if (res.success && res.profile) {
        setFormData(prev => ({
          ...prev,
          userName: res.profile.username || '',
          name: res.profile.fullname || '',
          userEmail: res.profile.email || '',
          gender: res.profile.gender || '',
          phoneNumber: res.profile.phone || '',
          skinType: res.profile.skinType || '',
          skinIssues: Array.isArray(res.profile.skinConcerns) ? res.profile.skinConcerns.join(', ') : '',
          periodType: res.profile.period?.periodType || '',
          lastPeriodDate: res.profile.period?.lastPeriodDate || '',
          cycleLength: res.profile.period?.cycleLength ? String(res.profile.period.cycleLength) : '',
          periodDuration: res.profile.period?.periodLastsFor ? String(res.profile.period.periodLastsFor) : '',
          monthlyReport: '',
          trackProgress: '',
          pushNotifications: true,
          theme: 'Night',
        }));
        // Set avatar selection if avatar matches
        if (res.profile.avatar) {
          if (res.profile.avatar.includes('a.png')) setSelectedAvatar('A');
          else if (res.profile.avatar.includes('b.png')) setSelectedAvatar('M');
          else if (res.profile.avatar.includes('c.png')) setSelectedAvatar('J');
          else if (res.profile.avatar.includes('d.png')) setSelectedAvatar('Y');
          else if (res.profile.avatar.includes('e.png')) setSelectedAvatar('S');
        }
      }
    } catch (error) {
        console.error("Error fetching profile:", error);
        // Optionally handle error state here
      }
    };
    fetchProfile();
  }, []);

  // Save settings handler
  const handleSaveSettings = async () => {
  const token = Cookies.get('token');
  if (!token) {
    alert('No authentication token found. Please login again.');
    return;
  }

  try {
    // Validate required fields
    if (!formData.name?.trim()) {
      alert('Name is required');
      return;
    }

    // Prepare data for API - match backend expectations
    const profileData = {
      name: formData.name.trim(),
      // Remove email and phone as backend doesn't handle them
      // email: formData.userEmail.trim(),
      // phone: formData.phoneNumber?.trim() || '',
      skinType: formData.skinType?.trim() || '',
      gender: formData.gender?.trim() || '',
      skinConcerns: formData.skinIssues ? 
        formData.skinIssues.split(',').map(s => s.trim()).filter(Boolean) : [],
      avatar: avatarUrls[selectedAvatar] || avatarUrls.A
    };

    // Add period data only for females
    if (formData.gender === 'female') {
      // Validate period data
      if (formData.lastPeriodDate) {
        const datePattern = /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/\d{4}$/;
        if (!datePattern.test(formData.lastPeriodDate)) {
          alert('Please enter last period date in dd/mm/yyyy format');
          return;
        }
      }
      
      profileData.period = {
        lastPeriodDate: formData.lastPeriodDate || '',
        cycleLength: formData.cycleLength ? parseInt(formData.cycleLength.replace(/\D/g, '')) : null,
        periodLastsFor: formData.periodDuration ? parseInt(formData.periodDuration.replace(/\D/g, '')) : null,
        periodType: formData.periodType || '',
      };
      
      // Remove null values
      if (!profileData.period.cycleLength) delete profileData.period.cycleLength;
      if (!profileData.period.periodLastsFor) delete profileData.period.periodLastsFor;
      if (!profileData.period.lastPeriodDate) delete profileData.period.lastPeriodDate;
      
      // If no period data, don't send it
      if (Object.keys(profileData.period).length === 0) {
        delete profileData.period;
      }
    }

    console.log("Saving profile data:", profileData);
    
    const result = await updateProfile(profileData, token);
    console.log("Profile updated successfully:", result);
    
    if (result.success) {
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 2500);
    } else {
      throw new Error(result.message || 'Update failed');
    }
    
  } catch (error) {
    console.error("Error saving settings:", error);
    alert(`Failed to save settings: ${error.message}`);
  }
};
  const styles = {
    container: {
      marginLeft: isMobile ? '0' : isTablet ? '60px' : '170px',
      marginTop: isMobile ? '60px' : isTablet ? '80px' : '100px',
      marginBottom: isMobile ? '40px' : isTablet ? '50px' : '20px',

      // Remove height and overflowY to ignore scrolling on this page
      backgroundColor: "#171717",
      color: "white",
      padding: "0",
      fontFamily: "outfit, sans-serif",
      minHeight: "100%",
    },
    header: {
      display: "flex",
      alignItems: "center",
      padding: isMobile ? "15px 20px" : isTablet ? "18px 30px" : "20px",
      position: "relative",
      flexWrap: isMobile ? "wrap" : "nowrap"
    },
    backButton: {
      background: "none",
      border: "none",
      color: "white",
      cursor: "pointer",
      padding: "0",
      display: "flex",
      alignItems: "center",
      fontSize: "16px",
      marginBottom: isMobile ? "0px" : "22px",
    },
    headerContent: {
      display: "flex",
      flexDirection: "column",
      marginLeft: "12px"
    },    
    title: {
      fontSize: isMobile ? "24px" : isTablet ? "28px" : "32px",
      fontWeight: "700",
      margin: "0",
      lineHeight: "1.2",
      
    },
    subtitle: {
      fontSize: isMobile ? "12px" : "14px",
      color: "#888",
      marginTop: "4px",
      fontWeight: "400"
    },
    searchContainer: {
      position: isMobile ? "static" : "absolute",
      right: isMobile ? "0" : "40px",
      top: isMobile ? "auto" : "50%",
      transform: isMobile ? "none" : "translateY(-50%)",
      marginTop: isMobile ? "15px" : "0",
      width: isMobile ? "100%" : "auto"
    },
    searchInput: {
      backgroundColor: "transparent",
      border: "1px solid #555",
      borderRadius: "25px",
      padding: "10px 20px 10px 45px",
      color: "#888",
      fontSize: "14px",
      width: isMobile ? "100%" : "200px",
      outline: "none"
    },
    searchIcon: {
      position: "absolute",
      left: "16px",
      top: "50%",
      transform: "translateY(-50%)",
    },    
    content: {
      padding: isMobile ? "20px 15px" : isTablet ? "30px 25px" : "40px 60px",
      maxWidth: "none"
    },
    section: {
      marginBottom: isMobile ? "30px" : isTablet ? "40px" : "50px"
    },
    sectionTitle: {
      fontSize: isMobile ? "16px" : "18px",
      fontWeight: "200",
      marginBottom: isMobile ? "20px" : "30px",
      color: "#A8A9AD"
    },
    sectionTitle1: {
      fontSize: isMobile ? "16px" : "18px",
      fontWeight: "500",
      color: "#fff"
    },
    fieldRow: {
      display: "flex",
      alignItems: isMobile ? "flex-start" : "center",
      justifyContent: "space-between",
      marginBottom: isMobile ? "20px" : "30px",
      // paddingRight: isMobile ? "0" : "40px",
      flexDirection: isMobile ? "column" : "row",
      gap: isMobile ? "10px" : "0"
    },    fieldInfo: {
      flex: "1",
      maxWidth: isMobile ? "100%" : "400px",
      marginBottom: isMobile ? "8px" : "0"
    },
    fieldLabel: {
      display: "block",
      fontSize: isMobile ? "16px" : "18px",
      fontWeight: "500",
      marginBottom: "6px",
      color: "#fff"
    },
    fieldDescription: {
      fontSize: isMobile ? "12px" : "14px",
      color: "#888",
      lineHeight: "1.4"
    },
    inputContainer: {
      position: "relative",
      display: "flex",
      alignItems: "center",
      minWidth: isMobile ? "100%" : isTablet ? "280px" : "350px",
      width: isMobile ? "100%" : "auto"
    },
    input: {
      backgroundColor: "#2a2a2a",
      border: "1px solid #444",
      borderRadius: "25px",
      padding: "14px 50px 14px 20px",
      color: "#888",
      fontSize: "14px",
      width: "100%",
      outline: "none",
      transition: "border-color 0.2s"
    },
    editIcon: {
      position: "absolute",
      right: "18px",
      color: "#888",
      cursor: "pointer",
      padding: "4px",
      backgroundColor: "#444",
      borderRadius: "50%",
      width: "24px",
      height: "24px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center"
    },
    infoIcon: {
      position: "absolute",
      right: "18px",
      color: "#888",
      cursor: "pointer",
      padding: "4px",
      backgroundColor: "#444",
      borderRadius: "50%",
      width: "24px",
      height: "24px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center"
    },
    periodSection: {
      marginTop: "50px"
    },
    periodDescription: {
      fontSize: "14px",
      color: "#888",
      marginBottom: "30px",
      lineHeight: "1.4"
    },    periodGrid: {
      display: "flex",
      gap: isMobile ? "20px" : "30px",
      marginTop: isMobile ? "20px" : "30px",
      flexDirection: isMobile ? "column" : "row"
    },
    periodField: {
      display: "flex",
      flexDirection: "column",
      flex: "1"
    },    periodLabel: {
      fontSize: isMobile ? "14px" : "16px",
      fontWeight: "500",
      marginBottom: "15px",
      color: "#fff"
    },
    periodInputContainer: {
      position: "relative",
      display: "flex",
      alignItems: "center"
    },
    periodInput: {
      backgroundColor: "#2a2a2a",
      border: "1px solid #444",
      borderRadius: "25px",
      padding: "14px 50px 14px 20px",
      color: "white",
      fontSize: "14px",
      width: "100%",
      outline: "none",
      transition: "border-color 0.2s"
    },
    reportSection: {
      marginTop: "50px",
      display: "flex",
      flexDirection: "column"
    },
    reportDescription: {
      fontSize: "14px",
      color: "#888",
      // marginBottom: "30px",
      lineHeight: "1.4"
    },    reportGrid: {
      display: "flex",
      flexDirection: "column",
      gap: isMobile ? "20px" : "30px",
      marginTop: isMobile ? "20px" : "30px"
    },
    reportField: {
      display: "flex",
      flexDirection: isMobile ? "row" : "row",
      flex: "1",
      alignItems: isMobile ? "flex-start" : "center",
      justifyContent: "space-between",
      gap: isMobile ? "8px" : "0"
    },
    reportLabel: {
      fontSize: isMobile ? "14px" : "16px",
      fontWeight: "500",
      marginBottom: isMobile ? "8px" : "15px",
      color: "#fff"
    },
    reportInputContainer: {
      position: "relative",
      display: "flex",
      alignItems: "center",
      width: isMobile ? "100%" : "auto",
      minWidth: isMobile ? "100%" : isTablet ? "280px" : "350px"
    },
    reportInput: {
      backgroundColor: "#2a2a2a",
      border: "1px solid #444",
      borderRadius: "25px",
      padding: "14px 50px 14px 20px",
      color: "white",
      fontSize: "14px",
      width: "100%",
      outline: "none",
      transition: "border-color 0.2s"
    },
    notificationSection: {
      marginTop: "50px"
    },    
    notificationRow: {
      display: "flex",
      alignItems: isMobile ? "flex-start" : "center",
      justifyContent: "space-between",
      marginBottom: isMobile ? "20px" : "30px",
      flexDirection: isMobile ? "column" : "row",
      gap: isMobile ? "15px" : "0",
      flexDirection: "row",
    },
    notificationInfo: {
      flex: "1"
    },    
    notificationLabel: {
      fontSize: isMobile ? "16px" : "18px",
      fontWeight: "500",
      marginBottom: "2px",
      color: "#fff"
    },
    notificationDescription: {
      fontSize: "14px",
      color: "#888",
      lineHeight: "1.4"
    },
    toggle: {
      position: "relative",
      width: "60px",
      height: "30px",
      backgroundColor: "#4CAF50",
      borderRadius: "15px",
      cursor: "pointer",
      transition: "background-color 0.3s"
    },
    toggleButton: {
      position: "absolute",
      top: "3px",
      right: "3px",
      width: "24px",
      height: "24px",
      backgroundColor: "white",
      borderRadius: "50%",
      transition: "transform 0.3s"
    },
    themeSection: {
      marginTop: "50px"
    },
    themeGrid: {
      display: "flex",
      gap: "20px",
      marginTop: "20px",
      alignItems: "center"
    },    
    avatarContainer: {
      display: "flex",
      gap: isMobile ? "15px" : "10px",
      alignItems: isMobile ? "flex-start" : "center",
      justifyContent: "space-between",
      marginBottom: "24px",
      flexDirection: isMobile ? "column" : "row"
    },
    avatar: {
      width: isMobile ? "40px" : "48px",
      height: isMobile ? "40px" : "48px",
      borderRadius: "50%",
      objectFit: "cover",
      backgroundColor: "#444",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: isMobile ? "12px" : "14px",
      fontWeight: "500",
      border: "2px solid transparent",
      cursor: "pointer",
      transition: "border 0.2s, box-shadow 0.2s"
    },
    avatarSelected: {
      width: isMobile ? "40px" : "48px",
      height: isMobile ? "40px" : "48px",
      borderRadius: "50%",
      objectFit: "cover",
      backgroundColor: "#444",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: isMobile ? "12px" : "14px",
      fontWeight: "500",
      border: "3px solid #4CAF50",
      boxShadow: "0 0 0 4px rgba(76,175,80,0.15)",
      cursor: "pointer",
      transition: "border 0.2s, box-shadow 0.2s"
    },
    avatarRow: {
      display: "flex",
      gap: isMobile ? "8px" : "12px",
      marginBottom: "12px",
      flexWrap: isMobile ? "wrap" : "nowrap"
    },
    themeInputContainer: {
      position: "relative",
      display: "flex",
      alignItems: "center",
      minWidth: "200px"
    },
    themeInput: {
      backgroundColor: "#2a2a2a",
      border: "1px solid #444",
      borderRadius: "25px",
      padding: "14px 50px 14px 20px",
      color: "white",
      fontSize: "14px",
      width: "100%",
      outline: "none",
      transition: "border-color 0.2s"
    },    
    themeDropdownRow: {
      display: "flex",
      alignItems: isMobile ? "flex-start" : "center",
      gap: isMobile ? "10px" : "16px",
      marginTop: "8px",
      justifyContent: "space-between",
      marginBottom: "24px",
      flexDirection: "row"
    },
    themeDropdownLabel: {
      fontSize: isMobile ? "14px" : "16px",
      fontWeight: "500",
      color: "#fff"
    },
    themeDropdown: {
      backgroundColor: "#2a2a2a",
      border: "1px solid #444",
      borderRadius: "25px",
      color: "white",
      fontSize: "14px",
      padding: "10px 24px",
      outline: "none"
    },
    dataSection: {
      marginTop: "50px"
    },    
    deleteButton: {
      backgroundColor: "#222",
      border: "1px solid #CA0000",
      borderRadius: "19px",
      marginBottom: isMobile ? "0" : "10px",
      color: "#FC1E1E",
      cursor: "pointer",
      fontSize: "14px",
      fontWeight: "500",
      padding: "10px 20px",
      transition: "background-color 0.2s",
      width: isMobile ? "50%" : "200px",
      // textDecoration: "underline" // Add underline
    },
    logoutButton: {
      color: "#FC1E1E",
      cursor: "pointer",
      fontSize: "20px",
      fontWeight: "400",
      // padding: "12px 24px",
      marginTop: isMobile ? "30px" : "50px",
      transition: "background-color 0.2s",
      width: isMobile ? "100%" : "auto",
      // textDecoration: "underline" // Add underline
    },
    saveButton: {
      backgroundColor: "#4CAF50",
      borderRadius: "19px",
      color: "#cedf9f",
      cursor: "pointer",
      fontSize: "14px",
      fontWeight: isMobile ? "500" : "500",
      padding: "10px 20px",
      // marginTop: isMobile ? "30px" : "50px",
      transition: "background-color 0.2s",
      width: isMobile ? "100%" : "auto"
    }
  };

  // Divider style for section separation
  const dividerStyle = {
    width: '100%',
    height: '3px',
    flexShrink: 0,
    opacity: 0.1,
    background: '#D9D9D9',
    border: 'none',
    margin: isMobile ? '24px 0' : '32px 0',
    alignSelf: 'center',
  };

  // Avatar URLs
  const avatarUrls = {
    A: "https://res.cloudinary.com/dnaldziom/image/upload/v1750091199/uploads/1750091197451-a.png",
    M: "https://res.cloudinary.com/dnaldziom/image/upload/v1750091237/uploads/1750091234576-b.png",
    J: "https://res.cloudinary.com/dnaldziom/image/upload/v1750091258/uploads/1750091256776-c.png",
    Y: "https://res.cloudinary.com/dnaldziom/image/upload/v1750091279/uploads/1750091278308-d.png",
    S: "https://res.cloudinary.com/dnaldziom/image/upload/v1750091298/uploads/1750091296791-e.png"
  };
  return (
    <div style={styles.container}>
      {/* Success Alert */}
      {showSuccess && (
        <div style={{
          position: 'fixed',
          top: 24,
          right: isMobile ? '15px' : '24px',
          left: isMobile ? '15px' : 'auto',
          background: '#4CAF50',
          color: '#fff',
          padding: isMobile ? '12px 20px' : '16px 32px',
          borderRadius: '8px',
          fontWeight: 600,
          fontSize: isMobile ? '14px' : '16px',
          boxShadow: '0 2px 12px rgba(0,0,0,0.15)',
          zIndex: 9999,
          letterSpacing: '0.5px',
          textAlign: isMobile ? 'center' : 'left'
        }}>
          Settings have been updated
        </div>
      )}
      
      {/* Header */}
      <div style={styles.header}>
        <button style={styles.backButton} onClick={() => router.push("/Landing/Dashboard")}>  {/* Updated to navigate to dashboard */}
          <Image
            src="/assets/backOliveClear.png"
            alt="Back"
            width={isMobile ? 20 : 24}
            height={isMobile ? 20 : 24}
            style={{ display: 'block' }}
          />
        </button>
        <div style={styles.headerContent}>
          <h1 style={styles.title}>Account settings</h1>
          <span style={styles.subtitle}>settings and options to manage your profile.</span>
        </div>
        {!isMobile && (
          <div style={styles.searchContainer}>
            <div style={{ position: 'relative' }}>
              <Search size={16} style={styles.searchIcon} />
              <input 
                type="text" 
                placeholder="search"
                style={styles.searchInput}
              />
            </div>
          </div>
        )}
        {isMobile && (
          <div style={styles.searchContainer}>
            <div style={{ position: 'relative' }}>
              <Search size={16} style={styles.searchIcon} />
              <input 
                type="text" 
                placeholder="search"
                style={styles.searchInput}
              />
            </div>
          </div>
        )}
      </div>

      {/* Content */}
      <div style={styles.content}>
        {/* Profile Section */}
        <div style={styles.section}>
          <h3 style={styles.sectionTitle}>Profile</h3>
          
          <div style={styles.fieldRow}>
            <div style={styles.fieldInfo}>
              <label style={styles.fieldLabel}>UserName</label>
              <div style={styles.fieldDescription}>change your username</div>
            </div>
            <div style={styles.inputContainer}>
              <input
                type="text"
                value={formData.userName}
                onChange={(e) => handleInputChange('userName', e.target.value)}
                style={styles.input}
              />
              <div style={styles.editIcon}>
                <Edit3 size={12} />
              </div>
            </div>
          </div>          <div style={styles.fieldRow}>
            <div style={styles.fieldInfo}>
              <label style={styles.fieldLabel}>Your Name</label>
              <div style={styles.fieldDescription}>change your name as you want to be greeted</div>
            </div>
            <div style={styles.inputContainer}>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                style={styles.input}
              />
              <div style={styles.editIcon}>
                <Edit3 size={12} />
              </div>
            </div>
          </div>
          <div style={styles.fieldRow}>
            <div style={styles.fieldInfo}>
              <label style={styles.fieldLabel}>User Mail</label>
              <div style={styles.fieldDescription}>change your mail where you want all the updates</div>
            </div>
            <div style={styles.inputContainer}>
              <input
                type="email"
                value={formData.userEmail}
                onChange={(e) => handleInputChange('userEmail', e.target.value)}
                style={styles.input}
              />
              <div style={styles.editIcon}>
                <Edit3 size={12} />
              </div>
            </div>
          </div>

          <div style={styles.fieldRow}>
            <div style={styles.fieldInfo}>
              <label style={styles.fieldLabel}>Gender</label>
              <div style={styles.fieldDescription}>change your gender information</div>
            </div>
            <div style={styles.inputContainer}>
              <select
                value={formData.gender}
                onChange={(e) => handleInputChange('gender', e.target.value)}
                style={styles.input}
              >
                <option value="">Select gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="others">Others</option>
              </select>
              <div style={styles.editIcon}>
                <Edit3 size={12} />
              </div>
            </div>
          </div>

          <div style={styles.fieldRow}>
            <div style={styles.fieldInfo}>
              <label style={styles.fieldLabel}>Phone number</label>
              <div style={styles.fieldDescription}>edit your phone number</div>
            </div>
            <div style={styles.inputContainer}>
              <input
                type="tel"
                value={formData.phoneNumber}
                onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                style={styles.input}
              />
              <div style={styles.editIcon}>
                <Edit3 size={12} />
              </div>
            </div>
          </div>

          <div style={styles.fieldRow}>
            <div style={styles.fieldInfo}>
              <label style={styles.fieldLabel}>Skin Type</label>
              <div style={styles.fieldDescription}>Recheck and Update your skin type</div>
            </div>
            <div style={styles.inputContainer}>
              <input
                type="text"
                value={formData.skinType}
                onChange={(e) => handleInputChange('skinType', e.target.value)}
                style={styles.input}
              />
              <div style={styles.editIcon}>
                <Edit3 size={12} />
              </div>
            </div>
          </div>
        </div>
        <div style={dividerStyle} />
        {/* User Info Section */}
        <div style={styles.section}>
          <h3 style={styles.sectionTitle}>User Info</h3>
          
          <div style={styles.fieldRow}>
            <div style={styles.fieldInfo}>
              <label style={styles.fieldLabel}>Skin Issues</label>
              <div style={styles.fieldDescription}>User skin issues</div>
            </div>
            <div style={styles.inputContainer}>
              <input
                type="text"
                value={formData.skinIssues}
                onChange={(e) => handleInputChange('skinIssues', e.target.value)}
                style={styles.input}
              />
              <div style={styles.infoIcon}>
                <Info size={12} />
              </div>            </div>
          </div>
        </div>
        
        {/* Period Section - Shown only for female gender */}
        {formData.gender === "female" && (
          <>
            <div style={dividerStyle} />
            <div style={styles.fieldRow}>
              <div style={styles.fieldInfo}>
                <label style={styles.fieldLabel}>Period Type</label>
                <div style={styles.fieldDescription}>Choose your Period type</div>
              </div>
              <div style={styles.inputContainer}>
                <select
                  value={formData.periodType}
                  onChange={e => handleInputChange('periodType', e.target.value)}
                  style={styles.input}
                >
                  <option value="">Select type</option>
                  <option value="regular">Regular</option>
                  <option value="irregular">Irregular</option>
                  <option value="pcos">PCOS/PCOD</option>
                  <option value="perimenopause">Perimenopause</option>
                </select>
                <div style={styles.infoIcon}>
                  <Info size={12} />
                </div>
              </div>
            </div>

            <div style={styles.periodSection}>
              <h3 style={styles.sectionTitle}>Period Cycle</h3>
              <div style={styles.periodDescription}>Track details for your period cycle</div>
              <div style={styles.periodGrid}>
                <div style={styles.periodField}>
                  <label style={styles.periodLabel}>a. Last period start date</label>
                  <div style={styles.periodInputContainer}>
                    <input
                      type="date"
                      value={(() => {
                        // Convert dd/mm/yyyy to yyyy-mm-dd for input
                        if (!formData.lastPeriodDate) return '';
                        const [dd, mm, yyyy] = formData.lastPeriodDate.split('/');
                        return `${yyyy}-${mm}-${dd}`;
                      })()}
                      onChange={e => {
                        // Convert yyyy-mm-dd to dd/mm/yyyy
                        const [yyyy, mm, dd] = e.target.value.split('-');
                        handleInputChange('lastPeriodDate', `${dd}/${mm}/${yyyy}`);
                      }}
                      style={styles.periodInput}
                    />
                    <div style={styles.editIcon}>
                      <Edit3 size={12} />
                    </div>
                  </div>
                </div>
                <div style={styles.periodField}>
                  <label style={styles.periodLabel}>b. Cycle length of periods (days)</label>
                  <div style={styles.periodInputContainer}>
                    <input
                      type="number"
                      min={20}
                      max={40}
                      value={formData.cycleLength}
                      onChange={e => handleInputChange('cycleLength', e.target.value)}
                      placeholder="28"
                      style={styles.periodInput}
                    />
                    <div style={styles.editIcon}>
                      <Edit3 size={12} />
                    </div>
                  </div>
                </div>
                <div style={styles.periodField}>
                  <label style={styles.periodLabel}>c. Periods lasts (days)</label>
                  <div style={styles.periodInputContainer}>
                    <input
                      type="number"
                      min={1}
                      max={10}
                      value={formData.periodDuration}
                      onChange={e => handleInputChange('periodDuration', e.target.value)}
                      placeholder="5"
                      style={styles.periodInput}
                    />
                    <div style={styles.editIcon}>
                      <Edit3 size={12} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
        <div style={dividerStyle} />
        {/* Reports & Track Progress Section */}
        <div style={styles.reportSection}>
          <h3 style={styles.sectionTitle1}>Reports & Track your Progress</h3>
          <div style={styles.reportDescription}>Track your progress with detailed reports</div>
          
          <div style={styles.reportGrid}>
            <div style={styles.reportField}>
              <div>
                <label style={styles.reportLabel}>Monthly Report</label>
                <div style={styles.fieldDescription}>View your monthly progress report</div>
              </div>
              <button
                style={{
                  borderRadius: '24px',
                  border: '1px solid #CEDF9F',
                  background: '#222',
                  width: '153px',
                  height: '44px',
                  flexShrink: 0,
                  color: '#CEDF9F',
                  fontWeight: 500,
                  fontSize: '15px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginTop: '8px',
                }}
                // onClick handler can be added here
              >
                View Report
              </button>
            </div>

            <div style={styles.reportField}>
              <div>
                <label style={styles.reportLabel}>Track your Progress</label>
                <div style={styles.fieldDescription}>Monitor your skin care progress</div>
              </div>
              <button
                style={{
                  borderRadius: '24px',
                  border: '1px solid #CEDF9F',
                  background: '#222',
                  width: '153px',
                  height: '44px',
                  flexShrink: 0,
                  color: '#CEDF9F',
                  fontWeight: 500,
                  fontSize: '15px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginTop: '8px',
                }}
                // onClick handler can be added here
              >
                Track Progress
              </button>
            </div>
          </div>
        </div>
        <div style={dividerStyle} />
        {/* Notification Section */}
        <div style={styles.notificationSection}>
          <h3 style={styles.sectionTitle}>Notification</h3>
          
          <div style={styles.notificationRow}>
            <div style={styles.notificationInfo}>
              <label style={styles.notificationLabel}>Push Notification</label>
              <div style={styles.notificationDescription}>Enable push notifications for app updates</div>
            </div>
            <div 
              style={{
                ...styles.toggle,
                backgroundColor: formData.pushNotifications ? '#4CAF50' : '#666'
              }}
              onClick={() => handleInputChange('pushNotifications', !formData.pushNotifications)}
            >
              <div 
                style={{
                  ...styles.toggleButton,
                  transform: formData.pushNotifications ? 'translateX(0)' : 'translateX(-30px)'
                }}
              />
            </div>
          </div>
        </div>
        <div style={dividerStyle} />
        {/* Avatar & Theme Section */}
        <div style={styles.themeSection}>
          <h3 style={styles.sectionTitle}>Avatar & Theme</h3>
          {/* Avatar Row */}
          <div style={styles.avatarContainer}>
            <div style={{ display: "flex", flexDirection: "column", marginBottom: "12px" }}>
              <label style={{ fontSize: "16px", fontWeight: 500, color: "#fff", marginBottom: "2px" }}>Avatar</label>
              <span style={{ fontSize: "13px", color: "#aaa", marginBottom: "8px" }}>Change your avatar</span>
            </div>
            <div style={styles.avatarRow}>
              <img src={avatarUrls.A} alt="Avatar A" style={selectedAvatar === "A" ? styles.avatarSelected : styles.avatar} onClick={() => setSelectedAvatar("A")} />
              <img src={avatarUrls.M} alt="Avatar M" style={selectedAvatar === "M" ? styles.avatarSelected : styles.avatar} onClick={() => setSelectedAvatar("M")} />
              <img src={avatarUrls.J} alt="Avatar J" style={selectedAvatar === "J" ? styles.avatarSelected : styles.avatar} onClick={() => setSelectedAvatar("J")} />
              <img src={avatarUrls.Y} alt="Avatar Y" style={selectedAvatar === "Y" ? styles.avatarSelected : styles.avatar} onClick={() => setSelectedAvatar("Y")} />
              <img src={avatarUrls.S} alt="Avatar S" style={selectedAvatar === "S" ? styles.avatarSelected : styles.avatar} onClick={() => setSelectedAvatar("S")} />
            </div>
          </div>

          {/* Theme Dropdown Row */}
          <div style={styles.themeDropdownRow}>            
            <div style={{ display: "flex", flexDirection: "column", marginBottom: "12px" }}>
              <label style={styles.themeDropdownLabel}>Theme:</label>
              <span style={{ fontSize: "13px", color: "#aaa", marginBottom: "8px"}}>Change your theme</span>
            </div>
            <div>              
              <select
                value={formData.theme}
                onChange={(e) => handleInputChange('theme', e.target.value)}
                style={styles.themeDropdown}
              >
                <option value="Night">Night</option>
                <option value="Light">Light</option>
                <option value="Olive">Olive</option>
                <option value="Classic">Classic</option>
              </select>
            </div>
          </div>
        </div>        {/* Save Settings Button */}
        <div style={{ display: 'flex',justifyContent: 'flex-end', gap: '12px', marginTop: 16, flexDirection:'row', alignItems: isMobile ? 'center' : 'flex-end', gap: isMobile ? '10px' : '0' }}>
          <div style={{ flex: 1, textAlign: 'left' }}>
                <div>Save Changes</div>
                <div style={styles.fieldDescription}>Update Your Settings</div>
              </div>
          <button 
            style={{
              ...styles.saveButton, 
              backgroundColor: '#222', 
              border: '1px solid #cedf9f',
              width: isMobile ? '50%' : 'auto'
            }}
            onClick={handleSaveSettings}
          >
            Save Settings
          </button>
        </div>
        <div style={dividerStyle} />
        {/* Data Section */}
        <div style={styles.dataSection}>
          <h3 style={styles.sectionTitle}>Data & Cache</h3>
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: isMobile ? '12px' : '15px',
            marginBottom: '15px',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '15px',flexDirection: 'row', gap: isMobile ? '10px' : '0'}}>
              <div style={{ flex: 1, textAlign: 'left' }}>
                <div>Delete Data</div>
                <div style={styles.fieldDescription}>Delete your collected data permanently</div>
              </div>
              <button 
                style={styles.deleteButton}
                onClick={handleDeleteData}
              >
                Delete Data
              </button>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '15px',flexDirection: 'row', gap: isMobile ? '10px' : '0' }}>
              <div style={{ flex: 1, textAlign: 'left' }}>
                <div>Delete Skin Type Data</div>
                <div style={styles.fieldDescription}>Delete your skin type data permanently</div>
              </div>
              <button 
                style={styles.deleteButton}
                onClick={handleDeleteSkinData}
              >
                Delete Skin Type Data
              </button>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '15px',flexDirection:'row', gap: isMobile ? '10px' : '0' }}>
              <div style={{ flex: 1, textAlign: 'left' }}>
                <div>Delete Account</div>
                <div style={styles.fieldDescription}>Delete your account permanently</div>
              </div>
              <button 
                style={styles.deleteButton}
                onClick={handleDeleteAccount}
              >
                Delete Account
              </button>
            </div>
          </div>
        </div>
        {/* <div style={dividerStyle} /> */}
        {/* Logout Button at the end of the page */}
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <button 
            style={styles.logoutButton}
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;