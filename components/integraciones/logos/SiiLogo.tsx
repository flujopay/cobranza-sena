export function SiiLogo() {
  return (
    <div className="w-12 h-12 flex items-center justify-center">
      {/* Replica del logo SII: "S" azul + "ii" con puntos naranja/azul */}
      <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* S */}
        <text x="2" y="34" fontFamily="Arial, sans-serif" fontWeight="800" fontSize="28" fill="#0033A0">S</text>
        {/* i + i */}
        <text x="22" y="34" fontFamily="Arial, sans-serif" fontWeight="800" fontSize="28" fill="#0033A0">ii</text>
        {/* dot 1 — naranja */}
        <circle cx="27" cy="10" r="3.5" fill="#F47920" />
        {/* dot 2 — azul claro */}
        <circle cx="36" cy="10" r="3.5" fill="#00AEEF" />
      </svg>
    </div>
  );
}
