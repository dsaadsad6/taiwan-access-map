import { redirect } from "next/navigation";
import { ShieldAlert, ShieldOff, Inbox } from "lucide-react";
import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { FLAG_REASON_LABELS, type FlagReason } from "@/lib/constants";
import { AdminFlagActions } from "@/components/admin/AdminFlagActions";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";

export default async function AdminPage() {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/login");
  }
  if (user.role !== "ADMIN") {
    return (
      <div className="mx-auto max-w-lg px-4 py-10 text-center">
        <ShieldOff className="mx-auto h-10 w-10 text-slate-300 dark:text-slate-600" />
        <h1 className="mt-3 text-xl font-bold text-slate-900 dark:text-slate-100">沒有權限</h1>
        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">這個頁面僅限管理員使用。</p>
      </div>
    );
  }

  const flags = await prisma.flag.findMany({
    where: { status: "OPEN" },
    include: {
      place: true,
      review: { include: { author: { select: { displayName: true } } } },
      reporter: { select: { displayName: true } },
    },
    orderBy: { createdAt: "asc" },
  });

  return (
    <div className="mx-auto max-w-3xl px-4 py-6 sm:px-6">
      <h1 className="flex items-center gap-2 text-xl font-bold text-slate-900 dark:text-slate-100">
        <ShieldAlert className="h-5 w-5 text-brand-600 dark:text-brand-400" />
        審核後台
      </h1>
      <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
        待處理檢舉：{flags.length} 筆
      </p>

      {flags.length === 0 ? (
        <div className="mt-10 flex flex-col items-center text-center">
          <Inbox className="h-10 w-10 text-slate-300 dark:text-slate-600" />
          <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">目前沒有待審核的檢舉。</p>
        </div>
      ) : (
        <ul className="mt-4 space-y-3">
          {flags.map((flag) => (
            <Card key={flag.id} className="p-4">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <Badge variant={flag.targetType === "PLACE" ? "brand" : "neutral"}>
                      {flag.targetType === "PLACE" ? "地點" : "評論"}
                    </Badge>
                    <span className="text-sm text-slate-500 dark:text-slate-400">
                      {FLAG_REASON_LABELS[flag.reason as FlagReason] ?? flag.reason}
                    </span>
                  </div>
                  {flag.targetType === "PLACE" && flag.place && (
                    <p className="mt-2 font-medium text-slate-800 dark:text-slate-200">
                      {flag.place.name}
                    </p>
                  )}
                  {flag.targetType === "REVIEW" && flag.review && (
                    <div className="mt-2">
                      <p className="text-sm text-slate-500 dark:text-slate-400">
                        {flag.review.author.displayName} 的評論：
                      </p>
                      <p className="font-medium text-slate-800 dark:text-slate-200">
                        {flag.review.comment}
                      </p>
                    </div>
                  )}
                  {flag.details && (
                    <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
                      補充：{flag.details}
                    </p>
                  )}
                  <p className="mt-2 text-xs text-slate-400 dark:text-slate-500">
                    檢舉人：{flag.reporter?.displayName ?? "匿名"} ·{" "}
                    {flag.createdAt.toLocaleString("zh-TW")}
                  </p>
                </div>
                <AdminFlagActions flagId={flag.id} />
              </div>
            </Card>
          ))}
        </ul>
      )}
    </div>
  );
}
