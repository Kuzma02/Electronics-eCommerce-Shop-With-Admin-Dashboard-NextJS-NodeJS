const prisma = require("../utills/db");

async function testDatabase() {
  console.log("🔍 Testing database connection for bulk upload...\n");

  try {
    // Test connection
    console.log("1️⃣ Testing Prisma connection...");
    await prisma.$connect();
    console.log("✅ Database connected\n");

    // Check batches
    console.log("2️⃣ Checking bulk_upload_batch table...");
    const batches = await prisma.bulk_upload_batch.findMany();
    console.log(`✅ Found ${batches.length} batches\n`);

    // Check items
    console.log("3️⃣ Checking bulk_upload_item table...");
    const items = await prisma.bulk_upload_item.findMany();
    console.log(`✅ Found ${items.length} items\n`);

    // Check categories
    console.log("4️⃣ Checking categories...");
    const categories = await prisma.category.findMany({
      select: { id: true, name: true },
    });
    console.log(`✅ Found ${categories.length} categories:`);
    categories.forEach((cat) => console.log(`   - ${cat.name} (${cat.id})`));
    console.log();

    console.log("✅ All database checks passed!");
  } catch (error) {
    console.error("❌ Database error:", error.message);
    console.error("Stack:", error.stack);
  } finally {
    await prisma.$disconnect();
  }
}

testDatabase();
