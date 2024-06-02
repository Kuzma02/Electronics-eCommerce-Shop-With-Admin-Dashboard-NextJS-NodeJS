const express = require("express");

const router = express.Router();

const {
  getAllWishlistByUserId,
} = require("../controllers/wishlist");

router.route("/").get(getAllWishlistByUserId);

module.exports = router;
