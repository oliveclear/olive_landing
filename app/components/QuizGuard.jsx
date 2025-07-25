"use client";
import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Cookies from "js-cookie";

export default function QuizGuard({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const [isLoading, setIsLoading] = useState(true);
  const [requiresQuiz, setRequiresQuiz] = useState(false);

  // Pages that don't require quiz completion
  const exemptPages = [
    '/login',
    '/register',
    '/InitialQuiz',
    '/forgot-password'
  ];

  useEffect(() => {
    checkQuizStatus();
  }, [pathname]);

  const checkQuizStatus = async () => {
    const token = Cookies.get("token");
    
    // If no token or on exempt page, don't check quiz status
    if (!token || exemptPages.some(page => pathname.startsWith(page))) {
      setIsLoading(false);
      return;
    }

    try {
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
        router.replace('/login');
        return;
      }

      if (response.ok) {
        const data = await response.json();
        if (data.data?.requiresQuiz) {
          setRequiresQuiz(true);
          router.replace('/InitialQuiz');
          return;
        }
      }
    } catch (error) {
      console.error("Error checking quiz status:", error);
      // Don't block user if there's an error checking quiz status
    }

    setIsLoading(false);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-lg">Loading...</div>
      </div>
    );
  }

  if (requiresQuiz && !exemptPages.some(page => pathname.startsWith(page))) {
    return null; // Router redirect is handling navigation
  }

  return children;
}
