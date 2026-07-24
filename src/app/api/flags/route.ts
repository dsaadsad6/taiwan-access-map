import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { createFlagSchema } from "@/lib/validation";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const parsed = createFlagSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const { targetType, placeId, reviewId, reason, details } = parsed.data;
  const user = await getCurrentUser();

  if (targetType === "PLACE") {
    const place = await prisma.place.findUnique({ where: { id: placeId } });
    if (!place) {
      return NextResponse.json({ error: "找不到這個地點" }, { status: 404 });
    }
  } else {
    const review = await prisma.review.findUnique({ where: { id: reviewId } });
    if (!review) {
      return NextResponse.json({ error: "找不到這則評論" }, { status: 404 });
    }
  }

  const flag = await prisma.flag.create({
    data: {
      targetType,
      placeId: targetType === "PLACE" ? placeId : undefined,
      reviewId: targetType === "REVIEW" ? reviewId : undefined,
      reason,
      details,
      reporterId: user?.id,
    },
  });

  if (targetType === "PLACE" && placeId) {
    await prisma.place.update({ where: { id: placeId }, data: { status: "PENDING" } });
  } else if (targetType === "REVIEW" && reviewId) {
    await prisma.review.update({ where: { id: reviewId }, data: { status: "PENDING" } });
  }

  return NextResponse.json({ flag }, { status: 201 });
}
