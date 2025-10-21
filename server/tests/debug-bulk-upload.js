// Debug test for bulk upload
const path = require("path");
const FormData = require("form-data");
const fs = require("fs");

require("dotenv").config({ path: path.join(__dirname, "..", ".env") });
require("dotenv").config({ path: path.join(__dirname, "..", "..", ".env") });

const API_BASE_URL = process.env.API_BASE_URL || "http://localhost:3001";

async function testBulkUpload() {
  console.log("🔍 Testing bulk upload API...\n");

  // Create simple CSV
  const csv = [
    "title,slug,price,manufacturer,description,mainImage,categoryId,inStock",
    "Test Product,test-slug-123,100,TestCo,Test description,test.jpg,some-uuid-here,1",
  ].join("\n");

  console.log("CSV content:");
  console.log(csv);
  console.log("\n");

  // Save to temp file
  const tempFile = path.join(__dirname, "temp-test.csv");
  fs.writeFileSync(tempFile, csv);

  // Create form data
  const form = new FormData();
  form.append("file", fs.createReadStream(tempFile), {
    filename: "test.csv",
    contentType: "text/csv",
  });

  try {
    console.log(
      `📤 Sending POST request to ${API_BASE_URL}/api/bulk-upload...\n`
    );

    const res = await fetch(`${API_BASE_URL}/api/bulk-upload`, {
      method: "POST",
      body: form,
      headers: form.getHeaders(),
    });

    console.log(`📥 Response status: ${res.status}`);

    const text = await res.text();
    console.log(`📥 Response body: ${text}\n`);

    if (res.status !== 201) {
      console.error("❌ Expected 201, got", res.status);
      console.error("Server might have logged more details");
    } else {
      console.log("✅ Success!");
    }
  } catch (error) {
    console.error("❌ Error:", error.message);
    console.error(error.stack);
  } finally {
    // Clean up
    fs.unlinkSync(tempFile);
  }
}

testBulkUpload();
