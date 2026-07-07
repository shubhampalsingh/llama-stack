// Admins can hide (take down) any startup. Configure via env:
// ADMIN_EMAILS="you@example.com,other@example.com"
export function isAdminEmail(email: string | null | undefined): boolean {
  if (!email) return false;
  const admins = (process.env.ADMIN_EMAILS ?? "")
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
  return admins.includes(email.toLowerCase());
}

export const CATEGORIES = [
  "AI",
  "Developer Tools",
  "Productivity",
  "SaaS",
  "Consumer",
  "E-commerce",
  "Fintech",
  "Health",
  "Education",
  "Games",
  "Open Source",
  "Other",
] as const;
