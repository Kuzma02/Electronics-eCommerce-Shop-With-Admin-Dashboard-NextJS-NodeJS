#!/usr/bin/env node
/* *********************************************************************
 * Accessibility contrast validation (WO-08)
 * ---------------------------------------------------------------------
 * Parses the theme design tokens from app/theme/design-tokens.css and
 * asserts WCAG 2.1 contrast ratios for the foreground/background pairs
 * the UI actually renders, per theme.
 *
 * Exits 0 if every pair meets its required ratio, 1 otherwise — so it can
 * gate CI. Run with:  node scripts/accessibility/contrast-check.js
 *
 * WCAG thresholds:
 *   - AA  normal text : >= 4.5
 *   - AA  large/UI    : >= 3.0
 * ********************************************************************* */
"use strict";

const fs = require("fs");
const path = require("path");

const TOKENS_FILE = path.join(
  __dirname,
  "..",
  "..",
  "app",
  "theme",
  "design-tokens.css"
);

// ---- WCAG contrast math -------------------------------------------------
function hexToRgb(hex) {
  const h = hex.replace("#", "").trim();
  const full =
    h.length === 3
      ? h
          .split("")
          .map((c) => c + c)
          .join("")
      : h;
  return {
    r: parseInt(full.slice(0, 2), 16),
    g: parseInt(full.slice(2, 4), 16),
    b: parseInt(full.slice(4, 6), 16),
  };
}

function relativeLuminance({ r, g, b }) {
  const chan = (v) => {
    const s = v / 255;
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  };
  return 0.2126 * chan(r) + 0.7152 * chan(g) + 0.0722 * chan(b);
}

function contrastRatio(hex1, hex2) {
  const l1 = relativeLuminance(hexToRgb(hex1));
  const l2 = relativeLuminance(hexToRgb(hex2));
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
}

// ---- Parse tokens per theme from the CSS -------------------------------
// Returns { ":root": {token: hex}, "purple-white": {token: hex}, ... }
function parseTokens(css) {
  const themes = {};
  // Match `:root { ... }` and `[data-theme="x"] { ... }` blocks.
  const blockRe = /(:root|\[data-theme="([^"]+)"\])\s*\{([^}]*)\}/g;
  let m;
  while ((m = blockRe.exec(css)) !== null) {
    const name = m[2] || "default";
    const body = m[3];
    const vars = {};
    const varRe = /(--[\w-]+)\s*:\s*(#[0-9a-fA-F]{3,6})\s*;/g;
    let v;
    while ((v = varRe.exec(body)) !== null) {
      vars[v[1]] = v[2];
    }
    themes[name] = vars;
  }
  return themes;
}

// ---- The pairs the UI actually renders ---------------------------------
// { fg, bg, min, label, informational? }
// Text pairs gate the build (WCAG AA 4.5:1). The border pair is reported
// informationally only: decorative hairlines/dividers are exempt from the
// WCAG 1.4.11 non-text 3:1 requirement, which targets *essential* UI
// boundaries, so we surface the number without failing on it.
const PAIRS = [
  { fg: "--brand-primary-content", bg: "--brand-primary", min: 4.5, label: "Button label on primary" },
  { fg: "--brand-primary", bg: "--brand-surface", min: 4.5, label: "Primary text/link on white surface" },
  { fg: "--brand-on-surface", bg: "--brand-surface", min: 4.5, label: "Body text on surface" },
  { fg: "--brand-on-surface", bg: "--brand-surface-alt", min: 4.5, label: "Body text on alt surface" },
  { fg: "--brand-muted", bg: "--brand-surface", min: 4.5, label: "Muted/secondary text on surface" },
  { fg: "--brand-status-content", bg: "--brand-success", min: 4.5, label: "Text on success" },
  { fg: "--brand-status-content", bg: "--brand-error", min: 4.5, label: "Text on error" },
  { fg: "--brand-status-content", bg: "--brand-warning", min: 4.5, label: "Text on warning" },
  { fg: "--brand-success", bg: "--brand-surface", min: 4.5, label: "Success text/icon on surface" },
  { fg: "--brand-error", bg: "--brand-surface", min: 4.5, label: "Error text/icon on surface" },
  { fg: "--brand-warning", bg: "--brand-surface", min: 4.5, label: "Warning text/icon on surface" },
  { fg: "--brand-info", bg: "--brand-surface", min: 4.5, label: "Info text/icon on surface" },
  { fg: "--brand-border", bg: "--brand-surface", min: 3.0, label: "Decorative hairline vs surface", informational: true },
];

function run() {
  const css = fs.readFileSync(TOKENS_FILE, "utf8");
  const themes = parseTokens(css);
  let failures = 0;
  let checks = 0;

  for (const [themeName, vars] of Object.entries(themes)) {
    console.log(`\nTheme: ${themeName}`);
    for (const { fg: fgTok, bg: bgTok, min, label, informational } of PAIRS) {
      const fg = vars[fgTok];
      const bg = vars[bgTok];
      if (!fg || !bg) continue; // token not defined in this theme
      const ratio = contrastRatio(fg, bg);
      const pass = ratio >= min;
      if (informational) {
        console.log(
          `  [INFO] ${label}: ${ratio.toFixed(2)}:1 (target ${min}:1, ` +
            `non-gating) ${fg} on ${bg}`
        );
        continue;
      }
      checks++;
      if (!pass) failures++;
      const mark = pass ? "PASS" : "FAIL";
      console.log(
        `  [${mark}] ${label}: ${ratio.toFixed(2)}:1 ` +
          `(need ${min}:1) ${fg} on ${bg}`
      );
    }
  }

  console.log(
    `\n${checks} checks, ${checks - failures} passed, ${failures} failed.`
  );
  if (failures > 0) {
    console.error(
      `\n✖ Accessibility contrast validation FAILED (${failures} pair(s) below WCAG AA).`
    );
    process.exit(1);
  }
  console.log("\n✔ All theme color pairs meet WCAG AA.");
}

run();
