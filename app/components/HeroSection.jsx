// "use client";
// import { motion, useScroll, useTransform } from "framer-motion";
// import { useEffect, useRef, useState } from "react";
// import Image from "next/image";
// import { useRouter } from 'next/navigation';
// import Lenis from "@studio-freight/lenis";
// import 'lenis/dist/lenis.css'

// export const useLenisScrollY = () => {
//   const scrollY = useMotionValue(0);

//   useEffect(() => {
//     const lenis = new Lenis({ 
//       smooth: true,
//       lerp: 0.1, 
//     });

//     const raf = (time) => {
//       lenis.raf(time);
//       requestAnimationFrame(raf);
//     };

//     requestAnimationFrame(raf);

//     lenis.on('scroll', ({ scroll }) => {
//       scrollY.set(scroll); // updates instantly
//     });

//     return () => lenis.destroy();
//   }, []);

//   return scrollY;
// };


// function useVerticalToHorizontalScroll(containerRef, scrollRef) {




//   useEffect(() => {
//     const container = containerRef.current;
//     const scrollEl = scrollRef.current;
//     if (!container || !scrollEl) return;

//     let isScrolling = false;
//     let isInView = false;

//     const observer = new IntersectionObserver(
//       ([entry]) => {
//         isInView = entry.isIntersecting && entry.intersectionRatio >= 0.9;
//       },
//       {
//         root: null,
//         threshold: [0.9], // trigger when 90% visible
//       }
//     );
//     observer.observe(container);

//     const onWheel = (e) => {
//       if (!isInView || !scrollEl) return;

//       const delta = e.deltaY;
//       const maxScrollLeft = scrollEl.scrollWidth - scrollEl.clientWidth;
//       const atStart = scrollEl.scrollLeft <= 0;
//       const atEnd = scrollEl.scrollLeft >= maxScrollLeft;

//       const shouldScrollHorizontally =
//         (delta > 0 && !atEnd) || (delta < 0 && !atStart);

//       if (!shouldScrollHorizontally) return;

//       e.preventDefault();

//       const scrollAmount = delta * 0.5;

//       if (!isScrolling) {
//         isScrolling = true;
//         window.requestAnimationFrame(() => {
//           scrollEl.scrollBy({
//             left: scrollAmount,
//             behavior: "smooth",
//           });
//           isScrolling = false;
//         });
//       }
//     };

//     container.addEventListener("wheel", onWheel, { passive: false });

//     return () => {
//       observer.disconnect();
//       container.removeEventListener("wheel", onWheel);
//     };
//   }, [containerRef, scrollRef]);
// }

// // Card Component
// function Card({ color, firstHeading, secondHeading, description, imageUrl, imageAlt }) {
//   return (
//     <div 
//       className="w-[75vw] rounded-xl sm:rounded-[1.5rem] lg:rounded-[2.5rem] overflow-hidden flex flex-col shadow-lg"
//       style={{ backgroundColor: color,
//         maxWidth: '430px',
//         minHeight: '500px',
//        }}
//     >
//       <div className="flex-1 px-4 sm:px-4 lg:px-10 pt-10 pb-3 sm:pb-4 lg:pb-6 flex flex-col justify-start text-left">
//         <h1 className="text-[5vw] sm:text-[4vw] md:text-[3vw] lg:text-[32px] font-medium mb-0 font-[Outfit,sans-serif] leading-[0.9]" style={{ color: '#2f2f2f' }}>
//           {firstHeading}
//         </h1>
//         <h1 className="text-[5vw] sm:text-[4vw] md:text-[3vw] lg:text-[32px] font-semibold mb-1 font-[Outfit,sans-serif] leading-[0.9]" style={{ color: '#2f2f2f' }}>
//           {secondHeading}
//         </h1>
//          <p className="text-base font-normal font-[Outfit,sans-serif] pt-3 leading-[1.3]" style={{ color: '#2f2f2f' }}>
//           {description}
//         </p>
//       </div>
//       <div className="flex-shrink-0 px-6 sm:px-8 lg:px-10 flex justify-center items-center overflow-hidden">
//         <Image
//           src={imageUrl}
//           alt={imageAlt || "Card image"}
//           width={300}
//           height={140}
//           className="mx-auto"
//         />
//       </div>
//     </div>
//   );
// }



// export default function HeroSection() {
//   const containerRef = useRef(null);
//   const sectionRef = useRef(null);
//   const secondSectionRef = useRef(null);
//   const horizontalScrollRef = useRef(null);
//   const thirdSectionRef = useRef(null);
//   const fourthSectionRef = useRef(null);
//   const router = useRouter();
//   // Main scroll progress for the entire container
//   const { scrollYProgress } = useScroll({
//     target: containerRef,
//     offset: ["start start", "end end"],
//   });

//   // Section 1 scroll progress (hero section)
//   const { scrollYProgress: section1Progress } = useScroll({
//     target: sectionRef,
//     offset: ["start start", "end start"],
//   });

//   const [showMockup, setShowMockup] = useState(false);
//   const [initialY, setInitialY] = useState(500);

//   useEffect(() => {
//     if (typeof window !== "undefined") {
//       setInitialY(window.innerHeight - 250);
//     }
//   }, []);

//   // Show mockup only after text has stayed for 2s
//   useEffect(() => {
//     const t = setTimeout(() => setShowMockup(true), 2800);
//     return () => clearTimeout(t);
//   }, []);

//   const [liftText, setLiftText] = useState(false);
//   useEffect(() => {
//     const t = setTimeout(() => setLiftText(true), 2000);
//     return () => clearTimeout(t);
//   }, []);

//   // Section 1 animations
//   const textOpacity = useTransform(section1Progress, [0, 0.1, 0.2], [1, 0.4, 0]);
//   const mockupY = useTransform(section1Progress, [0, 0.2], [initialY, 0]);
//   const pcScale = useTransform(section1Progress, [0.2, 0.6], [1, 0.9]);
//   const pcX = useTransform(section1Progress, [0.3, 0.5], ["0%", "-15%"]);
//   const mobileX = useTransform(section1Progress, [0.3, 0.5], ["80%", "30%"]);
//   const mobileScale = useTransform(section1Progress, [0.3, 0.5], [1, 0.9]);

//   // Section 2 overlap animation - starts overlapping from bottom
//   const overlayY = useTransform(scrollYProgress, [0.6, 0.7], ["100%", "0%"]);
//   const overlayOpacity = useTransform(scrollYProgress, [0.6, 0.7], [0, 1]);
//   const thirdSectionY = useTransform(scrollYProgress, [0.75, 0.8], ["100%", "0%"]);
//   const thirdSectionOpacity = useTransform(scrollYProgress, [0.5, 0.7], [0, 1]);
//   const fourthSectionY = useTransform(scrollYProgress, [0.8, 1], ["100%", "0%"]);
// const fourthSectionOpacity = useTransform(scrollYProgress, [0.7, 1], [0, 1]);

//   // Navbar color adaptation
//   const navbarBg = useTransform(scrollYProgress, [0.7, 1], ["rgba(0,0,0,0)", "rgba(0,0,0,0)"]);
//   const navbarTextColor = useTransform(scrollYProgress, [0.7, 1], ["#ffffff", "#ffffff"]);
//   const navbarBorderColor = useTransform(scrollYProgress, [0.7, 1], ["rgba(255,255,255,0.3)", "rgba(255,255,255,0.3)"]);

//   useVerticalToHorizontalScroll(secondSectionRef, horizontalScrollRef);


// const scrollToContact = () => {
//   // Since your fourth section becomes visible at 80% scroll progress
//   // and you have h-[900vh], calculate the exact position
//   const viewportHeight = window.innerHeight;
//   const totalScrollHeight = viewportHeight * 10; // 900vh = 9 * viewport height
//   const targetScroll = totalScrollHeight * 0.82; // 82% to ensure smooth entry
  
//   window.scrollTo({
//     top: targetScroll,
//     behavior: 'smooth'
//   });
// };



//   // Add custom styles for better mobile scrolling
//   useEffect(() => {
//     const style = document.createElement('style');
//     style.textContent = `
//       .scrollbar-hide {
//         -ms-overflow-style: none;
//         scrollbar-width: none;
//       }
//       .scrollbar-hide::-webkit-scrollbar {
//         display: none;
//       }
//       @media (max-width: 640px) {
//         .scrollbar-hide {
//           scroll-snap-type: x mandatory;
//           scroll-behavior: smooth;
//         }
//       }
//     `;
//     document.head.appendChild(style);
//     return () => document.head.removeChild(style);
//   }, []);

//   return (

//     <div ref={containerRef} className="relative">
//       {/* Section 1 - Hero Section (Frozen when overlap starts) */}
//       <div ref={sectionRef} className="h-[900vh] bg-black text-white relative">
//         <div className="sticky top-0 h-screen overflow-hidden">
//           {/* Center Text */}
//           <motion.div
//             initial={{ y: "100%", opacity: 0 }}
//             animate={{
//               y: liftText ? "-25vh" : "0vh",
//               opacity: 1,
//             }}
//             transition={{
//               delay: 0.5,
//               duration: 1,
//               ease: "easeInOut",
//             }}
//             style={{ 
//               opacity: textOpacity 
//             }}
//             className="absolute bottom-24 w-full flex flex-col items-center justify-center text-center z-10 mt-[100px] sm:mt-0"
//           >
//             <motion.h1
//               initial={{ y: 30, opacity: 0 }}
//               animate={{ y: 0, opacity: 1 }}
//               transition={{
//                 delay: 0.8,
//                 duration: 0.6,
//                 ease: "easeOut",
//               }}
//               className="font-light"
//               style={{
//                 fontSize: typeof window !== "undefined" && window.innerWidth < 640 ? "70px" : "140px",
//                 color: "#818181",
//                 lineHeight: 1,
//                 letterSpacing: "-0.04em",
//                 textAlign: "center",
//                 width: "100%",
//                 wordBreak: "break-word",
//               }}
//             >
//               unfolding skincare
//             </motion.h1>

//             <motion.h2
//               initial={{ y: 40, opacity: 0 }}
//               animate={{ y: 0, opacity: 1 }}
//               transition={{
//                 delay: 0.9,
//                 duration: 0.6,
//                 ease: "easeOut",
//               }}
//               className="font-bold mt-2"
//               style={{
//                 fontSize: typeof window !== "undefined" && window.innerWidth < 640 ? "70px" : "140px",
//                 color: "#ffffff",
//                 lineHeight: 1,
//                 letterSpacing: "-0.04em",
//                 textAlign: "center",
//                 width: "100%",
//                 wordBreak: "break-word",
//               }}
//             >
//               layer by layer
//             </motion.h2>
//           </motion.div>

//           {/* Mockup */}
//           {showMockup && (
//             <>
//               {typeof window !== "undefined" && window.innerWidth < 640 ? (
//                 // Mobile: Only mobile mockup, from bottom, centered
//                 <motion.div
//                   style={{
//                     opacity: 1,
//                     y: mockupY,
//                     scale: mobileScale,
//                   }}
//                   transition={{ duration: 0.7, ease: "easeOut" }}
//                   className="absolute bottom-0 w-full flex justify-center items-end z-0"
//                 >
//                   <img
//                     src="/assets/Mobile_Mockup.png"
//                     alt="Mobile Mockup"
//                     className="h-[90vh] w-auto object-cover rounded-xl shadow-xl mx-auto"
//                   />
//                 </motion.div>
//               ) : (
//                 <>
//                   {/* Desktop: PC mockup from below */}
//                   <motion.div
//                     initial={{ y: "100%" }}
//                     animate={{ y: `${initialY}px` }}
//                     style={{
//                       y: mockupY,
//                       scale: pcScale,
//                       x: pcX
//                     }}
//                     transition={{ duration: 0.7, ease: "easeOut" }}
//                     className="absolute bottom-0 w-full flex justify-center items-end z-0"
//                   >
//                     <img
//                       src="/assets/Pc_Mockup.png"
//                       alt="PC Mockup"
//                       className="h-[90vh] w-auto object-cover rounded-xl shadow-xl"
//                     />
//                   </motion.div>
//                   {/* Desktop: Mobile mockup from right */}
//                   <motion.div
//                     style={{
//                       x: mobileX,
//                       opacity: 1,
//                       y: mockupY,
//                       scale: mobileScale,
//                     }}
//                     transition={{ duration: 0.7, ease: "easeOut" }}
//                     className="absolute bottom-0 w-full flex justify-center items-end z-0"
//                   >
//                     <img
//                       src="/assets/Mobile_Mockup.png"
//                       alt="Mobile Mockup"
//                       className="h-[90vh] w-auto object-cover rounded-xl shadow-xl ml-8"
//                     />
//                   </motion.div>
//                 </>
//               )}
//             </>
//           )}
//         </div>
      

//       {/* Section 2 - Overlap Section */}
    
//         <motion.div
//         ref={secondSectionRef}
//           style={{
//             y: overlayY,
//             opacity: overlayOpacity,
//           }}
//           className="sticky h-screen top-0 left-0 w-full bg-black text-white z-40 overflow-hidden flex flex-col items-center justify-center pt-10"
//         >
//           {/* Heading */}
//           <div className="text-center mb-8 sm:mb-12 px-4 pt-3">
//             <h1 className="text-[4vw] sm:text-[3vw] md:text-[5vw] font-light text-gray-400 leading-none">what we bring to</h1>
//             <h2 className="text-[4vw] sm:text-[3vw] md:text-[5vw] font-light text-white leading-none">the table!</h2>
//           </div>

//           {/* Horizontal Scroll Section */}
//           <div
//             ref={horizontalScrollRef}
//             className="flex gap-4 sm:gap-6 lg:gap-8 overflow-x-scroll overflow-y-hidden scrollbar-hide snap-x snap-mandatory px-4 sm:px-6 lg:px-8 py-4 w-full"
//             style={{ paddingTop: '2rem', paddingBottom: '2rem' }}
//           >
//             <div className="flex gap-4 sm:gap-6 lg:gap-8 h-full w-max items-center">
//               {[
//                 {
//                   color: "#BDC5D3",
//                   first: "personalized",
//                   second: "dashboard",
//                   desc: "you get a special corner that’s all about you, with  everything you need for your skin...",
//                   img: "/assets/Dashboard_Mockup.png",
//                 },
//                 {
//                   color: "#D0DFCA",
//                   first: "detailed",
//                   second: "face scan",
//                   desc: "get a smart scan that looks at every angle of your face & tells you exactly what’s your skin type...",
//                   img: "/assets/Ai_Face_Mockup.png",
//                 },
//                 {
//                   color: "#DCBC77",
//                   first: "effortlessly",
//                   second: "track your progress",
//                   desc: "clear view that shows how your skin improves over time & helps you track your progress...",
//                   img: "/assets/Dashboard_Mockup.png",
//                 },
//                 {
//                   color: "#e59494",
//                   first: "track your",
//                   second: "period cycle",
//                   desc: "smart tracker that helps you follow your period cycle and understand its impact on your skin....",
//                   img: "/assets/Dashboard_Mockup.png",
//                 },
//                 {
//                   color: "#C7ABCE",
//                   first: "still confused",
//                   second: "ask olivia",
//                   desc: "olivia — your AI skincare buddy, trained on your face to give truly personalized advice....",
//                   img: "/assets/Dashboard_Mockup.png",
//                 },
                
//               ].map((card, i) => (
//                 <div key={i} className="snap-center flex-shrink-0">
//                   <Card
//                     color={card.color}
//                     firstHeading={card.first}
//                     secondHeading={card.second}
//                     description={card.desc}
//                     imageUrl={card.img}
//                   />
//                 </div>
//               ))}
//             </div>
//           </div>
//         </motion.div>

// {/* Section 3 Get Started Button */}
// <motion.div
//   ref={thirdSectionRef}
//   style={{
//     y: thirdSectionY,
//     opacity: thirdSectionOpacity,
//   }}
//   className="sticky h-screen top-0 w-full bg-[#000] text-white z-50 flex flex-col items-center justify-center px-6 sm:px-12 lg:px-24 text-center"
// >
//   <div className="max-w-3xl">
//     <h1 className="text-[6vw] sm:text-[4vw] md:text-[3vw] font-semibold leading-tight mb-4">
//       your skin deserves better
//     </h1>
//     <p className="text-base sm:text-lg text-gray-400 mb-8">
//       start your personalized skincare journey with AI-powered recommendations, face analysis, and progress tracking — all in one place.
//     </p>
//     <button
//      onClick={() => router.push('/coming-soon')}
//      className="text-black px-6 py-3 rounded-full text-lg font-semibold transition-colors duration-300" style={{ backgroundColor: '#CEDF9F'}}>
//       get started
//     </button>
//   </div>
// </motion.div>

// <motion.div
//   ref={fourthSectionRef}
//   style={{
//     y: fourthSectionY,
//     opacity: fourthSectionOpacity,
//   }}
//   className="sticky h-screen top-0 left-0 w-full bg-black text-white z-50 overflow-hidden flex flex-col items-center justify-start pt-10 px-6"
// >
//   {/* Heading */}
//   <div className="text-center mb-8 sm:mb-12 px-4 pt-10">
//     <h1 className="text-[4vw] sm:text-[3vw] md:text-[5vw] font-light text-gray-400 leading-none">
//       get in touch
//     </h1>
//     <h2 className="text-[4vw] sm:text-[3vw] md:text-[5vw] font-light text-white leading-none">
//       cause olive cares
//     </h2>
//   </div>

//   {/* Card Container */}

// <div className="w-full max-w-6xl flex flex-col lg:flex-row gap-6 justify-between">
//   {/* Contact Info Card - always first (above on mobile, left on desktop) */}
//   <div className="flex-1 bg-[#1a1a1a] rounded-2xl p-8" style={{ maxHeight : "500px" }}>
//     <h1 className="text-[6vw] sm:text-[4vw] md:text-[2.5vw] font-normal leading-[0.8] text-white">looking to</h1>
//     <h1 className="text-[6vw] sm:text-[4vw] md:text-[2.5vw] font-normal mb-6 leading-[0.8] text-white">connect with us?</h1>
//     <div className="flex flex-col gap-6">
//       {/* Contact number - same size as form fields */}
//       <div className="bg-[#1d1d1d]/90 text-white p-4 pt-4 rounded-full w-full text-normal font-medium  border border-white ">
//         contact number: +91 89205 76770
//       </div>
//       {/* Email - same size as form fields */}
//       <a 
//         href="mailto:support@amscay.com"
//         className="bg-[#1d1d1d]/90 text-white p-4 pt-4 rounded-full w-full text-normal font-medium border border-white block hover:bg-[#2d2d2d]/90 transition-colors cursor-pointer"
//       >
//         email: support@amscay.com
//       </a>
//       {/* Social links box - same size as message field */}
//       <div 
//         className="bg-[#1d1d1d]/90 border border-white p-4 pt-4 rounded-3xl w-full"
//         style={{ minHeight: 'unset', height: 'auto' }}
//       >
//         <p className="text-normal text-white-700 mb-2">socials links:</p>
//         <div
//           className="flex gap-3 flex-nowrap overflow-x-auto pb-2 px-2"
//           style={{
//             flexWrap: 'nowrap',
//             overflowX: 'auto',
//             WebkitOverflowScrolling: 'touch',
//           }}
//         >
//           <a href="https://instagram.com/oliveclear" target="_blank" rel="noopener noreferrer" className="flex-shrink-0 pl-2">
//             <Image 
//               src="/assets/OliveClear_Insta.png" 
//               alt="Instagram" 
//               width={100} 
//               height={100} 
//               className="w-20 h-20 sm:w-12 sm:h-12 object-contain hover:scale-110 transition-transform"
//             />
//           </a>
//           <a href="https://twitter.com/oliveclear" target="_blank" rel="noopener noreferrer" className="flex-shrink-0 pl-2">
//             <Image 
//               src="/assets/Olive_Twitter.png" 
//               alt="Twitter/X" 
//               width={100} 
//               height={100} 
//               className="w-20 h-20 sm:w-12 sm:h-12 object-contain hover:scale-110 transition-transform"
//             />
//           </a>
//           <a href="https://discord.gg/oliveclear" target="_blank" rel="noopener noreferrer" className="flex-shrink-0 pl-2">
//             <Image 
//               src="/assets/Olive_dis.png" 
//               alt="Discord" 
//               width={100} 
//               height={100} 
//               className="w-20 h-20 sm:w-12 sm:h-12 object-contain hover:scale-110 transition-transform"
//             />
//           </a>
//           <a href="https://linkedin.com/company/oliveclear" target="_blank" rel="noopener noreferrer" className="flex-shrink-0 pl-2">
//             <Image 
//               src="/assets/Olive_lkd.png" 
//               alt="LinkedIn" 
//               width={100} 
//               height={100} 
//               className="w-20 h-20 sm:w-12 sm:h-12 object-contain hover:scale-110 transition-transform"
//             />
//           </a>
//         </div>
//       </div>
//     </div>
//   </div>
//   {/* Form Card - always second (below on mobile, right on desktop) */}
//   <div className="flex-1 bg-[#c7abce] rounded-2xl p-8 max-h-[70vh] overflow-y-auto lg:max-h-none">
//     <h1 className="text-[6vw] sm:text-[4vw] md:text-[2.5vw] font-normal text-[#2f2f2f] leading-[0.8]">have any query</h1>
//     <h1 className="text-[6vw] sm:text-[4vw] md:text-[2.5vw] font-semibold text-[#2f2f2f] mb-6 leading-[0.8]">drop us a message</h1>
//     <form 
//       className="flex flex-col gap-6 text-black"
//       onSubmit={async (e) => {
//         e.preventDefault();
//         const formData = new FormData(e.target);
//         const data = {
//           name: formData.get('name'),
//           email: formData.get('email'),
//           message: formData.get('message')
//         };
//         try {
//           const response = await fetch(`${process.env.NEXT_PUBLIC_URL_HOST}/contact`, {
//             method: 'POST',
//             headers: {
//               'Content-Type': 'application/json',
//               'Accept': 'application/json',
//             },
//             body: JSON.stringify(data),
//           });
//           const responseText = await response.text();
//           console.log(responseText);
//           if (response.ok) {
//             alert('Message sent successfully!');
//             e.target.reset();
//           } else {
//             try {
//               const errorData = JSON.parse(responseText);
//               alert(`Failed to send message: ${errorData.message || 'Please try again.'}`);
//             } catch (parseError) {
//               alert(`Failed to send message: ${responseText || 'Please try again.'}`);
//             }
//           }
//         } catch (error) {
//           console.error('Network error:', error);
//           alert(`Failed to send message: ${error.message || 'Network error occurred.'}`);
//         }
//       }}
//     >
//       {/* Floating Input Fields */}
//       {[
//         { label: 'name',  type: 'text' },
//         { label: 'email',  type: 'email' },
//       ].map((field, idx) => (
//         <div key={idx} className="relative">
//           <input
//             name={field.label}
//             type={field.type}
//             required
//             className="peer w-full p-4 pt-4 bg-[#c7abce]/90 text-[#4F3356]-800 placeholder-transparent border border-[#8B6F92] rounded-full focus:outline-none focus:ring-0"
//             placeholder={field.label}
//           />
//           <label className="absolute left-4 top-1 text-sm text-[#4F3356]-800 transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-placeholder-shown:text-[#4F3356]-500 peer-focus:top-2 peer-focus:text-sm peer-focus:text-black-500">
//             {field.label}
//           </label>
//         </div>
//       ))}
//       {/* Message */}
//       <div className="relative">
//         <textarea
//           name="message"
//           rows={5}
//           required
//           placeholder="message..."
//           className="peer w-full p-4 pt-4 pr-16 bg-[#c7abce]/90 text-[#4F3356]-800 border border-[#8B6F92] placeholder-transparent rounded-3xl focus:outline-none focus:ring-0 resize-none"
//         />
//         <label className="absolute left-6 top-1 text-sm text-[#4F3356]-800 transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-placeholder-shown:text-[#4F3356]-500 peer-focus:top-2 peer-focus:text-sm peer-focus:text-black-500">
//           message
//         </label>
//         {/* Submit Button */}
//         <button
//           type="submit"
//           className="absolute bottom-3 right-2 bg-black text-white p-2 rounded-full hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
//           title="Send message"
//         >
//           <svg 
//             width="16" 
//             height="16" 
//             viewBox="0 0 24 24" 
//             fill="none" 
//             xmlns="http://www.w3.org/2000/svg"
//           >
//             <path 
//               d="M22 2L11 13M22 2L15 22L11 13M22 2L2 9L11 13" 
//               stroke="currentColor" 
//               strokeWidth="2" 
//               strokeLinecap="round" 
//               strokeLinejoin="round"
//             />
//           </svg>
//         </button>
//       </div>
//     </form>
//   </div>
// </div>



// </motion.div>


// </div>
//       {/* Adaptive Navbar - Always visible and adapts to background */}
//       <motion.div
//         initial={{ y: -100, opacity: 0 }}
//         animate={{ y: 0, opacity: 1 }}
//         transition={{ delay: 0.4, duration: 0.6 }}
//         style={{
//           backgroundColor: navbarBg,
//           backdropFilter: "blur(10px)",
//         }}
//         className="fixed top-0 left-0 right-0 z-[70] transition-all duration-300"
//       >
//         <div className="flex justify-between items-center px-8 py-4">
//           {/* Logo */}
//           <motion.div style={{ filter: "drop-shadow(0 2px 8px rgba(0,0,0,0.1))" }}>
//             <img
//               src="/assets/Oliveclear-logo.png"
//               alt="OliveClear Logo"
//               className="h-8 w-auto"
//             />
//           </motion.div>

//           {/* Nav Buttons */}
//           <motion.div className="flex gap-4">
//            <motion.button
//   onClick={scrollToContact}
//   style={{
//     color: navbarTextColor,
//     borderColor: navbarBorderColor,
//   }}
//   className="border px-4 py-1 rounded-full transition-all duration-300 hover:bg-opacity-10 hover:bg-gray-500 cursor-pointer"
// >
//   get in touch
// </motion.button>
          
//             {/* <button 
//             onClick={() => router.push('/login')}
//             className="text-black px-4 py-1 rounded-full hover:bg-lime-400 transition-colors" style={{ backgroundColor: '#cedf9f' }}>
//               login
//             </button> */}
//           </motion.div>
//         </div>
//       </motion.div>
//     </div>
  

//   );
// }


"use client";
import { motion, useScroll, useTransform, useMotionValue } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useRouter } from 'next/navigation';
import Lenis from "@studio-freight/lenis";
import 'lenis/dist/lenis.css'
function MiniCard({ color, first, second, img, desc }) {
  return (
    <div
      className="flex flex-col justify-between rounded-2xl pt-4 pl-4 pr-4 w-[160px] h-[200px]"
      style={{ backgroundColor: color }}
    >
      <div>
        <div className="text-base font-semibold text-[#2f2f2f]">{first}</div>
        <div className="text-lg font-bold text-[#2f2f2f] leading-[0.8]">{second}</div>
        {desc && (
          <div className="text-[8px] text-[#2f2f2f] text-left mt-1 line-clamp-3">
            {desc}
          </div>
        )}
      </div>
      <div className="w-[90px] h-[90px] self-center relative">
        <Image
          src={img}
          alt={first}
          fill
          className="object-contain"
        />
      </div>
    </div>
  );
}

function HorizontalCard({
  heading1 = "effortlessly",
  heading2 = "track your progress",
  desc = "clear view that shows how your skin improves over time & helps you track your progress...",
  img = "/assets/Dashboard_Mockup.png",
}) {
  return (
    <div className="w-full bg-[#DCBC77] rounded-xl flex flex-row sm:flex-row items-center justify-between pt-4 px-4 my-2">
      {/* Text Section */}
      <div className="flex-1 flex flex-col items-start justify-center text-left pb-4 ">
        <h1 className="text-lg sm:text-2xl font-semibold text-black leading-tight">{heading1}</h1>
        <h2 className="text-lg sm:text-2xl font-bold text-black leading-tight">{heading2}</h2>
        <p className="text-xs sm:text-base text-[#2f2f2f] mt-2">{desc}</p>
      </div>
      {/* Image Section */}
      <div className="flex items-end justify-center h-full mt-4 sm:mt-0 sm:ml-6">
        <Image
          src={img}
          alt={heading1}
          width={100}
          height={100}
          className="object-contain rounded-lg"
        />
      </div>
    </div>
  );
}

function useIsMobile(breakpoint = 640) {
  const [isMobile, setIsMobile] = useState(
    typeof window !== "undefined" ? window.innerWidth < breakpoint : false
  );

  useEffect(() => {
    function handleResize() {
      setIsMobile(window.innerWidth < breakpoint);
    }
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [breakpoint]);

  return isMobile;
}


// Properly implemented Lenis hook
export const useLenisScrollY = () => {
  const scrollY = useMotionValue(0);
  const lenisRef = useRef(null);

  useEffect(() => {
    // Initialize Lenis with optimal settings
    const lenis = new Lenis({
      duration: 1.2, // Smooth duration
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Custom easing
      direction: 'vertical',
      gestureDirection: 'vertical',
      smooth: true,
      mouseMultiplier: 1,
      smoothTouch: false,
      touchMultiplier: 2,
      infinite: false,
    });

    lenisRef.current = lenis;

    // Animation frame loop
    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    // Update motion value with Lenis scroll
    lenis.on('scroll', ({ scroll }) => {
      scrollY.set(scroll);
    });

    // Cleanup
    return () => {
      lenis.destroy();
    };
  }, [scrollY]);

  return { scrollY, lenis: lenisRef.current };
};

// Enhanced horizontal scroll hook with Lenis integration
function useVerticalToHorizontalScroll(containerRef, scrollRef) {
  useEffect(() => {
    const container = containerRef.current;
    const scrollEl = scrollRef.current;
    if (!container || !scrollEl) return;

    let isScrolling = false;
    let isInView = false;

    const observer = new IntersectionObserver(
      ([entry]) => {
        isInView = entry.isIntersecting && entry.intersectionRatio >= 0.9;
      },
      {
        root: null,
        threshold: [0.9],
      }
    );
    observer.observe(container);

    const onWheel = (e) => {
      if (!isInView || !scrollEl) return;

      const delta = e.deltaY;
      const maxScrollLeft = scrollEl.scrollWidth - scrollEl.clientWidth;
      const atStart = scrollEl.scrollLeft <= 0;
      const atEnd = scrollEl.scrollLeft >= maxScrollLeft;

      const shouldScrollHorizontally =
        (delta > 0 && !atEnd) || (delta < 0 && !atStart);

      if (!shouldScrollHorizontally) return;

      e.preventDefault();

      // Smoother scroll amount calculation
      const scrollAmount = delta * 0.8;

      if (!isScrolling) {
        isScrolling = true;
        
        // Use requestAnimationFrame for smoother animation
        const smoothScroll = () => {
          scrollEl.scrollBy({
            left: scrollAmount,
            behavior: "auto", // Changed from smooth to auto for better control
          });
          isScrolling = false;
        };
        
        requestAnimationFrame(smoothScroll);
      }
    };

    // Use passive: false for better control
    container.addEventListener("wheel", onWheel, { passive: false });

    return () => {
      observer.disconnect();
      container.removeEventListener("wheel", onWheel);
    };
  }, [containerRef, scrollRef]);
}

// Card Component (unchanged)
function Card({ color, firstHeading, secondHeading, description, imageUrl, imageAlt }) {
  return (
    <div 
      className="w-[75vw] rounded-xl sm:rounded-[1.5rem] lg:rounded-[2.5rem] overflow-hidden flex flex-col shadow-lg"
      style={{ backgroundColor: color,
        maxWidth: '430px',
        minHeight: '500px',
       }}
    >
      <div className="flex-1 px-4 sm:px-4 lg:px-10 pt-10 pb-3 sm:pb-4 lg:pb-6 flex flex-col justify-start text-left">
        <h1 className="text-[5vw] sm:text-[4vw] md:text-[3vw] lg:text-[32px] font-medium mb-0 font-[Outfit,sans-serif] leading-[0.9]" style={{ color: '#2f2f2f' }}>
          {firstHeading}
        </h1>
        <h1 className="text-[5vw] sm:text-[4vw] md:text-[3vw] lg:text-[32px] font-semibold mb-1 font-[Outfit,sans-serif] leading-[0.9]" style={{ color: '#2f2f2f' }}>
          {secondHeading}
        </h1>
         <p className="text-base font-normal font-[Outfit,sans-serif] pt-3 leading-[1.3]" style={{ color: '#2f2f2f' }}>
          {description}
        </p>
      </div>
      <div className="flex-shrink-0 px-6 sm:px-8 lg:px-10 flex justify-center items-center overflow-hidden">
        <Image
          src={imageUrl}
          alt={imageAlt || "Card image"}
          width={300}
          height={140}
          className="mx-auto"
        />
      </div>
    </div>
  );
}

export default function HeroSection() {
  const containerRef = useRef(null);
  const sectionRef = useRef(null);
  const secondSectionRef = useRef(null);
  const horizontalScrollRef = useRef(null);
  const thirdSectionRef = useRef(null);
  const fourthSectionRef = useRef(null);
  const router = useRouter();
const isMobile = useIsMobile(); 
  // Use Lenis scroll instead of regular useScroll
  const { scrollY } = useLenisScrollY();

  // Create scroll progress values based on Lenis scroll
  const scrollYProgress = useTransform(scrollY, [0, 9000], [0, 1]); // Adjust based on your total height
  const section1Progress = useTransform(scrollY, [0, 2500], [0, 1]); // Adjust for section 1

  const [showMockup, setShowMockup] = useState(false);
  const [initialY, setInitialY] = useState(500);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setInitialY(window.innerHeight - 250);
    }
  }, []);

  // Show mockup only after text has stayed for 2s
  useEffect(() => {
    const t = setTimeout(() => setShowMockup(true), 2800);
    return () => clearTimeout(t);
  }, []);

  const [liftText, setLiftText] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setLiftText(true), 2000);
    return () => clearTimeout(t);
  }, []);

  // Section 1 animations - now using Lenis scroll values
  const textOpacity = useTransform(section1Progress, [0, 0.1, 0.2], [1, 0.4, 0]);
  const mockupY = useTransform(section1Progress, isMobile?[0, 0.2]:[0, 0.2], [initialY, 0]);
  const pcScale = useTransform(section1Progress, [0.2, 0.5], [1, 0.9]);
  const pcX = useTransform(section1Progress, [0.2, 0.3], ["0%", "-15%"]);
  const mobileX = useTransform(section1Progress, [0.3, 0.5], ["80%", "30%"]);
  // Animate mobileScale from 0.7 to 1 for a more dynamic effect
  const mobileScale = useTransform(section1Progress, isMobile?[0, 0.2]:[0, 0.3], [0.7, 0.9]);

  // Section animations with Lenis scroll
  const overlayY = useTransform(scrollYProgress, isMobile?[0.05, 0.15]:[0.15, 0.25], ["100%", "0%"]);
  const overlayOpacity = useTransform(scrollYProgress, isMobile?[0.05, 0.15]:[0.15, 0.25], [0, 1]);
  const thirdSectionY = useTransform(scrollYProgress, isMobile?[0.15, 0.25]:[0.35, 0.45], ["100%", "0%"]);
  const thirdSectionOpacity = useTransform(scrollYProgress, isMobile?[0.15, 0.25]:[0.35, 0.45], [0, 1]);
  const fourthSectionY = useTransform(scrollYProgress,  isMobile?[0.25, 0.35]:[0.45, 0.55], ["100%", "0%"]);
  const fourthSectionOpacity = useTransform(scrollYProgress,  isMobile?[0.25, 0.35]:[0.45, 0.55], [0, 1]);

  // Navbar adaptations
  const navbarBg = useTransform(scrollYProgress, [0.7, 1], ["rgba(0,0,0,0)", "rgba(0,0,0,0)"]);
  const navbarTextColor = useTransform(scrollYProgress, [0.7, 1], ["#ffffff", "#ffffff"]);
  const navbarBorderColor = useTransform(scrollYProgress, [0.7, 1], ["rgba(255,255,255,0.3)", "rgba(255,255,255,0.3)"]);

  useVerticalToHorizontalScroll(secondSectionRef, horizontalScrollRef);

  const scrollToContact = () => {
    const viewportHeight = window.innerHeight;
    const totalScrollHeight = viewportHeight * 10;
    const targetScroll = totalScrollHeight * 0.82;
    
    // Use Lenis scrollTo for smooth scroll
    if (window.lenis) {
      window.lenis.scrollTo(targetScroll);
    } else {
      window.scrollTo({
        top: targetScroll,
        behavior: 'smooth'
      });
    }
  };

  // Enhanced scroll styles for better performance
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      .scrollbar-hide {
        -ms-overflow-style: none;
        scrollbar-width: none;
      }
      .scrollbar-hide::-webkit-scrollbar {
        display: none;
      }
      
      /* Enhanced smooth scrolling for horizontal sections */
      .horizontal-scroll {
        scroll-behavior: smooth;
        -webkit-overflow-scrolling: touch;
      }
      
      @media (max-width: 640px) {
        .scrollbar-hide {
          scroll-snap-type: x mandatory;
          scroll-behavior: smooth;
        }
      }
      
      /* Optimize GPU acceleration */
      .motion-element {
        will-change: transform;
        transform: translateZ(0);
      }
    `;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  return (
    <div ref={containerRef} className="relative">
      {/* Section 1 - Hero Section */}
      <div ref={sectionRef} className=" h-[600vh] 
    sm:h-[800vh] 
    md:h-[800vh] 
    lg:h-[800vh] 
    xl:h-[800vh]
    bg-black text-white relative">
        <div className="sticky top-0 h-screen overflow-hidden">
          {/* Center Text */}
          <motion.div
            initial={{ y: "100%", opacity: 0 }}
            animate={{
              y: liftText ? (isMobile ? "-10vh" : "-25vh") : "0vh",
              opacity: 1,
            }}
            transition={{
              delay: 0.5,
              duration: 1,
              ease: "easeInOut",
            }}
            style={{ 
              opacity: textOpacity 
            }}
            className={`absolute ${isMobile ? 'bottom-32 ' : 'bottom-28 mt-[100px]'} w-full flex flex-col items-center justify-center text-center z-10 sm:mt-0 motion-element`}
          >
            <motion.h1
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{
                delay: 0.8,
                duration: 0.6,
                ease: "easeOut",
              }}
              className="font-light"
              style={{
                fontSize: typeof window !== "undefined" && window.innerWidth < 640 ? "70px" : "140px",
                color: "#818181",
                lineHeight: 1,
                letterSpacing: "-0.04em",
                textAlign: "center",
                width: "100%",
                wordBreak: "break-word",
              }}
            >
              unfolding skincare
            </motion.h1>

            <motion.h2
              initial={{ y: 40, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{
                delay: 0.9,
                duration: 0.6,
                ease: "easeOut",
              }}
              className="font-bold mt-2"
              style={{
                fontSize: typeof window !== "undefined" && window.innerWidth < 640 ? "70px" : "140px",
                color: "#ffffff",
                lineHeight: 1,
                letterSpacing: "-0.04em",
                textAlign: "center",
                width: "100%",
                wordBreak: "break-word",
              }}
            >
              layer by layer
            </motion.h2>
          </motion.div>

          {/* Mockup */}
          {showMockup && (
            <>
              {typeof window !== "undefined" && window.innerWidth < 640 ? (
                              <motion.div
                    initial={{ y: "100%", opacity: 0 }}
                    animate={{ y: `${initialY}px`, opacity: 1 }}
                    transition={{ duration: 0.7, ease: "easeOut" }}
                    style={{
                      y: mockupY,
                      scale: mobileScale, // Keep scale dynamic if needed
                    }}
                    className="absolute bottom-0 w-full flex justify-center items-end z-0 motion-element"
                  >
                    <img
                      src="/assets/Mobile_Mockup.png"
                      alt="Mobile Mockup"
                      className="h-[90vh] w-auto object-cover rounded-xl shadow-xl mx-auto"
                    />
                  </motion.div>
              ) : (
                <>
                  <motion.div
                    initial={{ y: "100%" }}
                    animate={{ y: `${initialY}px` }}
                    style={{
                      y: mockupY,
                      scale: pcScale,
                      x: pcX
                    }}
                    transition={{ duration: 0.7, ease: "easeOut" }}
                    className="absolute bottom-0 w-full flex justify-center items-end z-0 motion-element"
                  >
                    <img
                      src="/assets/Pc_Mockup.png"
                      alt="PC Mockup"
                      className="h-[90vh] w-auto object-cover rounded-xl shadow-xl"
                    />
                  </motion.div>
                  <motion.div
                    style={{
                      x: mobileX,
                      opacity: 1,
                      y: mockupY,
                      scale: mobileScale,
                    }}
                    transition={{ duration: 0.7, ease: "easeOut" }}
                    className="absolute bottom-0 w-full flex justify-center items-end z-0 motion-element"
                  >
                    <img
                      src="/assets/Mobile_Mockup.png"
                      alt="Mobile Mockup"
                      className="h-[90vh] w-auto object-cover rounded-xl shadow-xl ml-8"
                    />
                  </motion.div>
                </>
              )}
            </>
          )}
        </div>

        {/* Section 2 - Overlap Section */}
        <motion.div
          ref={secondSectionRef}
          style={{
            y: overlayY,
            opacity: overlayOpacity,
          }}
          className="sticky h-screen top-0 left-0 w-full bg-black text-white z-40 overflow-hidden flex flex-col items-center justify-center md:pt-10 motion-element"
        >
          {/* Heading */}
          <div className="text-center mb-8 sm:mb-12 px-4 md:pt-3">
            <h1 className="text-[8vw] sm:text-[5vw] md:text-[5vw] font-light text-gray-400 leading-none">what we bring to</h1>
            <h2 className="text-[8vw] sm:text-[5vw] md:text-[5vw] font-light text-white leading-none">the table!</h2>
          </div>

          {/* Enhanced Horizontal Scroll Section */}

          {isMobile ? (
            <div className="w-full flex flex-col items-center ">
              <div className="grid grid-cols-2 gap-2 w-full max-w-xs mx-auto">
                <MiniCard
                  color="#BDC5D3"
                  first="personalized"
                  second="dashboard"
                  img="/assets/Dashboard_Mockup.png"
                  desc="you get a special corner that's all about you, with everything you need for your skin..."
                />
                <MiniCard
                  color="#D0DFCA"
                  first="detailed"
                  second="face scan"
                  img="/assets/Ai_Face_Mockup.png"
                  desc="get a smart scan that looks at every angle of your face & tells you exactly what's your skin type..."
                />
              </div>
              <div className="w-full max-w-xs mx-auto">
                <HorizontalCard
                  heading1="effortlessly"
                  heading2="track your progress"
                  desc="clear view that shows how your skin improves over time & helps you track your progress..."
                  img="/assets/Dashboard_Mockup.png"
                />
              </div>
              <div className="grid grid-cols-2 gap-2 w-full max-w-xs mx-auto">
                <MiniCard
                  color="#e59494"
                  first="track your"
                  second="period cycle"
                  img="/assets/Dashboard_Mockup.png"
                  desc="smart tracker that helps you follow your period cycle and understand its impact on your skin...."
                />
                <MiniCard
                  color="#C7ABCE"
                  first="still confused"
                  second="ask olivia"
                  img="/assets/Dashboard_Mockup.png"
                  desc="olivia — your AI skincare buddy, trained on your face to give truly personalized advice...."
                />
              </div>
            </div>
          ) : (
            <div
              ref={horizontalScrollRef}
              className="flex gap-4 sm:gap-6 lg:gap-8 overflow-x-auto overflow-y-hidden scrollbar-hide horizontal-scroll snap-x snap-mandatory px-4 sm:px-6 lg:px-8 py-4 w-full"
              style={{ paddingTop: '2rem', paddingBottom: '2rem', WebkitOverflowScrolling: 'touch' }}
            >
              <div
                className="flex gap-4 sm:gap-6 lg:gap-8 h-full items-center"
                style={{ minWidth: 'max-content', width: 'fit-content' }}
              >
                {[
                  {
                    color: "#BDC5D3",
                    first: "personalized",
                    second: "dashboard",
                    desc: "you get a special corner that's all about you, with  everything you need for your skin...",
                    img: "/assets/Dashboard_Mockup.png",
                  },
                  {
                    color: "#D0DFCA",
                    first: "detailed",
                    second: "face scan",
                    desc: "get a smart scan that looks at every angle of your face & tells you exactly what's your skin type...",
                    img: "/assets/Ai_Face_Mockup.png",
                  },
                  {
                    color: "#DCBC77",
                    first: "effortlessly",
                    second: "track your progress",
                    desc: "clear view that shows how your skin improves over time & helps you track your progress...",
                    img: "/assets/Dashboard_Mockup.png",
                  },
                  {
                    color: "#e59494",
                    first: "track your",
                    second: "period cycle",
                    desc: "smart tracker that helps you follow your period cycle and understand its impact on your skin....",
                    img: "/assets/Dashboard_Mockup.png",
                  },
                  {
                    color: "#C7ABCE",
                    first: "still confused",
                    second: "ask olivia",
                    desc: "olivia — your AI skincare buddy, trained on your face to give truly personalized advice....",
                    img: "/assets/Dashboard_Mockup.png",
                  },
                ].map((card, i) => (
                  <div key={i} className="snap-center flex-shrink-0">
                    <Card
                      color={card.color}
                      firstHeading={card.first}
                      secondHeading={card.second}
                      description={card.desc}
                      imageUrl={card.img}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
        </motion.div>

        {/* Section 3 Get Started Button */}
        <motion.div
          ref={thirdSectionRef}
          style={{
            y: thirdSectionY,
            opacity: thirdSectionOpacity,
          }}
          className="sticky h-screen top-0 w-full bg-[#000] text-white z-50 flex flex-col items-center justify-center px-6 sm:px-12 lg:px-24 text-center motion-element"
        >
          <div className="max-w-3xl">
            <h1 className="text-[8vw] sm:text-[4vw] md:text-[3vw] font-semibold leading-tight mb-4">
              your skin deserves better
            </h1>
            <p className="text-base sm:text-lg text-gray-400 mb-8">
              start your personalized skincare journey with AI-powered recommendations, face analysis, and progress tracking — all in one place.
            </p>
            <button
              onClick={() => router.push('/coming-soon')}
              className="text-black px-6 py-3 rounded-full text-lg font-semibold transition-colors duration-300" 
              style={{ backgroundColor: '#CEDF9F'}}
            >
              get started
            </button>
          </div>
        </motion.div>

        {/* Section 4 Contact */}
        <motion.div
          ref={fourthSectionRef}
          style={{
            y: fourthSectionY,
            opacity: fourthSectionOpacity,
          }}
          className="sticky h-screen top-0 left-0 w-full bg-black text-white z-50 overflow-hidden flex flex-col items-center justify-start pt-10 px-6 motion-element"
        >
          {/* Contact section content - keeping same as original */}
          <div className="text-center mb-8 sm:mb-12 px-4 pt-10">
            <h1 className="text-[7vw] sm:text-[3vw] md:text-[5vw] font-light text-gray-400 leading-none">
              get in touch
            </h1>
            <h2 className="text-[7vw] sm:text-[3vw] md:text-[5vw] font-light text-white leading-none">
              cause olive cares
            </h2>
          </div>

          <div className="w-full max-w-6xl flex flex-col-reverse lg:flex-row gap-4 md:gap-6 justify-between">
            {/* Contact Info Card */}
            <div
              className={`flex-1 bg-[#1a1a1a] rounded-2xl ${isMobile ? "py-2 px-4 max-h-[320px]" : "p-8 max-h-[500px]"}`}
            >
              <h1 className={`font-normal leading-[0.8] text-white ${isMobile ? "text-[6vw]" : "text-[5vw] sm:text-[4vw] md:text-[2.5vw]"}`}>looking to</h1>
              <h1 className={`font-normal mb-6 leading-[0.8] text-white ${isMobile ? "text-[6vw]" : "text-[5vw] sm:text-[4vw] md:text-[2.5vw]"}`}>connect with us?</h1>
              <div className="flex flex-col gap-4">
                <div className={`bg-[#1d1d1d]/90 text-white rounded-full w-full text-normal font-medium border border-white ${isMobile ? "text-xs p-2 pt-2" : "p-4 pt-4"}`}>
                  contact number: +91 89205 76770
                </div>
                <a
                  href="mailto:support@amscay.com"
                  className={`bg-[#1d1d1d]/90 text-white rounded-full w-full text-normal font-medium border border-white block hover:bg-[#2d2d2d]/90 transition-colors cursor-pointer ${isMobile ? "text-xs p-2 pt-2" : "p-4 pt-4"}`}
                >
                  email: support@amscay.com
                </a>
                <div
                  className={`bg-[#1d1d1d]/90 border border-white rounded-3xl w-full ${isMobile ? "text-xs p-2 pt-2" : "p-4 pt-4"}`}
                  style={{ minHeight: 'unset', height: 'auto' }}
                >
                  <p className="text-normal text-white-700 mb-2">socials links:</p>
                  <div
                    className={`flex gap-3 flex-nowrap pb-2 px-2 ${isMobile ? 'overflow-x-auto scrollbar-hide' : 'overflow-x-hidden'}`}
                    style={{
                      flexWrap: 'nowrap',
                      overflowX: 'auto',
                      WebkitOverflowScrolling: 'touch',
                    }}
                  >
                    <a href="https://instagram.com/olive.clear" target="_blank" rel="noopener noreferrer" className="flex-shrink-0 pl-1 md:pl-2">
                      <Image
                        src="/assets/OliveClear_Insta.png"
                        alt="Instagram"
                        width={isMobile ? 60 : 100}
                        height={isMobile ? 60 : 100}
                        className={isMobile ? "w-12 h-12 object-contain hover:scale-110 transition-transform" : "w-12 h-12 sm:w-12 sm:h-12 object-contain hover:scale-110 transition-transform"}
                      />
                    </a>
                    <a href="https://twitter.com/oliveclear" target="_blank" rel="noopener noreferrer" className="flex-shrink-0 pl-1 md:pl-2">
                      <Image
                        src="/assets/Olive_Twitter.png"
                        alt="Twitter/X"
                        width={isMobile ? 60 : 100}
                        height={isMobile ? 60 : 100}
                        className={isMobile ? "w-12 h-12 object-contain hover:scale-110 transition-transform" : "w-12 h-12 sm:w-12 sm:h-12 object-contain hover:scale-110 transition-transform"}
                      />
                    </a>
                    <a href="https://discord.gg/oliveclear" target="_blank" rel="noopener noreferrer" className="flex-shrink-0 pl-1 md:pl-2">
                      <Image
                        src="/assets/Olive_dis.png"
                        alt="Discord"
                        width={isMobile ? 60 : 100}
                        height={isMobile ? 60 : 100}
                        className={isMobile ? "w-12 h-12 object-contain hover:scale-110 transition-transform" : "w-12 h-12 sm:w-12 sm:h-12 object-contain hover:scale-110 transition-transform"}
                      />
                    </a>
                    <a href="https://linkedin.com/company/oliveclear" target="_blank" rel="noopener noreferrer" className="flex-shrink-0 pl-1 md:pl-2">
                      <Image
                        src="/assets/Olive_lkd.png"
                        alt="LinkedIn"
                        width={isMobile ? 60 : 100}
                        height={isMobile ? 60 : 100}
                        className={isMobile ? "w-12 h-12 object-contain hover:scale-110 transition-transform" : "w-12 h-12 sm:w-12 sm:h-12 object-contain hover:scale-110 transition-transform"}
                      />
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Form Card */}
            <div className={`flex-1 bg-[#c7abce] rounded-2xl ${isMobile ? "py-2 px-4 max-h-[50vh]" : "p-8 max-h-[90vh]"} overflow-y-visible sm:max-h-none`}>
              <h1 className={`font-normal text-[#2f2f2f] leading-[0.8] ${isMobile ? "text-[6vw]" : "text-[6vw] sm:text-[4vw] md:text-[2.5vw]"}`}>have any query</h1>
              <h1 className={`font-semibold mb-6 text-[#2f2f2f] leading-[0.8] ${isMobile ? "text-[6vw]" : "text-[6vw] sm:text-[4vw] md:text-[2.5vw]"}`}>drop us a message</h1>
              <form
                className="flex flex-col gap-4 text-black"
                onSubmit={async (e) => {
                  e.preventDefault();
                  const formData = new FormData(e.target);
                  const data = {
                    name: formData.get('name'),
                    email: formData.get('email'),
                    message: formData.get('message')
                  };
                  try {
                    const response = await fetch(`${process.env.NEXT_PUBLIC_URL_HOST}/contact`, {
                      method: 'POST',
                      headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json',
                      },
                      body: JSON.stringify(data),
                    });
                    const responseText = await response.text();
                    console.log(responseText);
                    if (response.ok) {
                      alert('Message sent successfully!');
                      e.target.reset();
                    } else {
                      try {
                        const errorData = JSON.parse(responseText);
                        alert(`Failed to send message: ${errorData.message || 'Please try again.'}`);
                      } catch (parseError) {
                        alert(`Failed to send message: ${responseText || 'Please try again.'}`);
                      }
                    }
                  } catch (error) {
                    console.error('Network error:', error);
                    alert(`Failed to send message: ${error.message || 'Network error occurred.'}`);
                  }
                }}
              >
                {[
                  { label: 'name',  type: 'text' },
                  { label: 'email',  type: 'email' },
                ].map((field, idx) => (
                  <div key={idx} className="relative">
                    <input
                      name={field.label}
                      type={field.type}
                      required
                      className={`peer w-full ${isMobile ? "p-2 pt-6 text-xs" : "p-4 pt-4"} bg-[#c7abce]/90 text-[#4F3356]-800 placeholder-transparent border border-[#8B6F92] rounded-full focus:outline-none focus:ring-0`}
                      placeholder={field.label}
                    />
                    <label className={`absolute left-4 ${isMobile ? "top-1 text-xs" : "top-1 text-sm"} text-[#4F3356]-800 transition-all ${isMobile ? "peer-placeholder-shown:top-1 peer-placeholder-shown:text-xs" : "peer-placeholder-shown:top-4 peer-placeholder-shown:text-base"} peer-placeholder-shown:text-[#4F3356]-500 peer-focus:top-1 peer-focus:text-sm peer-focus:text-black-500`}
                      style={isMobile ? {pointerEvents: 'none'} : {}}>
                      {field.label}
                    </label>
                  </div>
                ))}
                <div className="relative">
                  <textarea
                    name="message"
                    rows={isMobile ? 3 : 5}
                    required
                    placeholder="message..."
                    className={`peer w-full ${isMobile ? "p-2 pt-7 pr-8 text-xs" : "p-4 pt-4 pr-16"} bg-[#c7abce]/90 text-[#4F3356]-800 border border-[#8B6F92] placeholder-transparent rounded-3xl focus:outline-none focus:ring-0 resize-none`}
                  />
                  <label className={`absolute left-4 ${isMobile ? "top-1 text-xs" : "top-1 text-sm"} text-[#4F3356]-800 transition-all ${isMobile ? "peer-placeholder-shown:top-1 peer-placeholder-shown:text-xs" : "peer-placeholder-shown:top-5 peer-placeholder-shown:text-base"} peer-placeholder-shown:text-[#4F3356]-500 peer-focus:top-1 peer-focus:text-sm peer-focus:text-black-500`}
                    style={isMobile ? {pointerEvents: 'none'} : {}}>
                    message
                  </label>
                  <button
                    type="submit"
                    className={`absolute bottom-3 right-2 bg-black text-white rounded-full hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${isMobile ? "p-1" : "p-2"}`}
                    title="Send message"
                  >
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M22 2L11 13M22 2L15 22L11 13M22 2L2 9L11 13"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </button>
                </div>
              </form>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Adaptive Navbar */}
      <motion.div
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.6 }}
        style={{
          backgroundColor: navbarBg,
          backdropFilter: "blur(10px)",
        }}
        className="fixed top-0 left-0 right-0 z-[70] transition-all duration-300"
      >
        <div className="flex justify-between items-center px-8 py-4">
          <motion.div style={{ filter: "drop-shadow(0 2px 8px rgba(0,0,0,0.1))" }}>
            <img
              src="/assets/Oliveclear-logo.png"
              alt="OliveClear Logo"
              className="h-8 w-auto"
            />
          </motion.div>

          <motion.div className="flex gap-4">
            <motion.button
              onClick={scrollToContact}
              style={{
                color: navbarTextColor,
                borderColor: navbarBorderColor,
              }}
              className="border px-4 py-1 rounded-full transition-all duration-300 hover:bg-opacity-10 hover:bg-gray-500 cursor-pointer"
            >
              get in touch
            </motion.button>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}