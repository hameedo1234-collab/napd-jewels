"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Instagram, Facebook, Phone, ArrowUpRight } from "lucide-react";
import { useLang } from "../context/LangContext";

export default function EditorialFooter() {
  const { lang, t } = useLang();
  const pathname = usePathname();
  const ar = lang === "ar";
  if (pathname === "/") return null;
  return (
    <footer className="editorial-footer">
      <div className="editorial-footer-top">
        <div><Link href="/" className="editorial-footer-brand" dir="ltr" aria-label="NAPD Jewels">NAPD</Link><p className="mt-5">{ar ? "تفاصيل تُشبهك. فضة 925 ومويسانيت." : "Considered pieces. Unmistakably you."}</p><div className="editorial-footer-social"><a href="https://instagram.com/napd.ps" target="_blank" rel="noopener noreferrer" aria-label="Instagram"><Instagram size={18} strokeWidth={1.3} /></a><a href="https://facebook.com/napd.ps" target="_blank" rel="noopener noreferrer" aria-label="Facebook"><Facebook size={18} strokeWidth={1.3} /></a><a href="https://wa.me/972593255260" target="_blank" rel="noopener noreferrer" aria-label="WhatsApp"><Phone size={18} strokeWidth={1.3} /></a></div></div>
        <div><h2 className="editorial-footer-label">{ar ? "زورينا في نبض" : "FIND US IN RAMALLAH"}</h2><p>{ar ? <>رام الله — شارع الإرسال<br />سيتي مول — الطابق الأول</> : <>Al-Ersal Street, City Mall<br />First floor, Ramallah, Palestine</>}</p><a className="editorial-footer-contact" href="https://wa.me/972593255260" target="_blank" rel="noopener noreferrer"><bdi dir="ltr">0593255260</bdi> <ArrowUpRight className="inline napd-flip" size={17} aria-hidden="true" /></a><p className="mt-3" dir="ltr">@napd.ps</p></div>
        <div><h2 className="editorial-footer-label">{ar ? "اختاري قطعتك" : "THE COLLECTIONS"}</h2><nav className="editorial-footer-nav"><Link href="/rings">{t("cat.RINGS")}</Link><Link href="/chains">{t("cat.CHAINS")}</Link><Link href="/bracelets">{t("cat.BRACELETS")}</Link><Link href="/earrings">{t("cat.EARRINGS")}</Link><Link href="/moissanite">{t("cat.MOISSANITE")}</Link><Link href="/sets">{t("cat.SETS")}</Link><Link href="/cart">{t("nav.cart")}</Link><Link href="/account">{t("nav.account")}</Link></nav></div>
      </div>
      <div className="editorial-footer-bottom"><span>{t("footer.rights")}</span><span>{ar ? "فضة إسترلينية 925 · كفالة حسب سياسة نبض" : "STERLING SILVER 925 · NAPD WARRANTY POLICY APPLIES"}</span></div>
    </footer>
  );
}
