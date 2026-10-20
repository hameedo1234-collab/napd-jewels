"use client";

import { Gem, ShieldCheck, MessageCircle } from "lucide-react";
import { useLang } from "../context/LangContext";

export default function EditorialPromises() {
  const { lang } = useLang();
  const ar = lang === "ar";
  return (
    <section className="editorial-promises" aria-label={ar ? "وعد نبض" : "The NAPD promise"}>
      <div className="editorial-promises-inner">
        <div className="editorial-promise"><Gem size={25} strokeWidth={1.1} aria-hidden="true" /><h3>{ar ? "فضة إسترلينية 925" : "Sterling. Always."}</h3><p>{ar ? "فضة 925 ومويسانيت. تفاصيل صغيرة بتعمل فرق." : "Sterling silver 925 and moissanite. The difference is in the details."}</p></div>
        <div className="editorial-promise"><ShieldCheck size={25} strokeWidth={1.1} aria-hidden="true" /><h3>{ar ? "اختاري بثقة" : "Chosen with confidence."}</h3><p>{ar ? "قطعك معها كفالة حسب سياسة نبض. اسألينا عن تفاصيل العناية والكفالة." : "Your pieces are covered under the NAPD warranty policy. Ask us about care and coverage."}</p></div>
        <div className="editorial-promise"><MessageCircle size={25} strokeWidth={1.1} aria-hidden="true" /><h3>{ar ? "نساعدك تختاري" : "A personal touch."}</h3><p>{ar ? <>لإلك أو لهدية، احكيلنا شو ببالك.<br /><a href="https://wa.me/972593255260" target="_blank" rel="noopener noreferrer" className="underline underline-offset-4">تواصلي معنا على واتساب</a></> : <>For yourself or someone special, we are here to help.<br /><a href="https://wa.me/972593255260" target="_blank" rel="noopener noreferrer" className="underline underline-offset-4">Talk to us on WhatsApp</a></>}</p></div>
      </div>
    </section>
  );
}
