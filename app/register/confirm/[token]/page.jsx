"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

export default function ConfirmRegistration() {
  const router = useRouter();
  const params = useParams();
  const token = params?.token;
  const [message, setMessage] = useState("Verifying your account...");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (!token) return;

    async function verifyToken() {
      try {
        console.log("Trying to send confirmation request...");
        setMessage("Verifying your account...");
        const res = await fetch(`${process.env.NEXT_PUBLIC_URL_HOST}/register/confirm/${token}`);
        const data = await res.json();
        if (res.ok) {
          setMessage("Account confirmed! Redirecting to login...");
          setSuccess(true);
          setTimeout(() => router.replace("/login"), 2500);
        } else {
            console.log
          setMessage("Confirmation failed. Please try again.");
        }
      } catch (err) {
        setMessage("Server error. Please try again later.");
      }
    }

    verifyToken();
  }, [token, router]);

  return (
    <div style={{
      textAlign: "center",
      marginTop: "80px",
      color: success ? "#CEDF9F" : "#ff4d4f",
      fontSize: "1.2rem"
    }}>
      {message}
      {success && <div style={{ marginTop: "20px" }}>Redirecting to login page...</div>}
    </div>
  );
}
