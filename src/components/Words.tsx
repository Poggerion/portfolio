import type { CSSProperties } from "react";

/**
 * Splits text into masked words so headings can rise word by word on reveal.
 * Spaces stay real text nodes, so the heading reads normally to assistive technology.
 */
export function Words({ text, delay = 0 }: { text: string; delay?: number }) {
  const words = text.split(" ");
  return (
    <>
      {words.map((w, i) => (
        <span key={i}>
          <span className="w">
            <span style={{ "--i": i, "--d": delay } as CSSProperties}>{w}</span>
          </span>
          {i < words.length - 1 ? " " : null}
        </span>
      ))}
    </>
  );
}
