const Event = require("../model/eventSchema");

const addEvent = async (req, res) => { 
    try {
        const { eName, eDescript, eDate, venue } = req.body;
        if (!eName || !eDescript || !eDate || !venue || !req.files.poster || !req.files.eFile) {
            return res.status(400).json({ message: "All fields are required." });
        }
        const poster = req.files.poster[0].path;
        const eFile = req.files.eFile[0].path;

        const newEvent = new Event({eName, eDescript, eDate, venue, poster, eFile});
        await newEvent.save();
    } catch (error) {
        res.status(500).json({ message: "Internal server error.", error: error.message });
    }
}
const getAllEvent = async (req, res) => {
    try {
        const events = await Event.find();
        if (events.length > 0) {
            return res.status(200).json({ events });
        } else {
            return res.status(400).json({ message: "No events found" });
        }
    } catch (error) {
       res.status(500).json({ message: "Internal server error", error: error.message }); 
    }
}
const updateEvent = async (req, res) => {
    const { id } = req.params;
    const { eName, eDescript, eDate, venue} = req.body;
    try {
        const updateData = { eName, eDescript, eDate, venue };
        if (req.files.poster) {
            updateData.poster = req.files.poster[0].path;
        }
        if (req.files.eFile) {
            updateData.eFile = req.files.eFile[0].path;
        }

        const updatedEvent = await Event.findByIdAndUpdate(
            id,
            updateData,
            { new: true }
        );
        if (!updatedEvent) {
            return res.status(404).json({ message: "Event not found" });
        }
        res.status(200).json({ message: "Event updated successfully", updatedEvent });
    } catch (error) {
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
}
const deleteEvent = async (req, res) => {
    const { id } = req.params;
    try {
        const deletedEvent = await Event.findByIdAndDelete(id);
        if (!deletedEvent) {
            return res.status(404).json({ message: "Event not found" });
        }
        res.status(200).json({ message: "Event deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
}
        
module.exports = { addEvent, getAllEvent, updateEvent, deleteEvent };