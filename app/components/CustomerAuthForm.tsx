"use client";

import Link from "next/link";
import { useState } from "react";
import type { FormEvent } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { useLang } from "@/app/context/LangContext";

type Props = { mode: "login" | "register"; initialError?: string };

export default function CustomerAuthForm({ mode, initialError = "" }: Props) {
  const router = useRouter();
  const { lang, dir } = useLang();
  const ar = lang === "ar";
  const isRegister = mode === "register";
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(initialError);
  const [notice, setNotice] = useState("");

  async function continueWithGoogle() {
    setBusy(true);
    setError("");
    const { error: authError } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    });
    if (authError) {
      setError(authError.message);
      setBusy(false);
    }
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setError("");
    setNotice("");

    if (isRegister) {
      const { data, error: authError } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: { data: { full_name: fullName.trim() } },
      });
      setBusy(false);
      if (authError) {
        setError(authError.message);
      } else if (data.session) {
        router.replace("/account");
      } else {
        setNotice("Check your email to confirm your account, then sign in.");
      }
      return;
    }

    const { data, error: authError } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });
    if (authError || !data.user) {
      setBusy(false);
      setError(authError?.message || "Could not sign in. Please try again.");
      return;
    }

    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", data.user.id)
      .maybeSingle();
    setBusy(false);
    if (profileError) {
      setError("We could not verify your account. Please try again.");
      await supabase.auth.signOut();
      return;
    }

    router.replace(profile?.role === "owner" ? "/owner-dashboard" : "/account");
  }

  return (
    <main className="flex min-h-[calc(100vh-80px)] items-center justify-center bg-white px-5 py-12" dir={dir}>
      <section className="w-full max-w-md">
        <div className="mb-8 text-center">
          <p className="napd-caps text-[10px] tracking-[0.28em] text-napd-muted">NAPD JEWELS</p>
          <h1 className="mt-4 font-serif text-3xl text-napd-ink">
            {isRegister ? (ar ? "أنشئ حسابك في نبض" : "Create your NAPD account") : (ar ? "أهلًا بعودتك" : "Welcome back")}
          </h1>
          <p className="mt-3 text-sm text-napd-muted">
            {ar ? "سجّل دخولك لمتابعة طلباتك ورصيد نقاطك." : "Sign in to keep your details and rewards together."}
          </p>
        </div>

        <div className="border border-napd-ink/10 p-6 shadow-[0_18px_45px_-35px_rgba(0,0,0,0.28)] md:p-8">
          <button type="button" onClick={continueWithGoogle} disabled={busy} className="flex w-full items-center justify-center gap-3 border border-napd-ink/15 px-4 py-3 text-sm transition hover:border-napd-ink/40 disabled:opacity-60">
            <GoogleMark /> {ar ? "المتابعة باستخدام Google" : "Continue with Google"}
          </button>
          <div className="my-6 flex items-center gap-3 text-[10px] tracking-[0.18em] text-napd-muted/70">
            <span className="h-px flex-1 bg-napd-ink/10" />{ar ? "أو بالبريد الإلكتروني" : "OR EMAIL"}<span className="h-px flex-1 bg-napd-ink/10" />
          </div>

          <form onSubmit={submit} className="space-y-4">
            {isRegister && <label className="block text-xs text-napd-muted">{ar ? "الاسم الكامل" : "Full name"}<input required autoComplete="name" value={fullName} onChange={(e) => setFullName(e.target.value)} className="mt-2 w-full border border-napd-ink/15 px-4 py-3 text-sm text-napd-ink outline-none focus:border-napd-ink" /></label>}
            <label className="block text-xs text-napd-muted">{ar ? "البريد الإلكتروني" : "Email"}<input required type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} className="mt-2 w-full border border-napd-ink/15 px-4 py-3 text-sm text-napd-ink outline-none focus:border-napd-ink" /></label>
            <label className="block text-xs text-napd-muted">{ar ? "كلمة المرور" : "Password"}<input required type="password" minLength={6} autoComplete={isRegister ? "new-password" : "current-password"} value={password} onChange={(e) => setPassword(e.target.value)} className="mt-2 w-full border border-napd-ink/15 px-4 py-3 text-sm text-napd-ink outline-none focus:border-napd-ink" /></label>
            {error && <p role="alert" className="text-sm text-red-700">{error}</p>}
            {notice && <p role="status" className="text-sm text-napd-emerald">{notice}</p>}
            <button type="submit" disabled={busy} className="napd-pill w-full disabled:cursor-wait disabled:opacity-60">
              {busy ? (ar ? "لحظة…" : "Please wait…") : isRegister ? (ar ? "إنشاء حساب" : "Create account") : (ar ? "تسجيل الدخول" : "Sign in")}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-napd-muted">
            {isRegister ? (ar ? "عندك حساب؟ " : "Already have an account? ") : (ar ? "أول مرة مع نبض؟ " : "New to NAPD? ")}
            <Link href={isRegister ? "/customer/login" : "/customer/register"} className="text-napd-ink underline underline-offset-4">
              {isRegister ? (ar ? "سجّل دخولك" : "Sign in") : (ar ? "أنشئ حساب" : "Create an account")}
            </Link>
          </p>
        </div>
        <p className="mt-5 text-center text-[11px] leading-6 text-napd-muted/80">{ar ? "تسجيل Google بستخدم اسمك وبريدك لإنشاء حسابك في نبض." : "Google sign-in uses your name and email to create your NAPD account."}</p>
      </section>
    </main>
  );
}

function GoogleMark() {
  return (
    <svg aria-hidden="true" viewBox="0 0 48 48" className="h-5 w-5">
      <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.77 7.18l7.73 6C44.4 38.02 46.98 31.92 46.98 24.55Z" />
      <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.9-5.8l-7.73-6c-2.14 1.44-4.88 2.3-8.17 2.3-6.26 0-11.57-4.22-13.46-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48Z" />
      <path fill="#FBBC05" d="M10.53 28.59a14.5 14.5 0 0 1 0-9.18l-7.98-6.19a23.9 23.9 0 0 0 0 21.56l7.98-6.19Z" />
      <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5Z" />
    </svg>
  );
}
