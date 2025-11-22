import React from "react";

type Variant = "default" | "outline" | "destructive" | "secondary" | "ghost";
type Size = "default" | "sm" | "lg";

export function Button({ children, variant = "default", size = "default", className, asChild, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant, size?: Size, asChild?: boolean }) {
  const variantClass =
    variant === "outline"
      ? "border bg-white text-gray-800 hover:bg-gray-50"
      : variant === "destructive"
      ? "bg-red-600 text-white hover:bg-red-700"
      : variant === "secondary"
      ? "bg-gray-800 text-white hover:bg-black"
      : variant === "ghost"
      ? "bg-transparent text-gray-700 hover:bg-gray-100"
      : "bg-blue-600 text-white hover:bg-blue-700";
  const sizeClass = size === "sm" ? "px-3 py-1 text-sm" : size === "lg" ? "px-6 py-3 text-lg" : "px-4 py-2";
  
  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children, {
      className: `rounded ${sizeClass} ${variantClass} ${className ?? ""}`,
      ...props
    } as React.Attributes);
  }

  return (
    <button className={`rounded inline-flex items-center justify-center ${sizeClass} ${variantClass} ${className ?? ""}`} {...props}>
      {children}
    </button>
  );
}