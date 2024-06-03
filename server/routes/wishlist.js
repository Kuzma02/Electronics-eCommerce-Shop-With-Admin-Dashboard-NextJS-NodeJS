const express = require("express");

const router = express.Router();

const {
  getAllWishlistByUserId,
  getAllWishlist,
  createWishItem,
  deleteWishItem
} = require("../controllers/wishlist");

router.route("/").get(getAllWishlist).post(createWishItem);

router.route("/:userId").get(getAllWishlistByUserId);
router.route("/:id").delete(deleteWishItem);

module.exports = router;
