import type { ReactNode } from "react";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <main className="min-h-screen flex items-center justify-center relative overflow-hidden bg-[#0a1628]">
      {/* Radial glow blobs — matches Sena's dark blue gradient background */}
      <div
        className="pointer-events-none absolute inset-0"
        aria-hidden="true"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 20% 40%, #1d4ed840 0%, transparent 60%), radial-gradient(ellipse 60% 50% at 80% 70%, #2563eb30 0%, transparent 55%)",
        }}
      />
      <div className="relative z-10 w-full max-w-md px-4 py-12">
        {children}
      </div>
    </main>
  );
}
