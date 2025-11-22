"use client";
import { supabase } from "@/lib/supabaseClient";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function ResetPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo: `${location.origin}/auth/verify-otp` });
      if (error) throw error;
      alert("If the email exists, a reset code/link was sent.");
      router.push("/auth/verify-otp");
    } catch (err: any) {
      alert(err?.message || String(err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="p-6">
      <h1 className="text-2xl font-semibold">Reset password</h1>
      <form onSubmit={onSubmit} className="mt-4 max-w-md space-y-3">
        <label className="block">
          <div className="text-sm text-gray-600">Email</div>
          <input type="email" className="mt-1 w-full rounded border px-2 py-1" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </label>
        <button disabled={loading} className={`rounded bg-blue-600 px-4 py-2 text-white ${loading ? "opacity-50" : "hover:bg-blue-700"}`}>{loading ? "Sending..." : "Send OTP"}</button>
      </form>
    </main>
  );
}