import { prisma } from "@/lib/db";
import { MapExplorer } from "@/components/MapExplorer";

export default async function Home() {
  const places = await prisma.place.findMany({
    where: { status: "APPROVED" },
    select: {
      id: true,
      name: true,
      category: true,
      latitude: true,
      longitude: true,
      address: true,
    },
    take: 500,
  });

  return (
    <div className="h-[calc(100vh-3.5rem)]">
      <MapExplorer initialPlaces={places} />
    </div>
  );
}
