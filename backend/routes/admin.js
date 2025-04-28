const express = require("express");
const router = express.Router();
const { loginAdmin } = require("../controllers/admin");
const { verifyToken } = require("../middleware/verifyToken");
router.post("/login", loginAdmin);
router.get("/dashboard", verifyToken, (req, res) => {
  res.status(200).json({ message: "Welcome to the dashboard" });
});

module.exports = router;
