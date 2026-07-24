"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Flag, CheckCircle2 } from "lucide-react";
import { FLAG_REASONS, FLAG_REASON_LABELS, type FlagReason } from "@/lib/constants";
import { Select } from "@/components/ui/Select";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

export function FlagButton({
  targetType,
  targetId,
}: {
  targetType: "PLACE" | "REVIEW";
  targetId: string;
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState<FlagReason>("INACCURATE");
  const [details, setDetails] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    const res = await fetch("/api/flags", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        targetType,
        placeId: targetType === "PLACE" ? targetId : undefined,
        reviewId: targetType === "REVIEW" ? targetId : undefined,
        reason,
        details: details || undefined,
      }),
    });

    setSubmitting(false);

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(typeof data.error === "string" ? data.error : "檢舉失敗");
      return;
    }

    setDone(true);
    router.refresh();
  }

  if (done) {
    return (
      <p className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400">
        <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
        已收到檢舉，將由管理員審核。
      </p>
    );
  }

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-1 text-xs text-slate-400 hover:text-red-600 dark:text-slate-500 dark:hover:text-red-400"
      >
        <Flag className="h-3 w-3" />
        檢舉
      </button>
    );
  }

  return (
    <Card as="form" onSubmit={handleSubmit} className="mt-1 flex flex-col gap-1.5 p-2.5 text-xs">
      <Select value={reason} onChange={(e) => setReason(e.target.value as FlagReason)}>
        {FLAG_REASONS.map((r) => (
          <option key={r} value={r}>
            {FLAG_REASON_LABELS[r]}
          </option>
        ))}
      </Select>
      <Input
        type="text"
        placeholder="補充說明（選填）"
        value={details}
        onChange={(e) => setDetails(e.target.value)}
      />
      {error && <p className="text-red-600 dark:text-red-400">{error}</p>}
      <div className="flex gap-2">
        <Button type="submit" variant="danger" size="sm" loading={submitting}>
          送出檢舉
        </Button>
        <Button type="button" variant="ghost" size="sm" onClick={() => setOpen(false)}>
          取消
        </Button>
      </div>
    </Card>
  );
}
