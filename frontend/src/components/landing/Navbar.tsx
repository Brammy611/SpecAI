import Link from "next/link";
import { motion } from "framer-motion";

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 bg-spec-bg border-b border-spec-border shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link href="/" className="font-jakarta font-bold text-xl tracking-tight">
              <span className="text-spec-text-primary">Spec</span>
              <span className="text-spec-orange">Flow</span>
            </Link>
          </div>
          
          <div className="hidden md:flex items-center space-x-8">
            <Link 
              href="#features" 
              className="text-spec-text-primary font-semibold border-b-2 border-spec-orange pb-1 mt-1"
            >
              Features
            </Link>
            <Link 
              href="#solutions" 
              className="text-spec-text-secondary hover:text-spec-text-primary font-medium transition-colors"
            >
              Solutions
            </Link>
            <Link 
              href="#pricing" 
              className="text-spec-text-secondary hover:text-spec-text-primary font-medium transition-colors"
            >
              Pricing
            </Link>
            <Link 
              href="#docs" 
              className="text-spec-text-secondary hover:text-spec-text-primary font-medium transition-colors"
            >
              Docs
            </Link>
          </div>

          {/* Placeholder to balance flex-between (so links are somewhat centered if needed, but in image it's just left, center, right empty) */}
          <div className="hidden md:block w-[100px]"></div>
        </div>
      </div>
    </header>
  );
}
