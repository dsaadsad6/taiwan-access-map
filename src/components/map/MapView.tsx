"use client";

import { MapContainer, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet.markercluster/dist/MarkerCluster.css";
import "leaflet.markercluster/dist/MarkerCluster.Default.css";
import { MarkerCluster } from "./MarkerCluster";
import type { PlaceMarkerData } from "./PlaceMarker";

const TILE_URL =
  process.env.NEXT_PUBLIC_TILE_URL ?? "https://tile.openstreetmap.org/{z}/{x}/{y}.png";

// Taiwan's rough center, used as the default map view.
const TAIWAN_CENTER: [number, number] = [23.6, 120.9];

export function MapView({ places }: { places: PlaceMarkerData[] }) {
  return (
    <MapContainer
      center={TAIWAN_CENTER}
      zoom={8}
      scrollWheelZoom
      style={{ height: "100%", width: "100%" }}
    >
      <TileLayer
        url={TILE_URL}
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      <MarkerCluster places={places} />
    </MapContainer>
  );
}
