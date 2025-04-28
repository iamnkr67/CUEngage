const mongoose = require("mongoose");

const contestantSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true, // Ensures name is mandatory
    },
    rollNo: {
      type: String,
      required: true,
      match: /^\d{3}$/, // Validates roll number to be exactly 3 digits
    },
    phone: {
      type: String,
      required: true,
      match: /^\d{10}$/, // Validates phone number to be exactly 10 digits
    },
    year: {
      type: String,
      required: true,
    },
    program: {
      type: String,
      required: true,
      enum: ["ug", "pg"],
    },
    act: {
      type: String,
      required: true,
      enum: [
        "dance",
        "singing",
        "instrumental music",
        "drama",
        "stand-up comedy",
        "others",
      ], // Restricts values to predefined options
    },
  },
  { timestamps: true }, // Adds createdAt and updatedAt timestamps
);

module.exports = mongoose.model("contestants", contestantSchema);
