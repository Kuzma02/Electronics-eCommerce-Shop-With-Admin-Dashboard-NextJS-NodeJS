require("../utills/register-ts"); // load ts-node so ../utills/db (db.ts) resolves
const prisma = require("../utills/db");

async function checkBulkUploadResults() {
  console.log("📊 Checking Bulk Upload Results\n");

  try {
    await prisma.$connect();

    // 1. Get latest batch
    console.log("1️⃣ Latest Upload Batch:");
    console.log("═".repeat(80));
    const latestBatch = await prisma.bulk_upload_batch.findFirst({
      orderBy: { createdAt: "desc" },
    });

    if (latestBatch) {
      console.log(`📦 Batch ID: ${latestBatch.id}`);
      console.log(`📄 File Name: ${latestBatch.fileName}`);
      console.log(`📊 Status: ${latestBatch.status}`);
      console.log(`📈 Total Items: ${latestBatch.itemCount}`);
      console.log(`❌ Errors: ${latestBatch.errorCount}`);
      console.log(`📅 Uploaded: ${latestBatch.createdAt}`);
      console.log("");

      // 2. Get items from this batch
      console.log("2️⃣ Batch Items:");
      console.log("═".repeat(80));
      const items = await prisma.bulk_upload_item.findMany({
        where: { batchId: latestBatch.id },
        include: { product: true },
      });

      items.forEach((item, index) => {
        console.log(
          `\n[${index + 1}] ${item.status === "CREATED" ? "✅" : "❌"} ${
            item.title
          }`
        );
        console.log(`    Slug: ${item.slug}`);
        console.log(`    Price: Rp ${item.price.toLocaleString()}`);
        console.log(`    Stock: ${item.inStock}`);
        console.log(`    Status: ${item.status}`);

        if (item.error) {
          console.log(`    ❌ Error: ${item.error}`);
        }

        if (item.product) {
          console.log(`    ✅ Product Created: ${item.product.id}`);
          console.log(
            `       Available in shop: http://localhost:3000/product/${item.product.slug}`
          );
        }
      });

      // 3. Statistics
      console.log("\n\n3️⃣ Statistics:");
      console.log("═".repeat(80));
      const successful = items.filter(
        (i) => i.status === "CREATED" && i.productId
      ).length;
      const failed = items.filter((i) => i.status === "ERROR").length;
      const successRate =
        items.length > 0 ? ((successful / items.length) * 100).toFixed(2) : 0;

      console.log(`📊 Total Records: ${items.length}`);
      console.log(`✅ Successful: ${successful}`);
      console.log(`❌ Failed: ${failed}`);
      console.log(`📈 Success Rate: ${successRate}%`);

      // 4. Check products in catalog
      if (successful > 0) {
        console.log("\n\n4️⃣ Products Now Available in Catalog:");
        console.log("═".repeat(80));

        const productIds = items
          .filter((i) => i.productId)
          .map((i) => i.productId);

        const products = await prisma.product.findMany({
          where: { id: { in: productIds } },
          include: { category: true },
        });

        products.forEach((product, index) => {
          console.log(`\n[${index + 1}] ${product.title}`);
          console.log(`    ID: ${product.id}`);
          console.log(`    Category: ${product.category.name}`);
          console.log(`    Price: Rp ${product.price.toLocaleString()}`);
          console.log(`    Stock: ${product.inStock}`);
          console.log(`    URL: http://localhost:3000/product/${product.slug}`);
          console.log(`    Admin: http://localhost:3000/admin/products`);
        });
      }

      // 5. All batches summary
      console.log("\n\n5️⃣ Upload History Summary:");
      console.log("═".repeat(80));
      const allBatches = await prisma.bulk_upload_batch.findMany({
        orderBy: { createdAt: "desc" },
        take: 5,
      });

      console.log(`Total Uploads: ${allBatches.length}\n`);

      for (const batch of allBatches) {
        const batchItems = await prisma.bulk_upload_item.findMany({
          where: { batchId: batch.id },
        });

        const success = batchItems.filter((i) => i.status === "CREATED").length;
        const total = batchItems.length;
        const rate = total > 0 ? ((success / total) * 100).toFixed(0) : 0;

        const statusIcon =
          batch.status === "COMPLETED"
            ? "✅"
            : batch.status === "FAILED"
            ? "❌"
            : batch.status === "PARTIAL"
            ? "⚠️"
            : "⏳";

        console.log(
          `${statusIcon} ${
            batch.fileName || `Batch ${batch.id.substring(0, 8)}`
          }`
        );
        console.log(
          `   ${batch.createdAt.toLocaleString()} | ${success}/${total} (${rate}%) | ${
            batch.status
          }`
        );
      }
    } else {
      console.log("❌ No bulk upload batches found");
      console.log("\n💡 Upload a CSV file first:");
      console.log("   1. Go to http://localhost:3000/admin/bulk-upload");
      console.log("   2. Upload bulk-upload-example.csv");
      console.log("   3. Run this script again");
    }

    console.log("\n\n" + "═".repeat(80));
    console.log("✅ Analysis Complete!");
    console.log("═".repeat(80));
  } catch (error) {
    console.error("❌ Error:", error.message);
    console.error(error.stack);
  } finally {
    await prisma.$disconnect();
  }
}

checkBulkUploadResults();
