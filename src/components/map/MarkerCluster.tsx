"use client";

import { useEffect } from "react";
import { useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet.markercluster";
import { PLACE_CATEGORY_LABELS, type PlaceCategory } from "@/lib/constants";
import { markerColorFor } from "@/lib/marker-colors";
import type { PlaceMarkerData } from "./PlaceMarker";

function makeIcon(category: string) {
  const color = markerColorFor(category);
  return L.divIcon({
    className: "",
    html: `<div style="background:${color};width:16px;height:16px;border-radius:50% 50% 50% 0;transform:rotate(-45deg);border:2px solid white;box-shadow:0 1px 3px rgba(0,0,0,0.4);"></div>`,
    iconSize: [16, 16],
    iconAnchor: [8, 16],
    popupAnchor: [0, -14],
  });
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export function MarkerCluster({ places }: { places: PlaceMarkerData[] }) {
  const map = useMap();

  useEffect(() => {
    const clusterGroup = L.markerClusterGroup({
      iconCreateFunction: (cluster) => {
        const count = cluster.getChildCount();
        const size = count >= 50 ? 44 : count >= 10 ? 38 : 32;
        return L.divIcon({
          html: `<div style="
            width:${size}px;height:${size}px;line-height:${size}px;
            background:#158981;color:#fff;border-radius:9999px;
            border:2px solid white;box-shadow:0 1px 4px rgba(0,0,0,0.35);
            text-align:center;font-weight:600;font-family:inherit;font-size:${count >= 100 ? 11 : 13}px;
          ">${count}</div>`,
          className: "",
          iconSize: [size, size],
        });
      },
    });

    for (const place of places) {
      const marker = L.marker([place.latitude, place.longitude], {
        icon: makeIcon(place.category),
      });

      const categoryLabel =
        PLACE_CATEGORY_LABELS[place.category as PlaceCategory] ?? place.category;

      marker.bindPopup(
        `<div style="font-size:14px;min-width:160px;">
          <p style="font-weight:600;margin:0 0 4px;color:#0f172a;">${escapeHtml(place.name)}</p>
          <p style="color:#64748b;margin:0 0 4px;">${escapeHtml(categoryLabel)}</p>
          ${place.address ? `<p style="color:#64748b;margin:0 0 6px;">${escapeHtml(place.address)}</p>` : ""}
          <a href="/places/${place.id}" style="color:#158981;font-weight:500;text-decoration:none;">查看詳情 →</a>
        </div>`
      );

      clusterGroup.addLayer(marker);
    }

    map.addLayer(clusterGroup);

    return () => {
      map.removeLayer(clusterGroup);
    };
  }, [map, places]);

  return null;
}
