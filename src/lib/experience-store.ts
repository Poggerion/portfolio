"use client";

import { useSyncExternalStore } from "react";
import type { Domain } from "@/content/types";

/**
 * Shared state between the page, the creative interface and the WebGL scene.
 * A tiny external store: the scene subscribes without going through React renders.
 */
export type Mode = "pro" | "creative";

export interface ExperienceState {
  mode: Mode;
  /** Domain opened in the creative mode. */
  domain: Domain | null;
  /** Domain under the pointer or keyboard focus (lights its cluster). */
  hover: Domain | null;
  /** Project to highlight when the creative mode opens from a case study. */
  project: string | null;
  /** True once the WebGL scene has drawn its first frame. */
  sceneReady: boolean;
  /** True when the WebGL scene will not run (reduced motion, no WebGL, load failure). */
  sceneOff: boolean;
}

let state: ExperienceState = { mode: "pro", domain: null, hover: null, project: null, sceneReady: false, sceneOff: false };
const listeners = new Set<() => void>();

export const experience = {
  get: () => state,
  set(patch: Partial<ExperienceState>) {
    const next = { ...state, ...patch };
    if (
      next.mode === state.mode &&
      next.domain === state.domain &&
      next.hover === state.hover &&
      next.project === state.project &&
      next.sceneReady === state.sceneReady &&
      next.sceneOff === state.sceneOff
    ) {
      return;
    }
    state = next;
    listeners.forEach((l) => l());
  },
  subscribe(listener: () => void) {
    listeners.add(listener);
    return () => listeners.delete(listener);
  },
};

const serverState: ExperienceState = {
  mode: "pro",
  domain: null,
  hover: null,
  project: null,
  sceneReady: false,
  sceneOff: false,
};

export function useExperience<T>(select: (s: ExperienceState) => T): T {
  return useSyncExternalStore(
    experience.subscribe,
    () => select(state),
    () => select(serverState),
  );
}
