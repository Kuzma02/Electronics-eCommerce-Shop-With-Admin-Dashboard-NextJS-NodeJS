const prisma = require("../utills/db");
const { asyncHandler, AppError } = require("../utills/errorHandler");
const {
  parseCsvBufferToRows,
  validateRow,
  createBatchWithItems,
  computeBatchStatus,
  getBatchSummary,
  canDeleteProductsForBatch,
  applyItemUpdates,
} = require("../services/bulkUploadService");

// POST /api/bulk-upload
const uploadCsvAndCreateBatch = asyncHandler(async (req, res) => {
  const csvFile = req.files?.file;
  if (!csvFile) {
    throw new AppError("CSV file is required (field name: 'file')", 400);
  }

  const rows = await parseCsvBufferToRows(csvFile.data);
  if (!rows || rows.length === 0) {
    throw new AppError("CSV has no rows", 400);
  }

  const valid = [];
  const errors = [];
  for (let i = 0; i < rows.length; i++) {
    const { ok, data, error } = validateRow(rows[i]);
    if (ok) valid.push(data);
    else errors.push({ index: i + 1, error });
  }

  const result = await prisma.$transaction(async (tx) => {
    const createdBatch = await tx.bulk_upload_batch.create({
      data: { status: "PENDING", itemCount: rows.length, errorCount: errors.length },
    });

    const { successCount, errorCount } = await createBatchWithItems(
      tx,
      createdBatch.id,
      valid,
      errors
    );

    const finalStatus = computeBatchStatus(successCount, errorCount);
    const batch = await tx.bulk_upload_batch.update({
      where: { id: createdBatch.id },
      data: { status: finalStatus, itemCount: successCount + errorCount, errorCount },
    });

    return batch;
  });

  const summary = await getBatchSummary(prisma, result.id);

  return res.status(201).json({
    batchId: result.id,
    status: result.status,
    ...summary,
    validationErrors: errors,
  });
});

// GET /api/bulk-upload
const listBatches = asyncHandler(async (req, res) => {
  const batches = await prisma.bulk_upload_batch.findMany({
    orderBy: { createdAt: "desc" },
  });

  return res.json(
    batches.map((b) => ({
      id: b.id,
      createdAt: b.createdAt,
      status: b.status,
      itemCount: b.itemCount,
      errorCount: b.errorCount,
    }))
  );
});

// GET /api/bulk-upload/:batchId
const getBatchDetail = asyncHandler(async (req, res) => {
  const { batchId } = req.params;
  if (!batchId) throw new AppError("Batch ID is required", 400);

  const batch = await prisma.bulk_upload_batch.findUnique({ where: { id: batchId } });
  if (!batch) throw new AppError("Batch not found", 404);

  const items = await prisma.bulk_upload_item.findMany({
    where: { batchId },
    include: { product: true },
  });

  return res.json({ batch, items });
});

// PUT /api/bulk-upload/:batchId
const updateBatchItems = asyncHandler(async (req, res) => {
  const { batchId } = req.params;
  const { items } = req.body;

  if (!batchId) throw new AppError("Batch ID is required", 400);
  if (!Array.isArray(items) || items.length === 0) {
    throw new AppError("Items array is required", 400);
  }

  const updated = await prisma.$transaction(async (tx) => {
    return await applyItemUpdates(tx, batchId, items);
  });

  return res.json({ updatedCount: updated.length, items: updated });
});

// DELETE /api/bulk-upload/:batchId
const deleteBatch = asyncHandler(async (req, res) => {
  const { batchId } = req.params;
  if (!batchId) throw new AppError("Batch ID is required", 400);

  const ok = await canDeleteProductsForBatch(prisma, batchId);
  if (!ok.ok) {
    throw new AppError(
      `Cannot delete batch, products referenced in orders: ${ok.blockedProductIds.join(", ")}`,
      409
    );
  }

  await prisma.$transaction(async (tx) => {
    const items = await tx.bulk_upload_item.findMany({
      where: { batchId, productId: { not: null } },
      select: { productId: true },
    });
    const productIds = items.map((i) => i.productId).filter(Boolean);

    if (productIds.length > 0) {
      await tx.customer_order_product.deleteMany({
        where: { productId: { in: productIds } },
      });
      await tx.product.deleteMany({
        where: { id: { in: productIds } },
      });
    }

    await tx.bulk_upload_batch.delete({ where: { id: batchId } });
  });

  return res.status(204).send();
});

module.exports = {
  uploadCsvAndCreateBatch,
  listBatches,
  getBatchDetail,
  updateBatchItems,
  deleteBatch,
};
