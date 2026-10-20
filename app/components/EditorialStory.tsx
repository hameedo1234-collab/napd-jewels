"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { useCollection } from "@/lib/useCollection";
import { useLang } from "../context/LangContext";

export default function EditorialStory() {
  const { lang } = useLang();
  const { items, loading } = useCollection("MOISSANITE");
  if (loading || !items.length) return null;
  const ar = lang === "ar";
  return (
    <section className="editorial-story" aria-labelledby="story-title">
      <div className="editorial-story-image"><Image src="/banners/moissanite.webp" alt={ar ? "تفاصيل من مجموعة صور مويسانيت نبض" : "Jewelry details from the NAPD moissanite campaign"} fill sizes="(min-width: 900px) 58vw, 100vw" className="object-cover" /><span className="editorial-image-caption" dir="ltr">THE MOISSANITE EDIT / NAPD</span></div>
      <div className="editorial-story-copy"><p className="editorial-kicker">{ar ? "مويسانيت × فضة 925" : "MOISSANITE × STERLING SILVER"}</p><h2 id="story-title">{ar ? <>ضوء.<br />لا يُنسى.</> : <>A LITTLE<br />MORE<br /><em>brilliance.</em></>}</h2><p>{ar ? "لمعة تلفت النظر. اختاري قطعتك من تشكيلة المويسانيت المتوفرة." : "Light-catching moissanite. Sterling silver settings. Discover the pieces in the current edit."}</p><Link href="/moissanite" className="editorial-button editorial-button-light">{ar ? "اكتشفي المويسانيت" : "DISCOVER MOISSANITE"}<ArrowUpRight size={18} aria-hidden="true" className="napd-flip" /></Link></div>
    </section>
  );
}
