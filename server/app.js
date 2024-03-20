const express = require('express');
const productsRouter = require('./routes/products');
 const productImagesRouter = require('./routes/productImages');


const app = express();

app.use(express.json());

// Koristite rute
app.use('/api/products', productsRouter);

app.use('/api/images', productImagesRouter);

// Postavite server da sluša na određenom portu
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});