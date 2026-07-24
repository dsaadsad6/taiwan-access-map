import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { PlaceForm } from "@/components/forms/PlaceForm";

export default async function NewPlacePage() {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/login");
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-6 sm:px-6">
      <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100">新增地點</h1>
      <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
        以 {user.displayName} 的身分新增
      </p>
      <div className="mt-4">
        <PlaceForm />
      </div>
    </div>
  );
}
