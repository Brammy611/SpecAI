"use client";

import Link from "next/link";
import { motion, Variants } from "framer-motion";
import { Sparkles } from "lucide-react";

const sectionVariants: Variants = {
  hidden: { opacity: 0, y: 32 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
};

export function HeroSection() {
  return (
    <motion.section
      variants={sectionVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-80px" }}
      className="relative bg-white pt-24 pb-32 overflow-hidden"
    >
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        <h1 className="text-5xl md:text-[64px] font-jakarta font-bold tracking-tight text-gray-900 mb-3 leading-[1.1]">
          Technical Analysis at<br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#A1D6C3] to-[#E5CCAB]">
            Your Fingertip
          </span>
        </h1>
        <p className="mt-6 max-w-3xl mx-auto text-base md:text-[17px] text-gray-800 font-medium mb-10 leading-relaxed">
          The ultimate AI platform designed to revolutionize how you handle requirement changes. Predict impact, estimate effort, and protect your sprint.
        </p>
        <div className="flex justify-center mb-16">
          <Link
            href="/input"
            className="inline-flex items-center gap-2 bg-[#8A8575] text-white px-8 py-3.5 rounded-[12px] font-semibold text-[15px] hover:bg-[#7A7565] transition-transform hover:scale-105 shadow-md"
          >
            <Sparkles className="w-4 h-4" />
            Analyze Impact
          </Link>
        </div>

        {/* Mockup Frame Placeholder */}
        <div className="mx-auto w-full max-w-4xl aspect-[16/11] bg-white rounded-[32px] shadow-[0_8px_40px_rgba(0,0,0,0.06)] border border-gray-100 flex flex-col items-center justify-center p-8 relative overflow-hidden">
          <div className="w-16 h-16 rounded-full bg-gray-50 flex items-center justify-center mb-4">
            <svg className="w-8 h-8 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <p className="text-gray-500 font-medium text-center">Hero Image Frame</p>
          <p className="text-gray-400 text-sm mt-2 text-center">Replace this container with your actual screenshot</p>
          {/* 
             TODO: Replace this div with your actual image. Example:
             <Image src="/your-hero-image.png" alt="Hero Mockup" fill className="object-cover" />
          */}
        </div>
      </div>

      {/* Decorative background curve */}
      <div className="absolute bottom-0 left-0 right-0 h-[400px] bg-[#F5EFE6]/60 rounded-[100%] scale-x-[1.8] translate-y-1/2 z-0" />
    </motion.section>
  );
}
