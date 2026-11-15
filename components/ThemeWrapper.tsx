"use client";

import { useMemo } from "react";
import { getTheme, generateThemeCssVariables } from "@/lib/themes";

interface ThemeWrapperProps {
  themeId?: string;
  customAccent?: string;
  children: React.ReactNode;
}

export default function ThemeWrapper({ themeId, customAccent, children }: ThemeWrapperProps) {
  const cssVars = useMemo(() => {
    const theme = getTheme(themeId);
    return generateThemeCssVariables(theme, customAccent);
  }, [themeId, customAccent]);

  return (
    <div
      style={cssVars as React.CSSProperties}
      className="min-h-screen bg-background text-foreground transition-colors duration-200"
    >
      {children}
    </div>
  );
}
