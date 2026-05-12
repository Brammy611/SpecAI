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
          <h2 className="text-4xl md:text-5xl font-jakarta font-bold text-gray-900 mb-4">
            Why Changing Business Flows <br />
            Feels Like a <span className="text-[#FF3B30]">Nightmare</span>
          </h2>
          <p className="text-sm md:text-base text-gray-600 leading-relaxed max-w-2xl mx-auto">
            Every change should drive value. But in most organizations it creates<br />chaos, delays, and hidden costs.
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
          <motion.div variants={cardVariants} className="bg-white rounded-[24px] p-8 border border-gray-200 flex flex-col h-full shadow-sm">
            <div className="w-12 h-12 rounded-full bg-[#EEEEEE] mb-6"></div>
            <span className="text-[#64C2A6] font-jakarta font-bold text-sm mb-2">01</span>
            <h3 className="text-xl font-bold text-gray-900 mb-4 leading-tight">Communication<br/>Breakdowns</h3>
            <p className="text-sm text-gray-600 mb-8 flex-grow leading-relaxed">
              Requirement changes often get lost in translation between PMs and engineers, leading to blind commitments and broken trust.
            </p>
            <div className="mt-auto">
              <div className="bg-[#F8EFE6] text-gray-700 text-xs p-5 rounded-[16px] mb-4 leading-relaxed">
                <span className="text-[#FF3B30] text-2xl font-bold mr-1">57%</span>
                of IT project failures are driven directly by communication breakdowns.
              </div>
              <p className="text-[10px] text-gray-400">- Standish CHAOS Report</p>
            </div>
          </motion.div>

          {/* Card 2 */}
          <motion.div variants={cardVariants} className="bg-white rounded-[24px] p-8 border border-gray-200 flex flex-col h-full shadow-sm">
            <div className="w-12 h-12 rounded-full bg-[#EEEEEE] mb-6"></div>
            <span className="text-[#64C2A6] font-jakarta font-bold text-sm mb-2">02</span>
            <h3 className="text-xl font-bold text-gray-900 mb-4 leading-tight">Engineering<br/>Paralysis</h3>
            <p className="text-sm text-gray-600 mb-8 flex-grow leading-relaxed">
              Developers are pulled away from building new features because they are forced to manually trace dependencies and untangle old logic from scratch.
            </p>
            <div className="mt-auto">
              <div className="bg-[#E8F0E6] text-gray-700 text-xs p-5 rounded-[16px] mb-4 leading-relaxed">
                <span className="text-[#FF3B30] text-2xl font-bold mr-1">70%</span>
                of developer's time just trying to understand existing code
              </div>
              <p className="text-[10px] text-gray-400">- McKinsey 2023</p>
            </div>
          </motion.div>

          {/* Card 3 */}
          <motion.div variants={cardVariants} className="bg-white rounded-[24px] p-8 border border-gray-200 flex flex-col h-full shadow-sm">
            <div className="w-12 h-12 rounded-full bg-[#EEEEEE] mb-6"></div>
            <span className="text-[#64C2A6] font-jakarta font-bold text-sm mb-2">05</span>
            <h3 className="text-xl font-bold text-gray-900 mb-4 leading-tight">The "Rule of 100"<br/>Cost</h3>
            <p className="text-sm text-gray-600 mb-8 flex-grow leading-relaxed">
              Pushing requirement changes without an instant technical blueprint creates a ripple effect of massive technical debt and hidden bugs.
            </p>
            <div className="mt-auto">
              <div className="bg-[#F8EFE6] text-gray-700 text-xs p-5 rounded-[16px] mb-4 leading-relaxed">
                <span className="text-[#FF3B30] text-2xl font-bold mr-1">100x</span>
                more expensive to defects post-release vs. during planning
              </div>
              <p className="text-[10px] text-gray-400">- IBM Systems Sciences Institute</p>
            </div>
          </motion.div>

        </motion.div>
      </div>
    </motion.section>
  );
}
