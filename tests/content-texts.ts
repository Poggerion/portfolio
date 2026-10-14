import { capra, experiences } from "../src/content/experience";
import { domains, profile } from "../src/content/profile";
import { projects } from "../src/content/projects";
import { education, skillGroups } from "../src/content/skills";
import { ui } from "../src/content/ui";

/** Walk every value and collect strings, to scan the published content as a whole. */
export function strings(value: unknown, out: string[] = []): string[] {
  if (typeof value === "string") out.push(value);
  else if (Array.isArray(value)) value.forEach((v) => strings(v, out));
  else if (value && typeof value === "object") Object.values(value).forEach((v) => strings(v, out));
  return out;
}

/** Everything in src/content that can reach a page. Strings written directly in components are not covered. */
export const content = { profile, domains, experiences, capra, projects, skillGroups, education, ui };
export const texts = strings(content);
export const published = texts.join("\n");
