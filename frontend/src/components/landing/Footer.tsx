import Link from "next/link";

export function Footer() {
  return (
    <>
      {/* CTA Section */}
      <section className="py-24 bg-[#FAFAFA]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center bg-white rounded-[24px] shadow-sm border border-gray-100 py-16">
          <h2 className="text-[28px] md:text-[36px] font-jakarta font-bold text-gray-900 mb-4 leading-tight">
            Ready to eliminate technical surprises?
          </h2>
          <p className="text-[15px] text-gray-500 font-medium mb-10 max-w-2xl mx-auto">
            Join the next generation of technical leaders making data-driven architectural decisions.
          </p>
          <Link
            href="/input"
            className="inline-flex items-center justify-center bg-[#F9A01B] text-white px-8 py-3.5 rounded-[12px] font-semibold text-[15px] hover:bg-[#E58F15] transition-transform hover:scale-105 shadow-md shadow-orange-100"
          >
            Get Started with SpecFlow AI
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white py-8 border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex flex-col items-start gap-1">
            <span className="font-jakarta font-bold text-lg text-gray-900">
              Spec<span className="text-[#F9A01B]">Flow</span> <span className="text-sm font-semibold">AI</span>
            </span>
            <p className="text-gray-400 text-[11px] font-medium uppercase tracking-wider">
              © 2025 SpecFlow AI. Precision engineering for Project Manager.
            </p>
          </div>
          <div>
            <p className="text-gray-400 text-[11px] font-bold uppercase tracking-wider">
              MADE WITH LOVE BY CODECATALYST
            </p>
          </div>
        </div>
      </footer>
    </>
  );
}
