"use client";
import { supabase } from "@/lib/supabaseClient";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function ProfilePage() {
  const router = useRouter();
  const [email, setEmail] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setEmail(data.user?.email ?? null));
  }, []);

  async function onLogout() {
    await supabase.auth.signOut();
    router.push("/auth/login");
  }

  return (
    <main className="p-6">
      <h1 className="text-2xl font-semibold">My Profile</h1>
      <div className="mt-4 rounded border bg-white p-4">
        <div className="text-sm text-gray-600">Email</div>
        <div className="mt-1">{email ?? "-"}</div>
      </div>
      <button onClick={onLogout} className="mt-4 rounded bg-gray-800 px-4 py-2 text-white hover:bg-black">Logout</button>
    </main>
  );
}