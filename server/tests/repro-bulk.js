const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });
require('dotenv').config({ path: path.join(__dirname, '..', '..', '.env') });
const prisma = require('../utills/db');
const {
  validateRow,
  createBatchWithItems,
  computeBatchStatus,
  getBatchSummary,
} = require('../services/bulkUploadService');

(async () => {
  try {
    const cat = await prisma.category.create({ data: { name: 'repro-' + Math.random().toString(36).slice(2,8) } });
    const rows = [
      { title: 'Repro A', slug: 'repro-a-' + Date.now(), price: 200, manufacturer: 'X', description: 'A', mainImage: 'a.webp', categoryId: cat.id, inStock: 1 },
      { title: 'Repro B', slug: 'repro-b-' + Date.now(), price: 300, manufacturer: 'X', description: 'B', mainImage: 'b.webp', categoryId: cat.id, inStock: 1 },
      { title: 'Bad', slug: 'repro-bad-' + Date.now(), price: 'abc', manufacturer: 'X', description: 'Bad', mainImage: 'bad.webp', categoryId: '', inStock: 1 },
    ];
    const valid = [];
    const errors = [];
    for (let i = 0; i < rows.length; i++) {
      const { ok, data, error } = validateRow(rows[i]);
      if (ok) valid.push(data); else errors.push({ index: i + 1, error });
    }

    const batch = await prisma.$transaction(async (tx) => {
      const created = await tx.bulk_upload_batch.create({ data: { status: 'PENDING', itemCount: rows.length, errorCount: errors.length } });
      const { successCount, errorCount } = await createBatchWithItems(tx, created.id, valid, errors);
      const finalStatus = computeBatchStatus(successCount, errorCount);
      return await tx.bulk_upload_batch.update({ where: { id: created.id }, data: { status: finalStatus, itemCount: successCount + errorCount, errorCount } });
    });
    const summary = await getBatchSummary(prisma, batch.id);
    console.log('BATCH', { id: batch.id, status: batch.status, summary });

    const items = await prisma.bulk_upload_item.findMany({ where: { batchId: batch.id } });
    console.log('ITEMS', items.length, 'createdProducts', items.filter(i => i.productId).length);

    // cleanup
    const prodIds = items.map(i => i.productId).filter(Boolean);
    if (prodIds.length) await prisma.product.deleteMany({ where: { id: { in: prodIds } } });
    await prisma.bulk_upload_batch.delete({ where: { id: batch.id } });
    await prisma.category.delete({ where: { id: cat.id } });
    console.log('Repro OK');
  } catch (e) {
    console.error('Repro failed:', e.message);
    console.error(e);
    process.exitCode = 1;
  } finally {
    await prisma.$disconnect();
  }
})();
