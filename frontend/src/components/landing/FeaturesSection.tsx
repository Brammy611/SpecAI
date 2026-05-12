"use client";

import { motion, Variants } from "framer-motion";

const sectionVariants: Variants = {
  hidden: { opacity: 0, y: 32 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
};

export function FeaturesSection() {
  return (
    <section id="features" className="py-24 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          variants={sectionVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          className="text-center max-w-4xl mx-auto mb-24"
        >
          <h2 className="text-4xl md:text-[44px] font-jakarta font-bold text-gray-900 leading-[1.2]">
            Everything you need to negotiate with stakeholders and<br />
            protect your team.
          </h2>
        </motion.div>

        <motion.div 
          variants={sectionVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          className="relative max-w-5xl mx-auto"
        >
          {/* Floating Labels (Desktop) */}
          
          {/* Top Left */}
          <div className="absolute -top-8 -left-4 lg:-left-16 z-10 hidden md:flex items-center justify-center px-10 py-5 rounded-[24px] bg-gradient-to-r from-[#A1D6C3] to-[#E5CCAB] shadow-sm">
            <span className="font-bold text-gray-900 whitespace-nowrap">Business Translation</span>
          </div>
          
          {/* Top Right */}
          <div className="absolute -top-8 -right-4 lg:-right-16 z-10 hidden md:flex items-center justify-center px-10 py-5 rounded-[24px] bg-gradient-to-r from-[#A1D6C3] to-[#E5CCAB] shadow-sm">
            <span className="font-bold text-gray-900 whitespace-nowrap">Automated Impact Analysis</span>
          </div>
          
          {/* Bottom Left */}
          <div className="absolute -bottom-8 -left-4 lg:-left-16 z-10 hidden md:flex items-center justify-center px-10 py-5 rounded-[24px] bg-gradient-to-r from-[#A1D6C3] to-[#E5CCAB] shadow-sm">
            <span className="font-bold text-gray-900 whitespace-nowrap text-center">Task Planning & Effort<br/>Estimation</span>
          </div>
          
          {/* Bottom Right */}
          <div className="absolute -bottom-8 -right-4 lg:-right-16 z-10 hidden md:flex items-center justify-center px-10 py-5 rounded-[24px] bg-gradient-to-r from-[#A1D6C3] to-[#E5CCAB] shadow-sm">
            <span className="font-bold text-gray-900 whitespace-nowrap text-center">Developer-Ready<br/>Deliverables</span>
          </div>

          {/* Central Image Frame */}
          <div className="w-full aspect-[4/3] md:aspect-[16/11] bg-[#FAFAFA] rounded-[32px] border-2 border-dashed border-gray-200 flex flex-col items-center justify-center overflow-hidden relative z-0 p-8">
             <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
               <svg className="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
               </svg>
             </div>
             <p className="text-gray-500 font-medium text-center">Image Frame</p>
             <p className="text-gray-400 text-sm mt-2 text-center">Replace this container with your actual screenshot</p>
             {/* 
                TODO: Replace this div with your actual image. Example:
                <Image src="/your-image.png" alt="Dashboard Preview" fill className="object-cover" />
             */}
          </div>

          {/* Mobile version of the labels */}
          <div className="flex md:hidden flex-wrap justify-center gap-4 mt-12 relative z-10">
             <div className="flex items-center justify-center px-6 py-3 rounded-full bg-gradient-to-r from-[#A1D6C3] to-[#E5CCAB]">
               <span className="font-bold text-gray-900 text-sm">Business Translation</span>
             </div>
             <div className="flex items-center justify-center px-6 py-3 rounded-full bg-gradient-to-r from-[#A1D6C3] to-[#E5CCAB]">
               <span className="font-bold text-gray-900 text-sm">Automated Impact Analysis</span>
             </div>
             <div className="flex items-center justify-center px-6 py-3 rounded-full bg-gradient-to-r from-[#A1D6C3] to-[#E5CCAB]">
               <span className="font-bold text-gray-900 text-sm text-center">Task Planning & Estimation</span>
             </div>
             <div className="flex items-center justify-center px-6 py-3 rounded-full bg-gradient-to-r from-[#A1D6C3] to-[#E5CCAB]">
               <span className="font-bold text-gray-900 text-sm text-center">Developer Deliverables</span>
             </div>
          </div>
        </motion.div>

      </div>
    </section>
  );
}
