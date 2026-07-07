// BiblePeer look — same parchment/lake/gold palette as the web app.
export const colors = {
  background: "#faf7f0",
  surface: "#fffdf8",
  surface2: "#f1ecdf",
  border: "#e0d9c6",
  ink: "#2a3140",
  muted: "#7c7a6e",
  lake: "#34557f",
  lakeDeep: "#263f5f",
  gold: "#b08d3e",
  goldSoft: "#d4b877",
  olive: "#6e7f52",
  red: "#b04a4a",
  white: "#ffffff",
};

export const radii = { card: 12, button: 10, pill: 999 };

export const card = {
  backgroundColor: colors.surface,
  borderWidth: 1,
  borderColor: colors.border,
  borderRadius: radii.card,
} as const;
