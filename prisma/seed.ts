import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { ACCESSIBILITY_FEATURES } from "../src/lib/constants";
import { seedPlaces } from "./seedData/places";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding accessibility features...");
  for (const feature of ACCESSIBILITY_FEATURES) {
    await prisma.accessibilityFeature.upsert({
      where: { key: feature.key },
      update: { labelZh: feature.labelZh },
      create: feature,
    });
  }

  console.log("Seeding demo users...");
  const adminPasswordHash = await bcrypt.hash("admin1234", 10);
  const admin = await prisma.user.upsert({
    where: { email: "admin@example.com" },
    update: {},
    create: {
      email: "admin@example.com",
      passwordHash: adminPasswordHash,
      displayName: "管理員",
      role: "ADMIN",
    },
  });

  const demoPasswordHash = await bcrypt.hash("demo1234", 10);
  const demoUser = await prisma.user.upsert({
    where: { email: "demo@example.com" },
    update: {},
    create: {
      email: "demo@example.com",
      passwordHash: demoPasswordHash,
      displayName: "示範使用者",
      role: "USER",
    },
  });

  console.log(`Seeding ${seedPlaces.length} places...`);
  const createdPlaces = [];
  for (const seedPlace of seedPlaces) {
    const { features, ...placeData } = seedPlace;

    const existing = await prisma.place.findFirst({
      where: { name: placeData.name, isSeed: true },
    });
    if (existing) {
      createdPlaces.push(existing);
      continue;
    }

    const place = await prisma.place.create({
      data: {
        ...placeData,
        isSeed: true,
        createdById: demoUser.id,
      },
    });

    for (const f of features) {
      const featureRecord = await prisma.accessibilityFeature.findUniqueOrThrow({
        where: { key: f.key },
      });
      await prisma.placeFeature.create({
        data: {
          placeId: place.id,
          featureId: featureRecord.id,
          value: f.value,
          note: f.note,
        },
      });
    }

    createdPlaces.push(place);
  }

  console.log("Seeding demo reviews...");
  const reviewTargets = createdPlaces.slice(0, 3);
  const sampleReviews = [
    { rating: 5, comment: "無障礙設施完善，電梯很好找，服務人員也很friendly。" },
    { rating: 4, comment: "整體不錯，但無障礙廁所離入口有點遠。" },
    { rating: 3, comment: "有坡道但坡度偏陡，需要人協助會比較安全。" },
  ];
  for (let i = 0; i < reviewTargets.length; i++) {
    const place = reviewTargets[i];
    const existingReview = await prisma.review.findFirst({
      where: { placeId: place.id, authorId: demoUser.id },
    });
    if (existingReview) continue;

    await prisma.review.create({
      data: {
        placeId: place.id,
        authorId: demoUser.id,
        rating: sampleReviews[i].rating,
        comment: sampleReviews[i].comment,
      },
    });
  }

  console.log("Seed complete.");
  console.log(`Admin login: admin@example.com / admin1234 (dev only)`);
  console.log(`Demo user login: demo@example.com / demo1234 (dev only)`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
