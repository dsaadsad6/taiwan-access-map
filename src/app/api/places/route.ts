import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { createPlaceSchema } from "@/lib/validation";
import { parseBoundingBox, TAIWAN_BBOX } from "@/lib/geo";
import { PLACE_CATEGORIES } from "@/lib/constants";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const bbox = parseBoundingBox(searchParams) ?? TAIWAN_BBOX;
  const category = searchParams.get("category");
  const featureKey = searchParams.get("featureKey");
  const featureValue = searchParams.get("featureValue");
  const q = searchParams.get("q");

  const where: Record<string, unknown> = {
    status: "APPROVED",
    latitude: { gte: bbox.minLat, lte: bbox.maxLat },
    longitude: { gte: bbox.minLng, lte: bbox.maxLng },
  };

  if (category && (PLACE_CATEGORIES as readonly string[]).includes(category)) {
    where.category = category;
  }

  if (q) {
    where.OR = [
      { name: { contains: q } },
      { address: { contains: q } },
    ];
  }

  if (featureKey) {
    where.features = {
      some: {
        feature: { key: featureKey },
        ...(featureValue ? { value: featureValue } : {}),
      },
    };
  }

  const places = await prisma.place.findMany({
    where,
    include: { features: { include: { feature: true } } },
    orderBy: { createdAt: "desc" },
    take: 500,
  });

  return NextResponse.json({ places });
}

export async function POST(request: NextRequest) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "需要登入才能新增地點" }, { status: 401 });
  }

  const body = await request.json();
  const parsed = createPlaceSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const { features, ...placeData } = parsed.data;

  const place = await prisma.place.create({
    data: {
      ...placeData,
      createdById: user.id,
    },
  });

  for (const f of features) {
    const featureRecord = await prisma.accessibilityFeature.findUnique({
      where: { key: f.key },
    });
    if (!featureRecord) continue;
    await prisma.placeFeature.create({
      data: {
        placeId: place.id,
        featureId: featureRecord.id,
        value: f.value,
        note: f.note,
        updatedById: user.id,
      },
    });
  }

  const fullPlace = await prisma.place.findUnique({
    where: { id: place.id },
    include: { features: { include: { feature: true } } },
  });

  return NextResponse.json({ place: fullPlace }, { status: 201 });
}
