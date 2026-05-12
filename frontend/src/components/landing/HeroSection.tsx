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
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10 flex flex-col items-center">
        <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-orange-50 border border-orange-100 text-[#F9A01B] text-[10px] font-bold tracking-[0.15em] uppercase mb-8">
          AI-POWERED PRECISION
        </div>
        <h1 className="text-5xl md:text-[64px] font-jakarta font-bold tracking-tight text-gray-900 mb-4 leading-[1.1]">
          Technical Analysis at Your<br />
          <span className="text-[#F9A01B]">
            Fingertip
          </span>
        </h1>
        <p className="mt-6 max-w-3xl mx-auto text-base md:text-[17px] text-gray-800 font-medium mb-10 leading-relaxed">
          The ultimate AI platform designed to revolutionize how you handle requirement changes. Predict impact, estimate effort, and protect your sprint.
        </p>
        <div className="flex justify-center mb-16">
          <Link
            href="/input"
            className="inline-flex items-center gap-2 bg-[#F9A01B] text-white px-8 py-3.5 rounded-[12px] font-semibold text-[15px] hover:bg-[#E58F15] transition-transform hover:scale-105 shadow-md"
          >
            <Sparkles className="w-4 h-4" />
            Analyze Impact
          </Link>
        </div>

        {/* Mockup Frame */}
        <div className="mx-auto w-full max-w-4xl bg-white rounded-[24px] shadow-[0_8px_40px_rgba(0,0,0,0.06)] border border-gray-100 flex flex-col p-8 md:p-12 relative overflow-hidden text-left mt-4">
          <div className="text-center mb-8">
            <h2 className="text-[26px] md:text-[32px] font-bold text-gray-900 leading-tight">
              Transform Business Requirements<br />
              into <span className="text-[#F9A01B]">Technical Impact Analysis</span>
            </h2>
            <p className="text-gray-500 text-[13px] md:text-sm mt-3 font-medium">
              Analyze software architecture changes with AI-powered engineering workflows.
            </p>
          </div>

          <div className="bg-[#fcfdfd] border border-gray-100 rounded-[16px] p-6 shadow-sm">
            <div className="mb-6">
              <label className="flex items-center gap-2 text-gray-700 text-sm font-semibold mb-3">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400">
                  <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"></path>
                  <path d="M9 18c-4.51 2-5-2-7-2"></path>
                </svg>
                Connect Repository
              </label>
              <input type="text" readOnly value="https://github.com/org/repo" className="w-full bg-white border border-gray-200 rounded-[8px] px-4 py-3 text-sm text-gray-500 focus:outline-none" />
            </div>

            <div className="mb-6">
              <label className="block text-[11px] font-bold text-gray-400 tracking-wider uppercase mb-3 ml-1">
                WRITE YOUR REQUIREMENT
              </label>
              <textarea readOnly className="w-full bg-white border border-gray-200 rounded-[8px] px-4 py-4 text-sm text-gray-700 focus:outline-none min-h-[100px] resize-none" value="Tambahkan TOEFL minimal 450 saat pengajuan SKL"></textarea>
              <div className="flex justify-end items-center mt-3">
                <div className="flex items-center gap-2 text-gray-400 text-xs italic mr-auto ml-1">
                  <Sparkles className="w-3.5 h-3.5" />
                  Describe business changes in natural language.
                </div>
                <button disabled className="bg-[#cbd5e1] text-white px-6 py-2.5 rounded-[8px] font-semibold text-[13px] flex items-center gap-2 opacity-80">
                  <Sparkles className="w-3.5 h-3.5" />
                  Analyze Impact
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.section>
  );
}
