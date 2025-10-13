const express = require("express");
const router = express.Router();
const {
  getAllMerchants,
  getMerchantById,
  createMerchant,
  updateMerchant,
  deleteMerchant,
} = require("../controllers/merchant");

// Get all merchants
router.get("/", getAllMerchants);

// Get a specific merchant by ID
router.get("/:id", getMerchantById);

// Create a new merchant
router.post("/", createMerchant);

// Update a merchant
router.put("/:id", updateMerchant);

// Delete a merchant
router.delete("/:id", deleteMerchant);

module.exports = router;