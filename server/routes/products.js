const express = require('express');

const router = express.Router();
const {
  getAllProducts,
  getProductCategory,
  createProduct,
  updateProduct,
  deleteProduct,
  searchProducts
} = require('../controllers/products');

router.route('/')
  .get(getAllProducts)
  .post(createProduct);

router.route('/:slug')
  .get(getProductCategory)
  .put(updateProduct) 
  .delete(deleteProduct); 

  router.route('/search').get(searchProducts);

module.exports = router;
