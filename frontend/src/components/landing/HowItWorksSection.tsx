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
      className="py-24 bg-white"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <h2 className="text-4xl md:text-5xl font-jakarta font-bold text-gray-900 mb-4">
            From Confusion to Clarity <br />
            in Seconds
          </h2>
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          className="relative"
        >
          {/* Horizontal Line connecting steps */}
          <div className="hidden md:block absolute top-6 left-12 right-12 h-px bg-gray-200 z-0"></div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
            {/* Step 1 */}
            <motion.div variants={stepVariants} className="flex flex-col">
              <div className="flex items-center gap-3 mb-6 bg-white pr-4 inline-flex w-max relative">
                <div className="w-10 h-10 rounded-full bg-[#E5F7F3] border border-[#A5DFD1] flex items-center justify-center text-[#64C2A6]">
                  <MessageSquare className="w-4 h-4" />
                </div>
                <span className="text-3xl font-jakarta font-bold text-[#E5E7EB]">01</span>
              </div>
              <div className="bg-white rounded-[24px] p-6 border border-gray-100 shadow-[0_2px_10px_rgba(0,0,0,0.02)] h-full flex flex-col">
                <h3 className="text-[17px] font-bold text-gray-900 mb-2">Input Requirement</h3>
                <p className="text-[13px] text-gray-500 mb-6 flex-grow">Simply type your new business requirement or feature request in plain English.</p>
                <div className="h-40 bg-[#F7F7F7] rounded-xl w-full"></div>
              </div>
            </motion.div>

            {/* Step 2 */}
            <motion.div variants={stepVariants} className="flex flex-col">
              <div className="flex items-center gap-3 mb-6 bg-white pr-4 inline-flex w-max relative">
                <div className="w-10 h-10 rounded-full bg-[#E5F7F3] border border-[#A5DFD1] flex items-center justify-center text-[#64C2A6]">
                  <Lightbulb className="w-5 h-5" />
                </div>
                <span className="text-3xl font-jakarta font-bold text-[#E5E7EB]">02</span>
              </div>
              <div className="bg-white rounded-[24px] p-6 border border-gray-100 shadow-[0_2px_10px_rgba(0,0,0,0.02)] h-full flex flex-col">
                <h3 className="text-[17px] font-bold text-gray-900 mb-2">AI Analyzes Codebase</h3>
                <p className="text-[13px] text-gray-500 mb-6 flex-grow">Our engine scans your full repository to identify affected systems and hidden dependencies automatically.</p>
                <div className="h-40 bg-[#F7F7F7] rounded-xl w-full"></div>
              </div>
            </motion.div>

            {/* Step 3 */}
            <motion.div variants={stepVariants} className="flex flex-col">
              <div className="flex items-center gap-3 mb-6 bg-white pr-4 inline-flex w-max relative">
                <div className="w-10 h-10 rounded-full bg-[#E5F7F3] border border-[#A5DFD1] flex items-center justify-center text-[#64C2A6]">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <span className="text-3xl font-jakarta font-bold text-[#E5E7EB]">03</span>
              </div>
              <div className="bg-white rounded-[24px] p-6 border border-gray-100 shadow-[0_2px_10px_rgba(0,0,0,0.02)] h-full flex flex-col">
                <h3 className="text-[17px] font-bold text-gray-900 mb-2">Get Technical Blueprint</h3>
                <p className="text-[13px] text-gray-500 mb-6 flex-grow">eceive an actionable spec file, exact module list, and accurate effort estimates instantly.</p>
                <div className="h-40 bg-[#F7F7F7] rounded-xl w-full"></div>
              </div>
            </motion.div>
          </div>
        </motion.div>

      </div>
    </motion.section>
  );
}
