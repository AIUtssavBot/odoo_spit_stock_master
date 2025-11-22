"use client";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";

export default function ValidateOperationButton({ id, disabled }: { id: string; disabled?: boolean }) {
  const [loading, setLoading] = useState(false);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  async function onValidate() {
    setLoading(true);
    try {
      const res = await fetch(`/api/operations/${id}/validate`, {
        method: "POST",
      });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        alert(data.error || "Validation failed");
      } else {
        alert("Operation validated successfully");
        startTransition(() => {
          router.refresh();
        });
      }
    } catch (err: any) {
      alert(err?.message || String(err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      onClick={onValidate}
      disabled={disabled || loading || isPending}
      className={`rounded px-3 py-1 text-white ${disabled || loading || isPending ? "bg-gray-400" : "bg-green-600 hover:bg-green-700"}`}
    >
      {loading || isPending ? "Validating..." : "Validate"}
    </button>
  );
}