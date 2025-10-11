const express = require("express");

const router = express.Router();

const {
  getCategory,
  createCategory,
  updateCategory,
  deleteCategory,
  getAllCategories,
} = require("../controllers/category");

router.route("/").get(getAllCategories).post(createCategory);

router
  .route("/:id")
  .get(getCategory)
  .put(updateCategory)
  .delete(deleteCategory);

module.exports = router;
