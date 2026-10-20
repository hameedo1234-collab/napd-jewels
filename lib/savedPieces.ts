"use client";

import { useMemo, useSyncExternalStore } from "react";
const KEY = "napd-saved-pieces";
const EVENT = "napd-saved-pieces-change";
function snapshot() { return window.localStorage.getItem(KEY) || "[]"; }
function subscribe(listener: () => void) {
  window.addEventListener("storage", listener);
  window.addEventListener(EVENT, listener);
  return () => { window.removeEventListener("storage", listener); window.removeEventListener(EVENT, listener); };
}
function parse(raw: string): string[] {
  try { const value: unknown = JSON.parse(raw); return Array.isArray(value) ? value.filter((id): id is string => typeof id === "string") : []; } catch { return []; }
}
export function useSavedPieces() {
  const raw = useSyncExternalStore(subscribe, snapshot, () => "[]");
  const ids = useMemo(() => parse(raw), [raw]);
  function toggle(id: string) {
    const current = parse(snapshot());
    window.localStorage.setItem(KEY, JSON.stringify(current.includes(id) ? current.filter((p) => p !== id) : [...current, id]));
    window.dispatchEvent(new Event(EVENT));
  }
  return { ids, toggle };
}
