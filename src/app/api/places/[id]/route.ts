import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
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
    return NextResponse.json({ error: "找不到這個地點" }, { status: 404 });
  }

  return NextResponse.json({ place });
}
