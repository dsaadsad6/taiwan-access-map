"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Star } from "lucide-react";
import { Textarea } from "@/components/ui/Textarea";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

export function ReviewForm({ placeId }: { placeId: string }) {
  const router = useRouter();
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    const res = await fetch(`/api/places/${placeId}/reviews`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ rating, comment }),
    });

    setSubmitting(false);

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(typeof data.error === "string" ? data.error : "送出失敗");
      return;
    }

    setComment("");
    router.refresh();
  }

  return (
    <Card
      as="form"
      onSubmit={handleSubmit}
      className="mt-3 flex flex-col gap-2.5 p-3.5"
    >
      <label className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
        評分
        <div className="w-24">
          <Select value={rating} onChange={(e) => setRating(Number(e.target.value))}>
            {[5, 4, 3, 2, 1].map((n) => (
              <option key={n} value={n}>
                {"★".repeat(n)}
              </option>
            ))}
          </Select>
        </div>
      </label>
      <Textarea
        required
        placeholder="分享這個地點的無障礙使用經驗..."
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        rows={3}
      />
      {error && <p className="text-sm text-red-600 dark:text-red-400">{error}</p>}
      <Button type="submit" loading={submitting} size="sm" className="self-start">
        <Star className="h-3.5 w-3.5" />
        送出評論
      </Button>
    </Card>
  );
}
