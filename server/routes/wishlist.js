const express = require("express");

const router = express.Router();

const {
  getAllWishlistByUserId,
  getAllWishlist,
  createWishItem,
  deleteWishItem,
  getSingleProductFromWishlist
} = require("../controllers/wishlist");

router.route("/").get(getAllWishlist).post(createWishItem);

router.route("/:userId").get(getAllWishlistByUserId);
router.route("/:userId/:productId").get(getSingleProductFromWishlist).delete(deleteWishItem);

module.exports = router;
