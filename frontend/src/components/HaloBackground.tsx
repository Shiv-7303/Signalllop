'use client'

export function HaloBackground() {
  return (
    <div className="fixed inset-0 z-[-1] pointer-events-none bg-white">
      {/* Full Screen Decorative Grid Background */}
      <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:20px_20px] [mask-image:linear-gradient(to_bottom,transparent,black,transparent)] opacity-40 z-0 pointer-events-none" />
      {/* Soft orange glow at top right */}
      <div className="absolute -top-40 -right-40 w-96 h-96 bg-[#FF4500]/5 rounded-full blur-3xl pointer-events-none" />
      {/* Soft gray glow at bottom left */}
      <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-slate-100 rounded-full blur-3xl pointer-events-none" />
    </div>
  )
}
