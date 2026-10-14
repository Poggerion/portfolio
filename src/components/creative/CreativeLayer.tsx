"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import type { CSSProperties } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import type { Domain } from "@/content/types";
import { experience, useExperience } from "@/lib/experience-store";
import { exitCreative, resetMode, selectDomain, syncFromUrl } from "@/lib/mode";
import { clusterBus } from "../sculpture/SculptureStage";
import { ProjectGlyph } from "../ProjectGlyph";
import { useStageInsets } from "./useStageInsets";
import styles from "./CreativeLayer.module.css";

export interface CreativeItem {
  title: string;
  meta: string;
  href?: string;
  slug?: string;
}

export interface CreativeDomain {
  id: Domain;
  label: string;
  blurb: string;
  count: string;
  projects: CreativeItem[];
  experience: CreativeItem[];
  skills: { label: string; evidence: string; items: string[] }[];
}

export interface CreativeStrings {
  eyebrow: string;
  title: string;
  hint: string;
  escape: string;
  close: string;
  domains: string;
  projects: string;
  experience: string;
  skills: string;
  viewing: string;
  abstractVisual: string;
}

const ORDER: Domain[] = ["software", "robotics", "embedded", "data"];
/** Bottom sheet on narrow screens and whenever the scene stacks vertically (h > 1.15 w). Keep in sync with the CSS. */
const SHEET_QUERY = "(max-width: 760px), (max-aspect-ratio: 20/23)";
/** Longest panel exit (CSS), plus a margin; only a fallback for a missed animationend. */
const EXIT_FALLBACK_MS = 600;

/** True when the domain panel is shown as a bottom sheet. */
function useSheet() {
  return useSyncExternalStore(
    (cb) => {
      const mq = window.matchMedia(SHEET_QUERY);
      mq.addEventListener("change", cb);
      return () => mq.removeEventListener("change", cb);
    },
    () => window.matchMedia(SHEET_QUERY).matches,
    () => false,
  );
}

/**
 * Focus an element, retrying for a few frames while it cannot take focus yet
 * (e.g. its layer is still flipping from visibility: hidden or inert).
 */
function focusSoon(el: HTMLElement | null | undefined, tries = 8) {
  if (!el?.isConnected) return;
  el.focus({ preventScroll: true });
  if (document.activeElement !== el && tries > 0) requestAnimationFrame(() => focusSoon(el, tries - 1));
}

/** Back to the mode toggle; if it cannot take focus, to the first focusable control of the header. */
function focusToggle() {
  const toggle = document.getElementById("mode-toggle");
  toggle?.focus({ preventScroll: true });
  if (toggle && document.activeElement === toggle) return;
  document.querySelector<HTMLElement>("header a[href]")?.focus({ preventScroll: true });
}

/**
 * Creative mode interface. Domain labels are anchored to the four knots of the WebGL
 * scene; without WebGL they fall back to a grid with small abstract glyphs.
 * Every action is also reachable with the keyboard.
 */
export function CreativeLayer({
  domains,
  strings,
  projectDomains,
}: {
  domains: CreativeDomain[];
  strings: CreativeStrings;
  projectDomains: Record<string, Domain>;
}) {
  const mode = useExperience((s) => s.mode);
  const selected = useExperience((s) => s.domain);
  const hover = useExperience((s) => s.hover);
  const project = useExperience((s) => s.project);
  const sceneOff = useExperience((s) => s.sceneOff);
  const search = useSearchParams();
  const sheet = useSheet();
  const open = mode === "creative";
  const labelRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const headingRef = useRef<HTMLHeadingElement>(null);
  const panelHeadingRef = useRef<HTMLHeadingElement>(null);
  const introRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLElement>(null);
  const escapeRef = useRef<HTMLParagraphElement>(null);
  const focusInside = useRef(false);
  /** Labels are positioned under their knots (first cluster report received). */
  const [anchored, setAnchored] = useState(false);
  /** Label to focus once a panel closed from its close button or Escape. */
  const restoreTo = useRef<Domain | null>(null);
  const lastTarget = useRef<Domain | null>(null);

  const target = open ? (domains.find((d) => d.id === selected) ?? null) : null;
  const targetId = target?.id ?? null;

  // One panel on screen at a time: the previous one plays its exit before the next one mounts.
  const [exiting, setExiting] = useState<CreativeDomain | null>(null);
  const [prevTarget, setPrevTarget] = useState<CreativeDomain | null>(target);
  if ((prevTarget?.id ?? null) !== targetId) {
    setPrevTarget(target);
    if (prevTarget && !exiting) setExiting(prevTarget);
  }
  const panel = exiting ?? target;
  /** The panel that is mounted and entering (null while one is leaving). */
  const enteringId = exiting ? null : targetId;

  // URL is the source of truth for the mode (load, back/forward, links).
  useEffect(() => {
    syncFromUrl((slug) => projectDomains[slug] ?? null);
  }, [search, projectDomains]);

  useEffect(() => {
    const onPop = () => syncFromUrl((slug) => projectDomains[slug] ?? null);
    window.addEventListener("popstate", onPop);
    return () => {
      window.removeEventListener("popstate", onPop);
      resetMode();
    };
  }, [projectDomains]);

  // Anchor labels under their knot.
  useEffect(() => {
    const place = (clusters: typeof clusterBus.last) => {
      if (!clusters.length) return;
      const midY = clusters.reduce((sum, c) => sum + c.y, 0) / clusters.length;
      const portrait = window.innerHeight > window.innerWidth * 1.15;
      for (const c of clusters) {
        const el = labelRefs.current[c.domain];
        if (!el) continue;
        // Landscape: upper knots carry their name above, lower knots below, so names never sit
        // between two rows. Portrait: always below, where the tall composition leaves room.
        const above = !portrait && c.y < midY;
        el.dataset.side = above ? "top" : "bottom";
        el.style.setProperty("--x", `${c.x}px`);
        el.style.setProperty("--y", `${above ? c.y - c.r * 0.95 : c.y + c.r * 0.95}px`);
        el.dataset.anchored = "true";
      }
      setAnchored(true);
    };
    place(clusterBus.last);
    clusterBus.listeners.add(place);
    return () => {
      clusterBus.listeners.delete(place);
    };
  }, []);

  useStageInsets({
    open,
    panelOpen: !!target,
    sheet,
    panelKey: panel?.id ?? null,
    intro: introRef,
    panel: panelRef,
    escape: escapeRef,
  });

  // Focus: heading once the interface has appeared; back to the toggle when it closes.
  useEffect(() => {
    if (open) {
      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const id = window.setTimeout(
        () => {
          const active = document.activeElement;
          // Do not steal focus from something the visitor already moved to.
          if (!active || active === document.body || active.id === "mode-toggle") focusSoon(headingRef.current);
        },
        reduced ? 0 : 900,
      );
      return () => window.clearTimeout(id);
    }
    if (focusInside.current) {
      focusInside.current = false;
      focusToggle();
    }
  }, [open]);

  // A new panel is mounted (never the outgoing one): move focus to its heading.
  useEffect(() => {
    if (enteringId) focusSoon(panelHeadingRef.current);
  }, [enteringId]);

  // A panel closed: give focus back to its label when it came from the panel or the keyboard.
  useEffect(() => {
    const prev = lastTarget.current;
    lastTarget.current = targetId;
    if (targetId || !prev || !open) {
      restoreTo.current = null;
      return;
    }
    const fromPanel = !!panelRef.current?.contains(document.activeElement);
    if (restoreTo.current === prev || fromPanel) focusSoon(labelRefs.current[prev]);
    restoreTo.current = null;
  }, [targetId, open]);

  // The leaving panel normally reports the end of its animation; this covers a missed event.
  useEffect(() => {
    if (!exiting) return;
    const id = window.setTimeout(() => setExiting(null), EXIT_FALLBACK_MS);
    return () => window.clearTimeout(id);
  }, [exiting]);

  // Escape closes the panel, then the mode.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      const d = experience.get().domain;
      if (d) {
        restoreTo.current = d;
        selectDomain(null);
      } else {
        exitCreative();
        focusToggle();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  // Without the 3D scene the domains fall back to a grid; while it loads, labels simply wait.
  const staticMode = sceneOff;

  return (
    <section
      className={styles.layer}
      aria-labelledby="creative-title"
      data-open={open ? "true" : "false"}
      data-static={staticMode ? "true" : "false"}
      data-panel={target ? "true" : "false"}
      aria-hidden={!open}
      inert={!open}
      onFocus={() => (focusInside.current = true)}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node | null)) focusInside.current = false;
      }}
    >
      <div ref={introRef} className={styles.intro}>
        <p className={`mono ${styles.eyebrow}`}>{strings.eyebrow}</p>
        {/* The editorial h1 is hidden and inert in this mode; this is the page heading here. */}
        <h1 id="creative-title" ref={headingRef} tabIndex={-1} className={styles.title}>
          {strings.title}
        </h1>
        <p className={styles.hint}>{strings.hint}</p>
      </div>

      {/* Out of reach while hidden: under the bottom sheet, or before the knots have placed them. */}
      <nav
        aria-label={strings.domains}
        className={styles.domainNav}
        inert={(sheet && !!target) || (!staticMode && !anchored)}
      >
        <ul className={styles.labels}>
          {ORDER.map((id, i) => {
            const d = domains.find((x) => x.id === id)!;
            const state = selected === id ? "selected" : hover === id ? "hover" : selected || hover ? "dim" : "idle";
            return (
              <li key={id} style={{ "--k": i } as CSSProperties}>
                <button
                  ref={(el) => {
                    labelRefs.current[id] = el;
                  }}
                  type="button"
                  className={styles.label}
                  data-state={state}
                  aria-pressed={selected === id}
                  aria-controls="creative-panel"
                  onPointerEnter={() => experience.set({ hover: id })}
                  onPointerLeave={() => experience.set({ hover: null })}
                  onFocus={() => experience.set({ hover: id })}
                  onBlur={() => experience.set({ hover: null })}
                  onClick={() => selectDomain(selected === id ? null : id)}
                >
                  {staticMode && open && <ProjectGlyph index={i + 2} className={styles.labelGlyph} density={0.7} />}
                  <span className={styles.labelName}>{d.label}</span>
                  <span className={`mono ${styles.labelCount}`}>{d.count}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      {panel && (
        <section
          key={panel.id}
          ref={panelRef}
          id="creative-panel"
          className={styles.panel}
          data-phase={exiting ? "out" : "in"}
          inert={!!exiting}
          aria-labelledby="creative-panel-title"
          onAnimationEnd={(e) => {
            if (e.target === e.currentTarget && e.currentTarget.dataset.phase === "out") setExiting(null);
          }}
        >
          <div className={styles.panelHead}>
            <p className={`mono ${styles.eyebrow}`}>{panel.count}</p>
            <button
              type="button"
              className={`mono ${styles.close}`}
              onClick={() => {
                restoreTo.current = panel.id;
                selectDomain(null);
              }}
            >
              {strings.close} <span aria-hidden="true">×</span>
            </button>
          </div>
          <h2 id="creative-panel-title" ref={panelHeadingRef} tabIndex={-1} className={styles.panelTitle}>
            {panel.label}
          </h2>
          <p className={styles.panelBlurb}>{panel.blurb}</p>

          {panel.projects.length > 0 && (
            <section className={styles.group}>
              <h3 className={`mono ${styles.groupTitle}`}>{strings.projects}</h3>
              <ul>
                {panel.projects.map((p, i) => (
                  <li key={p.slug ?? p.title} className={styles.stagger} style={{ "--i": i } as CSSProperties}>
                    <Link href={p.href!} className={styles.item} data-active={p.slug === project ? "true" : "false"}>
                      <span className={styles.itemTitle}>
                        {p.title}
                        {p.slug === project && <span className={`mono ${styles.viewing}`}>{strings.viewing}</span>}
                      </span>
                      <span className={`mono ${styles.itemMeta}`}>{p.meta}</span>
                      <span className={styles.itemArrow} aria-hidden="true">
                        →
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {panel.experience.length > 0 && (
            <section className={styles.group}>
              <h3 className={`mono ${styles.groupTitle}`}>{strings.experience}</h3>
              <ul>
                {panel.experience.map((x) => (
                  <li key={x.title + x.meta} className={styles.plain}>
                    <span className={styles.itemTitle}>{x.title}</span>
                    <span className={`mono ${styles.itemMeta}`}>{x.meta}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {panel.skills.length > 0 && (
            <section className={styles.group}>
              <h3 className={`mono ${styles.groupTitle}`}>{strings.skills}</h3>
              {panel.skills.map((s) => (
                <div key={s.label} className={styles.skill}>
                  <p className={styles.skillLabel}>{s.label}</p>
                  <p className={styles.skillEvidence}>{s.evidence}</p>
                  <ul className={`mono ${styles.skillItems}`}>
                    {s.items.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </section>
          )}
        </section>
      )}

      <p ref={escapeRef} className={`mono ${styles.escape}`}>
        {strings.escape}
      </p>
      {staticMode && <p className={`mono ${styles.abstract}`}>{strings.abstractVisual}</p>}
    </section>
  );
}
