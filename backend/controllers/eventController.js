const Event = require("../model/eventSchema");

const addEvent = async (req, res) => {
  try {
    const { eName, eDescript, eDate, venue, oragnizer } = req.body;
    if (
      !eName ||
      !eDescript ||
      !eDate ||
      !venue ||
      !oragnizer ||
      !req.files.poster ||
      !req.files.eFile
    ) {
      return res.status(400).json({ message: "All fields are required." });
    }
    const poster = req.files.poster[0].filename;
    const eFile = req.files.eFile[0].filename;

    const newEvent = new Event({
      eName,
      eDescript,
      eDate,
      venue,
      oragnizer,
      poster,
      eFile,
    });
    res.status(200).json({ message: "Event added successfully", newEvent });
    await newEvent.save();
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal server error.", error: error.message });
  }
};
const getAllEvent = async (req, res) => {
  try {
    const events = await Event.find();
    if (events.length > 0) {
      return res.status(200).json({ events });
    } else {
      return res.status(400).json({ message: "No events found" });
    }
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

const getAllEventID = async (req, res) => {
  const { id } = req.params;
  try {
    const event = await Event.findById(id);
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }
    res.status(200).json({ event });
  
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

const updateEvent = async (req, res) => {
  const { id } = req.params;
  const { eName, eDescript, eDate, venue, oragnizer } = req.body;
  try {
    const updateData = { eName, eDescript, eDate, venue, oragnizer };
    if (req.files.poster) {
      updateData.poster = req.files.poster[0].filename;
    }
    if (req.files.eFile) {
      updateData.eFile = req.files.eFile[0].filename;
    }

    const updatedEvent = await Event.findByIdAndUpdate(id, updateData, {
      new: true,
    });
    if (!updatedEvent) {
      return res.status(404).json({ message: "Event not found" });
    }
    res
      .status(200)
      .json({ message: "Event updated successfully", updatedEvent });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};
const deleteEvent = async (req, res) => {
  const { id } = req.params;
  try {
    const deletedEvent = await Event.findByIdAndDelete(id);
    if (!deletedEvent) {
      return res.status(404).json({ message: "Event not found" });
    }
    res.status(200).json({ message: "Event deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

module.exports = {
  addEvent,
  getAllEvent,
  updateEvent,
  deleteEvent,
  getAllEventID,
};
