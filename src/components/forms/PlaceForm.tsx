"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { MapPin, Plus } from "lucide-react";
import { LocationPickerLoader } from "@/components/map/LocationPickerLoader";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Textarea } from "@/components/ui/Textarea";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import {
  PLACE_CATEGORIES,
  PLACE_CATEGORY_LABELS,
  ACCESSIBILITY_FEATURES,
  FEATURE_VALUES,
  FEATURE_VALUE_LABELS,
  type PlaceCategory,
  type FeatureValue,
} from "@/lib/constants";

type FeatureState = Record<string, { value: FeatureValue; note: string }>;

export function PlaceForm() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [category, setCategory] = useState<PlaceCategory>("OTHER");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [features, setFeatures] = useState<FeatureState>({});
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  function setFeature(key: string, value: FeatureValue) {
    setFeatures((prev) => ({ ...prev, [key]: { value, note: prev[key]?.note ?? "" } }));
  }

  function setFeatureNote(key: string, note: string) {
    setFeatures((prev) => ({
      ...prev,
      [key]: { value: prev[key]?.value ?? "UNKNOWN", note },
    }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!location) {
      setError("請先在地圖上點選地點位置");
      return;
    }

    setSubmitting(true);

    const res = await fetch("/api/places", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name,
        category,
        latitude: location.lat,
        longitude: location.lng,
        address: address || undefined,
        city: city || undefined,
        description: description || undefined,
        features: Object.entries(features).map(([key, f]) => ({
          key,
          value: f.value,
          note: f.note || undefined,
        })),
      }),
    });

    setSubmitting(false);

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(typeof data.error === "string" ? data.error : "新增失敗，請確認欄位是否正確");
      return;
    }

    const data = await res.json();
    router.push(`/places/${data.place.id}`);
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="h-72 w-full overflow-hidden rounded-xl border border-slate-200 dark:border-slate-800">
        <LocationPickerLoader value={location} onChange={(lat, lng) => setLocation({ lat, lng })} />
      </div>
      <p className="flex items-center gap-1.5 text-sm text-slate-500 dark:text-slate-400">
        <MapPin className="h-4 w-4 shrink-0 text-slate-400" />
        {location
          ? `已選擇位置：${location.lat.toFixed(5)}, ${location.lng.toFixed(5)}`
          : "在地圖上點一下來設定地點位置"}
      </p>

      <Input
        type="text"
        required
        placeholder="地點名稱"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <Select value={category} onChange={(e) => setCategory(e.target.value as PlaceCategory)}>
        {PLACE_CATEGORIES.map((c) => (
          <option key={c} value={c}>
            {PLACE_CATEGORY_LABELS[c]}
          </option>
        ))}
      </Select>

      <Input
        type="text"
        placeholder="地址（選填）"
        value={address}
        onChange={(e) => setAddress(e.target.value)}
      />

      <Input
        type="text"
        placeholder="縣市（選填）"
        value={city}
        onChange={(e) => setCity(e.target.value)}
      />

      <Textarea
        placeholder="補充說明（選填）"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        rows={3}
      />

      <Card className="p-4">
        <p className="mb-3 text-sm font-medium text-slate-700 dark:text-slate-300">無障礙設施標註</p>
        <div className="flex flex-col gap-3">
          {ACCESSIBILITY_FEATURES.map((f) => (
            <div key={f.key} className="flex flex-wrap items-center gap-2">
              <span className="w-28 shrink-0 text-sm text-slate-600 dark:text-slate-300">
                {f.labelZh}
              </span>
              <div className="w-28">
                <Select
                  value={features[f.key]?.value ?? "UNKNOWN"}
                  onChange={(e) => setFeature(f.key, e.target.value as FeatureValue)}
                >
                  {FEATURE_VALUES.map((v) => (
                    <option key={v} value={v}>
                      {FEATURE_VALUE_LABELS[v]}
                    </option>
                  ))}
                </Select>
              </div>
              <div className="min-w-32 flex-1">
                <Input
                  type="text"
                  placeholder="備註（選填）"
                  value={features[f.key]?.note ?? ""}
                  onChange={(e) => setFeatureNote(f.key, e.target.value)}
                />
              </div>
            </div>
          ))}
        </div>
      </Card>

      {error && <p className="text-sm text-red-600 dark:text-red-400">{error}</p>}

      <Button type="submit" loading={submitting}>
        <Plus className="h-4 w-4" />
        新增地點
      </Button>
    </form>
  );
}
