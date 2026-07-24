import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { createReviewSchema } from "@/lib/validation";

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "需要登入才能留言" }, { status: 401 });
  }

  const body = await request.json();
  const parsed = createReviewSchema.safeParse({ ...body, placeId: params.id });
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const place = await prisma.place.findUnique({ where: { id: params.id } });
  if (!place || place.status !== "APPROVED") {
    return NextResponse.json({ error: "找不到這個地點" }, { status: 404 });
  }

  const review = await prisma.review.create({
    data: {
      placeId: params.id,
      authorId: user.id,
      rating: parsed.data.rating,
      comment: parsed.data.comment,
    },
  });

  return NextResponse.json({ review }, { status: 201 });
}
