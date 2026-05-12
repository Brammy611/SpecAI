import { Navbar } from "@/components/landing/Navbar";
import { HeroSection } from "@/components/landing/HeroSection";
import { PainPointsSection } from "@/components/landing/PainPointsSection";
import { HowItWorksSection } from "@/components/landing/HowItWorksSection";
import { FeaturesSection } from "@/components/landing/FeaturesSection";
import { Footer } from "@/components/landing/Footer";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white font-sans text-gray-900 selection:bg-[#1D9E75] selection:text-white">
      <Navbar />
      <main>
        <HeroSection />
        <PainPointsSection />
        <HowItWorksSection />
        <FeaturesSection />
      </main>
      <Footer />
    </div>
  );
}
