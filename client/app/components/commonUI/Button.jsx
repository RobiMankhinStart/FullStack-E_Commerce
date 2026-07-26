import React from "react";
import { cva } from "class-variance-authority";
import { Slot } from "@radix-ui/react-slot";
import { cn } from "@/lib/utils"; // Standard helper: twMerge(clsx(...))

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60 select-none",
  {
    variants: {
      variant: {
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
        light:
          "bg-white text-slate-900 hover:bg-slate-100 focus:ring-slate-400",
      },
      size: {
        sm: "px-3 py-2 text-sm",
        md: "px-4 py-3 text-sm",
        lg: "px-6 py-3.5 text-base",
        icon: "h-10 w-10 p-0",
      },
      rounded: {
        none: "rounded-none",
        sm: "rounded-lg",
        md: "rounded-xl",
        lg: "rounded-2xl",
        full: "rounded-full",
      },
      fullWidth: {
        true: "w-full",
        false: "",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
      rounded: "md",
      fullWidth: false,
    },
  },
);

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
    asChild = false,
    ...props
  },
  ref,
) {
  const Component = asChild ? Slot : "button";

  return (
    <Component
      ref={ref}
      type={asChild ? undefined : type}
      disabled={disabled || loading}
      className={cn(
        buttonVariants({ variant, size, rounded, fullWidth }),
        className,
      )}
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
