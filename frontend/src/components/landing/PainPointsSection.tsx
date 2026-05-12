"use client";

import { motion, Variants } from "framer-motion";
import { Unlink, TimerOff, TrendingDown } from "lucide-react";

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
      className="py-24 bg-spec-bg"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-4xl md:text-[44px] font-jakarta font-bold text-spec-text-primary mb-6 leading-tight">
            Why Changing Business Flows Feels Like a Nightmare
          </h2>
          <p className="text-base md:text-lg text-spec-text-secondary leading-relaxed max-w-2xl mx-auto">
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
          <motion.div variants={cardVariants} className="bg-spec-bg rounded-[24px] p-10 border border-spec-border flex flex-col h-full shadow-sm">
            <div className="mb-6">
              <Unlink className="w-8 h-8 text-spec-yellow opacity-70 stroke-[1.5]" />
            </div>
            <h3 className="text-[40px] font-jakarta font-bold text-spec-yellow mb-2 leading-none">57%</h3>
            <h4 className="text-xl font-bold text-spec-text-primary mb-4">Communication Breakdowns</h4>
            <p className="text-sm text-spec-text-secondary leading-relaxed flex-grow">
              The percentage of project failures attributed to misalignment between product vision and engineering reality.
            </p>
          </motion.div>

          {/* Card 2 */}
          <motion.div variants={cardVariants} className="bg-spec-bg rounded-[24px] p-10 border border-spec-border flex flex-col h-full shadow-sm">
            <div className="mb-6">
              <TimerOff className="w-8 h-8 text-spec-yellow opacity-70 stroke-[1.5]" />
            </div>
            <h3 className="text-[40px] font-jakarta font-bold text-spec-yellow mb-2 leading-none">70%</h3>
            <h4 className="text-xl font-bold text-spec-text-primary mb-4">Engineering Paralysis</h4>
            <p className="text-sm text-spec-text-secondary leading-relaxed flex-grow">
              Time wasted by senior engineers manually investigating code dependencies for simple business requests.
            </p>
          </motion.div>

          {/* Card 3 */}
          <motion.div variants={cardVariants} className="bg-spec-bg rounded-[24px] p-10 border border-spec-border flex flex-col h-full shadow-sm">
            <div className="mb-6">
              <TrendingDown className="w-8 h-8 text-spec-yellow opacity-70 stroke-[1.5]" />
            </div>
            <h3 className="text-[40px] font-jakarta font-bold text-spec-yellow mb-2 leading-none">100<span className="text-2xl">x</span></h3>
            <h4 className="text-xl font-bold text-spec-text-primary mb-4">The Rule of 100 Cost</h4>
            <p className="text-sm text-spec-text-secondary leading-relaxed flex-grow">
              Changes identified during production cost 100 times more to fix than those identified during the analysis phase.
            </p>
          </motion.div>

        </motion.div>
      </div>
    </motion.section>
  );
}
