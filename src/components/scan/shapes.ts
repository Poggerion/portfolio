import { projects } from "@/content/projects";

/** Shapes of the sections, built in public/clouds/ (npm run clouds); "yarn" and "text" are made in the browser. */
export const SECTION_SHAPES = ["yarn", "face", "quebec", "spot", "board", "cegep", "ets", "text"] as const;

/**
 * Each project's own shape, never shared with another project (public/clouds/<shape>.bin, drawn
 * in scripts/drawings.mts).
 */
export const PROJECT_SHAPES = {
  "parking-platform": "parking-platform",
  "spot-mission-imaging": "spot-mission-imaging",
  "spot-thermal-mission": "spot-thermal-mission",
  "android-raspberry-arduino": "android-raspberry-arduino",
  "test-engineering-java": "test-engineering-java",
  "javafx-image-editor": "javafx-image-editor",
  "server-infrastructure-lab": "server-infrastructure-lab",
  "dotnet-web-apps": "dotnet-web-apps",
  "php-auth-sites": "php-auth-sites",
} as const satisfies Record<string, string>;

export type ShapeName = (typeof SECTION_SHAPES)[number] | (typeof PROJECT_SHAPES)[keyof typeof PROJECT_SHAPES];

/** Every shape, in a fixed order (it seeds each shape's dust). */
export const SHAPE_NAMES: ShapeName[] = [...SECTION_SHAPES, ...Object.values(PROJECT_SHAPES)];

/** First project in reading order: the work section's shape before the reader reaches a project. */
const FIRST_PROJECT = (projects.find((p) => p.featured) ?? projects[0]).slug as keyof typeof PROJECT_SHAPES;

/** The shape for a section (and variant), or for the project shown. */
export function shapeFor(section: string, variant: string | null, project: string | null): ShapeName {
  if (project && project in PROJECT_SHAPES) return PROJECT_SHAPES[project as keyof typeof PROJECT_SHAPES];
  switch (section) {
    case "about":
      return "quebec";
    case "work":
      return PROJECT_SHAPES[FIRST_PROJECT];
    case "experience":
      return "spot";
    case "skills":
      return "board";
    case "education":
      // ÉTS comes first (J5): its facade until the reader reaches the Cégep entry.
      return variant === "cegep" ? "cegep" : "ets";
    case "contact":
      return "text";
    default:
      return "face";
  }
}
