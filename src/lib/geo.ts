export interface BoundingBox {
  minLat: number;
  maxLat: number;
  minLng: number;
  maxLng: number;
}

// Taiwan's approximate bounding box, used as the default map viewport and
// as a sane fallback when no bbox query params are supplied.
export const TAIWAN_BBOX: BoundingBox = {
  minLat: 21.8,
  maxLat: 25.4,
  minLng: 119.3,
  maxLng: 122.1,
};

export function haversineDistanceKm(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export function parseBoundingBox(searchParams: URLSearchParams): BoundingBox | null {
  const minLat = searchParams.get("minLat");
  const maxLat = searchParams.get("maxLat");
  const minLng = searchParams.get("minLng");
  const maxLng = searchParams.get("maxLng");

  if (!minLat || !maxLat || !minLng || !maxLng) return null;

  const bbox = {
    minLat: parseFloat(minLat),
    maxLat: parseFloat(maxLat),
    minLng: parseFloat(minLng),
    maxLng: parseFloat(maxLng),
  };

  if (Object.values(bbox).some((v) => Number.isNaN(v))) return null;
  return bbox;
}
