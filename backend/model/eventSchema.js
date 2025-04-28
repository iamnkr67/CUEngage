const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema({
  eName: {
    type: String,
    required: true,
  },
  eDescript: {
    type: String,
    required: true,
  },
  eDate: {
    type: Date,
    required: true,
  },
  venue: {
    type: String,
    required: true,
  },
  oragnizer: {
    type: String,
    required: true,
  },
  poster: {
    type: String,
    required: true,
  },
  eFile: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("event", eventSchema);
