"use client";

import dynamic from "next/dynamic";

export const LocationPickerLoader = dynamic(
  () => import("./LocationPicker").then((m) => m.LocationPicker),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-full w-full items-center justify-center text-gray-500">
        地圖載入中...
      </div>
    ),
  }
);
