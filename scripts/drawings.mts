/**
 * Line drawings behind the project shapes (and the Spot of the experience section), as SVG on a
 * 1000 × 1000 canvas. One grammar for all of them, read by drawing() in build-clouds.mts:
 * - white strokes (INK) become the outlines, densely sampled;
 * - grey (FILL, or strokes in DIM) becomes sparse points: surfaces, and parts seen behind;
 * - orange (ACCENT) carries what the project is about.
 * Each drawing shows only what the project's page states: no invented sensors, protocols,
 * screens or figures. Symbols (a photo, a code, a notification) stay generic.
 */

export const INK = "#ffffff";
export const DIM = "#9a9a9a";
export const FILL = "#6e6e6e";
export const ACCENT = "#ff6a3d";

type P = [number, number];

const svg = (body: string) =>
  `<svg xmlns="http://www.w3.org/2000/svg" width="1000" height="1000" viewBox="0 0 1000 1000" fill="none" stroke-linecap="round" stroke-linejoin="round">${body}</svg>`;

const line = (a: P, b: P, stroke = INK, width = 6, extra = "") =>
  `<line x1="${a[0]}" y1="${a[1]}" x2="${b[0]}" y2="${b[1]}" stroke="${stroke}" stroke-width="${width}" ${extra}/>`;
const poly = (pts: P[], stroke = INK, width = 6, fill = "none", extra = "") =>
  `<polygon points="${pts.map((p) => p.join(",")).join(" ")}" stroke="${stroke}" stroke-width="${width}" fill="${fill}" ${extra}/>`;
const polyline = (pts: P[], stroke = INK, width = 6, extra = "") =>
  `<polyline points="${pts.map((p) => p.join(",")).join(" ")}" stroke="${stroke}" stroke-width="${width}" ${extra}/>`;
const rect = (x: number, y: number, w: number, h: number, r = 0, stroke = INK, width = 6, fill = "none", extra = "") =>
  `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${r}" stroke="${stroke}" stroke-width="${width}" fill="${fill}" ${extra}/>`;
const circle = (x: number, y: number, r: number, stroke = INK, width = 6, fill = "none", extra = "") =>
  `<circle cx="${x}" cy="${y}" r="${r}" stroke="${stroke}" stroke-width="${width}" fill="${fill}" ${extra}/>`;
const path = (d: string, stroke = INK, width = 6, fill = "none", extra = "") =>
  `<path d="${d}" stroke="${stroke}" stroke-width="${width}" fill="${fill}" ${extra}/>`;
const dashed = (gap = 18) => `stroke-dasharray="${gap * 0.6} ${gap}"`;

/** Arrowhead at b, pointing from a to b. */
function arrowHead(a: P, b: P, stroke = ACCENT, size = 22, width = 6): string {
  const ang = Math.atan2(b[1] - a[1], b[0] - a[0]);
  const wing = (s: number): P => [b[0] - size * Math.cos(ang + s), b[1] - size * Math.sin(ang + s)];
  return polyline([wing(0.5), b, wing(-0.5)], stroke, width);
}

/** Outline of a limb: a capsule from a (radius ra) to b (radius rb). */
function limb(a: P, b: P, ra: number, rb: number, stroke = INK, width = 6, fill = "none"): string {
  const ang = Math.atan2(b[1] - a[1], b[0] - a[0]);
  const n: P = [-Math.sin(ang), Math.cos(ang)];
  const at = (p: P, r: number, s: number): string => `${(p[0] + n[0] * r * s).toFixed(1)} ${(p[1] + n[1] * r * s).toFixed(1)}`;
  const d = `M ${at(a, ra, 1)} L ${at(b, rb, 1)} A ${rb} ${rb} 0 0 0 ${at(b, rb, -1)} L ${at(a, ra, -1)} A ${ra} ${ra} 0 0 0 ${at(a, ra, 1)} Z`;
  return path(d, stroke, width, fill);
}

/** A photo symbol: frame, mountain and sun. */
function photoIcon(x: number, y: number, w: number, h: number, stroke = ACCENT, width = 5): string {
  return [
    rect(x, y, w, h, 6, stroke, width),
    polyline([[x + w * 0.12, y + h * 0.82], [x + w * 0.42, y + h * 0.4], [x + w * 0.6, y + h * 0.62], [x + w * 0.72, y + h * 0.5], [x + w * 0.88, y + h * 0.82]], stroke, width - 1),
    circle(x + w * 0.75, y + h * 0.27, Math.min(w, h) * 0.1, stroke, width - 1),
  ].join("");
}

/**
 * Spot (quadruped robot), side view facing right: flat body with a sensor face at the front,
 * four legs whose knees point back. `dome`: a camera on a mast (the thermal mission's camera).
 */
export function spotFigure(dome = false): string {
  const parts: string[] = [];
  const legs = (offset: P, stroke: string, fill: string) => {
    for (const hipX of [278, 692]) {
      const hip: P = [hipX + offset[0], 458 + offset[1]];
      const knee: P = [hip[0] - 96, hip[1] + 178];
      const foot: P = [hip[0] - 14, hip[1] + 340];
      parts.push(limb(hip, knee, 40, 26, stroke, 6, fill));
      parts.push(limb(knee, foot, 22, 14, stroke, 6, fill));
      parts.push(`<ellipse cx="${foot[0] + 4}" cy="${foot[1] + 8}" rx="28" ry="13" stroke="${stroke}" stroke-width="6"/>`);
      parts.push(circle(knee[0], knee[1], 15, stroke, 5));
      parts.push(circle(hip[0], hip[1], 44, stroke, 6, fill), circle(hip[0], hip[1], 15, stroke, 5));
    }
  };
  // Far legs first, dim and behind.
  legs([40, -16], DIM, "none");
  // Body, with its angled ends.
  parts.push(poly([[172, 348], [768, 348], [842, 386], [826, 466], [186, 466], [128, 408]], INK, 7, FILL));
  parts.push(line([200, 428], [760, 428], INK, 4));
  // Payload rails on top.
  parts.push(line([250, 333], [690, 333], INK, 5));
  for (const x of [270, 470, 670]) parts.push(line([x, 333], [x, 348], INK, 5));
  // Sensor face at the front, with its cameras.
  parts.push(poly([[772, 357], [836, 390], [822, 458], [772, 458]], INK, 5, FILL));
  parts.push(circle(796, 396, 8, INK, 4), circle(800, 426, 8, INK, 4));
  // Near legs.
  legs([0, 0], INK, FILL);
  if (dome) {
    parts.push(rect(620, 284, 24, 50, 4, INK, 5));
    parts.push(path("M 586 286 A 46 46 0 0 1 678 286 Z", INK, 6, FILL));
    parts.push(circle(632, 266, 14, ACCENT, 6, ACCENT));
  }
  return parts.join("");
}

/** The robot alone, for the experience section (ITMI). */
export const spot = svg(spotFigure());

export const projectDrawings: Record<string, string> = {
  /** Phone with a parking sign: a deployed mobile app, no pretend app screen. */
  "parking-platform": svg(
    [
      rect(320, 70, 360, 860, 56, INK, 8, FILL),
      rect(344, 112, 312, 776, 30, INK, 4),
      rect(455, 88, 90, 12, 6, INK, 5),
      line([450, 908], [550, 908], INK, 6),
      rect(380, 360, 240, 240, 36, ACCENT, 14),
      `<text x="500" y="555" text-anchor="middle" font-family="Inter Display, Inter, FreeSans, DejaVu Sans, Arial, sans-serif" font-weight="700" font-size="210" fill="${ACCENT}">P</text>`,
    ].join(""),
  ),

  /** Spot on a mission, its photos sent to a server for processing. */
  "spot-mission-imaging": svg(
    [
      `<g transform="translate(-70 170) scale(0.7)">${spotFigure()}</g>`,
      // Server: four units with slots and lights.
      rect(760, 300, 180, 420, 14, INK, 7, FILL),
      ...[0, 1, 2, 3].flatMap((k) => [
        rect(780, 322 + k * 98, 140, 76, 8, INK, 5),
        line([800, 360 + k * 98], [870, 360 + k * 98], INK, 4),
        circle(898, 360 + k * 98, 6, ACCENT, 4, ACCENT),
      ]),
      // Photos taken on the way, travelling to the server.
      path("M 470 400 C 540 230, 640 220, 740 330", ACCENT, 5, "none", dashed(20)),
      arrowHead([700, 290], [742, 332]),
      photoIcon(470, 280, 84, 62),
      photoIcon(575, 205, 84, 62),
      photoIcon(668, 228, 72, 54),
    ].join(""),
  ),

  /** Spot's camera sweeping a wide cone toward a heat source: detection, not precise targeting. */
  "spot-thermal-mission": svg(
    [
      `<g transform="translate(-60 190) scale(0.62)">${spotFigure(true)}</g>`,
      // Wide observation cone and its sweep.
      line([316, 398], [960, 250], ACCENT, 5, dashed(22)),
      line([316, 398], [960, 820], ACCENT, 5, dashed(22)),
      ...[330, 470, 610].map((r) => path(`M ${316 + r * 0.97} ${398 - r * 0.24} A ${r} ${r} 0 0 1 ${316 + r * 0.84} ${398 + r * 0.55}`, ACCENT, 4, "none", 'stroke-opacity="0.55"')),
      // Heat source: warm rings fading out.
      circle(810, 560, 26, ACCENT, 6, ACCENT),
      circle(810, 560, 58, ACCENT, 6, "none", 'stroke-opacity="0.85"'),
      circle(810, 560, 92, ACCENT, 5, "none", 'stroke-opacity="0.6"'),
      circle(810, 560, 128, ACCENT, 4, "none", 'stroke-opacity="0.35"'),
    ].join(""),
  ),

  /** Portable monitoring: Arduino with its sensors, Raspberry Pi at the centre, the mobile app notified. */
  "android-raspberry-arduino": svg(
    [
      // Arduino, low on the left: board with its cut corner, headers and chip.
      poly([[60, 660], [260, 660], [260, 850], [90, 850], [60, 820]], INK, 7, FILL),
      rect(100, 672, 130, 14, 3, INK, 4),
      rect(100, 822, 130, 14, 3, INK, 4),
      rect(120, 730, 110, 44, 4, INK, 5),
      // Two sensors, unnamed.
      ...[[110, 550], [190, 550]].flatMap(([x, y]) => [rect(x - 26, y - 26, 52, 52, 8, INK, 5), circle(x, y, 13, INK, 4), line([x, y + 26], [x, 660], DIM, 4)]),
      // Raspberry Pi at the centre: board, 40-pin header, chip, mounting holes, ports.
      rect(350, 370, 300, 220, 16, INK, 7, FILL),
      ...Array.from({ length: 20 }, (_, c) => [0, 1].map((r) => rect(378 + c * 12, 384 + r * 12, 7, 7, 1, INK, 3)).join("")),
      rect(430, 460, 80, 80, 6, INK, 5),
      ...[[370, 570], [630, 570], [370, 430], [630, 430]].map(([x, y]) => circle(x, y, 7, INK, 3)),
      ...[0, 1, 2].map((k) => rect(600, 440 + k * 46, 64, 36, 4, INK, 5)),
      // Data flow: the Arduino up to the Pi, the Pi up to the phone.
      line([270, 690], [356, 612], ACCENT, 6, dashed(16)),
      arrowHead([320, 645], [358, 610]),
      line([672, 380], [768, 312], ACCENT, 6, dashed(16)),
      arrowHead([730, 339], [770, 310]),
      // Phone, high on the right, with a notification.
      rect(790, 110, 150, 330, 26, INK, 7, FILL),
      rect(812, 144, 106, 262, 14, INK, 3),
      rect(822, 160, 86, 34, 9, ACCENT, 6, ACCENT),
    ].join(""),
  ),

  /** A control-flow graph with its branches, a loop and the paths validated by tests. */
  "test-engineering-java": svg(
    [
      line([500, 136], [500, 222]),
      arrowHead([500, 190], [500, 222], INK, 18, 5),
      poly([[500, 228], [560, 288], [500, 348], [440, 288]], INK, 7, FILL),
      line([448, 312], [358, 404]),
      arrowHead([380, 382], [358, 404], INK, 18, 5),
      line([552, 312], [642, 404]),
      arrowHead([620, 382], [642, 404], INK, 18, 5),
      line([340, 460], [340, 524]),
      arrowHead([340, 500], [340, 524], INK, 18, 5),
      path("M 690 420 C 780 380, 760 270, 566 288", INK, 5, "none", dashed(16)),
      arrowHead([600, 286], [566, 288], INK, 18, 5),
      line([360, 596], [478, 682]),
      line([660, 460], [522, 682]),
      arrowHead([500, 660], [478, 682], INK, 18, 5),
      line([500, 734], [500, 820]),
      arrowHead([500, 796], [500, 820], INK, 18, 5),
      circle(500, 110, 26, INK, 7, FILL),
      circle(340, 432, 28, INK, 7, FILL),
      circle(660, 432, 28, INK, 7, FILL),
      circle(340, 566, 28, INK, 7, FILL),
      circle(500, 708, 26, INK, 7, FILL),
      circle(500, 852, 30, INK, 7, FILL),
      circle(500, 852, 18, INK, 5),
      // Validated paths.
      ...[[240, 432], [760, 432], [240, 566], [610, 852]].map(([x, y]) => `${circle(x, y, 30, ACCENT, 5)}${polyline([[x - 14, y + 1], [x - 4, y + 12], [x + 15, y - 11]], ACCENT, 7)}`),
    ].join(""),
  ),

  /** Three views of one image, kept in sync by a shared model (MVC, Observer). */
  "javafx-image-editor": svg(
    [
      // Full view.
      rect(60, 170, 420, 380, 14, INK, 7),
      line([60, 214], [480, 214], INK, 5),
      ...[0, 1, 2].map((k) => circle(86 + k * 22, 192, 6, INK, 4)),
      poly([[100, 510], [220, 330], [290, 420], [340, 360], [440, 510]], INK, 5, FILL),
      circle(390, 280, 26, INK, 5),
      // Zoomed view: the peak, larger.
      rect(560, 110, 380, 300, 14, INK, 7),
      line([560, 154], [940, 154], INK, 5),
      ...[0, 1, 2].map((k) => circle(586 + k * 22, 132, 6, INK, 4)),
      poly([[580, 390], [720, 190], [860, 390]], INK, 5, FILL),
      // Panned view: the same scene, shifted.
      rect(560, 470, 380, 300, 14, INK, 7),
      line([560, 514], [940, 514], INK, 5),
      ...[0, 1, 2].map((k) => circle(586 + k * 22, 492, 6, INK, 4)),
      poly([[580, 750], [640, 640], [690, 700], [760, 610], [870, 750]], INK, 5, FILL),
      circle(720, 570, 20, INK, 5),
      // The model and its observers.
      circle(300, 830, 46, ACCENT, 7, "none"),
      circle(300, 830, 18, ACCENT, 6, ACCENT),
      line([300, 784], [270, 556], ACCENT, 5, dashed(16)),
      line([340, 806], [556, 260], ACCENT, 5, dashed(16)),
      line([346, 834], [556, 640], ACCENT, 5, dashed(16)),
    ].join(""),
  ),

  /** A virtualized lab: one host, a server and clients on an isolated network, under monitoring. */
  "server-infrastructure-lab": svg(
    [
      // Monitoring: a resource curve with its peak, and the email alert.
      polyline([[110, 210], [220, 210], [260, 180], [300, 225], [360, 200], [440, 205], [490, 120], [540, 230], [610, 195], [700, 205], [770, 200]], ACCENT, 6),
      rect(800, 160, 84, 60, 6, ACCENT, 5),
      polyline([[800, 162], [842, 196], [884, 162]], ACCENT, 5),
      // Host (hypervisor).
      rect(70, 290, 860, 520, 22, INK, 7),
      line([70, 340], [930, 340], INK, 5),
      // Server VM.
      rect(120, 380, 220, 330, 12, INK, 6, FILL),
      ...[0, 1, 2, 3].map((k) => line([150, 430 + k * 70], [300, 430 + k * 70], INK, 5)),
      ...[0, 1, 2, 3].map((k) => circle(316, 430 + k * 70, 5, INK, 4)),
      // Three client VMs.
      ...[430, 600, 770].flatMap((x) => [rect(x - 60, 420, 120, 86, 8, INK, 6, FILL), line([x, 506], [x, 540], INK, 5), line([x - 34, 540], [x + 34, 540], INK, 5)]),
      // Isolated virtual network.
      line([230, 760], [770, 760], INK, 6),
      line([230, 710], [230, 760], INK, 5),
      ...[430, 600, 770].map((x) => line([x, 560], [x, 760], DIM, 4, dashed(14))),
    ].join(""),
  ),

  /** A layered web app: interface, REST API and database, linked by requests. */
  "dotnet-web-apps": svg(
    [
      // Interface.
      rect(50, 330, 270, 300, 14, INK, 7),
      line([50, 374], [320, 374], INK, 5),
      ...[0, 1, 2].map((k) => circle(76 + k * 22, 352, 6, INK, 4)),
      rect(80, 404, 210, 60, 6, FILL, 4, FILL),
      rect(80, 484, 150, 18, 4, FILL, 4, FILL),
      rect(80, 520, 180, 18, 4, FILL, 4, FILL),
      rect(80, 570, 90, 34, 8, INK, 5),
      // REST API.
      rect(400, 360, 200, 240, 18, INK, 7, FILL),
      path("M 470 410 C 440 410, 450 470, 430 480 C 450 490, 440 550, 470 550", INK, 7),
      path("M 530 410 C 560 410, 550 470, 570 480 C 550 490, 560 550, 530 550", INK, 7),
      // Database.
      `<ellipse cx="800" cy="350" rx="120" ry="40" stroke="${INK}" stroke-width="7" fill="${FILL}"/>`,
      path("M 680 350 L 680 610 A 120 40 0 0 0 920 610 L 920 350", INK, 7),
      path("M 680 437 A 120 40 0 0 0 920 437", INK, 5),
      path("M 680 524 A 120 40 0 0 0 920 524", INK, 5),
      // Requests and responses.
      line([336, 460], [384, 460], ACCENT, 6),
      arrowHead([350, 460], [386, 460]),
      line([384, 510], [336, 510], ACCENT, 6),
      arrowHead([370, 510], [334, 510]),
      line([616, 460], [664, 460], ACCENT, 6),
      arrowHead([630, 460], [666, 460]),
      line([664, 510], [616, 510], ACCENT, 6),
      arrowHead([650, 510], [614, 510]),
    ].join(""),
  ),

  /** A padlock and a second factor: a symbolic QR code and a one-time code. */
  "php-auth-sites": svg(
    [
      path("M 330 470 L 330 360 A 140 140 0 0 1 610 360 L 610 470", INK, 26),
      rect(270, 460, 400, 360, 36, INK, 8, FILL),
      circle(470, 610, 30, INK, 7),
      path("M 456 632 L 446 712 L 494 712 L 484 632", INK, 7),
      // Second factor: symbolic QR (three finder squares, a few modules) and the code slots.
      ...[[720, 150], [850, 150], [720, 280]].flatMap(([x, y]) => [rect(x, y, 90, 90, 6, ACCENT, 9), rect(x + 27, y + 27, 36, 36, 3, ACCENT, 6, ACCENT)]),
      ...[[850, 280], [880, 310], [850, 340], [910, 280], [910, 350], [820, 250], [820, 200], [880, 250]].map(([x, y]) => rect(x, y, 22, 22, 2, ACCENT, 4, ACCENT)),
      ...Array.from({ length: 6 }, (_, k) => rect(712 + k * 40, 430, 30, 44, 6, ACCENT, 5)),
    ].join(""),
  ),
};
