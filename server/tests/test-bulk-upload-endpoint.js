const fs = require("fs");
const path = require("path");
const FormData = require("form-data");
const fetch = require("node-fetch");

async function testBulkUploadEndpoint() {
  console.log("🧪 Testing Bulk Upload API Endpoint\n");

  const API_BASE = "http://localhost:3001";

  // Test 1: Health check
  console.log("1️⃣  Testing health endpoint...");
  try {
    const healthResponse = await fetch(`${API_BASE}/health`);
    const healthData = await healthResponse.json();
    console.log("✅ Health check:", healthData.status);
  } catch (error) {
    console.log("❌ Health check failed:", error.message);
    return;
  }

  // Test 2: Check bulk-upload route
  console.log("\n2️⃣  Testing GET /api/bulk-upload (list batches)...");
  try {
    const listResponse = await fetch(`${API_BASE}/api/bulk-upload`);
    if (listResponse.ok) {
      const listData = await listResponse.json();
      console.log("✅ GET /api/bulk-upload works!");
      console.log("   Batches found:", listData.batches?.length || 0);
    } else {
      console.log("⚠️  GET /api/bulk-upload returned:", listResponse.status);
    }
  } catch (error) {
    console.log("❌ GET /api/bulk-upload failed:", error.message);
  }

  // Test 3: Upload CSV file
  console.log("\n3️⃣  Testing POST /api/bulk-upload (upload CSV)...");

  const csvPath = path.join(__dirname, "..", "..", "bulk-upload-example.csv");

  if (!fs.existsSync(csvPath)) {
    console.log("❌ CSV file not found:", csvPath);
    console.log("   Creating a test CSV file...");

    const testCsv = `title,price,manufacturer,inStock,mainImage,description,slug,categoryId
Test Product,99.99,Test Brand,10,https://example.com/test.jpg,Test description,test-product-${Date.now()},electronics`;

    fs.writeFileSync(csvPath, testCsv, "utf8");
    console.log("✅ Test CSV created");
  }

  try {
    const form = new FormData();
    form.append("file", fs.createReadStream(csvPath));

    const uploadResponse = await fetch(`${API_BASE}/api/bulk-upload`, {
      method: "POST",
      body: form,
      headers: form.getHeaders(),
    });

    const uploadData = await uploadResponse.json();

    if (uploadResponse.ok) {
      console.log("✅ POST /api/bulk-upload works!");
      console.log("   Batch ID:", uploadData.batchId);
      console.log("   Status:", uploadData.status);
      console.log("   Summary:", uploadData);
    } else {
      console.log("⚠️  Upload failed with status:", uploadResponse.status);
      console.log("   Error:", uploadData);
    }
  } catch (error) {
    console.log("❌ POST /api/bulk-upload failed:", error.message);
  }

  console.log("\n✨ Test completed!\n");
}

testBulkUploadEndpoint();
