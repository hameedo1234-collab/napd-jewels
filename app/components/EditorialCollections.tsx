"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { useCollection } from "@/lib/useCollection";
import { useLang } from "../context/LangContext";
import type { DictKey } from "@/lib/i18n";

const COLLECTIONS: { name: string; href: string; label: DictKey; number: string }[] = [
  { name: "RINGS", href: "/rings", label: "cat.RINGS", number: "01" },
  { name: "CHAINS", href: "/chains", label: "cat.CHAINS", number: "02" },
  { name: "BRACELETS", href: "/bracelets", label: "cat.BRACELETS", number: "03" },
  { name: "MOISSANITE", href: "/moissanite", label: "cat.MOISSANITE", number: "04" },
];

function CollectionTile({ collection }: { collection: (typeof COLLECTIONS)[number] }) {
  const { items, loading } = useCollection(collection.name);
  const { t, lang } = useLang();
  if (!loading && !items.length) return null;
  const image = items.find((p) => p.image_url)?.image_url;
  return (
    <Link href={collection.href} className="editorial-collection">
      <div className="editorial-collection-image">
        {image ? <Image src={image} alt={t(collection.label)} fill sizes="(min-width: 900px) 23vw, 46vw" className="object-contain" /> : <div className="napd-skeleton absolute inset-0" />}
        <span className="editorial-collection-number" dir="ltr">/{collection.number}</span>
      </div>
      <div className="editorial-collection-label"><h3>{t(collection.label)}</h3><ArrowUpRight size={22} strokeWidth={1.25} aria-hidden="true" className="napd-flip" /></div>
      <p>{lang === "ar" ? "اكتشفي التشكيلة" : "DISCOVER THE COLLECTION"}</p>
    </Link>
  );
}

export default function EditorialCollections() {
  const { lang } = useLang();
  return (
    <section id="collection" className="editorial-collections" aria-labelledby="collection-heading">
      <div className="editorial-section-top"><p className="editorial-kicker">{lang === "ar" ? "اختاري بطريقتك" : "FIND YOUR SIGNATURE"}</p><span dir="ltr">925 / NAPD</span></div>
      <h2 id="collection-heading" className="editorial-section-title">{lang === "ar" ? "كل قطعة، حضور." : "YOUR EVERYDAY. ELEVATED."}</h2>
      <div className="editorial-collection-grid">{COLLECTIONS.map((collection) => <CollectionTile key={collection.name} collection={collection} />)}</div>
    </section>
  );
}
