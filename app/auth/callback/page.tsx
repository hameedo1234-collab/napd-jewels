"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function AuthCallbackPage() {
  const router = useRouter();

  useEffect(() => {
    let active = true;

    async function finishSignIn() {
      const { data, error } = await supabase.auth.getSession();
      if (!active) return;

      if (error || !data.session?.user.id) {
        router.replace("/customer/login?error=google-sign-in");
        return;
      }

      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", data.session.user.id)
        .maybeSingle();

      if (!active) return;
      router.replace(profile?.role === "owner" ? "/owner-dashboard" : "/account");
    }

    void finishSignIn();
    return () => {
      active = false;
    };
  }, [router]);

  return (
    <main className="flex min-h-[60vh] items-center justify-center px-6 text-center">
      <p className="text-sm text-black/60" role="status">Completing sign in…</p>
    </main>
  );
}
