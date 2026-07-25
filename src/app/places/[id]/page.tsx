import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ArrowLeft, MapPin, MessageSquare, Star } from "lucide-react";
import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { ReviewForm } from "@/components/forms/ReviewForm";
import { FlagButton } from "@/components/forms/FlagButton";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { CATEGORY_ICONS, FEATURE_VALUE_BADGE_VARIANT, FEATURE_VALUE_ICONS } from "@/lib/ui-icons";
import {
  PLACE_CATEGORY_LABELS,
  FEATURE_VALUE_LABELS,
  type PlaceCategory,
  type FeatureValue,
} from "@/lib/constants";

export async function generateMetadata({
  params,
}: {
  params: { id: string };
}): Promise<Metadata> {
  const place = await prisma.place.findUnique({
    where: { id: params.id },
    select: { name: true, category: true, city: true, address: true, status: true },
  });

  if (!place || place.status !== "APPROVED") {
    return { title: "找不到這個地點" };
  }

  const categoryLabel = PLACE_CATEGORY_LABELS[place.category as PlaceCategory] ?? place.category;
  const location = [place.city, place.address].filter(Boolean).join(" ");

  return {
    title: `${place.name}無障礙設施資訊 | 台灣無障礙地圖`,
    description: `${place.name}（${categoryLabel}${location ? ` · ${location}` : ""}）的無障礙設施標註與使用者評論，包含坡道、電梯、無障礙廁所等資訊。`,
  };
}

export default async function PlaceDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const place = await prisma.place.findUnique({
    where: { id: params.id },
    include: {
      features: { include: { feature: true } },
      reviews: {
        where: { status: "APPROVED" },
        include: { author: { select: { displayName: true } } },
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!place || place.status !== "APPROVED") {
    notFound();
  }

  const user = await getCurrentUser();
  const CategoryIcon = CATEGORY_ICONS[place.category as PlaceCategory] ?? MapPin;

  return (
    <div className="mx-auto max-w-2xl px-4 py-6 sm:px-6">
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-brand-600 dark:text-slate-400 dark:hover:text-brand-400"
      >
        <ArrowLeft className="h-4 w-4" />
        回到地圖
      </Link>

      <div className="mt-3 flex items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <span className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-600 dark:bg-brand-950 dark:text-brand-300">
            <CategoryIcon className="h-5 w-5" />
          </span>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">{place.name}</h1>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              {PLACE_CATEGORY_LABELS[place.category as PlaceCategory] ?? place.category}
              {place.city ? ` · ${place.city}` : ""}
            </p>
          </div>
        </div>
        <FlagButton targetType="PLACE" targetId={place.id} />
      </div>

      {place.address && (
        <p className="mt-3 flex items-center gap-1.5 text-sm text-slate-600 dark:text-slate-300">
          <MapPin className="h-4 w-4 shrink-0 text-slate-400" />
          {place.address}
        </p>
      )}
      {place.description && (
        <p className="mt-3 text-sm text-slate-700 dark:text-slate-300">{place.description}</p>
      )}

      <section className="mt-8">
        <h2 className="text-base font-semibold text-slate-900 dark:text-slate-100">無障礙設施</h2>
        {place.features.length === 0 ? (
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">目前尚無設施標註資訊。</p>
        ) : (
          <ul className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
            {place.features.map((pf) => {
              const value = pf.value as FeatureValue;
              const ValueIcon = FEATURE_VALUE_ICONS[value] ?? FEATURE_VALUE_ICONS.UNKNOWN;
              return (
                <Card key={pf.id} className="flex items-start justify-between gap-2 p-3">
                  <div>
                    <span className="text-sm font-medium text-slate-800 dark:text-slate-200">
                      {pf.feature.labelZh}
                    </span>
                    {pf.note && (
                      <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">{pf.note}</p>
                    )}
                  </div>
                  <Badge
                    variant={FEATURE_VALUE_BADGE_VARIANT[value] ?? "neutral"}
                    className="shrink-0"
                  >
                    <ValueIcon className="h-3 w-3" />
                    {FEATURE_VALUE_LABELS[value] ?? pf.value}
                  </Badge>
                </Card>
              );
            })}
          </ul>
        )}
      </section>

      <section className="mt-8">
        <h2 className="flex items-center gap-1.5 text-base font-semibold text-slate-900 dark:text-slate-100">
          <MessageSquare className="h-4 w-4" />
          評論 ({place.reviews.length})
        </h2>
        {place.reviews.length === 0 ? (
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">目前還沒有評論。</p>
        ) : (
          <ul className="mt-3 space-y-3">
            {place.reviews.map((review) => (
              <Card key={review.id} className="p-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-slate-800 dark:text-slate-200">
                    {review.author.displayName}
                  </span>
                  {review.rating && (
                    <span className="flex items-center gap-0.5 text-amber-500">
                      {Array.from({ length: review.rating }).map((_, i) => (
                        <Star key={i} className="h-3.5 w-3.5 fill-current" />
                      ))}
                    </span>
                  )}
                </div>
                <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">{review.comment}</p>
                <div className="mt-1.5">
                  <FlagButton targetType="REVIEW" targetId={review.id} />
                </div>
              </Card>
            ))}
          </ul>
        )}

        {user ? (
          <ReviewForm placeId={place.id} />
        ) : (
          <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">
            <Link href="/login" className="font-medium text-brand-600 hover:underline dark:text-brand-400">
              登入
            </Link>{" "}
            後即可留下評論。
          </p>
        )}
      </section>
    </div>
  );
}
