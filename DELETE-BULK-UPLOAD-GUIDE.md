# 🗑️ Cara Delete Bulk Upload Batch

## Dari UI Dashboard

### Langkah-langkah:

1. **Buka halaman Bulk Upload**

   ```
   http://localhost:3000/admin/bulk-upload
   ```

2. **Scroll ke bawah ke "Upload History"**

   - Anda akan melihat semua batch upload yang pernah dilakukan
   - Setiap batch memiliki informasi:
     - File name
     - Upload time
     - Status (COMPLETED/FAILED/PARTIAL)
     - Statistics (Total/Success/Failed/Rate)

3. **Klik tombol 🗑️ (Trash Icon)** di kanan atas setiap batch

   - Tombol trash berwarna merah
   - Berada di sebelah status badge

4. **Modal Konfirmasi akan muncul** dengan 2 pilihan:

   **Pilihan A: Delete Batch Only (Default)**

   - ☐ Checkbox TIDAK dicentang
   - Hanya menghapus record batch dari history
   - **Produk TETAP ADA** di catalog
   - Produk masih bisa dibeli di shop

   **Pilihan B: Delete Batch + Products**

   - ✅ Centang checkbox "Also delete all products created from this batch"
   - Menghapus batch DAN semua produk yang dibuat
   - **Produk HILANG** dari catalog
   - Produk tidak bisa dibeli lagi

5. **Klik "Delete Batch Only" atau "Delete Batch & Products"**

6. **Toast notification** akan muncul:
   - ✅ Success: "Batch deleted successfully!"
   - ❌ Error: Jika ada produk yang sudah di-order

---

## Dari API/cURL

### 1. Delete Batch Only (Keep Products)

```bash
curl -X DELETE "http://localhost:3001/api/bulk-upload/{batchId}?deleteProducts=false"
```

**Response**:

```json
{
  "message": "Batch deleted successfully (products kept)",
  "deletedProducts": false
}
```

**Hasil**:

- ❌ Batch record dihapus dari `bulk_upload_batch`
- ❌ Batch items dihapus dari `bulk_upload_item`
- ✅ **Products TETAP ADA** di `Product` table
- ✅ Products masih bisa dibeli

---

### 2. Delete Batch + Products

```bash
curl -X DELETE "http://localhost:3001/api/bulk-upload/{batchId}?deleteProducts=true"
```

**Response Success**:

```json
{
  "message": "Batch and products deleted successfully",
  "deletedProducts": true
}
```

**Response Error** (jika produk sudah di-order):

```json
{
  "error": "Cannot delete products: Some products are in orders. Products in orders: uuid-1, uuid-2",
  "timestamp": "2025-10-12T..."
}
```

**Hasil**:

- ❌ Batch record dihapus dari `bulk_upload_batch`
- ❌ Batch items dihapus dari `bulk_upload_item`
- ❌ **Products DIHAPUS** dari `Product` table
- ❌ Products TIDAK BISA dibeli lagi

---

## Proteksi Delete

### 🛡️ Safety Features:

1. **Order Protection**

   - Produk yang sudah ada di `customer_order_product` **TIDAK BISA dihapus**
   - Error akan muncul dengan list produk yang terblokir
   - Ini mencegah data order jadi corrupt

2. **Cascade Delete**

   - Ketika batch dihapus, semua `bulk_upload_item` otomatis terhapus
   - Database constraint: `ON DELETE CASCADE`

3. **Wishlist Relation**
   - Produk yang di wishlist masih bisa dihapus
   - Wishlist item akan otomatis terhapus (cascade)

---

## Contoh Skenario

### Skenario 1: Upload Salah, Hapus Semua

```bash
# 1. Upload CSV yang salah
curl -X POST http://localhost:3001/api/bulk-upload -F "file=@wrong-data.csv"

# Response: batchId = "abc-123"

# 2. Hapus batch + products
curl -X DELETE "http://localhost:3001/api/bulk-upload/abc-123?deleteProducts=true"

# ✅ Semua produk dari batch ini dihapus
```

---

### Skenario 2: Keep History, Remove Products

```bash
# Hapus produk tapi keep batch record untuk audit trail
curl -X DELETE "http://localhost:3001/api/bulk-upload/abc-123?deleteProducts=true"
```

---

### Skenario 3: Clean Up Old Batches

```bash
# Hapus batch lama tapi keep products yang sudah populer
curl -X DELETE "http://localhost:3001/api/bulk-upload/old-batch-id?deleteProducts=false"
```

---

### Skenario 4: Produk Sudah Di-Order (Protected)

```bash
# Upload 5 produk
curl -X POST http://localhost:3001/api/bulk-upload -F "file=@products.csv"
# batchId = "xyz-789"

# Customer beli 2 produk
# ... order created ...

# Coba hapus batch + products
curl -X DELETE "http://localhost:3001/api/bulk-upload/xyz-789?deleteProducts=true"

# ❌ ERROR 409:
# "Cannot delete products: Some products are in orders"
```

---

## Testing Delete Feature

### Test 1: Delete Batch Only

```bash
# 1. Get batch ID dari history
curl http://localhost:3001/api/bulk-upload

# 2. Delete batch (keep products)
curl -X DELETE "http://localhost:3001/api/bulk-upload/BATCH_ID?deleteProducts=false"

# 3. Verify batch deleted
curl http://localhost:3001/api/bulk-upload

# 4. Verify products still exist
curl http://localhost:3001/api/products
```

---

### Test 2: Delete Batch + Products

```bash
# 1. Upload test batch
curl -X POST http://localhost:3001/api/bulk-upload -F "file=@bulk-upload-example.csv"
# Save batchId

# 2. Check products created
curl http://localhost:3001/api/products

# 3. Delete batch + products
curl -X DELETE "http://localhost:3001/api/bulk-upload/BATCH_ID?deleteProducts=true"

# 4. Verify products deleted
curl http://localhost:3001/api/products
```

---

### Test 3: Order Protection

```bash
# 1. Upload batch
curl -X POST http://localhost:3001/api/bulk-upload -F "file=@bulk-upload-example.csv"

# 2. Create an order with one product (via frontend)
# - Login as customer
# - Add product to cart
# - Checkout

# 3. Try to delete batch + products
curl -X DELETE "http://localhost:3001/api/bulk-upload/BATCH_ID?deleteProducts=true"

# ❌ Should get 409 error
```

---

## UI Screenshots Explanation

Dari screenshot yang Anda kirim:

### Upload History Card:

```
┌─────────────────────────────────────────────────────┐
│ 📄 product-template.csv              [FAILED] 🗑️   │
│ Uploaded by Admin • 12 Okt 2025, 22.47             │
│                                                     │
│ ┌─────┬─────┬─────┬─────┐                          │
│ │  5  │  0  │  5  │ 0%  │                          │
│ │Total│Succ.│Fail │Rate │                          │
│ └─────┴─────┴─────┴─────┘                          │
│                                                     │
│ Errors (5):                                         │
│ • Category not found: REPLACE_WITH_CATEGORY_ID      │
│ • Category not found: REPLACE_WITH_CATEGORY_ID      │
│ ...                                                 │
└─────────────────────────────────────────────────────┘
```

**Tombol 🗑️** = Klik ini untuk delete batch

---

## Best Practices

### ✅ DO:

1. **Review batch sebelum delete**

   - Cek berapa produk yang akan terhapus
   - Cek status batch (FAILED/PARTIAL/COMPLETED)

2. **Use "Delete Batch Only" untuk audit**

   - Keep history untuk tracking
   - Berguna untuk compliance

3. **Use "Delete Batch + Products" untuk cleanup**
   - Upload salah/testing
   - Data duplicate
   - Produk tidak valid

### ❌ DON'T:

1. **Jangan delete batch dengan produk yang sudah di-order**

   - System akan block, tapi lebih baik check manual dulu

2. **Jangan delete batch production tanpa backup**

   - Export products to CSV dulu sebelum delete

3. **Jangan spam delete**
   - Rate limiter bisa block API requests

---

## Troubleshooting

### Problem 1: "Cannot delete products: Some products are in orders"

**Solution**:

- Pilih "Delete Batch Only" (uncheck checkbox)
- Atau: Hapus order dulu (NOT RECOMMENDED)
- Atau: Keep products, just delete batch record

### Problem 2: Tombol delete tidak muncul

**Solution**:

- Refresh page
- Check if component `BulkUploadHistory` loaded
- Check browser console for errors

### Problem 3: Delete stuck (loading forever)

**Solution**:

- Check server logs
- Check database connection
- Refresh page and try again

---

## Summary

| Action                      | Batch Record | Batch Items | Products     | Orders  |
| --------------------------- | ------------ | ----------- | ------------ | ------- |
| **Delete Batch Only**       | ❌ Deleted   | ❌ Deleted  | ✅ Kept      | ✅ Kept |
| **Delete Batch + Products** | ❌ Deleted   | ❌ Deleted  | ❌ Deleted\* | ✅ Kept |

\*Kecuali produk yang ada di orders (protected)

---

🎉 **Fitur delete sudah lengkap dan siap digunakan!**
