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
          className="text-center max-w-4xl mx-auto mb-20"
        >
          <h2 className="text-[32px] md:text-[40px] font-jakarta font-bold text-gray-900 leading-tight mb-4">
            Everything you need to negotiate with stakeholders
          </h2>
          <p className="text-[15px] text-gray-500 font-medium">
            Protect your team from unrealistic deadlines with data-driven impact analysis.
          </p>
        </motion.div>

        <motion.div 
          variants={sectionVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          className="relative max-w-[1000px] mx-auto min-h-[600px] flex items-center justify-center"
        >
          {/* Central Image Frame */}
          <div className="w-[300px] md:w-[450px] aspect-[16/10] bg-white rounded-[16px] shadow-[0_8px_40px_rgba(0,0,0,0.08)] border border-gray-100 flex flex-col overflow-hidden relative z-10">
             {/* Mockup Dashboard Header */}
             <div className="h-8 border-b border-gray-100 flex items-center px-4 gap-1">
               <div className="w-2 h-2 rounded-full bg-red-400"></div>
               <div className="w-2 h-2 rounded-full bg-yellow-400"></div>
               <div className="w-2 h-2 rounded-full bg-green-400"></div>
             </div>
             {/* Mockup Dashboard Content */}
             <div className="flex-1 bg-gray-50 p-4">
               <div className="h-4 w-1/3 bg-gray-200 rounded mb-4"></div>
               <div className="flex gap-4 mb-4">
                 <div className="h-20 flex-1 bg-white border border-gray-100 rounded-lg"></div>
                 <div className="h-20 flex-1 bg-white border border-gray-100 rounded-lg"></div>
               </div>
               <div className="h-24 w-full bg-gray-800 rounded-lg"></div>
             </div>
          </div>

          {/* Dotted lines (Desktop) */}
          <div className="hidden md:block absolute inset-0 z-0">
            {/* Left line */}
            <div className="absolute left-[200px] top-1/2 w-[100px] border-t-2 border-dashed border-orange-200"></div>
            {/* Right line */}
            <div className="absolute right-[200px] top-1/2 w-[100px] border-t-2 border-dashed border-orange-200"></div>
            {/* Top line */}
            <div className="absolute left-1/2 top-[100px] h-[100px] border-l-2 border-dashed border-orange-200"></div>
            {/* Bottom line */}
            <div className="absolute left-1/2 bottom-[150px] h-[100px] border-l-2 border-dashed border-orange-200"></div>
          </div>

          {/* Feature Cards (Desktop) */}
          
          {/* Top Left */}
          <div className="hidden md:flex flex-col bg-white border border-gray-100 shadow-sm rounded-xl p-5 absolute left-0 top-[10%] w-[240px] z-10">
            <span className="text-[10px] font-bold text-[#F9A01B] flex items-center gap-1.5 uppercase tracking-wider mb-2">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path></svg>
              Input
            </span>
            <h4 className="font-bold text-gray-900 text-sm mb-1.5">Business Translation</h4>
            <p className="text-[11px] text-gray-500 leading-relaxed">Converting business requirements text and raw documents to clear actionable technical constraints.</p>
          </div>
          
          {/* Top Right */}
          <div className="hidden md:flex flex-col bg-white border border-gray-100 shadow-sm rounded-xl p-5 absolute right-0 top-[10%] w-[240px] z-10">
            <span className="text-[10px] font-bold text-[#F9A01B] flex items-center gap-1.5 uppercase tracking-wider mb-2">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6M2 2l20 20"></path></svg>
              Process
            </span>
            <h4 className="font-bold text-gray-900 text-sm mb-1.5 text-right">Automated Impact Analysis</h4>
            <p className="text-[11px] text-gray-500 leading-relaxed text-right">Detailed analysis scanning across architecture, dependencies, and affected services.</p>
          </div>
          
          {/* Bottom Left */}
          <div className="hidden md:flex flex-col bg-white border border-gray-100 shadow-sm rounded-xl p-5 absolute left-0 bottom-[20%] w-[240px] z-10">
            <span className="text-[10px] font-bold text-[#F9A01B] flex items-center gap-1.5 uppercase tracking-wider mb-2">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
              Output
            </span>
            <h4 className="font-bold text-gray-900 text-sm mb-1.5">Task Planning & Effort</h4>
            <p className="text-[11px] text-gray-500 leading-relaxed">Data-driven story point estimation and resource allocation.</p>
          </div>
          
          {/* Bottom Right */}
          <div className="hidden md:flex flex-col bg-white border border-gray-100 shadow-sm rounded-xl p-5 absolute right-0 bottom-[20%] w-[240px] z-10">
            <span className="text-[10px] font-bold text-[#F9A01B] flex items-center gap-1.5 uppercase tracking-wider mb-2 justify-end">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
              Output
            </span>
            <h4 className="font-bold text-gray-900 text-sm mb-1.5 text-right">Developer-Ready</h4>
            <p className="text-[11px] text-gray-500 leading-relaxed text-right">Ready-to-code technical specs, not for engineering teams.</p>
          </div>

          {/* Bottom Center */}
          <div className="hidden md:flex flex-col bg-white border border-gray-100 shadow-sm rounded-xl p-5 absolute left-1/2 -translate-x-1/2 -bottom-[10%] w-[240px] z-10">
            <span className="text-[10px] font-bold text-[#F9A01B] flex items-center gap-1.5 uppercase tracking-wider mb-2">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
              Output
            </span>
            <h4 className="font-bold text-gray-900 text-sm mb-1.5">Export Analysis Report</h4>
            <p className="text-[11px] text-gray-500 leading-relaxed">Share deep technical insights with your team to perfectly align on the new business flow.</p>
          </div>

          {/* Mobile version of the cards */}
          <div className="flex md:hidden flex-col gap-4 mt-8 relative z-10 w-full max-w-[300px]">
             {/* Simple list for mobile to keep it clean */}
             <div className="bg-white border border-gray-100 p-4 rounded-xl shadow-sm"><h4 className="font-bold text-sm">Business Translation</h4></div>
             <div className="bg-white border border-gray-100 p-4 rounded-xl shadow-sm"><h4 className="font-bold text-sm">Automated Impact Analysis</h4></div>
             <div className="bg-white border border-gray-100 p-4 rounded-xl shadow-sm"><h4 className="font-bold text-sm">Task Planning & Effort</h4></div>
             <div className="bg-white border border-gray-100 p-4 rounded-xl shadow-sm"><h4 className="font-bold text-sm">Developer-Ready Specs</h4></div>
             <div className="bg-white border border-gray-100 p-4 rounded-xl shadow-sm"><h4 className="font-bold text-sm">Export Analysis Report</h4></div>
          </div>
        </motion.div>

      </div>
    </section>
  );
}
