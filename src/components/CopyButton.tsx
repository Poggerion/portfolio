"use client";

import { useState } from "react";
import styles from "./sections.module.css";

/** Copies a value to the clipboard; falls back to selecting the linked text. */
export function CopyButton({ value, label, done }: { value: string; label: string; done: string }) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      const el = document.getElementById("contact-email");
      const selection = window.getSelection();
      if (el && selection) {
        const range = document.createRange();
        range.selectNodeContents(el);
        selection.removeAllRanges();
        selection.addRange(range);
      }
    }
  }

  return (
    <button type="button" className={`mono ${styles.copy}`} onClick={copy} aria-live="polite">
      {copied ? done : label}
    </button>
  );
}
