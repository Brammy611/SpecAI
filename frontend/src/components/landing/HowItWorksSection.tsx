"use client";

import { motion, Variants } from "framer-motion";
import { MessageSquare, Lightbulb, CheckCircle2 } from "lucide-react";

const sectionVariants: Variants = {
  hidden: { opacity: 0, y: 32 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
};

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.15 } }
};

const stepVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
};

export function HowItWorksSection() {
  return (
    <motion.section
      id="how-it-works"
      variants={sectionVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-80px" }}
      className="py-24 bg-[#FCFBFD]"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <h2 className="text-[32px] md:text-[40px] font-jakarta font-bold text-gray-900 mb-4 leading-tight">
            From Confusion to Clarity in Seconds
          </h2>
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          className="relative max-w-5xl mx-auto pt-4"
        >
          {/* Horizontal Line connecting steps */}
          <div className="hidden md:block absolute top-[36px] left-[10%] right-[10%] h-[1px] bg-[#E5E7EB] z-0"></div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center relative z-10">
            {/* Step 1 */}
            <motion.div variants={stepVariants} className="flex flex-col items-center">
              <div className="w-[48px] h-[48px] rounded-full bg-gradient-to-b from-[#FDBF5E] to-[#F99A15] flex items-center justify-center text-white font-bold text-lg mb-8 shadow-[0_8px_16px_rgba(249,154,21,0.3)] z-10">
                01
              </div>
              <h3 className="text-[15px] font-bold text-[#1e2330] mb-2.5">Input Requirement</h3>
              <p className="text-[12px] text-[#6b7280] font-medium leading-relaxed max-w-[240px]">
                Paste your business specs, user stories, or design docs into the interface.
              </p>
            </motion.div>

            {/* Step 2 */}
            <motion.div variants={stepVariants} className="flex flex-col items-center">
              <div className="w-[48px] h-[48px] rounded-full bg-gradient-to-b from-[#FDBF5E] to-[#F99A15] flex items-center justify-center text-white font-bold text-lg mb-8 shadow-[0_8px_16px_rgba(249,154,21,0.3)] z-10">
                02
              </div>
              <h3 className="text-[15px] font-bold text-[#1e2330] mb-2.5">AI Analyzes Codebase</h3>
              <p className="text-[12px] text-[#6b7280] font-medium leading-relaxed max-w-[240px]">
                Our engine performs a deep-context scan of your microservices and data schemas.
              </p>
            </motion.div>

            {/* Step 3 */}
            <motion.div variants={stepVariants} className="flex flex-col items-center">
              <div className="w-[48px] h-[48px] rounded-full bg-gradient-to-b from-[#FDBF5E] to-[#F99A15] flex items-center justify-center text-white font-bold text-lg mb-8 shadow-[0_8px_16px_rgba(249,154,21,0.3)] z-10">
                03
              </div>
              <h3 className="text-[15px] font-bold text-[#1e2330] mb-2.5">Get Technical Blueprint</h3>
              <p className="text-[12px] text-[#6b7280] font-medium leading-relaxed max-w-[240px]">
                Receive a comprehensive report with impact levels, risk scores, and effort metrics.
              </p>
            </motion.div>
          </div>
        </motion.div>

      </div>
    </motion.section>
  );
}
