"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { useLang } from "@/app/context/LangContext";

type CustomerProfile = { full_name: string | null; role: "owner" | "customer" | null };
type CustomerOrder = {
  id: string;
  created_at: string;
  status: string;
  total: number;
};
type CustomerOrderItem = {
  order_id: string;
  title: string;
  quantity: number;
};
type LoyaltyEntry = { points_delta: number; entry_type: string; created_at: string; order_id: string };

const STATUS_AR: Record<string, string> = {
  pending: "قيد المراجعة",
  confirmed: "تم التأكيد",
  preparing: "قيد التجهيز",
  shipped: "تم الشحن",
  delivered: "تم التسليم",
  cancelled: "ملغي",
};

export default function AccountPage() {
  const router = useRouter();
  const { lang, dir } = useLang();
  const ar = lang === "ar";
  const [email, setEmail] = useState("");
  const [authName, setAuthName] = useState("");
  const [profile, setProfile] = useState<CustomerProfile | null>(null);
  const [orders, setOrders] = useState<CustomerOrder[]>([]);
  const [items, setItems] = useState<CustomerOrderItem[]>([]);
  const [loyaltyEntries, setLoyaltyEntries] = useState<LoyaltyEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [signedIn, setSignedIn] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    async function loadAccount() {
      const { data: auth, error: authError } = await supabase.auth.getUser();
      if (!active) return;
      if (authError || !auth.user) {
        setLoading(false);
        return;
      }

      const user = auth.user;
      setSignedIn(true);
      setEmail(user.email ?? "");
      const metadataName = user.user_metadata?.full_name || user.user_metadata?.name;
      setAuthName(typeof metadataName === "string" ? metadataName : "");

      const [profileResult, ordersResult, loyaltyResult] = await Promise.all([
        supabase.from("profiles").select("full_name, role").eq("id", user.id).maybeSingle(),
        supabase
          .from("orders")
          .select("id, created_at, status, total")
          .eq("customer_user_id", user.id)
          .order("created_at", { ascending: false })
          .limit(20),
        supabase
          .from("loyalty_transactions")
          .select("points_delta, entry_type, created_at, order_id")
          .eq("customer_id", user.id)
          .order("created_at", { ascending: false }),
      ]);

      if (!active) return;
      if (profileResult.error) setError(ar ? "تعذّر تحميل بيانات الحساب." : "We could not load your account details.");
      if (ordersResult.error || loyaltyResult.error) {
        setError(ar ? "تعذّر تحميل سجل الطلبات أو النقاط." : "We could not load your orders or points.");
      }

      const nextOrders = (ordersResult.data ?? []) as CustomerOrder[];
      const nextEntries = (loyaltyResult.data ?? []) as LoyaltyEntry[];
      setProfile(profileResult.data as CustomerProfile | null);
      setOrders(nextOrders);
      setLoyaltyEntries(nextEntries);

      if (nextOrders.length) {
        const { data: orderItems, error: itemsError } = await supabase
          .from("order_items")
          .select("order_id, title, quantity")
          .in("order_id", nextOrders.map((order) => order.id));
        if (!active) return;
        if (itemsError) setError(ar ? "تعذّر تحميل تفاصيل القطع." : "We could not load the pieces in your orders.");
        setItems((orderItems ?? []) as CustomerOrderItem[]);
      }

      setLoading(false);
      if (profileResult.data?.role === "owner") router.replace("/owner-dashboard");
    }

    void loadAccount();
    return () => {
      active = false;
    };
  }, [ar, router]);

  const pointsBalance = useMemo(
    () => loyaltyEntries.reduce((sum, entry) => sum + Number(entry.points_delta || 0), 0),
    [loyaltyEntries]
  );

  async function signOut() {
    await supabase.auth.signOut();
    router.replace("/");
  }

  const money = (amount: number) => `${Number(amount || 0).toFixed(2)} ₪`;
  const date = (value: string) =>
    new Intl.DateTimeFormat(ar ? "ar-PS" : "en-GB", { dateStyle: "medium" }).format(new Date(value));
  const orderItems = (orderId: string) => items.filter((item) => item.order_id === orderId);

  if (loading) {
    return <main className="mx-auto flex min-h-[60vh] max-w-4xl items-center justify-center px-6" dir={dir}><p className="text-sm text-napd-muted">{ar ? "جارٍ تحميل حسابك…" : "Loading your account…"}</p></main>;
  }

  if (!signedIn) {
    return (
      <main className="mx-auto max-w-xl px-5 pb-24 pt-16 text-center md:pt-24" dir={dir}>
        <p className="napd-caps text-[10px] tracking-[0.28em] text-napd-muted">NAPD JEWELS</p>
        <h1 className="mt-4 font-serif text-3xl text-napd-ink">{ar ? "حسابك في نبض" : "Your NAPD account"}</h1>
        <p className="mx-auto mt-4 max-w-md text-sm leading-7 text-napd-muted">{ar ? "سجّل دخولك لتتابع طلباتك ورصيد نقاطك. بتقدر تكمّل الشراء كضيف كمان." : "Sign in to keep your customer details, orders, and rewards in one place. Guest checkout is also available."}</p>
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Link href="/customer/login" className="napd-pill">{ar ? "تسجيل الدخول" : "Sign in"}</Link>
          <Link href="/customer/register" className="inline-flex min-h-11 items-center justify-center border border-napd-ink/20 px-6 text-xs uppercase tracking-[0.16em] text-napd-ink transition hover:border-napd-ink">{ar ? "إنشاء حساب" : "Create account"}</Link>
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-4xl px-5 pb-24 pt-14 md:px-8 md:pt-20" dir={dir}>
      <div className="mb-12 text-center">
        <p className="napd-caps text-[11px] tracking-[0.28em] text-napd-muted">NAPD JEWELS</p>
        <h1 className="mt-4 font-serif text-3xl text-napd-ink md:text-4xl">{ar ? "حسابي" : "My account"}</h1>
        <p className="mt-3 text-sm text-napd-muted">{ar ? "مساحتك الخاصة مع نبض." : "Your personal space with NAPD."}</p>
      </div>

      {error && <p role="alert" className="mb-6 border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">{error}</p>}

      <section className="grid gap-5 md:grid-cols-[1fr_0.8fr]">
        <div className="border-y border-napd-ink/10 py-8" aria-labelledby="account-details">
          <h2 id="account-details" className="napd-caps text-[11px] tracking-[0.2em] text-napd-muted">{ar ? "بيانات الحساب" : "Account details"}</h2>
          <dl className="mt-6 grid gap-5 sm:grid-cols-2">
            <div><dt className="text-xs text-napd-muted">{ar ? "الاسم" : "Name"}</dt><dd className="mt-1 text-sm text-napd-ink">{profile?.full_name || authName || (ar ? "زبون نبض" : "NAPD customer")}</dd></div>
            <div><dt className="text-xs text-napd-muted">{ar ? "البريد الإلكتروني" : "Email"}</dt><dd className="mt-1 break-all text-sm text-napd-ink" dir="ltr">{email}</dd></div>
          </dl>
        </div>

        <div className="border border-napd-ink/10 bg-napd-paper/60 p-6 md:p-8" aria-labelledby="loyalty-heading">
          <p className="napd-caps text-[10px] tracking-[0.22em] text-napd-bronze">NAPD REWARDS</p>
          <h2 id="loyalty-heading" className="mt-3 font-serif text-2xl text-napd-ink">{ar ? "رصيد نقاطك" : "Your points balance"}</h2>
          <p className="mt-4 text-4xl text-napd-emerald" aria-live="polite">{new Intl.NumberFormat(ar ? "ar-PS" : "en").format(pointsBalance)}</p>
          <p className="mt-3 text-sm leading-7 text-napd-muted">{ar ? "بتنضاف نقطة عن كل شيكل من قيمة القطع بعد تسليم الطلب. قيمة الخصم بالنقاط بنعلنها لاحقًا." : "Earn one point per shekel spent on pieces after delivery. We’ll announce the points-to-discount value later."}</p>
        </div>
      </section>

      <section className="mt-12" aria-labelledby="orders-heading">
        <div className="flex items-end justify-between gap-4 border-b border-napd-ink/10 pb-4">
          <div><p className="napd-caps text-[10px] tracking-[0.22em] text-napd-muted">NAPD JEWELS</p><h2 id="orders-heading" className="mt-2 font-serif text-2xl text-napd-ink">{ar ? "طلباتي" : "My orders"}</h2></div>
          <span className="text-xs text-napd-muted">{orders.length}</span>
        </div>
        {orders.length === 0 ? (
          <div className="py-10 text-center"><p className="text-sm text-napd-muted">{ar ? "ما في طلبات مرتبطة بحسابك لحد الآن." : "No orders are linked to your account yet."}</p><Link href="/rings" className="mt-5 inline-flex text-xs underline underline-offset-4">{ar ? "تصفّح القطع" : "Browse the collection"}</Link></div>
        ) : (
          <div className="divide-y divide-napd-ink/10">
            {orders.map((order) => {
              const contents = orderItems(order.id);
              return (
                <article key={order.id} className="flex flex-col gap-4 py-6 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <p className="text-sm font-medium text-napd-ink">{ar ? STATUS_AR[order.status] || order.status : order.status.replaceAll("_", " ")}</p>
                    <p className="mt-1 text-xs text-napd-muted">{date(order.created_at)}</p>
                    <ul className="mt-3 space-y-1 text-sm text-napd-muted">
                      {contents.map((item, index) => <li key={`${item.order_id}-${index}`}>{item.title} × {item.quantity}</li>)}
                    </ul>
                  </div>
                  <p className="shrink-0 text-sm text-napd-ink">{money(order.total)}</p>
                </article>
              );
            })}
          </div>
        )}
      </section>

      <div className="mt-8 flex flex-col items-center justify-between gap-5 sm:flex-row">
        <Link href="/rings" className="napd-pill">{ar ? "كمّل التسوق" : "Continue shopping"}</Link>
        <button type="button" onClick={signOut} className="text-xs text-napd-muted underline underline-offset-4 transition hover:text-napd-ink">{ar ? "تسجيل الخروج" : "Sign out"}</button>
      </div>
    </main>
  );
}
