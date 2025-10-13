const { PrismaClient } = require("@prisma/client");
const fs = require("fs");
const path = require("path");

const prisma = new PrismaClient();

async function generateProductTemplate() {
  try {
    console.log("📋 Generating product template CSV...\n");

    // Fetch categories from database
    const categories = await prisma.category.findMany({
      take: 5,
      orderBy: { name: "asc" },
    });

    if (categories.length === 0) {
      console.log("⚠️  No categories found in database!");
      console.log("Please create some categories first.");
      return;
    }

    console.log("✅ Found categories:");
    categories.forEach((cat, index) => {
      console.log(`   ${index + 1}. ${cat.name} (ID: ${cat.id})`);
    });
    console.log("");

    // Use first category as default, or distribute across categories
    const categoryIds = categories.map((c) => c.id);

    // Sample products with real category IDs
    const products = [
      {
        title: "Samsung Galaxy S24 Ultra",
        price: 1299.99,
        manufacturer: "Samsung",
        inStock: 25,
        mainImage:
          "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=500",
        description:
          "The latest flagship smartphone from Samsung with 200MP camera and S Pen support. Features advanced AI capabilities and all-day battery life.",
        slug: "samsung-galaxy-s24-ultra",
        categoryId: categoryIds[0] || "REPLACE_WITH_CATEGORY_ID",
      },
      {
        title: "Apple MacBook Pro 16-inch",
        price: 2499.99,
        manufacturer: "Apple",
        inStock: 15,
        mainImage:
          "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500",
        description:
          "Powerful laptop with M3 Pro chip and stunning Liquid Retina XDR display. Perfect for professionals and creatives.",
        slug: "apple-macbook-pro-16",
        categoryId:
          categoryIds[1] || categoryIds[0] || "REPLACE_WITH_CATEGORY_ID",
      },
      {
        title: "Sony WH-1000XM5 Headphones",
        price: 399.99,
        manufacturer: "Sony",
        inStock: 50,
        mainImage:
          "https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=500",
        description:
          "Premium noise-canceling wireless headphones with exceptional sound quality. Industry-leading noise cancellation technology.",
        slug: "sony-wh-1000xm5",
        categoryId:
          categoryIds[2] || categoryIds[0] || "REPLACE_WITH_CATEGORY_ID",
      },
      {
        title: "LG OLED C3 55-inch TV",
        price: 1799.99,
        manufacturer: "LG",
        inStock: 10,
        mainImage:
          "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=500",
        description:
          "Stunning 4K OLED TV with AI-powered picture processing and webOS smart platform. Perfect blacks and vibrant colors.",
        slug: "lg-oled-c3-55",
        categoryId:
          categoryIds[3] || categoryIds[0] || "REPLACE_WITH_CATEGORY_ID",
      },
      {
        title: "Canon EOS R6 Mark II Camera",
        price: 2499.99,
        manufacturer: "Canon",
        inStock: 8,
        mainImage:
          "https://images.unsplash.com/photo-1606980288917-8f1c01a4f6fc?w=500",
        description:
          "Full-frame mirrorless camera with 24.2MP sensor and advanced autofocus system. Captures stunning photos and 4K video.",
        slug: "canon-eos-r6-mark-ii",
        categoryId:
          categoryIds[4] || categoryIds[0] || "REPLACE_WITH_CATEGORY_ID",
      },
    ];

    // Generate CSV content
    const headers = [
      "title",
      "price",
      "manufacturer",
      "inStock",
      "mainImage",
      "description",
      "slug",
      "categoryId",
    ];
    let csvContent = headers.join(",") + "\n";

    products.forEach((product) => {
      const row = headers.map((header) => {
        const value = product[header];
        // Escape values that contain commas or quotes
        if (
          typeof value === "string" &&
          (value.includes(",") || value.includes('"') || value.includes("\n"))
        ) {
          return `"${value.replace(/"/g, '""')}"`;
        }
        return value;
      });
      csvContent += row.join(",") + "\n";
    });

    // Save to file
    const outputPath = path.join(
      __dirname,
      "..",
      "..",
      "product-template-ready.csv"
    );
    fs.writeFileSync(outputPath, csvContent, "utf8");

    console.log("✅ Template CSV generated successfully!");
    console.log(`📁 File saved to: ${outputPath}\n`);

    console.log("📊 Template contains:");
    console.log(`   - ${products.length} sample products`);
    console.log(`   - Real category IDs from your database`);
    console.log(`   - Ready to upload via bulk upload feature\n`);

    console.log("🚀 Next steps:");
    console.log("   1. Open the generated CSV file");
    console.log("   2. Modify the products as needed");
    console.log("   3. Upload via Admin Dashboard > Bulk Upload");
    console.log(
      "   4. Or use the API: POST http://localhost:3001/api/products/bulk-upload\n"
    );

    // Also create a blank template
    const blankTemplate = headers.join(",") + "\n";
    const blankPath = path.join(
      __dirname,
      "..",
      "..",
      "product-template-blank.csv"
    );
    fs.writeFileSync(blankPath, blankTemplate, "utf8");
    console.log(`📝 Blank template also created: ${blankPath}`);
  } catch (error) {
    console.error("❌ Error generating template:", error);
  } finally {
    await prisma.$disconnect();
  }
}

generateProductTemplate();
