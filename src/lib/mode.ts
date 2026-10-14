"use client";

import type { Domain } from "@/content/types";
import { experience } from "./experience-store";

/**
 * Switching between the professional and creative modes.
 *
 * - The URL carries the mode (?mode=creative&domain=…) so a view can be shared.
 * - Entering remembers the scroll position and the project being read, so leaving
 *   puts the visitor back exactly where they were.
 * - The browser back button leaves the creative mode.
 */

const domains: Domain[] = ["software", "robotics", "embedded", "data"];
export const isDomain = (v: string | null): v is Domain => !!v && (domains as string[]).includes(v);

/** Key set on the history entry pushed when entering, so leaving can go back to the entry before it. */
const PUSHED = "smCreative";

let savedScroll: number | null = null;
let returnTimer = 0;
/** A history.back() is in flight: a second activation before popstate must not step back twice. */
let leaving = false;

function urlFor(mode: "pro" | "creative", domain: Domain | null) {
  const url = new URL(window.location.href);
  url.hash = "";
  url.searchParams.delete("project");
  if (mode === "creative") {
    url.searchParams.set("mode", "creative");
    if (domain) url.searchParams.set("domain", domain);
    else url.searchParams.delete("domain");
  } else {
    url.searchParams.delete("mode");
    url.searchParams.delete("domain");
  }
  return url.pathname + url.search;
}

/**
 * Our own keys of the current history entry, merged with `patch`. The router's keys (__NA, …)
 * are left out on purpose: the router copies them itself, and only syncs its URL state
 * (useSearchParams) when the state it receives does not already carry them.
 */
function entryState(patch: Record<string, unknown> = {}) {
  const own: Record<string, unknown> = {};
  const current: unknown = window.history.state;
  if (current && typeof current === "object") {
    for (const [k, v] of Object.entries(current)) if (!k.startsWith("_")) own[k] = v;
  }
  for (const [k, v] of Object.entries(patch)) {
    if (v === undefined) delete own[k];
    else own[k] = v;
  }
  return own;
}

const pushedHere = () => (window.history.state as Record<string, unknown> | null)?.[PUSHED] === true;

/** The project or experience closest to the middle of the screen, if any. */
function contextFromViewport(): { domain: Domain | null; project: string | null } {
  const mid = window.innerHeight / 2;
  let best: HTMLElement | null = null;
  let bestD = Infinity;
  document.querySelectorAll<HTMLElement>(".editorial [data-domain]").forEach((el) => {
    const r = el.getBoundingClientRect();
    if (r.bottom < 0 || r.top > window.innerHeight) return;
    const d = r.top <= mid && r.bottom >= mid ? 0 : Math.min(Math.abs(r.top - mid), Math.abs(r.bottom - mid));
    if (d < bestD) {
      bestD = d;
      best = el;
    }
  });
  const el = best as HTMLElement | null;
  if (!el || bestD > window.innerHeight * 0.35) return { domain: null, project: null };
  const domain = el.dataset.domain ?? null;
  return { domain: isDomain(domain) ? domain : null, project: el.dataset.project || null };
}

/**
 * Editorial content and the main nav fade out with a delay; make them inert at once so
 * keyboard focus cannot land in them while they disappear.
 */
function setProInert(on: boolean) {
  document.querySelectorAll<HTMLElement>("[data-pro-only]").forEach((el) => el.toggleAttribute("inert", on));
}

function apply(mode: "pro" | "creative", domain: Domain | null, project: string | null) {
  const root = document.documentElement;
  window.clearTimeout(returnTimer);
  setProInert(mode === "creative");
  if (mode === "creative") {
    root.classList.remove("mode-returning");
    root.dataset.mode = "creative";
  } else {
    root.classList.add("mode-returning");
    delete root.dataset.mode;
    if (savedScroll !== null) window.scrollTo({ top: savedScroll, behavior: "instant" as ScrollBehavior });
    returnTimer = window.setTimeout(() => root.classList.remove("mode-returning"), 1400);
  }
  experience.set({ mode, domain, project, hover: null });
}

export function enterCreative(opts: { domain?: Domain | null; project?: string | null } = {}) {
  if (experience.get().mode === "creative") return;
  savedScroll = window.scrollY;
  const ctx = opts.domain || opts.project ? { domain: opts.domain ?? null, project: opts.project ?? null } : contextFromViewport();
  window.history.pushState(entryState({ [PUSHED]: true }), "", urlFor("creative", ctx.domain));
  apply("creative", ctx.domain, ctx.project);
}

export function exitCreative() {
  if (experience.get().mode !== "creative") return;
  // Entered from this page (even after a reload or a round trip through history): step back.
  if (pushedHere()) {
    if (leaving) return;
    leaving = true;
    window.history.back();
    return;
  }
  window.history.replaceState(entryState({ [PUSHED]: undefined }), "", urlFor("pro", null));
  const project = experience.get().project;
  apply("pro", null, null);
  // Opened from a link (e.g. a case study): land on that project in the list.
  if (savedScroll === null && project) {
    const row = document.querySelector<HTMLElement>(`#work [data-project="${CSS.escape(project)}"]`);
    row?.scrollIntoView({ block: "center" });
  }
}

export function selectDomain(domain: Domain | null) {
  experience.set({ domain });
  if (experience.get().mode === "creative") window.history.replaceState(entryState(), "", urlFor("creative", domain));
}

/** Read the URL on load and on back/forward. */
export function syncFromUrl(projectDomain: (slug: string) => Domain | null) {
  leaving = false;
  const q = new URLSearchParams(window.location.search);
  const creative = q.get("mode") === "creative";
  const current = experience.get().mode;
  if (creative) {
    const project = q.get("project");
    const fromUrl = q.get("domain");
    const domain = isDomain(fromUrl) ? fromUrl : project ? projectDomain(project) : null;
    if (current !== "creative") apply("creative", domain, project);
    else experience.set({ domain });
  } else if (current === "creative") {
    apply("pro", null, null);
  }
}

/** Forget remembered state when the home page unmounts (client navigation away). */
export function resetMode() {
  savedScroll = null;
  leaving = false;
  window.clearTimeout(returnTimer);
  setProInert(false);
  const root = document.documentElement;
  delete root.dataset.mode;
  root.classList.remove("mode-returning");
  experience.set({ mode: "pro", domain: null, hover: null, project: null });
}
