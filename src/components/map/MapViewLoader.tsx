"use client";

import dynamic from "next/dynamic";
import type { PlaceMarkerData } from "./PlaceMarker";

const MapView = dynamic(() => import("./MapView").then((m) => m.MapView), {
  ssr: false,
  loading: () => (
    <div className="flex h-full w-full items-center justify-center text-gray-500">
      地圖載入中...
    </div>
  ),
});

export function MapViewLoader({ places }: { places: PlaceMarkerData[] }) {
  return <MapView places={places} />;
}
