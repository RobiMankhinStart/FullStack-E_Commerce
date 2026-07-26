import React from "react";

const variantClasses = {
  primary:
    "bg-indigo-600 text-white hover:bg-indigo-700 focus:ring-indigo-500 shadow-sm shadow-indigo-100",
  secondary:
    "bg-slate-100 text-slate-700 hover:bg-slate-200 focus:ring-slate-400",
  outline:
    "border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 focus:ring-slate-400",
  ghost:
    "bg-transparent text-slate-700 hover:bg-slate-100 focus:ring-slate-400",
  danger: "bg-rose-600 text-white hover:bg-rose-700 focus:ring-rose-500",
  success:
    "bg-emerald-600 text-white hover:bg-emerald-700 focus:ring-emerald-500",
  light: "bg-white text-slate-900 hover:bg-slate-100 focus:ring-slate-400",
};

const sizeClasses = {
  sm: "px-3 py-2 text-sm",
  md: "px-4 py-3 text-sm",
  lg: "px-6 py-3.5 text-base",
  icon: "h-10 w-10 p-0",
};

const roundedClasses = {
  none: "rounded-none",
  sm: "rounded-lg",
  md: "rounded-xl",
  lg: "rounded-2xl",
  full: "rounded-full",
};

const Button = React.forwardRef(function Button(
  {
    children,
    className = "",
    variant = "primary",
    size = "md",
    rounded = "md",
    fullWidth = false,
    loading = false,
    disabled = false,
    leftIcon = null,
    rightIcon = null,
    type = "button",
    as: Component = "button", // Defaults to standard HTML button
    ...props
  },
  ref,
) {
  // Base styles applied to every button
  const baseClasses =
    "inline-flex items-center justify-center gap-2 font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60 select-none";

  // Merge classes safely using simple JavaScript array filtering
  const classes = [
    baseClasses,
    variantClasses[variant] || variantClasses.primary,
    sizeClasses[size] || sizeClasses.md,
    roundedClasses[rounded] || roundedClasses.md,
    fullWidth ? "w-full" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <Component
      ref={ref}
      type={Component === "button" ? type : undefined}
      disabled={Component === "button" ? disabled || loading : undefined}
      className={classes}
      {...props}
    >
      {loading ? (
        <span
          className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"
          aria-hidden="true"
        />
      ) : (
        leftIcon
      )}
      {children && <span>{children}</span>}
      {!loading && rightIcon}
    </Component>
  );
});

Button.displayName = "Button";

export default Button;
