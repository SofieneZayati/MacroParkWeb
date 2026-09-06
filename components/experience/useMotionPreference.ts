"use client";

import { useSyncExternalStore } from "react";

const query = "(prefers-reduced-motion: reduce)";
function subscribe(callback: () => void) {
  const media = window.matchMedia(query);
  media.addEventListener("change", callback);
  return () => media.removeEventListener("change", callback);
}

/** One consistent, live OS preference for the UI and physical demonstrations. */
export function useMotionPreference() {
  return useSyncExternalStore(subscribe, () =>
    (process.env.NEXT_PUBLIC_VISUAL_QA === "1" && new URLSearchParams(window.location.search).get("qaReducedMotion") === "1") || window.matchMedia(query).matches,
    () => false);
}
