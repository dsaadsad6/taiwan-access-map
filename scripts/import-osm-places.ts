import { PrismaClient } from "@prisma/client";
import fs from "fs";
import path from "path";
import crypto from "crypto";

const prisma = new PrismaClient();

interface OverpassElement {
  type: "node" | "way" | "relation";
  id: number;
  lat?: number;
  lon?: number;
  center?: { lat: number; lon: number };
  tags?: Record<string, string>;
}

type Category =
  | "MRT_STATION"
  | "TRAIN_STATION"
  | "GOVERNMENT"
  | "PARK"
  | "RESTAURANT"
  | "STORE";

function categorize(tags: Record<string, string>): Category | null {
  if (tags.station === "subway") return "MRT_STATION";
  if (tags.railway === "station" || tags.railway === "halt") return "TRAIN_STATION";
  if (tags.office === "government" || tags.amenity === "townhall") return "GOVERNMENT";
  if (tags.leisure === "park") return "PARK";
  if (tags.amenity === "restaurant") return "RESTAURANT";
  if (tags.shop === "mall" || tags.shop === "department_store") return "STORE";
  return null;
}

function wheelchairToFeatureValue(tag: string | undefined): "YES" | "NO" | "PARTIAL" | null {
  if (tag === "yes") return "YES";
  if (tag === "no") return "NO";
  if (tag === "limited") return "PARTIAL";
  return null;
}

function buildAddress(tags: Record<string, string>): string | undefined {
  if (tags["addr:full"]) return tags["addr:full"];
  const parts = [tags["addr:city"], tags["addr:street"], tags["addr:housenumber"]].filter(Boolean);
  return parts.length > 0 ? parts.join("") : undefined;
}

async function chunkedCreateMany<T>(
  model: { createMany: (args: { data: T[] }) => Promise<unknown> },
  rows: T[],
  chunkSize: number,
  label: string
) {
  for (let i = 0; i < rows.length; i += chunkSize) {
    const chunk = rows.slice(i, i + chunkSize);
    await model.createMany({ data: chunk });
    console.log(`  ${label}: ${Math.min(i + chunkSize, rows.length)}/${rows.length}`);
  }
}

async function main() {
  const filePath = path.join(process.cwd(), ".tmp-osm", "result.json");
  const raw = JSON.parse(fs.readFileSync(filePath, "utf8"));
  const elements: OverpassElement[] = raw.elements;

  const existingNames = new Set(
    (await prisma.place.findMany({ select: { name: true } })).map((p) => p.name)
  );

  const stepFreeFeature = await prisma.accessibilityFeature.findUniqueOrThrow({
    where: { key: "STEP_FREE_ENTRANCE" },
  });

  const placeRows: {
    id: string;
    name: string;
    category: Category;
    latitude: number;
    longitude: number;
    address?: string;
    city?: string;
    isSeed: boolean;
    status: string;
  }[] = [];
  const featureRows: {
    id: string;
    placeId: string;
    featureId: string;
    value: "YES" | "NO" | "PARTIAL";
    note: string;
  }[] = [];

  const seenInBatch = new Set<string>();
  let skippedNoName = 0;
  let skippedNoCoords = 0;
  let skippedNoCategory = 0;
  let skippedDuplicate = 0;

  for (const el of elements) {
    const name = el.tags?.name?.trim();
    if (!name) {
      skippedNoName++;
      continue;
    }
    const lat = el.lat ?? el.center?.lat;
    const lon = el.lon ?? el.center?.lon;
    if (lat === undefined || lon === undefined) {
      skippedNoCoords++;
      continue;
    }
    const category = categorize(el.tags!);
    if (!category) {
      skippedNoCategory++;
      continue;
    }
    if (existingNames.has(name) || seenInBatch.has(name)) {
      skippedDuplicate++;
      continue;
    }
    seenInBatch.add(name);

    const placeId = crypto.randomUUID();
    placeRows.push({
      id: placeId,
      name,
      category,
      latitude: lat,
      longitude: lon,
      address: buildAddress(el.tags!),
      city: el.tags!["addr:city"],
      isSeed: true,
      status: "APPROVED",
    });

    const wheelchairValue = wheelchairToFeatureValue(el.tags!.wheelchair);
    if (wheelchairValue) {
      featureRows.push({
        id: crypto.randomUUID(),
        placeId,
        featureId: stepFreeFeature.id,
        value: wheelchairValue,
        note: "資料來源：OpenStreetMap wheelchair 標籤",
      });
    }
  }

  console.log(
    `Prepared ${placeRows.length} places to insert (${featureRows.length} with real wheelchair data). ` +
      `Skipped: ${skippedNoName} no-name, ${skippedNoCoords} no-coords, ${skippedNoCategory} uncategorized, ${skippedDuplicate} duplicate-name.`
  );

  await chunkedCreateMany(prisma.place, placeRows, 500, "places");
  await chunkedCreateMany(prisma.placeFeature, featureRows, 500, "features");

  console.log(`Done. Inserted ${placeRows.length} places and ${featureRows.length} accessibility features.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
