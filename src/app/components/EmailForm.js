"use client";

import { useState } from "react";

export default function EmailForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("");

  const sendEmail = async (e) => {
    e.preventDefault();

    const res = await fetch("/api/sendEmail", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    });

    const data = await res.json();
    const message = data.message;
    console.log(message);

    if (res.ok) {
      if (
        message === "You are already subscribed to the Olive Clear newsletter!"
      ) {
        setStatus("You are already subscribed to the Olive Clear newsletter!"); // Set success message
      } else {
        setStatus("Thanks for Signing Up");
      }
    } else {
      setStatus(`Failed to Sign Up: ${data.error}`);
    }
  };

  return (
    <div
      className="flex flex-col justify-between min-h-screen bg-cover bg-center text-white space-y-6 p-4"
      style={{
        backgroundImage: "url('/pixelcut-export.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Top centered text for OLIVE */}
      <h1 className="hero-brand text-center">OLIVE</h1>

      {/* Centered main text */}
      <div className="flex flex-col justify-center items-center space-y-4">
        <h2 className="text-mid text-center">
          <span className="unbounded-text">complete solution to all</span>
          <br />
          <span className="allura-text">your skin needs</span>
        </h2>

        {/* Conditionally render the form or thank you message */}
        {status === "Thanks for Signing Up" || status === "You are already subscribed to the Olive Clear newsletter!" ?(
          <p className="text-green-500">{status}</p>
        ) : (
          <form onSubmit={sendEmail} className="email-signup-form">
            <input
              type="email"
              placeholder="Sign up for our latest updates"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="email-input"
            />
            <button type="submit" className="signup-button">
              SIGN UP
            </button>
          </form>
        )}
      </div>

      <p
        className="copy-right text-center text-sm"
        style={{ fontSize: "14px" }}
      >
        Copyright &copy; {new Date().getFullYear()} OLIVE. All rights reserved.
      </p>
      {/* Embedded CSS styles */}
      <style jsx>{`
        @import url("https://fonts.googleapis.com/css2?family=Bruno+Ace+SC&display=swap");
        @import url("https://fonts.googleapis.com/css2?family=Unbounded:wght@200..900&display=swap");
        @import url("https://fonts.googleapis.com/css2?family=Allura&display=swap");
        @import url("https://fonts.googleapis.com/css2?family=Outfit:wght@100..900&display=swap");

        /* General text styling */
        .hero-brand {
          font-size: 30px;
          font-family: "Bruno Ace SC", sans-serif;
        }

        .text-mid {
          padding-left: 16rem;
          padding-right: 16rem;
          line-height: 0.7; /* Adjust line height for merging effect */
        }

        /* Unbounded font for first part of the text */
        .unbounded-text {
          font-family: "Unbounded", sans-serif;
          font-weight: 700;
          font-size: 76px;
          text-shadow: 0 0 10px rgba(255, 255, 255, 0.7),
            0 0 20px rgba(255, 255, 255, 0.5); /* Glowing effect */
        }

        /* Allura font for the rest of the text */
        .allura-text {
          font-family: "Allura", cursive;
          font-size: 101px; /* Adjust size to match the first part */
          font-weight: 300;
          text-shadow: 0 0 10px rgba(255, 255, 255, 0.7),
            0 0 20px rgba(255, 255, 255, 0.5); /* Glowing effect */
        }

        .email-signup-form {
          margin-top: 2.5rem !important;
          display: flex;
          flex-direction: row;
          align-items: center;
          background-color: #404f3a; /* Dark green background */
          border-radius: 9999px; /* Fully rounded corners */
          width: fit-content;
        }

        /* Style for the input field */
        .email-input {
          padding-left: 20px;
          flex: 1;
          width: 750px;
          padding: 1.5rem;
          background-color: #1e2413;
          outline: none;
          transition: box-shadow 0.3s;

          border-radius: 27px;
          border: 4px solid #404f3a;
          background: #1e2413;
          font-size: 21.89px;
          font-style: normal;
          font-weight: 400;
          line-height: normal;
        }

        /* Input placeholder style */
        .email-input::placeholder {
          font-family: "Outfit", sans-serif;
          color: #d1d5db; /* Light gray for placeholder text */
        }

        /* Input focus state */
        .email-input:focus {
          box-shadow: 0 0 5px rgba(129, 199, 132, 0.5); /* Shadow effect on focus */
        }

        /* Style for the submit button */
        .signup-button {
          background-color: #404f3a;
          padding: 1rem 2rem;
          border: none;
          border-radius: 27px;
          cursor: pointer;
          transition: background-color 0.3s;
          color: rgba(235, 235, 235, 0.9);
          font-family: "Outfit", sans-serif;
          font-size: 25.03px;
          font-weight: 700;
          line-height: normal;
        }

        /* Status message styling */
        .text-green-500 {
          font-family: "Outfit", sans-serif;
          color: #b2bbaf; /* Green color for success messages */
          font-weight: bold; /* Bold text for emphasis */
        }

        .copy-right {
          font-family: "Outfit", sans-serif;
          font-size: 24px;
          color: #b2bbaf;
        }

        /* Media Queries */
        @media (max-width: 1024px) {
          .text-mid {
            padding-left: 8rem;
            padding-right: 8rem;
            font-size: 3rem;
          }

          .unbounded-text {
            font-size: 64px;
          }

          .allura-text {
            font-size: 88px;
          }

          .email-input {
            width: 600px;
            font-size: 18px;
          }

          .signup-button {
            font-size: 22px;
          }
        }

        @media (max-width: 768px) {
          .text-mid {
            padding-left: 4rem;
            padding-right: 4rem;
            font-size: 2.5rem;
          }

          .unbounded-text {
            font-size: 48px;
          }

          .allura-text {
            font-size: 70px;
            transform: rotate(-5.482deg);
          }

          .email-signup-form {
            margin-top: 37px !important;
            display: flex;
            flex-direction: column;
            align-items: center;
            background-color: transparent;
            gap: 9px;
          }

          .email-input {
            width: 450px;
            font-size: 16px;
          }

          .signup-button {
            font-size: 20px;
            border-radius: 9px;
            background: #1e2413;
          }
        }

        @media (max-width: 480px) {
          .hero-brand {
            font-size: 24px;
          }

          .text-mid {
            padding-left: 2rem;
            padding-right: 2rem;
            font-size: 1.8rem;
          }

          .unbounded-text {
            font-size: 36px;
          }

          .allura-text {
            font-size: 50px;
            transform: rotate(-5.482deg);
            margin-top: 8px;
            display: inline-block;
          }
          .email-signup-form {
            margin-top: 37px !important;
            display: flex;
            flex-direction: column;
            align-items: center;
            background-color: transparent;
            gap: 9px;
          }

          .email-input {
            width: 320px;
            font-size: 14px;
          }

          .signup-button {
            font-size: 18px;
            background: #1e2413;
          }
        }
      `}</style>
    </div>
  );
}
