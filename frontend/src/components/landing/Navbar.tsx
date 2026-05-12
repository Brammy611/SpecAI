import Link from "next/link";
import { motion } from "framer-motion";

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-2">
            <span className="font-jakarta font-bold text-xl text-gray-900">
              Spec<span className="text-[#F9A01B]">Flow</span>
            </span>
          </div>
          <div className="hidden md:flex items-center space-x-8 absolute left-1/2 transform -translate-x-1/2">
            <Link href="#features" className="text-gray-600 hover:text-gray-900 text-[13px] font-semibold transition-colors">
              Features
            </Link>
            <Link href="#solutions" className="text-gray-600 hover:text-gray-900 text-[13px] font-semibold transition-colors">
              Solutions
            </Link>
            <Link href="#pricing" className="text-gray-600 hover:text-gray-900 text-[13px] font-semibold transition-colors">
              Pricing
            </Link>
            <Link href="#docs" className="text-gray-600 hover:text-gray-900 text-[13px] font-semibold transition-colors">
              Docs
            </Link>
          </div>
          {/* Empty div to balance flex-between since menu is absolute center */}
          <div className="w-24"></div>
        </div>
      </div>
    </header>
  );
}
