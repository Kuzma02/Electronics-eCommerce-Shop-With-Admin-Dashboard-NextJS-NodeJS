const express = require("express");
const router = express.Router();
const { uploadMainImage } = require("../controllers/mainImages");

router.route("/").post(uploadMainImage);

module.exports = router;
