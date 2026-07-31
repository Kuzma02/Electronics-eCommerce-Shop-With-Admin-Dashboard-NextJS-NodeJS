# Purple/White Theme — Cross-browser QA & Accessibility Contrast Report (WO-08)

Scope: validate the Purple & White theme (WO-01…WO-07) for accessibility
contrast and cross-browser behaviour before release.

## 1. Accessibility contrast validation

An automated validator parses the real token values from
`app/theme/design-tokens.css` and checks the foreground/background pairs the
UI actually renders, per theme, against WCAG 2.1.

Run it:

```bash
npm run test:a11y
```

It exits non-zero if any **text** pair falls below AA (4.5:1), so it can gate
CI.

### Result — all gating pairs pass (24/24)

Purple & White theme (the shipped theme):

| Pair | Ratio | Min | Verdict |
| --- | --- | --- | --- |
| Button label on primary (`#fff` on `#6d28d9`) | 7.10:1 | 4.5 | PASS (AAA) |
| Primary text/link on white | 7.10:1 | 4.5 | PASS (AAA) |
| Body text on surface (`#2e1065` on `#fff`) | 15.24:1 | 4.5 | PASS (AAA) |
| Body text on alt surface | 13.89:1 | 4.5 | PASS (AAA) |
| Muted text on surface | 4.83:1 | 4.5 | PASS |
| Text on success / error / warning | 5.02 / 4.83 / 5.02 | 4.5 | PASS |
| Success / error / warning / info icon on surface | 5.02 / 4.83 / 5.02 / 7.10 | 4.5 | PASS |

The default theme is also validated (24 total checks across both themes).

### Fixes made during QA

- **Default theme primary** was `#3b82f6` (blue-500), which is only 3.68:1 on
  white — below AA for text/buttons. Bumped to `#2563eb` (blue-600, 5.17:1).
  Same blue family, now AA-compliant.

### Documented non-gating item

- **Decorative hairlines** (`--brand-border`) are ~1.2–1.4:1 vs the surface.
  This is intentional and **not** a violation: WCAG 1.4.11 (non-text 3:1)
  applies to *essential* UI boundaries and meaningful graphics, not decorative
  dividers/separators. The validator reports these as `[INFO]` (non-gating).
  Interactive boundaries that must be perceivable (focus rings, selected
  states) use `--brand-primary`, which passes at 7.10:1.

## 2. Status-indicator distinguishability (AC6)

Success (green `#15803d`), error (red `#dc2626`) and warning (amber `#b45309`)
are deliberately kept outside the purple hue and each pass AA on white, so they
remain distinguishable against the purple/white UI and are not confused with
the purple brand color. Notification priority colors (low/normal/high/urgent)
follow the same rule.

## 3. Cross-browser QA

The theme relies only on broadly supported primitives:

- **CSS custom properties** (`--brand-*`) — supported in all current evergreen
  browsers (Chrome, Edge, Firefox, Safari) and Safari ≥ 9.1 / iOS ≥ 9.3.
- **`data-theme` attribute switching** on `<html>` — plain attribute + CSS
  attribute selectors; universally supported. Drives both the design tokens
  and the daisyUI theme.
- **`localStorage`** persistence with a `try/catch` fallback to the default
  theme (covers private-mode / storage-blocked cases).
- **Pre-paint inline script** in `app/layout.tsx` sets the stored theme before
  first paint to avoid a flash-of-default; guarded by `try/catch`.

Manual smoke matrix (theme select → apply without reload → navigate → reload):

| Browser | Apply w/o reload | Persist on reload | No FOUC | Status colors legible |
| --- | --- | --- | --- | --- |
| Chrome (latest) | ✓ | ✓ | ✓ | ✓ |
| Firefox (latest) | ✓ | ✓ | ✓ | ✓ |
| Safari (latest) | ✓ | ✓ | ✓ | ✓ |
| Edge (latest) | ✓ | ✓ | ✓ | ✓ |

No browser-specific CSS hacks, vendor prefixes, or non-standard APIs are used,
so no per-browser fallbacks are required.
