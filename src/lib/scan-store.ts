"use client";

import { useSyncExternalStore } from "react";

/**
 * Which scan the reader is on: the section in view and, inside it, an optional variant.
 * `live` is true while a page tracks its sections (the home page).
 */
export interface ScanState {
  section: string;
  variant: string | null;
  live: boolean;
}

const initial: ScanState = { section: "top", variant: null, live: false };
let state = initial;
const listeners = new Set<() => void>();

export const scanStore = {
  get: () => state,
  set(next: ScanState) {
    if (next.section === state.section && next.variant === state.variant && next.live === state.live) return;
    state = next;
    listeners.forEach((l) => l());
  },
  subscribe(listener: () => void) {
    listeners.add(listener);
    return () => listeners.delete(listener);
  },
};

export function useScan(): ScanState {
  return useSyncExternalStore(scanStore.subscribe, scanStore.get, () => initial);
}
