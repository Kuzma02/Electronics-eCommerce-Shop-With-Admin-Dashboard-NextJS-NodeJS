const express = require("express");

const router = express.Router();
const { getProductCategory } = require("../controllers/category");

router.route("/:slug").get(getProductCategory);

module.exports = router;
