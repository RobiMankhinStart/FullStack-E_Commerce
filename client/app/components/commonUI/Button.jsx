import React from "react";

const variantClasses = {
  primary:
    "border border-indigo-600 bg-indigo-600 text-white shadow-sm shadow-indigo-100 hover:bg-indigo-700 hover:shadow-md focus:ring-indigo-500",
  secondary:
    "border border-slate-200 bg-slate-100 text-slate-700 hover:bg-slate-200 focus:ring-slate-400",
  outline:
    "border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 hover:border-slate-300 focus:ring-slate-400",
  ghost:
    "border border-transparent bg-transparent text-slate-700 hover:bg-slate-100 focus:ring-slate-400",
  danger:
    "border border-rose-600 bg-rose-600 text-white shadow-sm shadow-rose-100 hover:bg-rose-700 focus:ring-rose-500",
  success:
    "border border-emerald-600 bg-emerald-600 text-white shadow-sm shadow-emerald-100 hover:bg-emerald-700 focus:ring-emerald-500",
  light:
    "border border-slate-200 bg-white text-slate-900 hover:bg-slate-100 focus:ring-slate-400",
};

const sizeClasses = {
  xs: " px-0.5 text-xs",
  sm: "min-h-10 px-3 py-2 text-sm",
  md: "min-h-11 px-4 py-3 text-sm",
  lg: "min-h-12 px-6 py-3.5 text-base",
  icon: "h-10 w-10 p-0",
};

const roundedClasses = {
  none: "rounded-none",
  xs: "rounded-sm",
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
    leftIconClassName = "",
    rightIconClassName = "",
    type = "button",
    as: Component = "button", // Defaults to standard HTML button
    ...props
  },
  ref,
) {
  // Base styles applied to every button
  const baseClasses =
    "group inline-flex items-center justify-center gap-2 whitespace-nowrap font-semibold leading-none transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60 select-none active:translate-y-[1px]";

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

  const renderIcon = (icon, extraClassName = "") => {
    if (!icon) return null;

    return React.isValidElement(icon)
      ? React.cloneElement(icon, {
          className: [
            icon.props.className,
            "transition-transform duration-200 group-hover:translate-x-1",
            extraClassName,
          ]
            .filter(Boolean)
            .join(" "),
        })
      : icon;
  };

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
        renderIcon(leftIcon, leftIconClassName)
      )}
      {children && <span>{children}</span>}
      {!loading && renderIcon(rightIcon, rightIconClassName)}
    </Component>
  );
});

Button.displayName = "Button";

export default Button;
