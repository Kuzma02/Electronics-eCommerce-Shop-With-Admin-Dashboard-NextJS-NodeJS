# 📦 Bulk Upload Template Guide

## 📋 File Templates yang Tersedia

1. **bulk-upload-example.csv** - Template dengan 5 contoh produk lengkap
2. **bulk-upload-template-blank.csv** - Template kosong untuk diisi manual
3. **product-template.csv** - Template dasar

## 📊 Format CSV

### Header (Kolom yang Diperlukan)

```csv
title,price,manufacturer,inStock,mainImage,description,slug,categoryId
```

### Deskripsi Kolom

| Kolom            | Wajib    | Tipe   | Deskripsi                                              | Contoh                            |
| ---------------- | -------- | ------ | ------------------------------------------------------ | --------------------------------- |
| **title**        | ✅ Ya    | String | Nama produk                                            | Samsung Galaxy S24 Ultra          |
| **price**        | ✅ Ya    | Number | Harga produk (gunakan titik untuk desimal)             | 1299.99                           |
| **manufacturer** | ✅ Ya    | String | Nama manufaktur/brand                                  | Samsung                           |
| **inStock**      | ❌ Tidak | Number | Jumlah stok (default: 0)                               | 25                                |
| **mainImage**    | ❌ Tidak | URL    | URL gambar produk                                      | https://example.com/image.jpg     |
| **description**  | ✅ Ya    | String | Deskripsi produk                                       | The latest flagship smartphone... |
| **slug**         | ✅ Ya    | String | URL-friendly identifier (gunakan huruf kecil dan dash) | samsung-galaxy-s24-ultra          |
| **categoryId**   | ✅ Ya    | String | ID kategori dari database (atau nama kategori)         | electronics                       |

## ⚠️ Aturan Penting

### 1. Format Data

- **Harga**: Gunakan titik (.) untuk desimal, bukan koma

  - ✅ Benar: `1299.99`
  - ❌ Salah: `1.299,99`

- **Slug**: Harus URL-friendly (lowercase, no spaces)

  - ✅ Benar: `samsung-galaxy-s24`
  - ❌ Salah: `Samsung Galaxy S24`

- **Text dengan Koma**: Gunakan tanda kutip ganda
  - ✅ Benar: `"Camera with 200MP, 50MP, and 12MP lenses"`
  - ❌ Salah: `Camera with 200MP, 50MP, and 12MP lenses`

### 2. Category ID

Anda bisa menggunakan:

- **UUID kategori** dari database (rekomendasi)
- **Nama kategori** (akan dicari di database)

Untuk mendapatkan category ID yang valid:

```javascript
// Jalankan di server directory:
node -e "const {PrismaClient} = require('@prisma/client'); const p = new PrismaClient(); p.category.findMany().then(c => {console.log(c); p.$disconnect()});"
```

### 3. Image URL

- Gunakan URL lengkap dengan `http://` atau `https://`
- Rekomendasi: Unsplash, atau upload ke CDN terlebih dahulu
- Jika kosong, akan menggunakan placeholder default

## 📝 Contoh Row CSV

### Format Basic

```csv
title,price,manufacturer,inStock,mainImage,description,slug,categoryId
iPhone 15 Pro,999.99,Apple,50,https://example.com/iphone.jpg,Latest iPhone model,iphone-15-pro,smartphones
```

### Format dengan Deskripsi Panjang

```csv
title,price,manufacturer,inStock,mainImage,description,slug,categoryId
"Sony WH-1000XM5","399.99",Sony,30,https://example.com/sony.jpg,"Premium wireless headphones with industry-leading noise cancellation, 30-hour battery life, and exceptional sound quality.",sony-wh-1000xm5,audio
```

## 🚀 Cara Upload

### Via Admin Dashboard

1. Login ke admin dashboard
2. Buka menu **Bulk Upload**
3. Download template CSV atau gunakan yang sudah ada
4. Isi data produk sesuai format
5. Drag & drop file CSV atau klik "Select CSV File"
6. Klik "Upload Products"
7. Tunggu proses selesai dan lihat hasilnya

### Via API (Advanced)

```bash
curl -X POST http://localhost:3001/api/products/bulk-upload \
  -F "file=@bulk-upload-example.csv"
```

## ✅ Checklist Sebelum Upload

- [ ] Semua kolom wajib sudah diisi (title, price, manufacturer, description, slug, categoryId)
- [ ] Harga menggunakan format angka dengan titik untuk desimal
- [ ] Slug unik dan URL-friendly (lowercase, dash-separated)
- [ ] Category ID valid (ada di database)
- [ ] Image URL valid (jika diisi)
- [ ] Text dengan koma dibungkus tanda kutip ganda
- [ ] File berformat CSV (bukan Excel .xlsx)

## 🔍 Troubleshooting

### Error: "Category not found"

- Pastikan categoryId yang digunakan ada di database
- Atau gunakan nama kategori yang sudah terdaftar

### Error: "Duplicate slug"

- Slug harus unik untuk setiap produk
- Ubah slug menjadi lebih spesifik: `macbook-pro-16-2024` instead of `macbook`

### Error: "Invalid price format"

- Gunakan angka dengan titik untuk desimal
- Jangan gunakan simbol mata uang (Rp, $, dll)

### Error: "CSV parsing failed"

- Pastikan format CSV benar
- Gunakan text editor atau Excel untuk edit
- Save as CSV (Comma delimited)

## 📞 Support

Jika mengalami masalah:

1. Cek error message di upload result
2. Validasi format CSV menggunakan Excel atau Google Sheets
3. Pastikan encoding file UTF-8
4. Test dengan 1-2 produk dulu sebelum upload banyak

## 🎯 Tips

1. **Start Small**: Test dengan 2-3 produk dulu
2. **Validate Categories**: Pastikan kategori sudah dibuat di database
3. **Unique Slugs**: Gunakan kombinasi nama + model untuk slug
4. **Backup**: Simpan backup CSV sebelum upload
5. **Monitor**: Cek upload history untuk melihat hasilnya

---

Happy Bulk Uploading! 🚀
