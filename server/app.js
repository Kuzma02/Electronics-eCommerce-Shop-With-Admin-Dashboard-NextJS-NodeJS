const express = require('express');
const productsRouter = require('./routes/products');
const productImagesRouter = require('./routes/productImages');
const { searchProducts } = require('./controllers/products');

const app = express();

app.use(express.json());


app.use('/api/products', productsRouter);
app.use('/api/images', productImagesRouter);

app.use('/api/search', searchProducts);


const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
