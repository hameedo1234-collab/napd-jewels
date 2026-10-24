"use client";
import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import { useCollection } from "@/lib/useCollection";

/** Product imagery only: never rotates across categories or invents availability. */
export default function CollectionRotation({ category, label }: { category: string; label: string }) {
  const { items, loading } = useCollection(category);
  const [step, setStep] = useState(0);
  const [failed, setFailed] = useState<string[]>([]);
  const [paused, setPaused] = useState(false);
  const box = useRef<HTMLDivElement>(null);
  const images = useMemo(() => [...new Set(items.filter(p => Number(p.quantity) > 0 && p.image_url && !failed.includes(p.image_url)).map(p => p.image_url!))].slice(0, 5), [items, failed]);
  const signature = images.join("|");
  useEffect(() => {
    if (images.length < 2 || paused) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    const timer = window.setInterval(() => {
      if (document.visibilityState !== "visible" || reduced.matches || !box.current) return;
      if (box.current.closest("a") === document.activeElement) return;
      const rect = box.current.getBoundingClientRect();
      if (rect.bottom > 0 && rect.top < window.innerHeight) setStep(n => n + 1);
    }, 4500);
    return () => window.clearInterval(timer);
  }, [signature, images.length, paused]);
  const index = images.length ? step % images.length : 0;
  return <div ref={box} className="napd-rotation" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
    {images.length ? images.map((src, i) => <Image key={src} src={src} alt={i === index ? label : ""} aria-hidden={i !== index} fill sizes="(min-width: 1024px) 280px, 44vw" className={`napd-rotation-image ${i === index ? "is-current" : ""}`} onError={() => setFailed(prev => prev.includes(src) ? prev : [...prev, src])} />) : <span className="napd-rotation-empty">{loading ? "…" : label}</span>}
  </div>;
}
