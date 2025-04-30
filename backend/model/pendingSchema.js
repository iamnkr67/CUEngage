const mongoose = require("mongoose");

const pendingSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  rollNo: {
    type: String,
    required: true,
    match: /^\d{10}$/,
  },
  email: {
    type: String,
    required: true,
  },
  department: {
    type: String,
    required: true,
    enum: ["BE-CSE", "BCA", "Nursing", "Pharmacy"],
  },
  seat: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    default: "pending", // Default value for status
  },
  emailSent: {
    type: Boolean,
    default: false, // To track if the email has been sent
  },
  event: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("pendings", pendingSchema);
