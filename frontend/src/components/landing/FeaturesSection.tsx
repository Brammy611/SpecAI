"use client";

import { motion, Variants } from "framer-motion";
import { Languages, BarChart3, ClipboardCheck, TerminalSquare, Share } from "lucide-react";

const sectionVariants: Variants = {
  hidden: { opacity: 0, y: 32 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
};

interface FeatureCardProps {
  icon: React.ElementType;
  badge: string;
  title: string;
  desc: string;
  align?: "left" | "right";
  className?: string;
}

function FeatureCard({ icon: Icon, badge, title, desc, align = "left", className = "" }: FeatureCardProps) {
  const isRight = align === "right";
  return (
    <div className={`bg-spec-bg rounded-2xl p-6 border border-spec-border shadow-[0_4px_20px_rgba(0,0,0,0.03)] flex flex-col z-10 ${isRight ? "items-end text-right" : "items-start text-left"} ${className}`}>
      <div className={`flex items-center gap-2 mb-4 ${isRight ? "flex-row-reverse" : "flex-row"}`}>
        <Icon className="w-5 h-5 text-spec-orange stroke-[2]" />
        <span className="text-spec-orange text-sm font-semibold tracking-wide uppercase">{badge}</span>
      </div>
      <h3 className="text-lg font-bold text-spec-text-primary mb-2">{title}</h3>
      <p className="text-sm text-spec-text-secondary leading-relaxed">{desc}</p>
    </div>
  );
}

export function FeaturesSection() {
  return (
    <section id="features" className="py-24 bg-spec-bg overflow-hidden relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          variants={sectionVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          className="text-center max-w-4xl mx-auto mb-20"
        >
          <h2 className="text-4xl md:text-[44px] font-jakarta font-bold text-spec-text-primary leading-tight mb-4">
            Everything you need to negotiate with stakeholders
          </h2>
          <p className="text-lg text-spec-text-secondary">
            Protect your team from unrealistic deadlines with data-driven impact analysis.
          </p>
        </motion.div>

        {/* Desktop Layout */}
        <motion.div 
          variants={sectionVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          className="hidden lg:block relative max-w-6xl mx-auto pb-12"
        >
          {/* Dashed Lines */}
          <div className="absolute top-[45%] left-[5%] right-[5%] h-[2px] border-t-2 border-dashed border-spec-yellow/60 z-0"></div>
          <div className="absolute left-1/2 top-[5%] bottom-[15%] w-[2px] border-l-2 border-dashed border-spec-yellow/60 -translate-x-1/2 z-0"></div>

          {/* Top Row */}
          <div className="flex justify-between items-end mb-10 relative z-10 px-8">
            <FeatureCard 
              icon={Languages} 
              badge="Input" 
              title="Business Translation" 
              desc="Converting GitHub repository links and raw requirements into actionable technical intent maps."
              className="w-[320px] bg-white"
            />
            <FeatureCard 
              icon={BarChart3} 
              badge="Process" 
              title="Automated Impact Analysis" 
              desc="Context-aware scanning across distributed services."
              align="right"
              className="w-[320px] bg-white"
            />
          </div>

          {/* Middle Row - Central Image Frame */}
          <div className="flex justify-center relative z-10 mb-10">
            <div className="w-[600px] aspect-[16/10] bg-white rounded-3xl border border-spec-border shadow-lg flex flex-col items-center justify-center overflow-hidden p-8 relative">
               <div className="w-16 h-16 rounded-full bg-spec-surface flex items-center justify-center mb-4 border border-spec-border">
                 <svg className="w-8 h-8 text-spec-text-secondary opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                 </svg>
               </div>
               <p className="text-spec-text-primary font-medium text-center">Central Interface Mockup</p>
               <p className="text-spec-text-secondary text-sm mt-2 text-center">Add your screenshot here to complete the diagram</p>
            </div>
          </div>

          {/* Bottom Row */}
          <div className="flex justify-between items-start relative z-10 px-8">
            <FeatureCard 
              icon={ClipboardCheck} 
              badge="Output" 
              title="Task Planning & Effort" 
              desc="Data-driven story point estimation and resource allocation."
              className="w-[320px] bg-white -mt-4"
            />
            <FeatureCard 
              icon={Share} 
              badge="Output" 
              title="Export Analysis Report" 
              desc="Share data-driven insights with your team to ensure everyone is perfectly aligned on the new business flow."
              className="w-[320px] bg-white mt-12"
            />
            <FeatureCard 
              icon={TerminalSquare} 
              badge="Output" 
              title="Developer-Ready" 
              desc="Ready-to-code technical specs .md for engineering teams."
              align="right"
              className="w-[320px] bg-white -mt-4"
            />
          </div>
        </motion.div>

        {/* Mobile Layout */}
        <div className="lg:hidden flex flex-col gap-6 relative z-10">
          <FeatureCard 
            icon={Languages} 
            badge="Input" 
            title="Business Translation" 
            desc="Converting GitHub repository links and raw requirements into actionable technical intent maps."
          />
          <FeatureCard 
            icon={BarChart3} 
            badge="Process" 
            title="Automated Impact Analysis" 
            desc="Context-aware scanning across distributed services."
          />
          
          <div className="w-full aspect-[4/3] bg-white rounded-3xl border border-spec-border shadow-sm flex flex-col items-center justify-center p-6 my-4">
             <p className="text-spec-text-primary font-medium text-center mb-2">Central Interface Mockup</p>
             <p className="text-spec-text-secondary text-sm text-center">Add your screenshot here</p>
          </div>

          <FeatureCard 
            icon={ClipboardCheck} 
            badge="Output" 
            title="Task Planning & Effort" 
            desc="Data-driven story point estimation and resource allocation."
          />
          <FeatureCard 
            icon={TerminalSquare} 
            badge="Output" 
            title="Developer-Ready" 
            desc="Ready-to-code technical specs .md for engineering teams."
          />
          <FeatureCard 
            icon={Share} 
            badge="Output" 
            title="Export Analysis Report" 
            desc="Share data-driven insights with your team to ensure everyone is perfectly aligned on the new business flow."
          />
        </div>

      </div>
    </section>
  );
}
