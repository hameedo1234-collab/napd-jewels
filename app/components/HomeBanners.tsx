"use client";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { useLang } from "../context/LangContext";
import CollectionRotation from "./CollectionRotation";
import type { DictKey } from "@/lib/i18n";
const collections: { category: string; href: string; label: DictKey }[] = [
 {category:"RINGS",href:"/rings",label:"cat.RINGS"},
 {category:"CHAINS",href:"/chains",label:"cat.CHAINS"},
 {category:"BRACELETS",href:"/bracelets",label:"cat.BRACELETS"},
 {category:"MOISSANITE",href:"/moissanite",label:"cat.MOISSANITE"},
];
export default function HomeBanners() {
 const {t,lang}=useLang();
 return <section id="collection" className="napd-clean-collections" aria-labelledby="clean-collections-title">
  <div className="napd-clean-heading"><span>NAPD / 925</span><h2 id="clean-collections-title">{lang==="ar"?"اكتشفي المجموعات":"Shop by collection"}</h2></div>
  <div className="napd-clean-grid">{collections.map(c=><Link href={c.href} key={c.category} className="napd-clean-tile"><CollectionRotation category={c.category} label={t(c.label)} /><div><h3>{t(c.label)}</h3><ArrowUpRight size={18} aria-hidden="true"/></div><span>{t("col.explore")}</span></Link>)}</div>
 </section>;
}
