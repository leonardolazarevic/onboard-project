/**
 * Chick-fil-A status palette — the single source of truth for the status colors
 * used across cards, tables, and the App Health views (previously copy-pasted as
 * raw hex in each). Environment-specific brand colors live in `envColor.ts`.
 */
export const palette = {
  success: "#077E4C", // healthy / open / online
  warning: "#FBC111", // degraded
  error: "#B6072F", // unhealthy / closed / offline
  muted: "#5B6770", // missing / not-reporting
  accent: "#E35205", // remodel
  info: "#004F71", // future
  onColor: "#FFFFFF", // text on a filled status color
  onWarning: "#1E272F", // text on the (light) warning color
} as const;
