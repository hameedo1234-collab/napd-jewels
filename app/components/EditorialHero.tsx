"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowDown, ArrowUpRight } from "lucide-react";
import { useLang } from "../context/LangContext";

export default function EditorialHero() {
  const { lang } = useLang();
  const ar = lang === "ar";
  return (
    <section className="editorial-hero" aria-labelledby="editorial-title">
      <div className="editorial-hero-image">
        <Image src="/editorial-hero.webp" alt={ar ? "بورتريه تحريري بالأبيض والأسود لهوية نبض" : "A monochrome fashion portrait for NAPD"} fill priority sizes="(min-width: 900px) 55vw, 100vw" className="object-cover" />
        <span className="editorial-image-caption" dir="ltr">NAPD / A STUDY IN SILVER</span>
      </div>
      <div className="editorial-hero-copy">
        <p className="editorial-kicker">{ar ? "نبض للمجوهرات — فضة إسترلينية 925" : "NAPD JEWELS — STERLING SILVER 925"}</p>
        <h1 id="editorial-title" className="editorial-headline">
          {ar ? <><span>تفاصيل</span><span>تُشبهك.</span></> : <><span>SILVER</span><span>WITH</span><span>ATTITUDE.</span></>}
        </h1>
        <p className="editorial-hero-description">{ar ? "فضة 925 ومويسانيت. قطع تختاريها على ذوقك، وتكمّل حكايتك." : "Sterling silver and moissanite. Considered pieces. Unmistakably you."}</p>
        <Link href="#collection" className="editorial-button">{ar ? "اكتشفي التشكيلات" : "EXPLORE THE COLLECTIONS"}<ArrowUpRight aria-hidden="true" size={18} className="napd-flip" /></Link>
        <a href="https://wa.me/972593255260" target="_blank" rel="noopener noreferrer" className="editorial-text-link">{ar ? "نساعدك تختاري عبر واتساب" : "A little help choosing? WhatsApp us"}</a>
        <div className="editorial-hero-bottom"><span dir="ltr">RAMALLAH, PALESTINE</span><a href="#collection" aria-label={ar ? "انتقلي للتشكيلات" : "Scroll to collections"}><ArrowDown size={18} aria-hidden="true" /></a><span dir="ltr">01 — THE EDIT</span></div>
      </div>
    </section>
  );
}
