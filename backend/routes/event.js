const express = require("express");
const router = express.Router();
const uploadToCloudinary = require("../middleware/cloudinaryUpload");

const {
  addEvent,
  getAllEvent,
  updateEvent,
  deleteEvent,
  getAllEventID,
} = require("../controllers/eventController");

router.post(
  "/add",
  uploadToCloudinary.fields([{ name: "poster" }, { name: "eFile" }]),
  addEvent,
);
router.get("/getAll", getAllEvent);
router.get("/getID/:id", getAllEventID);
router.put(
  "/update/:id",
  uploadToCloudinary.fields([{ name: "poster" }, { name: "eFile" }]),
  updateEvent,
);
router.delete("/delete/:id", deleteEvent);
module.exports = router;
