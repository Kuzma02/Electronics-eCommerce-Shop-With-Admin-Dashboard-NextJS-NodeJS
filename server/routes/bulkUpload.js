const express = require("express");
const router = express.Router();

const {
  uploadCsvAndCreateBatch,
  listBatches,
  getBatchDetail,
  updateBatchItems,
  deleteBatch,
} = require("../controllers/bulkUpload");

router.route("/")
  .post(uploadCsvAndCreateBatch)
  .get(listBatches);

router.route("/:batchId")
  .get(getBatchDetail)
  .put(updateBatchItems)
  .delete(deleteBatch);

module.exports = router;
