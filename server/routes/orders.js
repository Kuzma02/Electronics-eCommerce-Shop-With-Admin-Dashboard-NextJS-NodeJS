const express = require("express");
const router = express.Router();
const { createOrder } = require("../controllers/orders");

router.route("/").post(createOrder);

module.exports = router;