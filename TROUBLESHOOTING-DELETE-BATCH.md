# 🐛 Bulk Upload - Troubleshooting Guide

## Error: "Failed to execute 'json' on 'Response': Unexpected end of JSON input"

### 📋 Symptom:

```
Error deleting batch: SyntaxError: Failed to execute 'json' on 'Response':
Unexpected end of JSON input at handleDeleteConfirm
```

### 🔍 Root Cause:

1. Backend tidak mengembalikan JSON response
2. Response body kosong
3. Field name mismatch (`ok` vs `canDelete`)
4. Server error sebelum return statement

### ✅ Fixed:

#### 1. **Frontend: Better Response Handling**

```typescript
// OLD (Error prone):
const data = await response.json();

// NEW (Safe):
const contentType = response.headers.get("content-type");
if (contentType && contentType.includes("application/json")) {
  const text = await response.text();
  if (text) {
    data = JSON.parse(text);
  }
}
```

#### 2. **Backend: Consistent Response Format**

```javascript
// OLD:
return { ok: true, blockedProductIds: [] };

// NEW:
return { canDelete: true, blockedProductIds: [] };
```

#### 3. **Backend: Always Return JSON**

```javascript
// Always use res.status().json()
return res.status(200).json({
  success: true,
  message: "...",
  deletedProducts: false,
});
```

---

## Common Issues & Solutions

### Issue 1: Server Returns 500 Error

**Symptom**:

```json
{
  "error": "Internal server error",
  "timestamp": "..."
}
```

**Causes**:

- Database connection error
- Prisma query error
- Undefined variable

**Solution**:

1. Check server logs
2. Check database connection
3. Verify batch ID exists
4. Check Prisma schema

**Test**:

```bash
# Check if batch exists
curl http://localhost:3001/api/bulk-upload/{batchId}

# Check database
node server/tests/test-db-bulk.js
```

---

### Issue 2: Cannot Delete - Products in Orders

**Symptom**:

```json
{
  "error": "Cannot delete products: Some products are in orders",
  "timestamp": "..."
}
```

**Cause**: Protection working correctly! Products can't be deleted if they're in orders.

**Solution**:

1. **Option A**: Delete batch only (keep products)

   - Uncheck "Also delete all products" checkbox
   - Products will remain in catalog

2. **Option B**: Delete orders first (NOT RECOMMENDED)

   ```sql
   DELETE FROM customer_order_product
   WHERE productId IN (SELECT productId FROM bulk_upload_item WHERE batchId = ?);
   ```

3. **Option C**: Keep batch and products
   - Don't delete, just keep for history

**Test Which Products Are Blocking**:

```bash
curl http://localhost:3001/api/bulk-upload/{batchId}
# Check which products have productId
```

---

### Issue 3: Delete Button Not Working (No Response)

**Symptom**:

- Click delete button
- Modal shows
- Click confirm
- Nothing happens
- No error, no success message

**Causes**:

1. Frontend not connected to backend
2. CORS error
3. Server not running
4. Wrong API URL

**Solution**:

```bash
# 1. Check if server is running
curl http://localhost:3001/api/bulk-upload

# 2. Check CORS
# Open browser DevTools > Network tab
# Look for CORS errors

# 3. Check frontend API URL
# File: components/BulkUploadHistory.tsx
# Should be: http://localhost:3001/api/bulk-upload/{id}
```

---

### Issue 4: Batch Deleted But Products Still Exist

**Symptom**:

- Delete with "Also delete products" checked
- Success message shown
- But products still in catalog

**Cause**: Working as designed! If products are in orders, they won't be deleted.

**Verify**:

```bash
# Check products
curl http://localhost:3001/api/products

# Check if products in orders
# (Products in orders are protected)
```

---

### Issue 5: Empty Response Body

**Symptom**:

```
Response Body: (empty)
```

**Causes**:

1. Server crashed before sending response
2. Error in transaction
3. Database locked

**Solution**:

1. **Check server logs**:

   ```bash
   Get-Content server/logs/error.log | Select-Object -Last 50
   ```

2. **Restart server**:

   ```bash
   cd server
   npm start
   ```

3. **Test with curl**:
   ```bash
   curl -X DELETE "http://localhost:3001/api/bulk-upload/{id}?deleteProducts=false" -v
   ```

---

## Testing Checklist

### ✅ Before Testing Delete:

1. **Server is running**

   ```bash
   curl http://localhost:3001/api/bulk-upload
   # Should return JSON with batches
   ```

2. **At least one batch exists**

   ```bash
   # Upload test batch
   curl -X POST http://localhost:3001/api/bulk-upload -F "file=@bulk-upload-example.csv"
   ```

3. **Frontend is running**

   ```bash
   # Should be at http://localhost:3000
   ```

4. **Database is accessible**
   ```bash
   node server/tests/test-db-bulk.js
   ```

---

### ✅ Test Delete Batch Only:

```bash
# 1. Get batch ID
curl http://localhost:3001/api/bulk-upload

# 2. Delete batch (keep products)
curl -X DELETE "http://localhost:3001/api/bulk-upload/{BATCH_ID}?deleteProducts=false"

# Expected response:
# {
#   "success": true,
#   "message": "Batch deleted successfully (products kept)",
#   "deletedProducts": false
# }

# 3. Verify batch gone
curl http://localhost:3001/api/bulk-upload

# 4. Verify products still exist
curl http://localhost:3001/api/products
```

---

### ✅ Test Delete Batch + Products:

```bash
# 1. Upload fresh batch
curl -X POST http://localhost:3001/api/bulk-upload -F "file=@bulk-upload-example.csv"
# Save batchId

# 2. Delete batch + products
curl -X DELETE "http://localhost:3001/api/bulk-upload/{BATCH_ID}?deleteProducts=true"

# Expected response:
# {
#   "success": true,
#   "message": "Batch and products deleted successfully",
#   "deletedProducts": true
# }

# 3. Verify products deleted
curl http://localhost:3001/api/products
# Products from batch should be gone
```

---

## Debug Commands

### Check Server Status:

```bash
# Windows
Get-Process -Name node

# Check port 3001
netstat -ano | findstr :3001
```

### Check Database:

```bash
cd server
node tests/test-db-bulk.js
```

### Check Batch Details:

```bash
curl http://localhost:3001/api/bulk-upload/{batchId}
```

### Manual Delete (SQL):

```sql
-- Delete batch only
DELETE FROM bulk_upload_item WHERE batchId = 'xxx';
DELETE FROM bulk_upload_batch WHERE id = 'xxx';

-- Delete batch + products
DELETE FROM Product WHERE id IN (
  SELECT productId FROM bulk_upload_item WHERE batchId = 'xxx'
);
DELETE FROM bulk_upload_item WHERE batchId = 'xxx';
DELETE FROM bulk_upload_batch WHERE id = 'xxx';
```

---

## Prevention Tips

### ✅ DO:

1. Always check server logs before reporting issues
2. Test with curl first before using UI
3. Verify batch ID is correct
4. Check if products are in orders before trying to delete
5. Use "Delete Batch Only" if unsure

### ❌ DON'T:

1. Don't force delete products in orders
2. Don't delete batches without backup
3. Don't spam delete button (rate limiter)
4. Don't modify database directly without backup

---

## Fixed Files

### Frontend:

- `components/BulkUploadHistory.tsx`
  - Added safe JSON parsing
  - Better error handling
  - Loading states

### Backend:

- `server/services/bulkUploadService.js`

  - Fixed `canDeleteProductsForBatch` return format
  - Changed `ok` to `canDelete`
  - Added `reason` field

- `server/controllers/bulkUpload.js`
  - Always return JSON
  - Better logging
  - Consistent response format

---

## Quick Fix Summary

**Problem**: JSON parse error on delete

**Root Cause**: Field mismatch (`ok` vs `canDelete`)

**Fix**:

1. ✅ Updated `canDeleteProductsForBatch` to return `canDelete`
2. ✅ Added safe JSON parsing in frontend
3. ✅ Better error messages
4. ✅ Consistent response format

**Test**:

```bash
node server/tests/test-delete-batch.js
```

---

🎉 **Issue Resolved!**
