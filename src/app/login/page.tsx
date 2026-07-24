"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { LogIn } from "lucide-react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    setSubmitting(false);

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(typeof data.error === "string" ? data.error : "登入失敗");
      return;
    }

    router.push("/");
    router.refresh();
  }

  return (
    <div className="mx-auto flex min-h-[calc(100vh-3.5rem)] max-w-sm items-center px-4 py-10">
      <Card className="w-full p-6">
        <h1 className="flex items-center gap-2 text-xl font-bold text-slate-900 dark:text-slate-100">
          <LogIn className="h-5 w-5 text-brand-600 dark:text-brand-400" />
          登入
        </h1>
        <form onSubmit={handleSubmit} className="mt-5 flex flex-col gap-3">
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
            placeholder="密碼"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {error && <p className="text-sm text-red-600 dark:text-red-400">{error}</p>}
          <Button type="submit" loading={submitting} className="mt-1 w-full">
            登入
          </Button>
        </form>
        <p className="mt-4 text-sm text-slate-500 dark:text-slate-400">
          還沒有帳號？{" "}
          <Link href="/register" className="font-medium text-brand-600 hover:underline dark:text-brand-400">
            註冊
          </Link>
        </p>
        <p className="mt-3 rounded-lg bg-slate-50 p-2 text-xs text-slate-400 dark:bg-slate-800/50 dark:text-slate-500">
          開發測試帳號：demo@example.com / demo1234（一般使用者）、admin@example.com / admin1234（管理員）
        </p>
      </Card>
    </div>
  );
}
