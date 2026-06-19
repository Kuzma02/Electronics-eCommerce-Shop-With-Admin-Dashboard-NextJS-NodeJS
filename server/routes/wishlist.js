const express = require("express");

const router = express.Router();

const {
  getWishlistById,
  createWishListItem,
  removeWishlist,
} = require("../controllers/wishlist.controller");

// Create wishlist item
router.post("/", createWishListItem);

// Get wishlist by user
router.get("/:userId", getWishlistById);

// Remove wishlist item (by userId + productId)
router.delete("/:userId/:productId", removeWishlist);

module.exports = router;