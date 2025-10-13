# 📦 Penjelasan Bulk Upload Product

## 🎯 Apa itu Bulk Upload?

Bulk upload adalah fitur untuk **membuat banyak produk sekaligus** menggunakan file CSV, tanpa perlu input manual satu per satu.

---

## 📊 Hasil Bulk Upload

### 1️⃣ Data yang Tersimpan di Database:

Ketika Anda upload CSV dengan 5 produk dan berhasil 100%, maka:

#### **Tabel `Product`** (Produk yang dibuat):

```sql
SELECT * FROM Product WHERE id IN (
  SELECT productId FROM bulk_upload_item
  WHERE batchId = 'bbd17cc8-b714-489a-9b54-14c859b19b6e'
);
```

**Hasil**: 5 produk baru ditambahkan ke catalog:

- Samsung Galaxy S24 Ultra
- Apple MacBook Pro 16-inch M3
- Sony WH-1000XM5 Wireless Headphones
- LG OLED C3 55-inch 4K Smart TV
- Canon EOS R6 Mark II Mirrorless Camera

#### **Tabel `bulk_upload_batch`** (Metadata upload):

```sql
id: bbd17cc8-b714-489a-9b54-14c859b19b6e
fileName: bulk-upload-example.csv
status: COMPLETED
itemCount: 5
errorCount: 0
createdAt: 2025-10-12 22:38:00
```

#### **Tabel `bulk_upload_item`** (Detail tiap produk):

```sql
-- 5 records dengan:
status: CREATED
productId: [UUID produk yang dibuat]
error: NULL (karena sukses)
```

---

## 🔄 CRUD Bulk Upload

### **C - CREATE** ✅ (Sudah Bisa)

**Cara 1: Via UI Dashboard**

1. Buka http://localhost:3000/admin/bulk-upload
2. Upload file CSV
3. Lihat hasilnya di Upload History

**Cara 2: Via API**

```bash
curl -X POST http://localhost:3001/api/bulk-upload -F "file=@bulk-upload-example.csv"
```

**Response**:

```json
{
  "batchId": "uuid",
  "status": "COMPLETED",
  "total": 5,
  "created": 5,
  "errors": 0
}
```

---

### **R - READ** ✅ (Sudah Bisa)

#### **1. List Semua Upload History**

```bash
GET http://localhost:3001/api/bulk-upload
```

**Response**:

```json
{
  "batches": [
    {
      "id": "uuid",
      "fileName": "bulk-upload-example.csv",
      "totalRecords": 5,
      "successfulRecords": 5,
      "failedRecords": 0,
      "status": "COMPLETED",
      "uploadedBy": "Admin",
      "uploadedAt": "2025-10-12T22:38:00.000Z",
      "errors": []
    }
  ]
}
```

#### **2. Detail Batch Tertentu**

```bash
GET http://localhost:3001/api/bulk-upload/{batchId}
```

**Response**:

```json
{
  "batch": {
    "id": "uuid",
    "fileName": "bulk-upload-example.csv",
    "status": "COMPLETED",
    "itemCount": 5,
    "errorCount": 0
  },
  "items": [
    {
      "id": "item-uuid-1",
      "batchId": "batch-uuid",
      "productId": "product-uuid-1",
      "title": "Samsung Galaxy S24 Ultra",
      "slug": "samsung-galaxy-s24-ultra",
      "price": 1299.99,
      "status": "CREATED",
      "error": null,
      "product": {
        /* detail produk */
      }
    }
    // ... 4 item lainnya
  ]
}
```

#### **3. Lihat Produk yang Dibuat**

Produk yang berhasil dibuat akan langsung muncul di:

- http://localhost:3000/admin/products
- http://localhost:3000/shop
- http://localhost:3000/product/{slug}

---

### **U - UPDATE** ⚙️ (Partial, perlu development lebih lanjut)

**Update yang Sudah Ada**:

#### **1. Update Item dalam Batch (Fix Error)**

```bash
PUT http://localhost:3001/api/bulk-upload/{batchId}
Content-Type: application/json

{
  "items": [
    {
      "itemId": "item-uuid",
      "categoryId": "correct-category-uuid"
    }
  ]
}
```

**Fungsi**: Memperbaiki item yang error dengan categoryId yang benar

**Kapan Digunakan**:

- Upload gagal karena kategori tidak ditemukan
- Ingin retry create produk dari item yang error

#### **2. Update Produk Individual**

Setelah bulk upload berhasil, produk bisa diupdate via:

```bash
PUT http://localhost:3001/api/products/{productId}
```

**Yang Bisa Diupdate Lewat Bulk Upload** (Enhancement):
Untuk saat ini, bulk upload **hanya CREATE**. Jika ingin UPDATE existing products via CSV, perlu tambahan:

```javascript
// Di bulkUploadService.js - createBatchWithItems()
// Tambahkan logic:

// Check if product with slug already exists
const existingProduct = await tx.product.findUnique({
  where: { slug: row.slug },
});

if (existingProduct) {
  // UPDATE product
  const updatedProduct = await tx.product.update({
    where: { id: existingProduct.id },
    data: {
      /* data dari CSV */
    },
  });

  await tx.bulk_upload_item.create({
    data: {
      batchId,
      productId: updatedProduct.id,
      status: "UPDATED", // Bukan CREATED
      // ... field lainnya
    },
  });
} else {
  // CREATE product (logic yang sudah ada)
}
```

---

### **D - DELETE** ✅ (Sudah Bisa)

#### **1. Delete Batch (Metadata saja)**

```bash
DELETE http://localhost:3001/api/bulk-upload/{batchId}?deleteProducts=false
```

**Hasil**: Hapus batch + items record, tapi **produk tetap ada**

#### **2. Delete Batch + Products**

```bash
DELETE http://localhost:3001/api/bulk-upload/{batchId}?deleteProducts=true
```

**Hasil**: Hapus batch, items, **DAN semua produk yang dibuat**

**Protection**: Tidak bisa delete jika produk sudah ada di order

```javascript
// Dari bulkUploadService.js
async function canDeleteProductsForBatch(tx, batchId) {
  const items = await tx.bulk_upload_item.findMany({
    where: { batchId, productId: { not: null } },
  });

  const productIds = items.map((i) => i.productId);

  // Check if any product is in orders
  const orderedProducts = await tx.customer_order_product.findMany({
    where: { productId: { in: productIds } },
  });

  if (orderedProducts.length > 0) {
    return { canDelete: false, reason: "Some products are in orders" };
  }

  return { canDelete: true };
}
```

---

## 🎨 UI yang Sudah Ada

### **1. Bulk Upload Page** (`/admin/bulk-upload`)

- ✅ Drag & drop CSV upload
- ✅ File validation
- ✅ Upload progress
- ✅ Result display (success/error)
- ✅ Template download
- ✅ Upload history list

### **2. Upload History Component**

- ✅ List semua upload batch
- ✅ Status badge (COMPLETED/FAILED/PARTIAL)
- ✅ Statistics (total/success/failed/rate)
- ✅ Error messages display
- ✅ File name & upload time

---

## 🚀 Enhancement yang Bisa Ditambahkan

### **1. Update Existing Products** (via CSV)

Tambahkan mode "UPDATE" di CSV dengan column `productId`:

```csv
productId,title,price,inStock
uuid-123,Updated Title,999.99,50
```

### **2. Bulk Delete via CSV**

Upload CSV berisi productId untuk mass delete:

```csv
productId
uuid-1
uuid-2
uuid-3
```

### **3. Export Products to CSV**

Download produk existing ke CSV untuk edit:

```bash
GET /api/products/export?categoryId=xxx&format=csv
```

### **4. Scheduled/Background Upload**

Untuk file besar (1000+ products):

- Queue system (Bull/BullMQ)
- Progress tracking
- Email notification setelah selesai

### **5. Image Bulk Upload**

Upload images dalam ZIP bersamaan dengan CSV:

```csv
title,price,imageName
Product 1,99.99,product1.jpg
```

### **6. Validation Preview**

Sebelum commit ke database, tampilkan preview:

- Valid rows (hijau)
- Invalid rows (merah) dengan alasan error
- Button "Confirm Upload" atau "Cancel"

### **7. Rollback/Undo Upload**

Tambahkan button "Undo Upload" dalam 5 menit setelah upload:

```javascript
DELETE / api / bulk - upload / { batchId } / rollback;
```

---

## 📝 Workflow Lengkap

### **Scenario 1: Upload Produk Baru**

1. **Prepare CSV** dengan data produk
2. **Upload** via dashboard
3. **Verify** di Upload History
4. **Check Products** di product list
5. **Test** di frontend shop

### **Scenario 2: Fix Failed Upload**

1. **Upload CSV** → Gagal karena category salah
2. **Lihat error** di Upload History
3. **Fix category** di CSV
4. **Re-upload** file yang sudah diperbaiki
5. **Verify success**

### **Scenario 3: Mass Delete via Batch**

1. **Find batch** yang mau dihapus
2. **Check** apakah produk sudah ada di order
3. **Delete batch + products** jika aman
4. **Verify** produk hilang dari catalog

---

## 🛠️ Testing Commands

```bash
# 1. Test Upload
cd "d:\MyDocuments\Documents\Kuliah\Semester 5\Pengembangan WEB (T2-P2)\ETS-v2\Electronics-eCommerce-Shop-With-Admin-Dashboard-NextJS-NodeJS"
curl.exe -X POST http://localhost:3001/api/bulk-upload -F "file=@bulk-upload-example.csv"

# 2. List Batches
curl http://localhost:3001/api/bulk-upload

# 3. Get Batch Detail
curl http://localhost:3001/api/bulk-upload/{batchId}

# 4. Delete Batch (keep products)
curl -X DELETE http://localhost:3001/api/bulk-upload/{batchId}?deleteProducts=false

# 5. Delete Batch (with products)
curl -X DELETE http://localhost:3001/api/bulk-upload/{batchId}?deleteProducts=true

# 6. Check Products Created
curl http://localhost:3001/api/products?page=1&limit=10
```

---

## ✅ Kesimpulan

**Hasil bulk upload Anda sudah BENAR!** ✅

Yang terjadi:

1. ✅ 5 produk berhasil dibuat di database
2. ✅ Produk muncul di product list
3. ✅ Produk bisa dibeli di shop
4. ✅ History tersimpan untuk tracking
5. ✅ Error handling berfungsi (lihat upload pertama yang gagal)

**Fitur CRUD yang sudah ada**:

- ✅ **CREATE**: Upload CSV → Buat produk baru
- ✅ **READ**: List batches, detail batch, lihat produk
- ⚠️ **UPDATE**: Bisa update individual product, tapi belum support bulk update via CSV
- ✅ **DELETE**: Delete batch (dengan/tanpa produk)

**Rekomendasi Next Steps**:

1. Test upload dengan kategori yang berbeda
2. Test upload file besar (50+ products)
3. Test error handling (invalid data)
4. Implement bulk UPDATE jika diperlukan
5. Add export to CSV feature

🎉 **Bulk upload feature is working perfectly!**
