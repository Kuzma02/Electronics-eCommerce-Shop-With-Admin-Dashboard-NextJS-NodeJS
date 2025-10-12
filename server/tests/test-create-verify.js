// Test lengkap: Create product dan verify di database
const prisma = require("../utills/db");

const API_BASE_URL = "http://localhost:3001";

async function testCreateAndVerify() {
  console.log("🧪 Full Test: Create Product + Verify in Database\n");
  console.log("=".repeat(70) + "\n");

  // Step 1: Get category
  console.log("Step 1️⃣: Getting categories...");
  const categoriesRes = await fetch(`${API_BASE_URL}/api/categories`);
  const categories = await categoriesRes.json();
  const categoryId = categories[0].id;
  console.log(`✅ Using category: ${categories[0].name} (${categoryId})\n`);

  // Step 2: Create product via API
  console.log("Step 2️⃣: Creating product via API...");
  const timestamp = Date.now();
  const productData = {
    title: `Test Product ${timestamp}`,
    slug: `test-product-${timestamp}`,
    price: 12345,
    manufacturer: "Test Manufacturer",
    description: "This is a test product for verification",
    mainImage: "test-image.jpg",
    categoryId: categoryId,
    inStock: 99,
  };

  console.log("Product data:", JSON.stringify(productData, null, 2));

  const createRes = await fetch(`${API_BASE_URL}/api/products`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(productData),
  });

  console.log(`Response status: ${createRes.status}`);
  const createResult = await createRes.json();
  console.log("Response:", JSON.stringify(createResult, null, 2));

  if (createRes.status !== 201) {
    console.log("\n❌ FAILED to create product via API");
    await prisma.$disconnect();
    return;
  }

  const createdProductId = createResult.id;
  console.log(`✅ Product created with ID: ${createdProductId}\n`);

  // Step 3: Wait a bit
  console.log("Step 3️⃣: Waiting 1 second...");
  await new Promise((resolve) => setTimeout(resolve, 1000));
  console.log("✅ Done\n");

  // Step 4: Verify in database directly
  console.log("Step 4️⃣: Checking database directly...");

  try {
    const dbProduct = await prisma.product.findUnique({
      where: { id: createdProductId },
      include: { category: true },
    });

    if (!dbProduct) {
      console.log("❌ CRITICAL: Product NOT FOUND in database!");
      console.log(`   Searched for ID: ${createdProductId}`);

      // Check if any product with same slug exists
      const bySlug = await prisma.product.findUnique({
        where: { slug: productData.slug },
      });

      if (bySlug) {
        console.log(
          `⚠️  Found product with slug, but different ID: ${bySlug.id}`
        );
      }
    } else {
      console.log("✅ SUCCESS: Product found in database!");
      console.log("\nDatabase record:");
      console.log(`   ID: ${dbProduct.id}`);
      console.log(`   Title: ${dbProduct.title}`);
      console.log(`   Slug: ${dbProduct.slug}`);
      console.log(`   Price: ${dbProduct.price}`);
      console.log(`   Category: ${dbProduct.category.name}`);
      console.log(`   In Stock: ${dbProduct.inStock}`);
      console.log(`   Manufacturer: ${dbProduct.manufacturer}`);
    }
  } catch (error) {
    console.error("❌ Error checking database:", error.message);
  }

  // Step 5: Verify via API
  console.log("\nStep 5️⃣: Fetching product via API...");
  const getRes = await fetch(
    `${API_BASE_URL}/api/products/${createdProductId}`
  );

  if (getRes.status === 200) {
    const apiProduct = await getRes.json();
    console.log("✅ Product accessible via API");
    console.log(`   Title: ${apiProduct.title}`);
  } else {
    console.log(`❌ Product NOT accessible via API (status: ${getRes.status})`);
  }

  console.log("\n" + "=".repeat(70));
  console.log("🏁 Test completed\n");

  await prisma.$disconnect();
}

testCreateAndVerify().catch(async (error) => {
  console.error("\n💥 Test failed:", error.message);
  console.error(error.stack);
  await prisma.$disconnect();
  process.exit(1);
});
