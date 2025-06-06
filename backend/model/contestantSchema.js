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
      match: /^\d{10}$/, // Validates roll number to be exactly 3 digits
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
      enum: ["BE-CSE", "BCA", "Nursing", "Pharmacy"],
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
      ],
    },
    eName: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }, // Adds createdAt and updatedAt timestamps
);

module.exports = mongoose.model("contestants", contestantSchema);
