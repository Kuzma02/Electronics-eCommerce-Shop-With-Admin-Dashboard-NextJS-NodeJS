// *********************************************************************
// ThemeProvider (WO-01)
// ---------------------------------------------------------------------
// Applies the selected theme by setting <html data-theme="...">, which
// drives both the daisyUI theme and the design-token CSS variables.
//
// - Reads the persisted choice from localStorage on mount (fast-path cache
//   per the theming ADR) and falls back to the default theme when none is
//   set, so the existing default stays active until a user opts in (AC3).
// - Switching a theme updates the attribute in place — applied immediately,
//   no page reload (AC2), and any page/component mounted afterwards inherits
//   it because the attribute lives on the document root (AC5).
// *********************************************************************
"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  DEFAULT_THEME_ID,
  THEME_STORAGE_KEY,
  ThemeId,
  isThemeId,
} from "./themes";

interface ThemeContextValue {
  theme: ThemeId;
  setTheme: (theme: ThemeId) => void;
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

const applyThemeAttribute = (theme: ThemeId) => {
  if (typeof document !== "undefined") {
    document.documentElement.setAttribute("data-theme", theme);
  }
};

const readStoredTheme = (): ThemeId => {
  if (typeof window === "undefined") return DEFAULT_THEME_ID;
  try {
    const stored = window.localStorage.getItem(THEME_STORAGE_KEY);
    return isThemeId(stored) ? stored : DEFAULT_THEME_ID;
  } catch {
    // localStorage can throw in private mode / when blocked — fall back.
    return DEFAULT_THEME_ID;
  }
};

const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  // Start from the default so server and first client render agree; the
  // stored preference is applied in the effect below to avoid hydration
  // mismatches. The pre-hydration inline script in layout.tsx paints the
  // correct theme before this runs, so there is no visible flash.
  const [theme, setThemeState] = useState<ThemeId>(DEFAULT_THEME_ID);

  useEffect(() => {
    const stored = readStoredTheme();
    setThemeState(stored);
    applyThemeAttribute(stored);
  }, []);

  const setTheme = useCallback((next: ThemeId) => {
    setThemeState(next);
    applyThemeAttribute(next);
    try {
      window.localStorage.setItem(THEME_STORAGE_KEY, next);
    } catch {
      // Persisting is best-effort; the in-memory + attribute state still applies.
    }
  }, []);

  const value = useMemo(() => ({ theme, setTheme }), [theme, setTheme]);

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextValue => {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return ctx;
};

export default ThemeProvider;
