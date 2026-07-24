import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAdmin, AuthError } from "@/lib/auth";

export async function GET() {
  try {
    await requireAdmin();
  } catch (e) {
    if (e instanceof AuthError) {
      return NextResponse.json({ error: e.code }, { status: e.code === "FORBIDDEN" ? 403 : 401 });
    }
    throw e;
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

  return NextResponse.json({ flags });
}
