export function ImagePlaceholder({ label, className }: { label: string; className?: string }) {
  return (
    <div className={`rounded-2xl border-2 border-dashed border-gray-200 bg-gray-50 flex items-center justify-center min-h-[200px] ${className || ''}`}>
      {/* REPLACE: set as <Image src="/images/..." alt="..." fill /> from next/image */}
      <p className="text-sm text-gray-400 px-4 text-center">[ {label} ]</p>
    </div>
  );
}
