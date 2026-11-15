export interface ThemePreset {
  id: string;
  name: string;
  tagline: string;
  badge: string;
  vars: {
    bgMain: string;
    textMain: string;
    cardBg: string;
    cardText: string;
    primary: string;
    primaryHover: string;
    primaryFg: string;
    secondary: string;
    secondaryHover: string;
    secondaryFg: string;
    accent: string;
    accentHover: string;
    accentFg: string;
    muted: string;
    borderColor: string;
    radiusNeo: string;
  };
  emojis: string[];
}

export const THEME_PRESETS: Record<string, ThemePreset> = {
  hyperpop: {
    id: "hyperpop",
    name: "Hyperpop",
    tagline: "Hot pink + neon lime chaos energy",
    badge: "💖⚡",
    vars: {
      bgMain: "#FFF0F5",
      textMain: "#121212",
      cardBg: "#FFFFFF",
      cardText: "#121212",
      primary: "#FF2E93", // Hot pink
      primaryHover: "#E0187A",
      primaryFg: "#FFFFFF",
      secondary: "#A6FF00", // Neon lime
      secondaryHover: "#8FE000",
      secondaryFg: "#000000",
      accent: "#7928CA", // Electric purple
      accentHover: "#6218AA",
      accentFg: "#FFFFFF",
      muted: "#FCE7F3",
      borderColor: "#000000",
      radiusNeo: "16px",
    },
    emojis: ["💖", "⚡", "🍭", "👽", "💅", "🔥", "🎀", "🎉"],
  },
  "lofi-sunset": {
    id: "lofi-sunset",
    name: "Lo-fi Sunset",
    tagline: "Golden hour orange & retro purple chill",
    badge: "🌅🎵",
    vars: {
      bgMain: "#FFF5EB",
      textMain: "#221124",
      cardBg: "#FFFFFF",
      cardText: "#221124",
      primary: "#FF6B35", // Sunset orange
      primaryHover: "#E6531E",
      primaryFg: "#FFFFFF",
      secondary: "#9D4EDD", // Deep lilac/purple
      secondaryHover: "#8338EC",
      secondaryFg: "#FFFFFF",
      accent: "#FFD166", // Warm golden yellow
      accentHover: "#F4C447",
      accentFg: "#000000",
      muted: "#FFE8D6",
      borderColor: "#221124",
      radiusNeo: "14px",
    },
    emojis: ["🌅", "🎧", "☕", "📼", "🌇", "✨", "🍂", "🛹"],
  },
  "matcha-mode": {
    id: "matcha-mode",
    name: "Matcha Mode",
    tagline: "Calm green, whipped cream & aesthetic latte",
    badge: "🍵🌿",
    vars: {
      bgMain: "#F4F7F2",
      textMain: "#1B2A1E",
      cardBg: "#FFFFFF",
      cardText: "#1B2A1E",
      primary: "#588157", // Rich Matcha green
      primaryHover: "#3A5A40",
      primaryFg: "#FFFFFF",
      secondary: "#DDA15E", // Warm biscuit / cream
      secondaryHover: "#BC6C25",
      secondaryFg: "#000000",
      accent: "#A3B18A", // Soft sage
      accentHover: "#86996E",
      accentFg: "#1B2A1E",
      muted: "#E9EFE6",
      borderColor: "#1B2A1E",
      radiusNeo: "20px",
    },
    emojis: ["🍵", "🌿", "🥑", "🌱", "🧘", "🥐", "🤍", "🎋"],
  },
  "dark-mode-chaos": {
    id: "dark-mode-chaos",
    name: "Dark Mode Chaos",
    tagline: "Pitch black, toxic green & cyber cyan",
    badge: "👾🖤",
    vars: {
      bgMain: "#0F0F12",
      textMain: "#F5F5F7",
      cardBg: "#1C1C24",
      cardText: "#F5F5F7",
      primary: "#00FF66", // Toxic neon green
      primaryHover: "#00D655",
      primaryFg: "#000000",
      secondary: "#00F0FF", // Cyber cyan
      secondaryHover: "#00C2CF",
      secondaryFg: "#000000",
      accent: "#FF007F", // Cyberpunk magenta
      accentHover: "#DE006E",
      accentFg: "#FFFFFF",
      muted: "#2A2A38",
      borderColor: "#00FF66",
      radiusNeo: "12px",
    },
    emojis: ["👾", "⚡", "🖤", "🧬", "🎮", "🕹️", "🛸", "🕶️"],
  },
};

export const DEFAULT_THEME_ID = "hyperpop";

export function getTheme(themeId?: string): ThemePreset {
  if (themeId && THEME_PRESETS[themeId]) {
    return THEME_PRESETS[themeId];
  }
  return THEME_PRESETS[DEFAULT_THEME_ID];
}

export function generateThemeCssVariables(theme: ThemePreset, customAccent?: string): Record<string, string> {
  const vars = { ...theme.vars };
  if (customAccent) {
    vars.accent = customAccent;
  }
  return {
    "--bg-main": vars.bgMain,
    "--text-main": vars.textMain,
    "--card-bg": vars.cardBg,
    "--card-text": vars.cardText,
    "--primary": vars.primary,
    "--primary-hover": vars.primaryHover,
    "--primary-fg": vars.primaryFg,
    "--secondary": vars.secondary,
    "--secondary-hover": vars.secondaryHover,
    "--secondary-fg": vars.secondaryFg,
    "--accent": vars.accent,
    "--accent-hover": vars.accentHover,
    "--accent-fg": vars.accentFg,
    "--muted": vars.muted,
    "--border-color": vars.borderColor,
    "--radius-neo": vars.radiusNeo,
  };
}
