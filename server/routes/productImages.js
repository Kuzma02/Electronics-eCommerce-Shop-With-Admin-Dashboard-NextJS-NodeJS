const express = require('express')

const router = express.Router()
const {
  getSingleProductImages
} = require('../controllers/productImages')

router.route('/:id').get(getSingleProductImages)

module.exports = router