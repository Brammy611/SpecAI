import Link from "next/link";
import { motion } from "framer-motion";

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-[#A1D6C3]" />
            <span className="font-jakarta font-bold text-xl text-transparent bg-clip-text bg-gradient-to-r from-[#A1D6C3] to-[#E5CCAB]">
              SpecFlow
            </span>
            <span className="ml-2 px-3 py-1 text-[10px] font-bold text-gray-800 bg-[#F5EFE6] rounded-full tracking-wider">
              BETA
            </span>
          </div>
          <div className="hidden md:flex items-center space-x-8">
            <Link href="#features" className="text-gray-500 hover:text-gray-900 font-medium transition-colors">
              Features
            </Link>
            <Link href="#how-it-works" className="text-gray-500 hover:text-gray-900 font-medium transition-colors">
              How it works
            </Link>
            <Link
              href="/input"
              className="bg-[#8A8575] text-white px-5 py-2 rounded-full font-medium hover:bg-[#7A7565] transition-colors"
            >
              Get Started
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
