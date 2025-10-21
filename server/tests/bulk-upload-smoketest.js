/* eslint-disable no-console */
// Bulk Upload API Smoke Test
// Endpoints:
// 1) POST   /api/bulk-upload          → upload CSV and create batch
// 2) GET    /api/bulk-upload           → list batches
// 3) GET    /api/bulk-upload/:batchId  → fetch batch detail
// 4) PUT    /api/bulk-upload/:batchId  → update items (price/stock)
// 5) DELETE /api/bulk-upload/:batchId  → delete batch and products

const path = require("path");
const { execSync } = require("child_process");
const prisma = require("../utills/db");
const FormData = require("form-data");
const fs = require("fs");

// Ensure env loaded similarly to server/app.js
require("dotenv").config({ path: path.join(__dirname, "..", ".env") });
require("dotenv").config({ path: path.join(__dirname, "..", "..", ".env") });

const API_BASE_URL = process.env.API_BASE_URL || "http://127.0.0.1:3001";

function section(title) {
  console.log("\n" + "─".repeat(80));
  console.log(`🔹 ${title}`);
  console.log("─".repeat(80));
}

function logStep(step, expected, actual) {
  console.log(`• ${step}`);
  if (expected) console.log(`  - Expected: ${expected}`);
  if (actual !== undefined) console.log(`  - Actual:   ${actual}`);
}

function assert(cond, message) {
  if (!cond) throw new Error(message || "Assertion failed");
}

async function ensureMigrations() {
  section("Applying Prisma migrations");
  try {
    execSync("npx prisma migrate deploy", {
      cwd: path.join(__dirname, "..", ".."),
      stdio: "inherit",
      env: process.env,
    });
    console.log("✅ Migrations applied");
  } catch (e) {
    console.error("❌ Failed to apply migrations");
    throw e;
  }
}

async function waitForServer() {
  section("Server health check");
  const res = await fetch(`${API_BASE_URL}/health`).catch(() => null);
  if (!res)
    throw new Error("Health check request failed (server not reachable)");
  const text = await res.text();
  logStep(
    "GET /health",
    "200 with status json",
    `${res.status} ${text.slice(0, 200)}...`
  );
  assert(res.status === 200, "Expected 200 from /health");
}

async function ensureTestCategory() {
  section("Ensure test category exists");
  const name = `bulk-test-${Math.random().toString(36).slice(2, 8)}`;
  const cat = await prisma.category.create({ data: { name } });
  logStep(
    "Create Category",
    "Created with unique id",
    JSON.stringify({ id: cat.id, name: cat.name })
  );
  return cat;
}

function buildCSV({ categoryId }) {
  // Random unique slugs
  const slugA = `bulk-a-${Date.now().toString(36)}-${Math.random()
    .toString(36)
    .slice(2, 6)}`;
  const slugB = `bulk-b-${Date.now().toString(36)}-${Math.random()
    .toString(36)
    .slice(2, 6)}`;
  const slugBad = `bulk-bad-${Date.now().toString(36)}-${Math.random()
    .toString(36)
    .slice(2, 6)}`;

  const header = [
    "title",
    "slug",
    "price",
    "manufacturer",
    "description",
    "mainImage",
    "categoryId",
    "inStock",
  ].join(",");
  const row1 = [
    "Bulk Test Product A",
    slugA,
    199,
    "TestCo",
    "Bulk A",
    "productA.webp",
    categoryId,
    1,
  ].join(",");
  const row2 = [
    "Bulk Test Product B",
    slugB,
    299,
    "TestCo",
    "Bulk B",
    "productB.webp",
    categoryId,
    1,
  ].join(",");
  // Invalid row: missing categoryId and non-numeric price → should be captured as error
  const rowBad = [
    "Bulk Invalid Product",
    slugBad,
    "abc",
    "TestCo",
    "Invalid item",
    "bad.webp",
    "",
    1,
  ].join(",");

  return {
    csv: [header, row1, row2, rowBad].join("\n"),
    slugs: { a: slugA, b: slugB, bad: slugBad },
  };
}

async function postBulkUpload(csvContent) {
  // Create temp file for CSV
  const tempFile = path.join(__dirname, "temp-bulk.csv");
  fs.writeFileSync(tempFile, csvContent);

  const form = new FormData();
  form.append("file", fs.createReadStream(tempFile), {
    filename: "bulk.csv",
    contentType: "text/csv",
  });

  const res = await fetch(`${API_BASE_URL}/api/bulk-upload`, {
    method: "POST",
    body: form,
    headers: form.getHeaders(),
  });

  // Clean up temp file
  fs.unlinkSync(tempFile);

  const text = await res.text();
  let payload;
  try {
    payload = JSON.parse(text);
  } catch {
    payload = { raw: text };
  }
  logStep(
    "POST /api/bulk-upload",
    "201 Created with batch summary",
    `${res.status} ${JSON.stringify(payload).slice(0, 300)}...`
  );
  assert(res.status === 201, `Expected 201, got ${res.status}`);
  const batchId = payload.batchId || payload.id;
  assert(batchId, "Response missing batchId");
  return { batchId, payload };
}

async function postBulkUploadMissingFileShould400() {
  const res = await fetch(`${API_BASE_URL}/api/bulk-upload`, {
    method: "POST",
  });
  logStep("POST /api/bulk-upload (no file)", "400 Bad Request", res.status);
  assert(res.status === 400, "Expected 400 for missing file");
}

async function listBatches() {
  const res = await fetch(`${API_BASE_URL}/api/bulk-upload`);
  const data = await res.json().catch(() => null);
  logStep(
    "GET /api/bulk-upload",
    "200 OK with list",
    `${res.status} (count=${Array.isArray(data) ? data.length : "n/a"})`
  );
  assert(res.status === 200, `Expected 200, got ${res.status}`);
  assert(Array.isArray(data), "Expected an array");
  return data;
}

async function getBatchDetail(batchId) {
  const res = await fetch(`${API_BASE_URL}/api/bulk-upload/${batchId}`);
  const data = await res.json().catch(() => null);
  logStep(`GET /api/bulk-upload/${batchId}`, "200 OK with items", res.status);
  assert(res.status === 200, `Expected 200, got ${res.status}`);
  return data;
}

async function putUpdateBatchItems(batchId, itemId, price, inStock) {
  const body = { items: [{ itemId, price, inStock }] };
  const res = await fetch(`${API_BASE_URL}/api/bulk-upload/${batchId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const data = await res.json().catch(() => null);
  logStep(
    `PUT /api/bulk-upload/${batchId}`,
    "200 OK and item updated",
    `${res.status} ${JSON.stringify(body)}`
  );
  assert(res.status === 200, `Expected 200, got ${res.status}`);
  return data;
}

async function deleteBatch(batchId) {
  const res = await fetch(`${API_BASE_URL}/api/bulk-upload/${batchId}`, {
    method: "DELETE",
  });
  logStep(`DELETE /api/bulk-upload/${batchId}`, "204 No Content", res.status);
  assert(res.status === 204, `Expected 204, got ${res.status}`);
}

async function run() {
  section("Start Bulk Upload Smoke Test");

  // Pre-flight checks
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL must be set in environment");
  }

  await ensureMigrations();
  await waitForServer();

  // Negative quick check for 400
  await postBulkUploadMissingFileShould400();

  // Create category for valid rows
  const category = await ensureTestCategory();

  // Build CSV with 2 valid + 1 invalid
  const { csv } = buildCSV({ categoryId: category.id });

  // 1) POST create batch
  section("1) Create bulk upload batch");
  const { batchId, payload: createPayload } = await postBulkUpload(csv);

  // DB check after creation
  section("DB check after creation");
  const dbBatch = await prisma.bulk_upload_batch.findUnique({
    where: { id: batchId },
    include: { items: true },
  });

  logStep(
    "Batch in DB",
    "Exists with items and status set",
    JSON.stringify({
      id: dbBatch?.id,
      status: dbBatch?.status,
      itemCount: dbBatch?.itemCount,
      errorCount: dbBatch?.errorCount,
    })
  );
  assert(dbBatch, "Batch not found in DB");
  assert(dbBatch.items.length >= 2, "Expected at least 2 items for valid rows");
  assert(
    ["PENDING", "COMPLETED", "PARTIAL", "FAILED"].includes(dbBatch.status),
    "Invalid batch status"
  );
  // With 1 invalid row we expect PARTIAL or at least errorCount > 0
  assert(
    dbBatch.status === "PARTIAL" || (dbBatch.errorCount ?? 0) > 0,
    "Expected partial success/errors"
  );

  // Verify product references for created items
  const createdItems = dbBatch.items.filter((i) => i.productId);
  for (const it of createdItems) {
    const prod = await prisma.product.findUnique({
      where: { id: it.productId },
    });
    assert(prod, `Product not found for item ${it.id}`);
  }
  logStep(
    "Product references",
    "All productId exist",
    `checked ${createdItems.length}`
  );

  // 2) GET list
  section("2) List batches");
  const list = await listBatches();
  assert(
    list.some((b) => b.id === batchId),
    "Created batch not listed"
  );

  // 3) GET detail
  section("3) Batch detail");
  const detail = await getBatchDetail(batchId);
  const itemsFromDetail = Array.isArray(detail?.items) ? detail.items : [];
  logStep("Detail items", "At least 2 items", itemsFromDetail.length);
  assert(itemsFromDetail.length >= 2, "Expected at least 2 items in detail");

  // 4) PUT update items (price/stock)
  section("4) Update batch items");
  const updatable = dbBatch.items.find((i) => i.productId);
  assert(updatable, "No updatable item with productId");
  const newPrice = 1234;
  await putUpdateBatchItems(batchId, updatable.id, newPrice, 0);

  // DB check product updated
  const updatedProduct = await prisma.product.findUnique({
    where: { id: updatable.productId },
  });
  logStep(
    "DB product updated",
    "price=1234, inStock=0",
    JSON.stringify({
      price: updatedProduct?.price,
      inStock: updatedProduct?.inStock,
    })
  );
  assert(
    updatedProduct && updatedProduct.price === newPrice,
    "Product price not updated"
  );
  assert(updatedProduct.inStock === 0, "Product inStock not updated");

  // 5) DELETE batch and products
  section("5) Delete batch and created products");
  // capture productIds before delete
  const productIds = (
    await prisma.bulk_upload_item.findMany({
      where: { batchId },
      select: { productId: true },
    })
  )
    .map((x) => x.productId)
    .filter(Boolean);

  await deleteBatch(batchId);

  // DB verify deletion
  section("DB check after deletion");
  const batchGone = await prisma.bulk_upload_batch.findUnique({
    where: { id: batchId },
  });
  assert(!batchGone, "Batch still exists after deletion");
  const itemsGone = await prisma.bulk_upload_item.findMany({
    where: { batchId },
  });
  assert(itemsGone.length === 0, "Batch items still exist after deletion");
  for (const pid of productIds) {
    const prod = await prisma.product.findUnique({ where: { id: pid } });
    assert(!prod, `Product ${pid} still exists after deletion`);
  }
  logStep(
    "Product cleanup",
    "Products removed",
    `checked ${productIds.length}`
  );

  console.log("\n✅ Smoke test completed successfully!");
}

run()
  .catch(async (err) => {
    console.error(
      "\n❌ Critical failure:",
      err && err.message ? err.message : err
    );
    console.error("Stack:", err?.stack);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
