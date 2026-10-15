"use client";

import { useSyncExternalStore } from "react";

/**
 * Which scan the reader is on: the section in view and, inside it, an optional variant (in the
 * work section, the project being read). `focus` and `hover`: a project previewed by keyboard
 * focus or by the mouse. `live` is true while a page tracks its sections (the home page).
 */
export interface ScanState {
  section: string;
  variant: string | null;
  focus: string | null;
  hover: string | null;
  live: boolean;
}

const initial: ScanState = { section: "top", variant: null, focus: null, hover: null, live: false };
let state = initial;
const listeners = new Set<() => void>();

export const scanStore = {
  get: () => state,
  /** Changes some fields; listeners hear about it only if one actually changed. */
  update(next: Partial<ScanState>) {
    const merged = { ...state, ...next };
    if ((Object.keys(merged) as (keyof ScanState)[]).every((k) => merged[k] === state[k])) return;
    state = merged;
    listeners.forEach((l) => l());
  },
  reset() {
    scanStore.update(initial);
  },
  subscribe(listener: () => void) {
    listeners.add(listener);
    return () => listeners.delete(listener);
  },
};

export function useScan(): ScanState {
  return useSyncExternalStore(scanStore.subscribe, scanStore.get, () => initial);
}
