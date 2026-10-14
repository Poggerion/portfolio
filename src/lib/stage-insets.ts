/**
 * Screen areas the creative interface covers (intro, panel or bottom sheet), so the 3D
 * composition can fit in the space that is left. CSS pixels, measured inwards from each
 * edge of the visible viewport. The creative layer publishes them; the engine reads them.
 */
export interface StageInsets {
  top: number;
  right: number;
  bottom: number;
  left: number;
}

const zero: StageInsets = { top: 0, right: 0, bottom: 0, left: 0 };

export const stageInsets = {
  value: zero,
  listeners: new Set<(v: StageInsets) => void>(),
  set(v: StageInsets) {
    const c = this.value;
    if (c.top === v.top && c.right === v.right && c.bottom === v.bottom && c.left === v.left) return;
    this.value = v;
    this.listeners.forEach((l) => l(v));
  },
  reset() {
    this.set(zero);
  },
};
