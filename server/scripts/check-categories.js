const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function checkCategories() {
  try {
    const categories = await prisma.category.findMany();

    console.log("\n📋 Categories in database:\n");
    if (categories.length === 0) {
      console.log("⚠️  No categories found!");
      console.log("You need to create categories first.\n");
    } else {
      categories.forEach((cat) => {
        console.log(`- ${cat.name.padEnd(20)} (ID: ${cat.id})`);
      });
      console.log(`\nTotal: ${categories.length} categories\n`);
    }

    // Check what's in the CSV
    console.log("📄 CategoryIds used in bulk-upload-example.csv:");
    console.log("- electronics");
    console.log("- laptops");
    console.log("- audio");
    console.log("- televisions");
    console.log("- cameras\n");

    // Check if these match
    const csvCategories = [
      "electronics",
      "laptops",
      "audio",
      "televisions",
      "cameras",
    ];
    const dbCategoryNames = categories.map((c) => c.name.toLowerCase());

    console.log("🔍 Matching check:");
    csvCategories.forEach((csvCat) => {
      const exists = dbCategoryNames.includes(csvCat.toLowerCase());
      console.log(
        `${exists ? "✅" : "❌"} ${csvCat}: ${
          exists ? "EXISTS in DB" : "NOT FOUND in DB"
        }`
      );
    });
    console.log("");
  } catch (error) {
    console.error("Error:", error);
  } finally {
    await prisma.$disconnect();
  }
}

checkCategories();
