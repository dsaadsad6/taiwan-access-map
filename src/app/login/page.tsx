"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { LogIn } from "lucide-react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

// Facebook and LINE are temporarily hidden from the UI until their OAuth
// app credentials are set up:
// - Facebook: no app created yet. Re-add { id: "facebook", label: "使用 Facebook 繼續" }
//   once FACEBOOK_CLIENT_ID/SECRET are configured.
// - LINE: requires a separate LINE Developers console application for email
//   permission (under review), and User.email is NOT NULL — LINE sign-in
//   would fail account creation until that's approved. Re-add
//   { id: "line", label: "使用 LINE 繼續" } once granted.
const OAUTH_PROVIDERS = [{ id: "google", label: "使用 Google 繼續" }] as const;

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [oauthLoading, setOauthLoading] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    const res = await signIn("credentials", { email, password, redirect: false });

    setSubmitting(false);

    if (!res || res.error) {
      setError("email 或密碼不正確");
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

        <div className="mt-5 flex flex-col gap-2">
          {OAUTH_PROVIDERS.map((p) => (
            <Button
              key={p.id}
              type="button"
              variant="secondary"
              loading={oauthLoading === p.id}
              onClick={() => {
                setOauthLoading(p.id);
                signIn(p.id, { callbackUrl: "/" });
              }}
              className="w-full"
            >
              {p.label}
            </Button>
          ))}
        </div>

        <div className="my-5 flex items-center gap-3 text-xs text-slate-400 dark:text-slate-500">
          <div className="h-px flex-1 bg-slate-200 dark:bg-slate-700" />
          或使用 email
          <div className="h-px flex-1 bg-slate-200 dark:bg-slate-700" />
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
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
