const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function createDefaultCategories() {
  console.log("🏗️  Creating default categories...\n");

  const categoriesToCreate = [
    { name: "electronics" },
    { name: "laptops" },
    { name: "audio" },
    { name: "televisions" },
    { name: "cameras" },
    { name: "smartphones" },
    { name: "tablets" },
    { name: "accessories" },
  ];

  try {
    for (const cat of categoriesToCreate) {
      const existing = await prisma.category.findFirst({
        where: { name: cat.name },
      });

      if (existing) {
        console.log(
          `⏭️  Category "${cat.name}" already exists (ID: ${existing.id})`
        );
      } else {
        const created = await prisma.category.create({
          data: cat,
        });
        console.log(`✅ Created category "${cat.name}" (ID: ${created.id})`);
      }
    }

    console.log("\n✨ All categories ready!\n");

    // List all categories
    const allCategories = await prisma.category.findMany({
      orderBy: { name: "asc" },
    });

    console.log("📋 Categories in database:");
    allCategories.forEach((cat) => {
      console.log(`   - ${cat.name.padEnd(20)} (ID: ${cat.id})`);
    });
    console.log("");
  } catch (error) {
    console.error("❌ Error:", error);
  } finally {
    await prisma.$disconnect();
  }
}

createDefaultCategories();
