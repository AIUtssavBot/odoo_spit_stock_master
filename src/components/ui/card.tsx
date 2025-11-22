import React from "react";

export function Card({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={`rounded border bg-white shadow-sm ${className ?? ""}`}>{children}</div>;
}