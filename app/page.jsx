"use client";

import React, { useState, useEffect } from "react";

import Layout from "./layout";

import Footer from "./Footer/page";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie"; // Import js-cookie
import Dashboard from "./Landing/Dashboard/page";
import HeroSection from "./components/HeroSection";
const Page = () => {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(null); // Initial state is null to avoid flickering
  const [isCheckingQuiz, setIsCheckingQuiz] = useState(false);

  useEffect(() => {
    // Function to check login status and quiz completion
    const checkLoginStatus = async () => {
      const token = Cookies.get("token");
      if (token) {
        setIsLoggedIn(true);
        console.log("User is logged in, checking quiz status");
        
        // Check if user needs to complete initial quiz
        await checkQuizStatus(token);
      } else {
        setIsLoggedIn(false);
      }
    };

    checkLoginStatus();

    // Listen for page visibility changes (e.g., after logout/login in another tab)
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        checkLoginStatus();
      }
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [router]); // Runs only when the router changes

  const checkQuizStatus = async (token) => {
    try {
      setIsCheckingQuiz(true);
      const response = await fetch(`${process.env.NEXT_PUBLIC_URL_HOST}/quiz/status`, {
        credentials: 'include',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.status === 401) {
        // Token is invalid, redirect to login
        Cookies.remove("token");
        setIsLoggedIn(false);
        return;
      }

      const data = await response.json();
      
      // If quiz is not completed, redirect to initial quiz
      if (!data.data?.quizCompleted) {
        router.replace("/InitialQuiz");
        return;
      }
    } catch (error) {
      console.error("Error checking quiz status:", error);
      // If there's an error checking quiz status, allow them to proceed
      // but they might need to take the quiz later
    } finally {
      setIsCheckingQuiz(false);
    }
  };

  if (isLoggedIn === null || isCheckingQuiz) return null; // Prevent rendering until authentication and quiz status are checked

  return (
    <>
      {isLoggedIn ? (
        <Layout style={styles.container}>
          <Dashboard />
        </Layout>
      ) : (
        <div style={styles.container1}>
          <HeroSection />
        </div>
      )}
    </>
  );
};

const styles = {
  container: {
    // height: "100vh",
    overflowY: "unset",
    // backgroundColor: "#000000",
  },
  container1: {
    // height: "100vh",
    overflowY: "unset",
    
  },
  // @media  (max-width: "768px"): {
  //     container1: {
  //       // height: "100vh",
  //   }
};

export default Page;