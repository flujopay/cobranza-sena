type SenaLogoProps = {
  /** "white" para fondos oscuros (sidebar, auth), "black" para fondos claros, "color" para el logo original */
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

  // eslint-disable-next-line @next/next/no-img-element
  return <img src={src} alt="Sena" style={{ height, width: "auto" }} />;
}
