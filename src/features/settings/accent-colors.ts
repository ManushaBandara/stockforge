export const ACCENT_COLORS = {
  violet: {
    label: "Violet",
    hex: "#8B7CFF",
    foreground: "#FFFFFF",
    soft: "rgba(139, 124, 255, 0.12)",
    border: "rgba(139, 124, 255, 0.30)",
  },
  blue: {
    label: "Blue",
    hex: "#3B82F6",
    foreground: "#FFFFFF",
    soft: "rgba(59, 130, 246, 0.12)",
    border: "rgba(59, 130, 246, 0.30)",
  },
  cyan: {
    label: "Cyan",
    hex: "#06B6D4",
    foreground: "#FFFFFF",
    soft: "rgba(6, 182, 212, 0.12)",
    border: "rgba(6, 182, 212, 0.30)",
  },
  emerald: {
    label: "Emerald",
    hex: "#10B981",
    foreground: "#FFFFFF",
    soft: "rgba(16, 185, 129, 0.12)",
    border: "rgba(16, 185, 129, 0.30)",
  },
  amber: {
    label: "Amber",
    hex: "#F59E0B",
    foreground: "#18181B",
    soft: "rgba(245, 158, 11, 0.12)",
    border: "rgba(245, 158, 11, 0.30)",
  },
  rose: {
    label: "Rose",
    hex: "#F43F5E",
    foreground: "#FFFFFF",
    soft: "rgba(244, 63, 94, 0.12)",
    border: "rgba(244, 63, 94, 0.30)",
  },
} as const;

export type AccentColor = keyof typeof ACCENT_COLORS;
