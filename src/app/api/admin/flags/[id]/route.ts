import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAdmin, AuthError } from "@/lib/auth";
import { resolveFlagSchema } from "@/lib/validation";

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  let admin;
  try {
    admin = await requireAdmin();
  } catch (e) {
    if (e instanceof AuthError) {
      return NextResponse.json({ error: e.code }, { status: e.code === "FORBIDDEN" ? 403 : 401 });
    }
    throw e;
  }

  const body = await request.json();
  const parsed = resolveFlagSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const flag = await prisma.flag.findUnique({ where: { id: params.id } });
  if (!flag || flag.status !== "OPEN") {
    return NextResponse.json({ error: "找不到待審核的檢舉" }, { status: 404 });
  }

  const approve = parsed.data.resolution === "APPROVE";
  const newTargetStatus = approve ? "APPROVED" : "REJECTED";

  await prisma.flag.update({
    where: { id: flag.id },
    data: {
      status: approve ? "RESOLVED_APPROVED" : "RESOLVED_REJECTED",
      resolvedAt: new Date(),
      resolvedById: admin.id,
    },
  });

  if (flag.targetType === "PLACE" && flag.placeId) {
    await prisma.place.update({ where: { id: flag.placeId }, data: { status: newTargetStatus } });
  } else if (flag.targetType === "REVIEW" && flag.reviewId) {
    await prisma.review.update({ where: { id: flag.reviewId }, data: { status: newTargetStatus } });
  }

  return NextResponse.json({ ok: true });
}
