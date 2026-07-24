export const CATEGORY_MARKER_COLORS: Record<string, string> = {
  RESTAURANT: "#f97316",
  MRT_STATION: "#2563eb",
  TRAIN_STATION: "#2563eb",
  GOVERNMENT: "#7c3aed",
  PARK: "#16a34a",
  STORE: "#ca8a04",
  OTHER: "#64748b",
};

export function markerColorFor(category: string): string {
  return CATEGORY_MARKER_COLORS[category] ?? CATEGORY_MARKER_COLORS.OTHER;
}
