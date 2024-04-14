const express = require("express");

const router = express.Router();

const { getProductBySlug } = require("../controllers/slugs");

router.route("/:slug").get(getProductBySlug);

module.exports = router;