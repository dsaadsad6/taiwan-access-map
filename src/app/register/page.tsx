"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { UserPlus } from "lucide-react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

export default function RegisterPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password, displayName }),
    });

    setSubmitting(false);

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      const message =
        typeof data.error === "string"
          ? data.error
          : data.error?.fieldErrors?.password?.[0] ?? "註冊失敗";
      setError(message);
      return;
    }

    router.push("/");
    router.refresh();
  }

  return (
    <div className="mx-auto flex min-h-[calc(100vh-3.5rem)] max-w-sm items-center px-4 py-10">
      <Card className="w-full p-6">
        <h1 className="flex items-center gap-2 text-xl font-bold text-slate-900 dark:text-slate-100">
          <UserPlus className="h-5 w-5 text-brand-600 dark:text-brand-400" />
          註冊
        </h1>
        <form onSubmit={handleSubmit} className="mt-5 flex flex-col gap-3">
          <Input
            type="text"
            required
            placeholder="顯示名稱"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
          />
          <Input
            type="email"
            required
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Input
            type="password"
            required
            placeholder="密碼（至少 8 個字元）"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {error && <p className="text-sm text-red-600 dark:text-red-400">{error}</p>}
          <Button type="submit" loading={submitting} className="mt-1 w-full">
            註冊
          </Button>
        </form>
        <p className="mt-4 text-sm text-slate-500 dark:text-slate-400">
          已經有帳號？{" "}
          <Link href="/login" className="font-medium text-brand-600 hover:underline dark:text-brand-400">
            登入
          </Link>
        </p>
      </Card>
    </div>
  );
}
