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

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
};

export function PainPointsSection() {
  return (
    <motion.section
      variants={sectionVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-80px" }}
      className="py-24 bg-[#FAFAFA]"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-[40px] font-jakarta font-bold text-gray-900 mb-6 leading-tight">
            Why Changing Business Flows Feels Like a Nightmare
          </h2>
          <p className="text-sm md:text-[15px] text-gray-600 leading-relaxed max-w-2xl mx-auto font-medium">
            Static documentation and siloed communication are the hidden killers of technical agility.
          </p>
        </div>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          {/* Card 1 */}
          <motion.div variants={cardVariants} className="bg-white rounded-[16px] p-8 border border-gray-100 shadow-sm flex flex-col h-full">
            <div className="mb-6">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#F9A01B" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21.5 2v6h-6M2.5 22v-6h6M2 2l20 20M15.5 8l6-6M8.5 16l-6 6" />
              </svg>
            </div>
            <h3 className="text-[28px] font-bold text-[#F9A01B] mb-1">57%</h3>
            <h4 className="text-[15px] font-bold text-gray-900 mb-3">Communication Breakdowns</h4>
            <p className="text-[13px] text-gray-500 leading-relaxed font-medium">
              The percentage of project failures attributed to misalignment between product vision and engineering reality.
            </p>
          </motion.div>

          {/* Card 2 */}
          <motion.div variants={cardVariants} className="bg-white rounded-[16px] p-8 border border-gray-100 shadow-sm flex flex-col h-full">
            <div className="mb-6">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#F9A01B" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="2" y1="2" x2="22" y2="22"></line>
              </svg>
            </div>
            <h3 className="text-[28px] font-bold text-[#F9A01B] mb-1">70%</h3>
            <h4 className="text-[15px] font-bold text-gray-900 mb-3">Engineering Paralysis</h4>
            <p className="text-[13px] text-gray-500 leading-relaxed font-medium">
              Time wasted by senior engineers manually investigating code dependencies for simple business requests.
            </p>
          </motion.div>

          {/* Card 3 */}
          <motion.div variants={cardVariants} className="bg-white rounded-[16px] p-8 border border-gray-100 shadow-sm flex flex-col h-full">
            <div className="mb-6">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#F9A01B" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6M2 2l20 20" />
              </svg>
            </div>
            <h3 className="text-[28px] font-bold text-[#F9A01B] mb-1 flex items-center">100<span className="text-xl ml-0.5">x</span></h3>
            <h4 className="text-[15px] font-bold text-gray-900 mb-3">The Rule of 100 Cost</h4>
            <p className="text-[13px] text-gray-500 leading-relaxed font-medium">
              Changes identified during production cost 100 times more to fix than those identified during the analysis phase.
            </p>
          </motion.div>

        </motion.div>
      </div>
    </motion.section>
  );
}
