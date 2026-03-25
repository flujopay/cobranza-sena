"use client";

interface SubmitButtonProps {
  label: string;
  loadingLabel?: string;
  isLoading?: boolean;
}

export function SubmitButton({ label, loadingLabel, isLoading }: SubmitButtonProps) {
  return (
    <button
      type="submit"
      disabled={isLoading}
      className={[
        "w-full rounded-lg py-3 px-4 text-sm font-semibold text-white",
        "bg-brand hover:bg-brand-hover active:bg-brand-active",
        "transition-colors focus:outline-none focus:ring-2 focus:ring-brand focus:ring-offset-2",
        "disabled:opacity-60 disabled:cursor-not-allowed",
      ].join(" ")}
    >
      {isLoading ? (loadingLabel ?? "Cargando…") : label}
    </button>
  );
}
