const express = require('express')

const router = express.Router()
const {
  getAllProducts, getProductCategory
} = require('../controllers/products')

router.route('/').get(getAllProducts)
router.route('/:slug').get(getProductCategory)

module.exports = router