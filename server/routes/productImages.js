const express = require('express')
const router = express.Router()
const {
  getSingleProductImages,
  createImage,
  updateImage,
  deleteImage
} = require('../controllers/productImages')


router.route('/:id').get(getSingleProductImages); 


router.route('/').post(createImage);


router.route('/:id').put(updateImage);


router.route('/:id').delete(deleteImage);

module.exports = router
