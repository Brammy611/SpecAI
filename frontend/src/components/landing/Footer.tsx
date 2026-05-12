export function Footer() {
  return (
    <footer className="bg-spec-bg border-t border-spec-border py-8 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center md:items-end">
        <div className="flex flex-col items-center md:items-start mb-4 md:mb-0">
          <div className="font-jakarta font-bold text-xl tracking-tight mb-2">
            <span className="text-spec-text-primary">Spec</span>
            <span className="text-spec-orange">Flow</span>
            <span className="text-spec-text-primary"> AI</span>
          </div>
          <p className="text-spec-text-secondary text-sm">
            © 2026 SpecFlow AI. Precision engineering for Project Manager.
          </p>
        </div>
        <div className="text-spec-text-secondary text-sm tracking-widest font-medium uppercase">
          Made with love by CodeCatalyst
        </div>
      </div>
    </footer>
  );
}
