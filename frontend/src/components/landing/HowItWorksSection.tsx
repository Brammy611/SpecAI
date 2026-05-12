"use client";

import { motion, Variants } from "framer-motion";

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
      className="py-24 bg-[#FCF8FB]" // Light purple/pinkish background from image
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <h2 className="text-4xl md:text-[44px] font-jakarta font-bold text-spec-text-primary mb-4 leading-tight">
            From Confusion to Clarity in Seconds
          </h2>
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          className="relative max-w-5xl mx-auto"
        >
          {/* Horizontal Line connecting steps */}
          <div className="hidden md:block absolute top-12 left-24 right-24 h-[1px] bg-gray-200 z-0"></div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative z-10">
            {/* Step 1 */}
            <motion.div variants={stepVariants} className="flex flex-col items-center text-center">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-spec-yellow to-spec-orange flex items-center justify-center text-white text-3xl font-jakarta font-bold mb-8 shadow-md">
                01
              </div>
              <h3 className="text-[22px] font-bold text-spec-text-primary mb-3">Input Requirement</h3>
              <p className="text-[14px] text-spec-text-secondary leading-relaxed px-4">
                Paste your business specs, user stories, or design docs into the interface.
              </p>
            </motion.div>

            {/* Step 2 */}
            <motion.div variants={stepVariants} className="flex flex-col items-center text-center">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-spec-yellow to-spec-orange flex items-center justify-center text-white text-3xl font-jakarta font-bold mb-8 shadow-md">
                02
              </div>
              <h3 className="text-[22px] font-bold text-spec-text-primary mb-3">AI Analyzes Codebase</h3>
              <p className="text-[14px] text-spec-text-secondary leading-relaxed px-4">
                Our engine performs a deep-context scan of your microservices and data schemas.
              </p>
            </motion.div>

            {/* Step 3 */}
            <motion.div variants={stepVariants} className="flex flex-col items-center text-center">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-spec-yellow to-spec-orange flex items-center justify-center text-white text-3xl font-jakarta font-bold mb-8 shadow-md">
                03
              </div>
              <h3 className="text-[22px] font-bold text-spec-text-primary mb-3">Get Technical Blueprint</h3>
              <p className="text-[14px] text-spec-text-secondary leading-relaxed px-4">
                Receive a comprehensive report with impact levels, risk scores, and effort metrics.
              </p>
            </motion.div>
          </div>
        </motion.div>

      </div>
    </motion.section>
  );
}
