import React from "react";

type Variant = "default" | "warning" | "destructive" | "secondary";

export function Badge({ children, variant = "default", className }: { children: React.ReactNode; variant?: Variant; className?: string }) {
  const variantClass =
    variant === "warning"
      ? "bg-yellow-100 text-yellow-800"
      : variant === "destructive"
      ? "bg-red-100 text-red-800"
      : variant === "secondary"
      ? "bg-gray-100 text-gray-800"
      : "bg-blue-100 text-blue-800";
  return <span className={`rounded px-2 py-1 text-xs ${variantClass} ${className ?? ""}`}>{children}</span>;
}