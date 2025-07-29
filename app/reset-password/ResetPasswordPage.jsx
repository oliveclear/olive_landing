"use client";
import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { FaEye, FaEyeSlash } from "react-icons/fa";

export default function ResetPasswordPage() {
  const [password, setPassword] = useState("");
  const [confrmpass, setConfrmpass] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfrmpass, setShowConfrmpass] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const email = searchParams.get("email");

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
      const res = await fetch(`${process.env.NEXT_PUBLIC_URL_HOST}/reset-password?token=${token}&email=${email}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ password, confrmpass })
        }
      );
      const data = await res.json();
      if (res.ok) {
        setMessage(data.message || "Password changed successfully.");
        setTimeout(() => router.replace("/login"), 2500);
      } else {
        setMessage(data.message || "Error resetting password.");
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
      <h2 style={{ fontSize: isMobile ? "2rem" : "2.5rem", fontWeight: "bold", marginBottom: 30, color: "#CEDF9F" }}>Reset Password</h2>
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
          <label htmlFor="password" style={{ display: "block", marginBottom: 8, fontWeight: "bold", color: "#CEDF9F", fontSize: isMobile ? "1rem" : "1.2rem" }}>New Password</label>
          <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              minLength={8}
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
            <span
              style={{
                position: "absolute",
                right: "12px",
                top: "40%",
                transform: "translateY(-50%)",
                cursor: "pointer",
                color: "#999",
                fontSize: "18px",
                zIndex: 2,
                userSelect: "none",
                transition: "background 0.2s"
                }}
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>
          <label htmlFor="confrmpass" style={{ display: "block", marginBottom: 8, fontWeight: "bold", color: "#CEDF9F", fontSize: isMobile ? "1rem" : "1.2rem" }}>Confirm Password</label>
          <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
            <input
              id="confrmpass"
              type={showConfrmpass ? "text" : "password"}
              value={confrmpass}
              onChange={e => setConfrmpass(e.target.value)}
              required
              minLength={8}
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
            <span
              style={{
                position: "absolute",
                right: "12px",
                top: "40%",
                transform: "translateY(-50%)",
                cursor: "pointer",
                color: "#999",
                fontSize: "18px",
                zIndex: 2,
                userSelect: "none",
                transition: "background 0.2s"
              }}
              onClick={() => setShowConfrmpass(!showConfrmpass)}
            >
              {showConfrmpass ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>
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
            {loading ? "Changing..." : "Change Password"}
          </button>
        </form>
        {message && (
          <div style={{ marginTop: 20, color: message.includes("successfully") ? "#CEDF9F" : "#ff4d4f", textAlign: "center", fontSize: isMobile ? "1rem" : "1.1rem" }}>
            {message}
          </div>
        )}
      </div>
    </div>
  );
}
