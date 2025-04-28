const express = require("express");
const router = express.Router();
const {
  addPendingStatus,
  getPendingData,
  updatedData,
  deletePending,
} = require("../controllers/pendingCntrl");


router.post("/", addPendingStatus);
router.get("/", getPendingData); 
router.patch("/:id", updatedData);
router.delete("/:id", deletePending);

module.exports = router;
