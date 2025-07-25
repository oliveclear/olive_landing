"use client";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function ComingSoon() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center px-6 relative overflow-hidden">
      {/* Background Animation */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.1 }}
          transition={{ duration: 2 }}
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#CEDF9F] rounded-full blur-3xl"
        />
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.05 }}
          transition={{ duration: 2, delay: 0.5 }}
          className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-[#c7abce] rounded-full blur-3xl"
        />
      </div>

      {/* Navigation */}
      <motion.div
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="fixed top-0 left-0 right-0 z-50 backdrop-blur-sm"
      >
        <div className="flex justify-between items-center px-8 py-4">
          <div>
            <img
              src="/assets/Oliveclear-logo.png"
              alt="OliveClear Logo"
              className="h-8 w-auto"
            />
          </div>
          <button
            onClick={() => router.push('/')}
            className="border border-white/30 px-4 py-1 rounded-full transition-all duration-300 hover:bg-white/10"
          >
            back to home
          </button>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="relative z-10 text-center max-w-4xl mx-auto pt-20 sm:pt-0">
        {/* Main Heading */}
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="mb-8"
        >
          <h1 className="text-[8vw] sm:text-[6vw] md:text-[4vw] lg:text-6xl font-light text-gray-400 leading-tight mb-2">
            something amazing
          </h1>
          <h2 className="text-[8vw] sm:text-[6vw] md:text-[4vw] lg:text-6xl font-bold text-white leading-tight">
            is coming soon
          </h2>
        </motion.div>

        {/* Description */}
        <motion.p
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 1.2 }}
          className="text-lg sm:text-xl text-gray-300 mb-12 max-w-2xl mx-auto leading-relaxed"
        >
          We're working hard to bring you the ultimate AI-powered skincare experience. 
          Get ready for personalized recommendations, smart face analysis, and progress tracking like never before.
        </motion.p>

        {/* Launch Status */}
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 1.6 }}
          className="mb-12"
        >
          <div className="inline-flex items-center gap-3 bg-[#CEDF9F]/10 border border-[#CEDF9F]/30 rounded-full px-6 py-3">
            <div className="w-2 h-2 bg-[#CEDF9F] rounded-full animate-pulse"></div>
            <span className="text-[#CEDF9F] font-medium">launching soon</span>
          </div>
        </motion.div>

        {/* Call to Action */}
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 2 }}
          className="space-y-6"
        >
          <p className="text-gray-400 mb-4">
            Want to be the first to know when we launch?
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="w-full sm:flex-1 px-4 py-3 bg-white/10 border border-white/20 rounded-full text-white placeholder-gray-400 focus:outline-none focus:border-[#CEDF9F]/50 backdrop-blur-sm"
            />
            <button className="w-full sm:w-auto bg-[#CEDF9F] text-black px-6 py-3 rounded-full font-semibold hover:bg-[#CEDF9F]/90 transition-colors">
              notify me
            </button>
          </div>
        </motion.div>

        {/* Social Links */}
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 2.4 }}
          className="mt-16"
        >
          <p className="text-gray-400 mb-6">Follow us for updates</p>
          <div className="flex justify-center gap-6">
            <a 
              href="https://instagram.com/oliveclear" 
              target="_blank" 
              rel="noopener noreferrer"
              className="hover:scale-110 transition-transform"
            >
              <Image 
                src="/assets/OliveClear_Insta.png" 
                alt="Instagram" 
                width={40} 
                height={40} 
                className="opacity-70 hover:opacity-100 transition-opacity"
              />
            </a>
            <a 
              href="https://twitter.com/oliveclear" 
              target="_blank" 
              rel="noopener noreferrer"
              className="hover:scale-110 transition-transform"
            >
              <Image 
                src="/assets/Olive_Twitter.png" 
                alt="Twitter/X" 
                width={40} 
                height={40} 
                className="opacity-70 hover:opacity-100 transition-opacity"
              />
            </a>
            <a 
              href="https://discord.gg/oliveclear" 
              target="_blank" 
              rel="noopener noreferrer"
              className="hover:scale-110 transition-transform"
            >
              <Image 
                src="/assets/Olive_dis.png" 
                alt="Discord" 
                width={40} 
                height={40} 
                className="opacity-70 hover:opacity-100 transition-opacity"
              />
            </a>
            <a 
              href="https://linkedin.com/company/oliveclear" 
              target="_blank" 
              rel="noopener noreferrer"
              className="hover:scale-110 transition-transform"
            >
              <Image 
                src="/assets/Olive_lkd.png" 
                alt="LinkedIn" 
                width={40} 
                height={40} 
                className="opacity-70 hover:opacity-100 transition-opacity"
              />
            </a>
          </div>
        </motion.div>
      </div>

      {/* Floating Elements */}
      <motion.div
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 0.3 }}
        transition={{ duration: 2, delay: 3 }}
        className="absolute top-1/3 left-8 hidden lg:block"
      >
        <div className="w-2 h-2 bg-[#CEDF9F] rounded-full"></div>
      </motion.div>
      
      <motion.div
        initial={{ x: 100, opacity: 0 }}
        animate={{ x: 0, opacity: 0.3 }}
        transition={{ duration: 2, delay: 3.5 }}
        className="absolute bottom-1/3 right-8 hidden lg:block"
      >
        <div className="w-3 h-3 bg-[#c7abce] rounded-full"></div>
      </motion.div>
    </div>
  );
}
