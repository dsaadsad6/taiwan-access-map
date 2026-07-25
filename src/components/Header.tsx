import Link from "next/link";
import { Accessibility, Plus, ShieldCheck, LogIn, UserPlus } from "lucide-react";
import { getCurrentUser } from "@/lib/auth";
import { Button } from "@/components/ui/Button";
import { LogoutButton } from "@/components/LogoutButton";

export async function Header() {
  const user = await getCurrentUser();

  return (
    <header className="flex h-14 shrink-0 items-center justify-between border-b border-slate-200 bg-white/80 px-4 backdrop-blur supports-[backdrop-filter]:bg-white/60 dark:border-slate-800 dark:bg-slate-950/80">
      <Link href="/" className="flex items-center gap-2 font-semibold text-slate-900 dark:text-slate-100">
        <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-brand-600 text-white">
          <Accessibility className="h-4 w-4" />
        </span>
        <span className="hidden sm:inline">台灣無障礙地圖</span>
      </Link>

      <nav className="flex items-center gap-1 sm:gap-2">
        <Link href="/places/new">
          <Button variant="ghost" size="sm">
            <Plus className="h-4 w-4" />
            <span className="hidden sm:inline">新增地點</span>
          </Button>
        </Link>

        {user ? (
          <>
            {user.role === "ADMIN" && (
              <Link href="/admin">
                <Button variant="ghost" size="sm">
                  <ShieldCheck className="h-4 w-4" />
                  <span className="hidden sm:inline">審核後台</span>
                </Button>
              </Link>
            )}
            <span className="hidden text-sm text-slate-500 dark:text-slate-400 md:inline">
              {user.displayName}
            </span>
            <LogoutButton />
          </>
        ) : (
          <>
            <Link href="/login">
              <Button variant="ghost" size="sm">
                <LogIn className="h-4 w-4" />
                <span className="hidden sm:inline">登入</span>
              </Button>
            </Link>
            <Link href="/register">
              <Button variant="primary" size="sm">
                <UserPlus className="h-4 w-4" />
                <span className="hidden sm:inline">註冊</span>
              </Button>
            </Link>
          </>
        )}
      </nav>
    </header>
  );
}
