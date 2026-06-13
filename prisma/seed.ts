import "dotenv/config";
import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});

const prisma = new PrismaClient({
  adapter,
});
async function main() {
  await prisma.game.upsert({
    where: { slug: "remi" },
    update: {},
    create: {
      name: "Remi",
      slug: "remi",
      description: "Turnee recreative de Remi pe tabla",
      isActive: true,
    },
  });

  await prisma.game.upsert({
    where: { slug: "table" },
    update: {},
    create: {
      name: "Table",
      slug: "table",
      description: "Turnee recreative de Table",
      isActive: true,
    },
  });

  await prisma.game.upsert({
    where: { slug: "fifa" },
    update: {},
    create: {
      name: "FIFA",
      slug: "fifa",
      description: "Turnee recreative de FIFA",
      isActive: true,
    },
  });

  await prisma.game.upsert({
    where: { slug: "pescuit" },
    update: {},
    create: {
      name: "Pescuit",
      slug: "pescuit",
      description: "Concursuri recreative de pescuit",
      isActive: true,
    },
  });

  await prisma.season.upsert({
    where: { year: 2026 },
    update: { isActive: true },
    create: {
      name: "Sezon 2026",
      year: 2026,
      startsAt: new Date("2026-01-01T00:00:00.000Z"),
      endsAt: new Date("2026-12-31T23:59:59.000Z"),
      isActive: true,
    },
  });

  await prisma.city.upsert({
    where: { slug: "braila" },
    update: {},
    create: {
      name: "Braila",
      slug: "braila",
      county: "Braila",
      country: "Romania",
    },
  });

  await prisma.city.upsert({
    where: { slug: "galati" },
    update: {},
    create: {
      name: "Galati",
      slug: "galati",
      county: "Galati",
      country: "Romania",
    },
  });

  const badges = [
    ["Primul Turneu", "primul-turneu", "Participa la primul turneu Turneus"],
    ["10 Turnee", "10-turnee", "Participa la 10 turnee"],
    ["50 Turnee", "50-turnee", "Participa la 50 de turnee"],
    ["100 Turnee", "100-turnee", "Participa la 100 de turnee"],
    ["Campion Local", "campion-local", "Castiga un turneu local"],
    ["Campion National", "campion-national", "Devine campion national"],
    ["Top 10 National", "top-10-national", "Ajunge in Top 10 national"],
    ["Campionul Anului", "campionul-anului", "Devine campionul anului"],
  ];

  for (const [name, slug, description] of badges) {
    await prisma.badge.upsert({
      where: { slug },
      update: {},
      create: {
        name,
        slug,
        description,
      },
    });
  }

  console.log("Seed initial Turneus Pro finalizat.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
