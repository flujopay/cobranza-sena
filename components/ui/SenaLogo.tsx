"use client";

type SenaLogoProps = {
  variant?: "white" | "black" | "color";
  height?: number;
};

export function SenaLogo({ variant = "white", height = 40 }: SenaLogoProps) {
  const src =
    variant === "white"
      ? "/images/logo-sena-white.png"
      : variant === "black"
      ? "/images/logo-sena-black.png"
      : "/images/logo-sena.png";

  const fallbackColor = variant === "white" ? "#ffffff" : "#0041B5";

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt="Sena"
      style={{ height, width: "auto" }}
      onError={(e) => {
        // Si el PNG no carga, muestra el nombre como texto
        const el = e.currentTarget;
        el.style.display = "none";
        const span = document.createElement("span");
        span.textContent = "SENA";
        span.style.cssText = `font-size:${height * 0.6}px;font-weight:700;letter-spacing:0.1em;color:${fallbackColor}`;
        el.parentNode?.insertBefore(span, el);
      }}
    />
  );
}
