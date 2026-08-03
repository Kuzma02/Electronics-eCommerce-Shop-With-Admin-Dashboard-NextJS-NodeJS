// *********************************************************************
// Theme registry (WO-01)
// ---------------------------------------------------------------------
// Single source of truth for the themes users can pick in
// Settings > Appearance. Each entry's `id` is the value written to the
// <html data-theme="..."> attribute and matched by:
//   - the daisyUI theme config in tailwind.config.ts
//   - the [data-theme="..."] token blocks in app/theme/design-tokens.css
//
// Add a theme here (plus its daisyUI config + token block) and it shows up
// as a selectable option automatically — no per-page code edits (AC3).
// *********************************************************************

export type ThemeId = "light" | "purple-white";

export interface ThemeOption {
  /** value written to <html data-theme>; matches daisyUI + design tokens */
  id: ThemeId;
  /** label shown in the Appearance settings UI */
  label: string;
  /** short description shown under the label */
  description: string;
  /** small swatches shown in the picker (surface + primary + accent) */
  swatches: string[];
}

// The theme that stays active when the user has not explicitly chosen one (AC3).
export const DEFAULT_THEME_ID: ThemeId = "light";

// localStorage key holding the user's chosen theme (fast-path cache per ADR).
export const THEME_STORAGE_KEY = "app-theme";

export const THEMES: ThemeOption[] = [
  {
    id: "light",
    label: "Default",
    description: "The original light theme.",
    swatches: ["#ffffff", "#3b82f6", "#fed700"],
  },
  {
    id: "purple-white",
    label: "Purple & White",
    description: "Clean white surfaces with a purple accent palette.",
    swatches: ["#ffffff", "#6d28d9", "#a78bfa"],
  },
];

export const isThemeId = (value: unknown): value is ThemeId =>
  typeof value === "string" && THEMES.some((t) => t.id === value);
