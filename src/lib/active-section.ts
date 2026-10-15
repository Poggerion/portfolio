/** Where a section or a marker starts, measured from the top of the viewport. */
export interface Box {
  id: string;
  top: number;
}

/** The reading line sits at 40% of the viewport: a section is active once its top crosses it. */
export const PROBE = 0.4;

/**
 * The active section: the last one whose top has crossed the probe line. Before the first one
 * crosses, the first is active; once the page cannot scroll further, the last one is, so a short
 * final section still gets its turn.
 */
export function pickActive(boxes: Box[], probe: number, atBottom: boolean): string | null {
  if (boxes.length === 0) return null;
  if (atBottom) return boxes[boxes.length - 1].id;
  let active = boxes[0].id;
  for (const box of boxes) if (box.top <= probe) active = box.id;
  return active;
}

/** The variant inside the active section: the last marker whose top has crossed the probe line. */
export function pickVariant(markers: Box[], probe: number): string | null {
  let variant: string | null = null;
  for (const marker of markers) if (marker.top <= probe) variant = marker.id;
  return variant;
}

/**
 * The project being read in the work section: the last one whose top has crossed the probe line,
 * or the first one while none has (it is the next thing to read).
 */
export function pickProject(projects: Box[], probe: number): string | null {
  return pickVariant(projects, probe) ?? projects[0]?.id ?? null;
}

/**
 * The project the cloud shows, by priority: keyboard focus, then the mouse, then the project
 * being read in the work section. Null outside the work section with nothing previewed: the
 * section's own shape shows.
 */
export function shownProject(s: { section: string; variant: string | null; focus: string | null; hover: string | null }): string | null {
  return s.focus ?? s.hover ?? (s.section === "work" ? s.variant : null);
}
