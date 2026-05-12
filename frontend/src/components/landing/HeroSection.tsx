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
      className="relative bg-spec-bg pt-24 pb-32 overflow-hidden"
    >
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        
        {/* Top Badge */}
        <div className="flex justify-center mb-8">
          <span className="inline-flex items-center px-4 py-1.5 rounded-full border border-spec-orange text-spec-orange text-xs font-semibold tracking-widest uppercase bg-white/50 backdrop-blur-sm shadow-sm">
            AI-POWERED PRECISION
          </span>
        </div>

        {/* Title */}
        <h1 className="text-5xl md:text-[64px] font-jakarta font-bold tracking-tight text-spec-text-primary mb-6 leading-[1.1]">
          Technical Analysis at Your<br />
          <span className="text-spec-orange">
            Fingertip
          </span>
        </h1>
        
        {/* Subtitle */}
        <p className="mt-6 max-w-3xl mx-auto text-base md:text-[17px] text-spec-text-secondary font-medium mb-10 leading-relaxed">
          Bridge the gap between business requirements and codebase reality. Instantly map the
          ripple effects of every change before you write a single line of code.
        </p>
        
        {/* Call to Action */}
        <div className="flex justify-center mb-16">
          <Link
            href="/input"
            className="inline-flex items-center gap-2 bg-spec-orange text-white px-8 py-3.5 rounded-xl font-semibold text-[15px] hover:bg-orange-500 transition-all hover:scale-105 shadow-md shadow-spec-orange/20"
          >
            <Sparkles className="w-4 h-4" />
            Analyze Impact
          </Link>
        </div>

        {/* Mockup Frame Placeholder */}
        <div className="mx-auto w-full max-w-4xl aspect-[16/11] bg-spec-surface rounded-[24px] shadow-[0_8px_40px_rgba(0,0,0,0.06)] border border-spec-border flex flex-col items-center justify-center p-8 relative overflow-hidden">
          <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center mb-4 shadow-sm border border-spec-border">
            <svg className="w-8 h-8 text-spec-text-secondary opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <p className="text-spec-text-primary font-medium text-center">Hero Image Frame</p>
          <p className="text-spec-text-secondary text-sm mt-2 text-center">Replace this container with your actual screenshot</p>
          {/* 
             TODO: Replace this div with your actual image. Example:
             <Image src="/your-hero-image.png" alt="Hero Mockup" fill className="object-cover rounded-[24px]" />
          */}
        </div>
      </div>

      {/* Decorative background curve */}
      <div className="absolute bottom-0 left-0 right-0 h-[400px] bg-[#f8eef6]/60 rounded-[100%] scale-x-[1.8] translate-y-1/2 z-0" />
    </motion.section>
  );
}
