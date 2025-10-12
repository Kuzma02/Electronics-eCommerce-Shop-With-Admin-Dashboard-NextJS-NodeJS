const { parse } = require("csv-parse/sync");

// Validate a single CSV row according to the Product schema constraints
function validateRow(row) {
  const errs = [];
  const clean = {};

  const title = String(row.title ?? "").trim();
  const slug = String(row.slug ?? "").trim();
  const price = Number(row.price);
  const categoryId = String(row.categoryId ?? "").trim();
  const inStock = Number(row.inStock);

  if (!title) errs.push("title is required");
  if (!slug) errs.push("slug is required");
  if (!Number.isFinite(price) || price < 0) errs.push("price must be a non-negative number");
  if (!categoryId) errs.push("categoryId is required");
  if (!(inStock === 0 || inStock === 1)) errs.push("inStock must be 0 or 1");

  if (errs.length) return { ok: false, error: errs.join(", ") };

  clean.title = title;
  clean.slug = slug;
  clean.price = Math.round(price);
  clean.categoryId = categoryId;
  clean.inStock = inStock;

  clean.manufacturer = row.manufacturer ? String(row.manufacturer).trim() : null;
  clean.description = row.description ? String(row.description).trim() : null;
  clean.mainImage = row.mainImage ? String(row.mainImage).trim() : null;

  return { ok: true, data: clean };
}

async function parseCsvBufferToRows(buffer) {
  const text = buffer.toString("utf-8");
  const records = parse(text, {
    columns: true,
    skip_empty_lines: true,
    trim: true,
  });
  return records;
}

function computeBatchStatus(successCount, errorCount) {
  if (successCount > 0 && errorCount === 0) return "COMPLETED";
  if (successCount > 0 && errorCount > 0) return "PARTIAL";
  if (successCount === 0 && errorCount > 0) return "FAILED";
  return "PENDING";
}

// Create products + items for valid rows, error items for invalid
async function createBatchWithItems(tx, batchId, validRows, errorRows) {
  const uniqueCategoryIds = [...new Set(validRows.map((r) => r.categoryId))];
  const categories = await tx.category.findMany({
    where: { id: { in: uniqueCategoryIds } },
    select: { id: true },
  });
  const validCategory = new Set(categories.map((c) => c.id));

  let success = 0;
  let failed = 0;

  for (const row of validRows) {
    if (!validCategory.has(row.categoryId)) {
      await tx.bulk_upload_item.create({
        data: {
          batchId,
          title: row.title,
          slug: row.slug,
          price: row.price,
          manufacturer: row.manufacturer,
          description: row.description,
          mainImage: row.mainImage,
          categoryId: row.categoryId,
          inStock: row.inStock,
          status: "ERROR",
          error: "Invalid categoryId",
        },
      });
      failed++;
      continue;
    }

    try {
      const product = await tx.product.create({
        data: {
          title: row.title,
          slug: row.slug,
          price: row.price,
          rating: 5,
          description: row.description ?? "",
          manufacturer: row.manufacturer ?? "",
          mainImage: row.mainImage ?? "",
          categoryId: row.categoryId,
          inStock: row.inStock,
        },
      });

      await tx.bulk_upload_item.create({
        data: {
          batchId,
          productId: product.id,
          title: row.title,
          slug: row.slug,
          price: row.price,
          manufacturer: row.manufacturer,
          description: row.description,
          mainImage: row.mainImage,
          categoryId: row.categoryId,
          inStock: row.inStock,
          status: "CREATED",
          error: null,
        },
      });
      success++;
    } catch (e) {
      await tx.bulk_upload_item.create({
        data: {
          batchId,
          title: row.title,
          slug: row.slug,
          price: row.price,
          manufacturer: row.manufacturer,
          description: row.description,
          mainImage: row.mainImage,
          categoryId: row.categoryId,
          inStock: row.inStock,
          status: "ERROR",
          error: e?.message || "Create failed",
        },
      });
      failed++;
    }
  }

  for (const err of errorRows) {
    await tx.bulk_upload_item.create({
      data: {
        batchId,
        title: "",
        slug: "",
        price: 0,
        manufacturer: null,
        description: null,
        mainImage: null,
        categoryId: "",
        inStock: 0,
        status: "ERROR",
        error: `Row ${err.index}: ${err.error}`,
      },
    });
    failed++;
  }

  return { successCount: success, errorCount: failed };
}

async function getBatchSummary(prisma, batchId) {
  const total = await prisma.bulk_upload_item.count({ where: { batchId } });
  const errors = await prisma.bulk_upload_item.count({ where: { batchId, status: "ERROR" } });
  const created = await prisma.bulk_upload_item.count({ where: { batchId, status: "CREATED" } });
  const updated = await prisma.bulk_upload_item.count({ where: { batchId, status: "UPDATED" } });
  return { total, errors, created, updated };
}

async function canDeleteProductsForBatch(prisma, batchId) {
  const items = await prisma.bulk_upload_item.findMany({
    where: { batchId, productId: { not: null } },
    select: { productId: true },
  });
  const productIds = items.map((i) => i.productId).filter(Boolean);
  if (productIds.length === 0) return { ok: true, blockedProductIds: [] };

  const referenced = await prisma.customer_order_product.findMany({
    where: { productId: { in: productIds } },
    select: { productId: true },
  });
  const blocked = new Set(referenced.map((r) => r.productId));
  const blockedList = productIds.filter((id) => blocked.has(id));
  return { ok: blockedList.length === 0, blockedProductIds: blockedList };
}

async function applyItemUpdates(tx, batchId, updates) {
  // updates: [{ itemId, price, inStock }]
  const ids = updates.map((u) => u.itemId);
  const items = await tx.bulk_upload_item.findMany({
    where: { id: { in: ids }, batchId },
    select: { id: true, productId: true },
  });
  const byId = new Map(items.map((i) => [i.id, i]));
  const result = [];

  for (const upd of updates) {
    const current = byId.get(upd.itemId);
    if (!current) continue;

    const price = Math.round(Number(upd.price));
    const inStock = Number(upd.inStock) === 1 ? 1 : 0;

    if (current.productId) {
      await tx.product.update({
        where: { id: current.productId },
        data: { price, inStock },
      });
    }

    const updatedItem = await tx.bulk_upload_item.update({
      where: { id: upd.itemId },
      data: { price, inStock, status: "UPDATED", error: null },
    });
    result.push(updatedItem);
  }
  return result;
}

module.exports = {
  parseCsvBufferToRows,
  validateRow,
  createBatchWithItems,
  computeBatchStatus,
  getBatchSummary,
  canDeleteProductsForBatch,
  applyItemUpdates,
};
