"use client";

import { useEffect, useMemo, useState } from "react";
import { Search, Loader2, MapPinned } from "lucide-react";
import { MapViewLoader } from "@/components/map/MapViewLoader";
import type { PlaceMarkerData } from "@/components/map/PlaceMarker";
import { Select } from "@/components/ui/Select";
import { Input } from "@/components/ui/Input";
import {
  PLACE_CATEGORIES,
  PLACE_CATEGORY_LABELS,
  ACCESSIBILITY_FEATURES,
  FEATURE_VALUES,
  FEATURE_VALUE_LABELS,
} from "@/lib/constants";

export function MapExplorer({ initialPlaces }: { initialPlaces: PlaceMarkerData[] }) {
  const [places, setPlaces] = useState(initialPlaces);
  const [category, setCategory] = useState("");
  const [featureKey, setFeatureKey] = useState("");
  const [featureValue, setFeatureValue] = useState("");
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(false);

  const hasFilters = category || featureKey || q;

  const query = useMemo(() => {
    const params = new URLSearchParams();
    if (category) params.set("category", category);
    if (featureKey) params.set("featureKey", featureKey);
    if (featureKey && featureValue) params.set("featureValue", featureValue);
    if (q) params.set("q", q);
    return params.toString();
  }, [category, featureKey, featureValue, q]);

  useEffect(() => {
    if (!hasFilters) {
      setPlaces(initialPlaces);
      return;
    }
    let cancelled = false;
    setLoading(true);
    fetch(`/api/places?${query}`)
      .then((res) => res.json())
      .then((data) => {
        if (!cancelled) setPlaces(data.places ?? []);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query]);

  return (
    <div className="flex h-full flex-col">
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 bg-white px-4 py-2.5 dark:border-slate-800 dark:bg-slate-950">
        <div className="w-36">
          <Select value={category} onChange={(e) => setCategory(e.target.value)}>
            <option value="">全部分類</option>
            {PLACE_CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {PLACE_CATEGORY_LABELS[c]}
              </option>
            ))}
          </Select>
        </div>

        <div className="w-36">
          <Select
            value={featureKey}
            onChange={(e) => {
              setFeatureKey(e.target.value);
              setFeatureValue("");
            }}
          >
            <option value="">全部設施</option>
            {ACCESSIBILITY_FEATURES.map((f) => (
              <option key={f.key} value={f.key}>
                {f.labelZh}
              </option>
            ))}
          </Select>
        </div>

        {featureKey && (
          <div className="w-28">
            <Select value={featureValue} onChange={(e) => setFeatureValue(e.target.value)}>
              <option value="">任何狀態</option>
              {FEATURE_VALUES.map((v) => (
                <option key={v} value={v}>
                  {FEATURE_VALUE_LABELS[v]}
                </option>
              ))}
            </Select>
          </div>
        )}

        <div className="relative min-w-40 flex-1 sm:flex-none">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <Input
            type="text"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="搜尋地點名稱或地址"
            className="pl-9"
          />
        </div>

        <span className="ml-auto flex items-center gap-1.5 text-sm text-slate-500 dark:text-slate-400">
          {loading ? (
            <>
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
              搜尋中...
            </>
          ) : (
            <>
              <MapPinned className="h-3.5 w-3.5" />共 {places.length} 筆地點
            </>
          )}
        </span>
      </div>
      <div className="flex-1">
        <MapViewLoader places={places} />
      </div>
    </div>
  );
}
