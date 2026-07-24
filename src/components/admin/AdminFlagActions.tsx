"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Check, X } from "lucide-react";
import { Button } from "@/components/ui/Button";

export function AdminFlagActions({ flagId }: { flagId: string }) {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function resolve(resolution: "APPROVE" | "REJECT") {
    setSubmitting(true);
    setError(null);

    const res = await fetch(`/api/admin/flags/${flagId}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ resolution }),
    });

    setSubmitting(false);

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(typeof data.error === "string" ? data.error : "操作失敗");
      return;
    }

    router.refresh();
  }

  return (
    <div className="flex flex-col items-end gap-1.5">
      <div className="flex items-center gap-2">
        <Button type="button" variant="success" size="sm" disabled={submitting} onClick={() => resolve("APPROVE")}>
          <Check className="h-3.5 w-3.5" />
          核准
        </Button>
        <Button type="button" variant="danger" size="sm" disabled={submitting} onClick={() => resolve("REJECT")}>
          <X className="h-3.5 w-3.5" />
          駁回
        </Button>
      </div>
      {error && <span className="text-xs text-red-600 dark:text-red-400">{error}</span>}
    </div>
  );
}
