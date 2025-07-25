"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    username: "",
    phone: "",
    email: "",
    password: "",
    cnfrm_password: "",
  });

  const [isWideScreen, setIsWideScreen] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    const checkScreen = () => {
      setIsWideScreen(window.innerWidth >= 640);
    };
    checkScreen();
    window.addEventListener("resize", checkScreen);
    return () => window.removeEventListener("resize", checkScreen);
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    
    if (formData.password !== formData.cnfrm_password) {
      setError("Passwords do not match.");
      return;
    }

    // Basic validation
    if (!formData.name || !formData.username || !formData.phone || !formData.email || !formData.password) {
      setError("All fields are required.");
      return;
    }

    setIsLoading(true);
    
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_URL_HOST}/register`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "ngrok-skip-browser-warning": "true"
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (response.ok) {
        alert("Registration successful! Please login.");
        // Optionally redirect to login page
        window.location.href = "/login";
      } else {
        setError(result.message || "Registration failed. Please try again.");
      }
    } catch (error) {
      setError("An unexpected error occurred. Please try again.");
      console.error("Error during registration:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const styles = {
    container: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      backgroundColor: '#171717',
      color: 'white',
      padding: '16px 14px',
      position: 'relative',
    },
    header: {
      position: 'absolute',
      top: 24,
      left: 24,
    },
    title: {
      fontSize: '2rem',
      fontWeight: 800,
      letterSpacing: '-0.05em',
      textAlign: 'center',
      margin: 0,
      marginBottom: '8px',
    },
    card: {
      width: '100%',
      maxWidth: 448,
      height: 'auto',
      borderRadius: '1.5rem',
      border: '4px solid rgba(156,163,175,0.4)',
      background: 'rgba(255,255,255,0.20)',
      backdropFilter: 'blur(8px)',
      padding: '16px',
      marginTop: '24px',
    },
    form: {
      display: 'grid',
      gap: '16px',
      gridTemplateColumns: '1fr',
    },
    form2col: {
      gridTemplateColumns: '1fr 1fr',
      gap: '24px',
    },
    label: {
      fontSize: '1rem',
      fontWeight: 600,
      marginBottom: '4px',
    },
    input: {
      width: '100%',
      padding: '12px',
      marginTop: '8px',
      borderRadius: '0.75rem',
      background: '#23272b',
      border: '1px solid #4b5563',
      color: 'white',
      fontSize: '1rem',
      outline: 'none',
      boxSizing: 'border-box',
    },
    passwordInputContainer: {
      position: 'relative',
      display: 'flex',
      alignItems: 'center',
    },
    eyeIcon: {
      position: 'absolute',
      right: '12px',
      top: '50%',
      transform: 'translateY(-50%)',
      cursor: 'pointer',
      color: '#999',
      fontSize: '18px',
      zIndex: 1,
      userSelect: 'none',
    },
    button: {
      padding: '12px 24px',
      background: '#23272b',
      color: '#CEDF9F',
      fontWeight: 600,
      borderRadius: '1rem',
      border: '2px solid #CEDF9F',
      fontSize: '1rem',
      width: '100%',
      cursor: 'pointer',
    },
    buttonDisabled: {
      padding: '12px 24px',
      background: '#444',
      color: '#888',
      fontWeight: 600,
      borderRadius: '1rem',
      border: '2px solid #888',
      fontSize: '1rem',
      width: '100%',
      cursor: 'not-allowed',
    },
    error: {
      color: '#ff6b6b',
      fontSize: '0.875rem',
      marginTop: '8px',
      textAlign: 'center',
      padding: '8px',
      backgroundColor: 'rgba(255, 107, 107, 0.1)',
      borderRadius: '0.5rem',
      border: '1px solid rgba(255, 107, 107, 0.3)',
    },
    loginText: {
      marginTop: '16px',
      textAlign: 'center',
      fontSize: '1rem',
    },
    loginLink: {
      color: '#CEDF9F',
      textDecoration: 'underline',
      cursor: 'pointer',
    },
  };

  const formStyle = isWideScreen
    ? { ...styles.form, ...styles.form2col }
    : styles.form;

  const buttonWrapperStyle = {
    gridColumn: isWideScreen ? 'span 2' : 'span 1',
    display: 'flex',
    justifyContent: 'center',
  };

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h1 style={{ fontSize: '1.25rem', fontWeight: 700 }}>OliveClear</h1>
      </header>
      <h2 style={styles.title}>Register</h2>
      <div style={styles.card}>
        <form style={formStyle} onSubmit={handleSubmit}>
          {[
            { label: "Name", name: "name", type: "text" },
            { label: "Username", name: "username", type: "text" },
            { label: "Phone Number", name: "phone", type: "tel" },
            { label: "Email", name: "email", type: "email" },
          ].map(({ label, name, type }) => (
            <div key={name} style={{ display: 'flex', flexDirection: 'column' }}>
              <label style={styles.label} htmlFor={name}>{label}</label>
              <input
                type={type}
                id={name}
                name={name}
                placeholder={`Enter your ${label.toLowerCase()}`}
                style={styles.input}
                value={formData[name]}
                onChange={handleChange}
              />
            </div>
          ))}
          
          {/* Password field with toggle */}
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <label style={styles.label} htmlFor="password">Password</label>
            <div style={styles.passwordInputContainer}>
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                placeholder="Enter your password"
                style={{ ...styles.input, paddingRight: '45px' }}
                value={formData.password}
                onChange={handleChange}
              />
              <span
                style={styles.eyeIcon}
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>
          </div>

          {/* Confirm Password field with toggle */}
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <label style={styles.label} htmlFor="cnfrm_password">Confirm Password</label>
            <div style={styles.passwordInputContainer}>
              <input
                type={showConfirmPassword ? "text" : "password"}
                id="cnfrm_password"
                name="cnfrm_password"
                placeholder="Enter your confirm password"
                style={{ ...styles.input, paddingRight: '45px' }}
                value={formData.cnfrm_password}
                onChange={handleChange}
              />
              <span
                style={styles.eyeIcon}
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>
          </div>
          <div style={buttonWrapperStyle}>
            <button 
              type="submit" 
              style={isLoading ? styles.buttonDisabled : styles.button}
              disabled={isLoading}
            >
              {isLoading ? 'Registering...' : 'Register'}
            </button>
          </div>
          {error && <div style={styles.error}>{error}</div>}
        </form>
        <p style={styles.loginText}>
          Already a user? <Link href="/login" style={styles.loginLink}>Login</Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
