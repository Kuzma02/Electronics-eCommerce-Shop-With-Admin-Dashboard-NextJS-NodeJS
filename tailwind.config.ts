import type { Config } from "tailwindcss";

// daisyUI adds a top-level `daisyui` key that isn't part of Tailwind's Config type.
const config: Config & { daisyui?: { themes?: unknown[] } } = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        'custom-yellow': '#FED700',
        // Brand tokens bound to the CSS custom properties defined in
        // app/theme/design-tokens.css. Because these reference vars, updating
        // a token there re-colors every `brand-*` utility across all pages
        // with no per-page edits (WO-01, AC3). Usable as bg-brand-primary,
        // text-brand-on-surface, border-brand-border, etc.
        brand: {
          DEFAULT: 'var(--brand-primary)',
          primary: 'var(--brand-primary)',
          'primary-hover': 'var(--brand-primary-hover)',
          'primary-content': 'var(--brand-primary-content)',
          secondary: 'var(--brand-secondary)',
          accent: 'var(--brand-accent)',
          surface: 'var(--brand-surface)',
          'surface-alt': 'var(--brand-surface-alt)',
          'surface-raised': 'var(--brand-surface-raised)',
          border: 'var(--brand-border)',
          'on-surface': 'var(--brand-on-surface)',
          muted: 'var(--brand-muted)',
          success: 'var(--brand-success)',
          error: 'var(--brand-error)',
          warning: 'var(--brand-warning)',
          info: 'var(--brand-info)',
          'status-content': 'var(--brand-status-content)',
        },
      },
    },
  },
  plugins: [require("@tailwindcss/typography"), require("@tailwindcss/forms"), require("daisyui")],
  daisyui: {
    // Keep the existing default light theme, and register the Purple & White
    // theme. daisyUI applies whichever matches <html data-theme="...">, so
    // switching the attribute restyles daisyUI semantic components
    // (buttons, cards, navbar, modals, badges) with no per-component edits.
    themes: [
      "light",
      {
        "purple-white": {
          primary: "#6d28d9",
          "primary-content": "#ffffff",
          secondary: "#7c3aed",
          "secondary-content": "#ffffff",
          accent: "#a78bfa",
          "accent-content": "#2e1065",
          neutral: "#2e1065",
          "neutral-content": "#ffffff",
          "base-100": "#ffffff",
          "base-200": "#f5f3ff",
          "base-300": "#ede9fe",
          "base-content": "#2e1065",
          info: "#6d28d9",
          "info-content": "#ffffff",
          success: "#15803d",
          "success-content": "#ffffff",
          warning: "#b45309",
          "warning-content": "#ffffff",
          error: "#dc2626",
          "error-content": "#ffffff",
        },
      },
    ],
  },
};
export default config;
