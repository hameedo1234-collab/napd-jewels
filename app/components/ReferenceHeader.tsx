"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { Heart, Search, ShoppingBag, X } from "lucide-react";
import Header from "./Header";
import ProductCard from "./ProductCard";
import { useCart } from "../context/CartContext";
import { useLang } from "../context/LangContext";
import { useIsOwner } from "@/lib/useIsOwner";
import { supabase } from "@/lib/supabase";
import { productName, type ListingProduct } from "@/lib/productDisplay";
import { useSavedPieces } from "@/lib/savedPieces";

type Panel = "search" | "saved" | "about" | null;
export default function ReferenceHeader() {
  const pathname = usePathname();
  const { cart } = useCart();
  const { lang, setLang, t } = useLang();
  const { isOwner } = useIsOwner();
  const { ids } = useSavedPieces();
  const [panel, setPanel] = useState<Panel>(null);
  const [query, setQuery] = useState("");
  const [products, setProducts] = useState<ListingProduct[]>([]);
  const [status, setStatus] = useState("loading");
  const dialog = useRef<HTMLDialogElement>(null);
  const opener = useRef<HTMLButtonElement | null>(null);
  useEffect(() => { if (panel) dialog.current?.showModal(); else dialog.current?.close(); }, [panel]);
  useEffect(() => {
    if (panel !== "search" && panel !== "saved") return;
    let alive = true;
    supabase.from("products").select("id,title,title_ar,price,final_price,has_discount,discount_percentage,image_url,created_at,quantity").eq("is_active", true).gt("quantity", 0).order("created_at", { ascending: false })
      .then(({ data, error }) => { if (alive) { setProducts((data as ListingProduct[]) || []); setStatus(error ? "error" : "ready"); } });
    return () => { alive = false; };
  }, [panel]);
  function open(next: Panel, button: HTMLButtonElement) { opener.current = button; setQuery(""); setStatus("loading"); setPanel(next); }
  function close() { setPanel(null); opener.current?.focus(); }
  const filtered = products.filter((p) => panel === "saved" ? ids.includes(p.id) : `${p.title} ${p.title_ar || ""} ${productName(p, lang)}`.toLowerCase().includes(query.trim().toLowerCase()));
  const count = cart.reduce((n, item) => n + item.quantity, 0);
  if (pathname !== "/") return <Header />;
  return <>
    <header className="ed4-header" dir="ltr" lang="en">
      <nav className="ed4-header-links" aria-label="Main navigation"><Link href="/rings">Shop</Link><Link href="/#collection">Collections</Link><button type="button" onClick={(e) => open("about", e.currentTarget)}>About</button></nav>
      <Link href="/" className="ed4-brand" aria-label="NAPD Jewelry"><span>NAPD</span><small>JEWELRY</small></Link>
      <div className="ed4-header-actions"><button type="button" aria-label="Search jewelry" onClick={(e) => open("search", e.currentTarget)}><Search strokeWidth={1.3} /></button><button type="button" aria-label="Saved pieces" onClick={(e) => open("saved", e.currentTarget)}><Heart strokeWidth={1.3} />{ids.length > 0 && <span className="ed4-action-count">{ids.length}</span>}</button><Link href="/cart" aria-label={t("nav.cart")}><ShoppingBag strokeWidth={1.3} />{count > 0 && <span className="ed4-action-count">{count}</span>}</Link></div>
    </header>
    <dialog ref={dialog} className="ed4-dialog" onCancel={close} onClose={() => setPanel(null)} aria-labelledby="ed4-panel-title" dir={lang === "ar" ? "rtl" : "ltr"}>
      <div className="ed4-dialog-top"><h2 id="ed4-panel-title">{panel === "search" ? (lang === "ar" ? "ابحثي عن قطعتك" : "Find your piece") : panel === "saved" ? (lang === "ar" ? "قطعك المفضّلة" : "Saved pieces") : "NAPD Jewelry"}</h2><button type="button" onClick={close} aria-label={lang === "ar" ? "إغلاق" : "Close"}><X size={22} strokeWidth={1.3} /></button></div>
      {panel === "about" ? <div className="ed4-about"><p>{lang === "ar" ? "فضة إسترلينية 925 ومويسانيت. كفالة حسب سياسة نبض." : "Sterling silver 925 and moissanite. Covered under the NAPD warranty policy."}</p><p>{lang === "ar" ? "رام الله — شارع الإرسال — سيتي مول — الطابق الأول" : "Al-Ersal Street, City Mall, first floor, Ramallah."}</p><a href="https://wa.me/972593255260" target="_blank" rel="noopener noreferrer" dir="ltr">0593255260</a><a href="https://instagram.com/napd.ps" target="_blank" rel="noopener noreferrer">@napd.ps</a><Link href="/moissanite" onClick={close}>{t("cat.MOISSANITE")}</Link><Link href="/sets" onClick={close}>{t("cat.SETS")}</Link><Link href="/login" onClick={close}>{t("nav.account")}</Link>{isOwner && <><Link href="/owner-dashboard" onClick={close}>{t("nav.dashboard")}</Link><Link href="/owner/orders" onClick={close}>{t("nav.orders")}</Link></>}<button type="button" onClick={() => setLang(lang === "ar" ? "en" : "ar")}>{t("lang.switch")}</button></div> : <>
        {panel === "search" && <input aria-label={lang === "ar" ? "البحث عن منتج" : "Search products"} type="search" value={query} onChange={(e) => setQuery(e.target.value)} placeholder={lang === "ar" ? "اسم القطعة…" : "Search pieces…"} className="ed4-search-input" />}
        {status === "loading" ? <p role="status">{lang === "ar" ? "جارِ التحميل…" : "Loading…"}</p> : status === "error" ? <p role="alert">{lang === "ar" ? "تعذّر تحميل القطع. جرّبي مرة ثانية." : "Could not load pieces. Please try again."}</p> : filtered.length ? <div className="ed4-search-results">{filtered.map((product) => <div key={product.id} onClick={(e) => { if ((e.target as HTMLElement).closest("a")) close(); }}><ProductCard product={product} /></div>)}</div> : <p>{panel === "saved" ? (lang === "ar" ? "احفظي القطع بقلب صغير أثناء التصفح، وبتلاقي المتوفر منها هون." : "Tap the heart on a piece while browsing. Available saved pieces will appear here.") : (lang === "ar" ? "ما لقينا قطعة بهالاسم." : "No pieces matched your search.")}</p>}
      </>}
    </dialog>
  </>;
}
