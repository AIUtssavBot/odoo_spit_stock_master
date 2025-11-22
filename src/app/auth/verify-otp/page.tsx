"use client";
import { supabase } from "@/lib/supabaseClient";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function VerifyOtpPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [token, setToken] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      // Verify OTP sent via password recovery flow
      const { error: verifyErr } = await supabase.auth.verifyOtp({ type: "recovery", email, token });
      if (verifyErr) throw verifyErr;
      const { error: updateErr } = await supabase.auth.updateUser({ password: newPassword });
      if (updateErr) throw updateErr;
      alert("Password updated. Please login.");
      router.push("/auth/login");
    } catch (err: any) {
      alert(err?.message || String(err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="p-6">
      <h1 className="text-2xl font-semibold">Verify OTP & Set New Password</h1>
      <form onSubmit={onSubmit} className="mt-4 max-w-md space-y-3">
        <label className="block">
          <div className="text-sm text-gray-600">Email</div>
          <input type="email" className="mt-1 w-full rounded border px-2 py-1" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </label>
        <label className="block">
          <div className="text-sm text-gray-600">OTP Code</div>
          <input className="mt-1 w-full rounded border px-2 py-1" value={token} onChange={(e) => setToken(e.target.value)} required />
        </label>
        <label className="block">
          <div className="text-sm text-gray-600">New Password</div>
          <input type="password" className="mt-1 w-full rounded border px-2 py-1" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required />
        </label>
        <button disabled={loading} className={`rounded bg-blue-600 px-4 py-2 text-white ${loading ? "opacity-50" : "hover:bg-blue-700"}`}>{loading ? "Updating..." : "Update Password"}</button>
      </form>
    </main>
  );
}