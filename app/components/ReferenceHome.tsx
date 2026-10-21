"use client";

import { useLang } from "../context/LangContext";
import StorefrontPieces from "./StorefrontPieces";
import Link from "next/link";
import ReferenceArtwork from "./ReferenceArtwork";

const COLLECTIONS = [
  { ar: "خواتم", name: "Rings", href: "/rings", region: "rings" },
  { ar: "سناسل", name: "Necklaces", href: "/chains", region: "necklaces" },
  { ar: "أقراط", name: "Earrings", href: "/earrings", region: "earrings" },
  { ar: "أساور", name: "Bracelets", href: "/bracelets", region: "bracelets" },
] as const;

export default function ReferenceHome() {
  const { lang } = useLang();
  const ar = lang === "ar";
  return <div className="ed4-page" lang="en" dir="ltr">
    <section className="ed4-hero" aria-labelledby="ed4-title">
      <div className="ed4-portrait"><ReferenceArtwork region="hero" label="NAPD monochrome jewelry editorial portrait" /></div>
      <div className="ed4-copy"><span className="ed4-eyebrow">NAPD / STERLING SILVER 925</span><h1 id="ed4-title"><span>SILVER</span><span>LIVES</span><span>BOLDER</span></h1><p lang={lang} dir={ar ? "rtl" : "ltr"}>{ar ? <>فضة ومويسانيت.<br />تفاصيل بتشبهك، لكل يوم.</> : <>Everyday pieces.<br />A little more you.</>}</p><Link href="#pieces" className="ed4-shop-button">{ar ? "اكتشفي القطع" : "Discover the pieces"}</Link></div>
    </section>
    <nav id="collection" className="ed4-collection-strip" aria-label="Shop by collection">{COLLECTIONS.map(({ ar: nameAr, name, href, region }) => <Link href={href} key={region} className="ed4-collection-link"><div className="ed4-collection-photo"><ReferenceArtwork region={region} label={`${name} editorial collection artwork`} /></div><span lang={lang}>{ar ? nameAr : name}</span></Link>)}</nav>
    <StorefrontPieces />
    <section className="ed4-contact" dir={ar ? "rtl" : "ltr"} lang={lang} aria-label={ar ? "نبض، معك بالاختيار" : "Here to help you choose"}>
      <div><span className="ed4-eyebrow">NAPD / RAMALLAH</span><h2>{ar ? "قطعتك، على ذوقك." : "Find your kind of silver."}</h2><p>{ar ? "بدك مساعدة بالاختيار؟ احكي معنا، وبنساعدك تلاقي القطعة المناسبة." : "Need a hand choosing? Talk to us and find the piece that feels right."}</p><a href="https://wa.me/972593255260" target="_blank" rel="noopener noreferrer" className="ed4-shop-button">{ar ? "احكي معنا على واتساب" : "Talk to us on WhatsApp"}</a></div>
      <div><p>{ar ? "رام الله – شارع الإرسال – سيتي مول – الطابق الأول" : "Al-Ersal Street, City Mall, first floor, Ramallah"}</p><a href="tel:0593255260" dir="ltr">0593255260</a><p>{ar ? "فضة إسترلينية 925 ومويسانيت. كفالة حسب سياسة نبض." : "Sterling silver 925 & moissanite. NAPD warranty policy applies."}</p></div>
    </section>
  </div>;
}
