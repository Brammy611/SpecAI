import { motion } from "framer-motion";

export function Footer() {
  return (
    <footer className="bg-[#1a1a1a] py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="flex items-center justify-center gap-2 mb-6">
          <div className="w-6 h-6 rounded-full bg-white flex items-center justify-center" />
          <span className="font-jakarta font-bold text-lg text-white">SpecFlow</span>
        </div>
        <p className="text-gray-400 text-sm">
          © 2026 SpecFlow. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
