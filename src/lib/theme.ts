// 🎨 CENTRALIZED THEME SYSTEM
// ========================================
// এক জায়গা থেকে পুরো অ্যাপের কালার কন্ট্রোল
// 
// ⚠️ গুরুত্বপূর্ণ: মূল কালার পরিবর্তন করতে হলে শুধু
// src/app/globals.css ফাইলে `--signal` ভ্যালু এডিট করুন।
// বাকি সব এই ফাইল থেকে অটো আপডেট হবে।

/**
 * মূল কালার কনস্ট্যান্ট
 * এগুলো JS-এ inline style, chart library, canvas ইত্যাদিতে ব্যবহারের জন্য
 */
export const COLORS = {
  // ===== Primary Brand (Teal #066F6F) =====
  primary: "#066F6F",
  primaryForeground: "#FFFFFF",
  primaryTint: "rgba(6, 111, 111, 0.08)",
  primaryBorder: "rgba(6, 111, 111, 0.15)",
  primaryHover: "#055A5A",
  primaryActive: "#044747",
  primaryLight: "#0A8F8F",
  primaryShadow: "rgba(6, 111, 111, 0.45)",
  primaryShadowSm: "rgba(6, 111, 111, 0.20)",

  // ===== Neutral =====
  white: "#FFFFFF",
  black: "#000000",
  bg: "#F8FAFC",
  card: "#FFFFFF",
  border: "#E2E8F0",
  borderLight: "#F1F5F9",
  textPrimary: "#0F172A",
  textSecondary: "#64748B",
  textMuted: "#94A3B8",

  // ===== Semantic =====
  success: "#10B981",
  successBg: "#ECFDF5",
  successText: "#047857",
  successBorder: "#A7F3D0",

  warning: "#F59E0B",
  warningBg: "#FFFBEB",
  warningText: "#B45309",
  warningBorder: "#FDE68A",

  danger: "#DC2626",
  dangerBg: "#FEF2F2",
  dangerText: "#B91C1C",
  dangerBorder: "#FECACA",

  info: "#3B82F6",
  infoBg: "#EFF6FF",
  infoText: "#1D4ED8",
  infoBorder: "#BFDBFE",
} as const;

/**
 * CSS Variable Reference
 * এগুলো Tailwind ক্লাসের সমতুল্য — chart library বা custom CSS-এ ব্যবহারের জন্য
 */
export const CSS_VARS = {
  primary: "var(--color-signal)",
  primaryForeground: "var(--color-signal-foreground)",
  primaryTint: "var(--color-signal-tint)",
  background: "var(--background)",
  foreground: "var(--foreground)",
  card: "var(--card)",
  border: "var(--border)",
} as const;

/**
 * Tailwind ক্লাস শর্টকাট
 * বারবার লিখতে না হয় — একসাথে সব ক্লাস
 */
export const TW = {
  // === Backgrounds ===
  bgPrimary: "bg-signal",
  bgPrimaryTint: "bg-signal-tint",
  bgSuccess: "bg-success",
  bgSuccessTint: "bg-success-tint",
  bgWarning: "bg-warning",
  bgWarningTint: "bg-warning-tint",
  bgCaution: "bg-caution",
  bgCautionTint: "bg-caution-tint",
  bgDanger: "bg-destructive",
  bgViolet: "bg-violet-accent",
  bgVioletTint: "bg-violet-accent-tint",

  // === Text ===
  textPrimary: "text-signal",
  textOnPrimary: "text-signal-foreground",
  textSuccess: "text-success",
  textWarning: "text-warning",
  textCaution: "text-caution",
  textDanger: "text-destructive",
  textViolet: "text-violet-accent",
  textMuted: "text-muted-foreground",

  // === Borders ===
  borderPrimary: "border-signal",
  borderPrimarySoft: "border-signal/20",
  borderSuccess: "border-success/30",
  borderWarning: "border-warning/30",
  borderDanger: "border-destructive/30",

  // === Common Combos ===
  // Primary Button
  btnPrimary:
    "bg-signal text-signal-foreground hover:bg-signal/90 transition-colors rounded-xl font-semibold",
  // Outline Button
  btnOutline:
    "bg-transparent border border-signal/30 text-signal hover:bg-signal/5 transition-colors rounded-xl font-semibold",
  // Card Container
  cardBox: "bg-card rounded-2xl border border-border shadow-sm",
  // Tinted Info Box
  infoBox: "bg-signal-tint border border-signal/20 rounded-xl p-4",
  // Badge (success)
  badgeSuccess: "bg-success-tint text-success border border-success/20 rounded-full px-2.5 py-1 text-xs font-bold",
  // Badge (danger)
  badgeDanger: "bg-destructive/10 text-destructive border border-destructive/20 rounded-full px-2.5 py-1 text-xs font-bold",
  // Badge (warning)
  badgeWarning: "bg-warning-tint text-warning border border-warning/20 rounded-full px-2.5 py-1 text-xs font-bold",
} as const;

/**
 * চার্টের জন্য প্রিসেট কালার সেট
 * Recharts, ApexCharts ইত্যাদিতে ব্যবহারের জন্য
 */
export const CHART_COLORS = [
  COLORS.primary,
  "#8B5CF6", // violet
  "#10B981", // emerald
  "#F59E0B", // amber
  "#EC4899", // pink
  "#3B82F6", // blue
  "#EF4444", // red
] as const;