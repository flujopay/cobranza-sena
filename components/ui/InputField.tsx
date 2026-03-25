import { forwardRef, type InputHTMLAttributes } from "react";

interface InputFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

export const InputField = forwardRef<HTMLInputElement, InputFieldProps>(
  ({ label, error, id, ...props }, ref) => {
    const fieldId = id ?? props.name;

    return (
      <div className="flex flex-col gap-1.5">
        <label htmlFor={fieldId} className="text-sm font-medium text-gray-700">
          {label}
        </label>
        <input
          id={fieldId}
          ref={ref}
          className={[
            "w-full rounded-lg border px-4 py-3 text-sm text-gray-900 placeholder-gray-400 outline-none",
            "transition-colors focus:ring-2 focus:ring-brand focus:border-brand",
            error
              ? "border-red-400 bg-red-50 focus:ring-red-400 focus:border-red-400"
              : "border-gray-300 bg-white hover:border-gray-400",
          ].join(" ")}
          {...props}
        />
        {error && (
          <p className="text-xs text-red-600" role="alert">
            {error}
          </p>
        )}
      </div>
    );
  }
);

InputField.displayName = "InputField";
