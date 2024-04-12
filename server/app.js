const express = require('express');
const fileUpload = require("express-fileupload");
const productsRouter = require('./routes/products');
const productImagesRouter = require('./routes/productImages');
const categoryRouter = require('./routes/category');
const searchRouter = require('./routes/search');
const mainImageRouter = require('./routes/mainImages');
var cors = require('cors');

// use it before all route definitions

const app = express();

app.use(express.json());
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(fileUpload());


app.use('/api/products', productsRouter);
app.use('/api/category', categoryRouter);
app.use('/api/images', productImagesRouter);
app.use("/api/main-image", mainImageRouter);
app.use('/api/search', searchRouter);


const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
