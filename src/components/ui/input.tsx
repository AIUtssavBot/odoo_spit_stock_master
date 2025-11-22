import React from "react";

export function Input({ className, ...props }: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input className={`w-full rounded border px-2 py-1 ${className ?? ""}`} {...props} />;
}