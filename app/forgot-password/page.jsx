"use client";
import { useState, useEffect } from "react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 430);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_URL_HOST}/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email })
      });
      const data = await res.json();
      if (res.ok) {
        setMessage(data.message || "Password reset link sent to your email.");
      } else {
        setMessage(data.message || "Error sending password reset link.");
      }
    } catch (err) {
      setMessage("Server error. Please try again later.");
    }
    setLoading(false);
  }

  return (
    <div style={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      height: "100vh",
      backgroundColor: "#1a1a1a",
      color: "white"
    }}>
      <h2 style={{ fontSize: isMobile ? "2rem" : "2.5rem", fontWeight: "bold", marginBottom: 30, color: "#CEDF9F" }}>Forgot Password</h2>
      <div style={{
        width: isMobile ? 320 : 384,
        padding: isMobile ? 24 : 40,
        borderRadius: 20,
        background: "rgba(255,255,255,0.1)",
        backdropFilter: "blur(10px)",
        textAlign: "center",
        border: "1px solid rgba(255,255,255,0.3)",
        margin: "auto"
      }}>
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 15 }}>
          <label htmlFor="email" style={{ display: "block", marginBottom: 8, fontWeight: "bold", color: "#CEDF9F", fontSize: isMobile ? "1rem" : "1.2rem" }}>Email Address</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            style={{
              width: "100%",
              padding: isMobile ? 10 : 12,
              marginBottom: 16,
              borderRadius: 8,
              border: "1px solid #CEDF9F",
              background: "rgba(255,255,255,0.2)",
              backdropFilter: "blur(8px)",
              color: "#fff",
              fontWeight: 600,
              fontSize: isMobile ? "1rem" : "1.1rem"
            }}
          />
          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              padding: isMobile ? 10 : 12,
              background: "#333",
              color: "#CEDF9F",
              fontWeight: "bold",
              border: "2px solid #CEDF9F",
              borderRadius: 10,
              cursor: loading ? "not-allowed" : "pointer",
              fontSize: isMobile ? "1rem" : "1.1rem"
            }}
          >
            {loading ? "Sending..." : "Send Reset Link"}
          </button>
        </form>
        {message && (
          <div style={{ marginTop: 20, color: message.includes("sent") ? "#CEDF9F" : "#ff4d4f", textAlign: "center", fontSize: isMobile ? "1rem" : "1.1rem" }}>
            {message}
          </div>
        )}
      </div>
    </div>
  );
}
