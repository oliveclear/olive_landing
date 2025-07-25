// "use client";

// import React, { useState, useEffect } from "react";
// import { useRouter } from "next/navigation";
// import Cookies from "js-cookie";
// import { FaEye, FaEyeSlash } from "react-icons/fa";
// const token = Cookies.get("token");

// const LoginPage = () => {
//   const [loginField, setLoginField] = useState("");
//   const [password, setPassword] = useState("");
//   const [error, setError] = useState("");
//   const [showPassword, setShowPassword] = useState(false);
//   const router = useRouter();

//   const [isScreen, setIsScreen] = useState(false);
//   const [isMobile, setIsMobile] = useState(false);

//   // Redirect if token exists
//   useEffect(() => {
//     if (Cookies.get("token")) {
//       router.replace("/");
//     }
//   }, [router]);

//   useEffect(() => {
//     const handleResize = () => {
//       setIsScreen(window.innerWidth <= 768);
//       setIsMobile(window.innerWidth <= 430);
//     };

//     handleResize();
//     window.addEventListener("resize", handleResize);
//     return () => window.removeEventListener("resize", handleResize);
//   }, []);

//   const handleLogin = async (e) => {
//     e.preventDefault();
//     setError("");

//     try {
//       const response = await fetch(
//         `${process.env.NEXT_PUBLIC_URL_HOST}/login`,
//         {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify({ loginField, password }),
//         }
//       );

//       const result = await response.json();

//       if (response.ok) {
//         Cookies.set("token", result.token, { expires: 7 });
        
//         // Check if user needs to complete the initial quiz
//         if (result.requiresQuiz && result.userType === 'user') {
//           router.replace("/InitialQuiz");
//         } else {
//           router.replace("/");
//         }
//       } else {
//         setError(result.message || "Login failed, please try again.");
//       }
//     } catch (error) {
//       setError("An unexpected error occurred. Please try again.");
//       console.error("Error during login:", error);
//     }
//   };

//   const styles = {
//     container: {
//       display: "flex",
//       flexDirection: "column",
//       alignItems: "center",
//       justifyContent: "center",
//       height: "100vh",
//       backgroundColor: "#1a1a1a",
//       color: "white",
//     },
//     header: {
//       position: "absolute",
//       top: "20px",
//       left: "20px",
//       fontSize: "2rem",
//       fontWeight: "bold",
//     },
//     title: {
//       fontSize: "3rem",
//       fontWeight: "bold",
//       marginBottom: "30px",
//     },
//     formContainer: {
//       width: isMobile ? "320px" : "384px",
//       padding: "40px",
//       borderRadius: "20px",
//       background: "rgba(255, 255, 255, 0.1)",
//       backdropFilter: "blur(10px)",
//       textAlign: "center",
//       border: "1px solid rgba(255, 255, 255, 0.3)",
//     },
//     form: {
//       display: "flex",
//       flexDirection: "column",
//       gap: "15px",
//     },
//     inputGroup: {
//       display: "flex",
//       flexDirection: "column",
//       textAlign: "left",
//       position: "relative",
//     },
//     passwordInputContainer: {
//       position: "relative",
//       display: "flex",
//       alignItems: "center",
//     },
//     passwordInput: {
//       flex: 1,
//       padding: "12px",
//       borderRadius: "8px",
//       border: "1px solid gray",
//       background: "rgba(255, 255, 255, 0.2)",
//       backdropFilter: "blur(8px)",
//       color: "#fff", // Set password input text color to white
//       fontWeight: 600, // Match the username label style
//       paddingRight: "1px",
//     },
//     eyeIcon: {
//       position: "absolute",
//       right: "12px",
//       top: "50%",
//       transform: "translateY(-50%)",
//       cursor: "pointer",
//       color: "#999",
//       fontSize: "18px",
//       zIndex: 2,
//       userSelect: "none",
//       transition: "background 0.2s"
//     },
//     label: {
//       fontSize: "1.2rem",
//       fontWeight: "bold",
//       marginBottom: "5px",
//     },
//     input: {
//       padding: "12px",
//       borderRadius: "8px",
//       border: "1px solid gray",
//       background: "rgba(255, 255, 255, 0.2)",
//       backdropFilter: "blur(8px)",
//       color: "#fff", // Set input text color to white for better contrast
//       fontWeight: 600, // Match the username label style
//     },
//     forgotLink: {
//       fontSize: "0.9rem",
//       color: "lightgray",
//       marginTop: "5px",
//       textDecoration: "none",
//     },
//     errorText: {
//       color: "red",
//       textAlign: "center",
//     },
//     button: {
//       padding: "12px",
//       background: "#333",
//       color: "#CEDF9F",
//       fontWeight: "bold",
//       border: "2px solid #CEDF9F",
//       borderRadius: "10px",
//       cursor: "pointer",
//     },
//     registerText: {
//       fontSize: "0.9rem",
//       marginTop: "10px",
//     },
//     registerLink: {
//       color: "#CEDF9F",
//       textDecoration: "none",
//     },
//   };

//   return (
//     <div style={styles.container}>
//       <header style={styles.header}>OliveClear</header>
//       <h2 style={styles.title}>Login</h2>
//       <div style={styles.formContainer}>
//         <form style={styles.form} onSubmit={handleLogin}>
//           <div style={styles.inputGroup}>
//             <label htmlFor="loginField" style={styles.label}>
//               Username / Email / Phone
//             </label>
//             <input
//               type="text"
//               id="loginField"
//               name="loginField"
//               placeholder="Enter your username / email / phone"
//               style={styles.input}
//               value={loginField}
//               onChange={(e) => setLoginField(e.target.value)}
//             />
//           </div>

//           <div style={styles.inputGroup}>
//             <label htmlFor="password" style={styles.label}>
//               Password
//             </label>
//             <div style={styles.passwordInputContainer}>
//               <input
//                 type={showPassword ? "text" : "password"}
//                 id="password"
//                 name="password"
//                 placeholder="Enter your password"
//                 style={styles.passwordInput}
//                 value={password}
//                 onChange={(e) => setPassword(e.target.value)}
//               />
//               <span
//                 style={styles.eyeIcon}
//                 onClick={() => setShowPassword(!showPassword)}
//               >
//                 {showPassword ? <FaEyeSlash /> : <FaEye />}
//               </span>
//             </div>
//             <a href="#" style={styles.forgotLink} onClick={e => { e.preventDefault(); router.push("/forgot-password"); }}>
//               Forgot?
//             </a>
//           </div>

//           {error && <p style={styles.errorText}>{error}</p>}

//           <button type="submit" style={styles.button}>Login</button>

//           <p style={styles.registerText}>
//             New Here,{" "}
//             <a href="/register" style={styles.registerLink}>Register Now</a>
//           </p>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default LoginPage;
