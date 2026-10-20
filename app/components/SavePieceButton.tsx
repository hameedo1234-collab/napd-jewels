"use client";
import { Heart } from "lucide-react";
import { useSavedPieces } from "@/lib/savedPieces";
import { useLang } from "../context/LangContext";
export default function SavePieceButton({ id, name }: { id: string; name: string }) {
  const { ids, toggle } = useSavedPieces();
  const { lang } = useLang();
  const saved = ids.includes(id);
  return <button type="button" className="ed4-save-button" onClick={() => toggle(id)} aria-pressed={saved} aria-label={`${lang === "ar" ? (saved ? "إزالة من المفضلة" : "حفظ في المفضلة") : (saved ? "Unsave" : "Save")} ${name}`}><Heart size={17} strokeWidth={1.4} fill={saved ? "currentColor" : "none"} /></button>;
}
