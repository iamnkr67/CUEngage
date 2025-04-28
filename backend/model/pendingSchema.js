const mongoose = require("mongoose");

const pendingSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  rollNo: {
    type: String,
    required: true,
    match: /^\d{3}$/,
  },
  email: {
    type: String,
    required: true,
  },
  semester: {
    type: String,
    required: true,
    enum: ["UG-sem1", "UG-3rd year", "UG-sem2", "PG-sem1", "PG-sem3"],
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
});

module.exports = mongoose.model("pendings", pendingSchema);
