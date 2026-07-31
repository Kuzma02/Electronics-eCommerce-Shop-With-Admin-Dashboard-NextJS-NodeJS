// *********************************************************************
// Role of the component: Appearance theme picker (Settings > Appearance)
// Name of the component: ThemeSwitcher.tsx
// Developer: skaftorAI · WO-01
// Component call: <ThemeSwitcher />
// Input parameters: no input parameters
// Output: a list of selectable themes (incl. "Purple & White") that the
//         user can select and apply without a page reload.
// *********************************************************************
"use client";

import React, { useEffect, useState } from "react";
import { FaCheck } from "react-icons/fa6";
import { useTheme } from "@/app/theme/ThemeProvider";
import { THEMES, ThemeId } from "@/app/theme/themes";

const ThemeSwitcher = () => {
  const { theme, setTheme } = useTheme();

  // `selected` is the pending choice; it becomes active only on Apply (confirm).
  const [selected, setSelected] = useState<ThemeId>(theme);

  // Keep the pending choice in sync when the active theme changes elsewhere.
  useEffect(() => {
    setSelected(theme);
  }, [theme]);

  const isDirty = selected !== theme;

  const handleApply = () => {
    // Applies immediately by updating <html data-theme> — no page reload (AC2).
    setTheme(selected);
  };

  return (
    <section aria-labelledby="appearance-heading" className="w-full max-w-3xl">
      <h2 id="appearance-heading" className="text-2xl font-semibold text-brand-on-surface">
        Appearance
      </h2>
      <p className="mt-1 text-brand-muted">
        Choose how the app looks. Your choice is applied instantly and
        remembered on this device.
      </p>

      <fieldset className="mt-6">
        <legend className="sr-only">Theme</legend>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {THEMES.map((option) => {
            const active = selected === option.id;
            return (
              <label
                key={option.id}
                className={`relative flex cursor-pointer flex-col gap-y-3 rounded-lg border-2 p-4 transition-colors ${
                  active
                    ? "border-brand-primary bg-brand-surface-alt"
                    : "border-brand-border bg-brand-surface hover:border-brand-primary"
                }`}
              >
                <input
                  type="radio"
                  name="theme"
                  value={option.id}
                  checked={active}
                  onChange={() => setSelected(option.id)}
                  className="sr-only"
                />
                <div className="flex items-center justify-between">
                  <span className="text-lg font-medium text-brand-on-surface">
                    {option.label}
                  </span>
                  {active && (
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-brand-primary text-brand-primary-content">
                      <FaCheck className="text-xs" aria-hidden />
                    </span>
                  )}
                </div>
                <div className="flex gap-x-2" aria-hidden>
                  {option.swatches.map((color, i) => (
                    <span
                      key={i}
                      className="h-6 w-6 rounded-full border border-brand-border"
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
                <span className="text-sm text-brand-muted">{option.description}</span>
              </label>
            );
          })}
        </div>
      </fieldset>

      <div className="mt-6 flex items-center gap-x-3">
        <button
          type="button"
          onClick={handleApply}
          disabled={!isDirty}
          className="rounded-md bg-brand-primary px-5 py-2.5 font-medium text-brand-primary-content transition-colors hover:bg-brand-primary-hover disabled:cursor-not-allowed disabled:opacity-50"
        >
          Apply theme
        </button>
        {isDirty ? (
          <span className="text-sm text-brand-muted">Unsaved changes</span>
        ) : (
          <span className="text-sm text-brand-muted">
            Current theme:{" "}
            <span className="font-medium text-brand-on-surface">
              {THEMES.find((t) => t.id === theme)?.label}
            </span>
          </span>
        )}
      </div>
    </section>
  );
};

export default ThemeSwitcher;
