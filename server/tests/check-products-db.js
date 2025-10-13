// Test untuk verifikasi data masuk database
const prisma = require("../utills/db");

async function checkProducts() {
  console.log("🔍 Checking products in database...\n");

  try {
    // Ambil produk terbaru
    const products = await prisma.product.findMany({
      orderBy: {
        id: "desc",
      },
      take: 10,
      include: {
        category: true,
      },
    });

    console.log(`📊 Total products found: ${products.length}\n`);

    if (products.length === 0) {
      console.log("❌ No products in database!");
      return;
    }

    console.log("Latest 10 products:");
    console.log("=".repeat(80));

    products.forEach((product, index) => {
      console.log(`\n${index + 1}. ${product.title}`);
      console.log(`   ID: ${product.id}`);
      console.log(`   Slug: ${product.slug}`);
      console.log(`   Price: ${product.price}`);
      console.log(`   Category: ${product.category?.name || "N/A"}`);
      console.log(`   In Stock: ${product.inStock}`);
    });

    console.log("\n" + "=".repeat(80));
    console.log("✅ Database check completed");
  } catch (error) {
    console.error("❌ Error:", error.message);
    console.error(error);
  } finally {
    await prisma.$disconnect();
  }
}

checkProducts();
