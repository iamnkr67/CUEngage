const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema({
  eventName: String,
  eventDescription: String,
  eventDate: Date,
  venue: String,
  attachments: String,
  poster: String,
});

module.exports = mongoose.model("Event", eventSchema);
