import React from "react";

const Input = React.forwardRef(function Input(
  {
    label,
    labelClassName = "",
    error,
    className = "",
    containerClassName = "",
    type = "text",
    placeholder,
    id,
    rows = 4,
    as: Component = "input",
    ...props
  },
  ref,
) {
  // 1. Determine element type (textarea vs input)
  const isTextarea = type === "textarea" || Component === "textarea";
  const InputElement = isTextarea ? "textarea" : "input";

  // 2. Auto-generate element & error IDs for accessibility if none are passed
  const inputId =
    id || (label ? label.toLowerCase().replace(/\s+/g, "-") : undefined);
  const errorId = inputId && error ? `${inputId}-error` : undefined;

  // 3. Common base styles shared by both input and textarea
  const baseClasses =
    "w-full border border-slate-200 px-4 py-3 text-sm text-slate-700 outline-none transition-all duration-200 placeholder:text-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 disabled:cursor-not-allowed disabled:opacity-60";

  // 4. Safely merge class names using standard JS array methods
  const inputClasses = [
    baseClasses,
    isTextarea ? "rounded-2xl bg-slate-50" : "rounded-xl bg-white",
    error ? "border-rose-400 focus:border-rose-500 focus:ring-rose-100" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  const containerClasses = ["w-full", containerClassName]
    .filter(Boolean)
    .join(" ");

  const labelClasses = [
    "mb-2 block text-sm font-semibold text-slate-700",
    labelClassName,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={containerClasses}>
      {label && (
        <label htmlFor={inputId} className={labelClasses}>
          {label}
        </label>
      )}

      <InputElement
        ref={ref}
        id={inputId}
        type={isTextarea ? undefined : type}
        placeholder={placeholder}
        rows={isTextarea ? rows : undefined}
        aria-invalid={Boolean(error)}
        aria-describedby={errorId}
        className={inputClasses}
        {...props}
      />

      {error && (
        <p id={errorId} className="mt-2 text-sm text-rose-500">
          {error}
        </p>
      )}
    </div>
  );
});

Input.displayName = "Input";

export default Input;
