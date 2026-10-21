"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import type { ListingProduct } from "@/lib/productDisplay";
import { useLang } from "../context/LangContext";
import ProductCard, { ProductCardSkeleton } from "./ProductCard";

export default function StorefrontPieces() {
  const { lang } = useLang();
  const ar = lang === "ar";
  const [products, setProducts] = useState<ListingProduct[]>([]);
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");
  const [attempt, setAttempt] = useState(0);
  useEffect(() => {
    let alive = true;
    setStatus("loading");
    async function load() {
      try {
        const { data, error } = await supabase.from("products")
          .select("id,title,title_ar,price,final_price,has_discount,discount_percentage,image_url,created_at,quantity,is_featured,featured_at")
          .eq("is_active", true).gt("quantity", 0)
          .order("is_featured", { ascending: false, nullsFirst: false })
          .order("featured_at", { ascending: true, nullsFirst: false })
          .order("created_at", { ascending: false }).limit(8);
        if (error) throw error;
        if (alive) { setProducts((data as ListingProduct[]) || []); setStatus("ready"); }
      } catch { if (alive) setStatus("error"); }
    }
    void load();
    return () => { alive = false; };
  }, [attempt]);
  return <section id="pieces" className="ed4-pieces" dir={ar ? "rtl" : "ltr"} lang={lang} aria-labelledby="ed4-pieces-title">
    <div className="ed4-pieces-heading"><div><span className="ed4-eyebrow">THE NAPD SELECTION</span><h2 id="ed4-pieces-title">{ar ? "اختيارات نبض" : "The pieces to know"}</h2><p>{ar ? "من القطع المتوفرة، اختاري اللي بتشبهك." : "Available pieces, ready to become part of your everyday."}</p></div><Link href="/moissanite">{ar ? "اكتشفي المويسانيت ↗" : "Explore moissanite ↗"}</Link></div>
    {status === "error" ? <div role="alert" className="ed4-pieces-state"><p>{ar ? "تعذّر تحميل القطع هالمرة." : "We couldn't load the pieces this time."}</p><button type="button" onClick={() => setAttempt(n => n + 1)}>{ar ? "جرّبي مرة ثانية" : "Try again"}</button></div> : status === "ready" && products.length === 0 ? <p className="ed4-pieces-state">{ar ? "ما في قطع متوفرة للعرض حاليًا." : "No pieces are available to show right now."}</p> : <div className="ed4-pieces-grid" aria-busy={status === "loading"}>{status === "loading" ? Array.from({ length: 4 }, (_, i) => <ProductCardSkeleton key={i} />) : products.map(product => <ProductCard key={product.id} product={product} sizes="(min-width: 1024px) 23vw, 44vw" />)}</div>}
    <div className="ed4-pieces-links"><Link href="/rings">{ar ? "الخواتم" : "Rings"}</Link><Link href="/chains">{ar ? "السناسل" : "Necklaces"}</Link><Link href="/bracelets">{ar ? "الأساور" : "Bracelets"}</Link><Link href="/sets">{ar ? "الأطقم" : "Sets"}</Link></div>
  </section>;
}
