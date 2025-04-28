const Pending = require("../model/pendingSchema");

const addPendingStatus = async (req, res) => {
  try {
    const { name, rollNo, email, semester, seat } = req.body;

    if (!name || !rollNo || !email || !semester || !seat) {
      return res.status(400).json({ message: "All fields are required." });
    }

    const newPending = new Pending({name,rollNo,email,semester,seat});

    // const rollData = await Pending.findOne({ rollNo });
    // if (rollData) {
    //   return res.status(400).json({ message: "Roll number already booked." });
    // }
    await newPending.save();
    return res.status(201).json({ msg: "Pending data Submitted Successfully" });
  } catch (error) {
    console.error("Error adding pending status:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};

const getPendingData = async (req, res) => {
  try {
    const data = await Pending.find(); 
    if (data.length > 0) {
      return res.status(200).json({ data });
    } else {
      return res.status(400).json({ message: "No pending seats found" });
    }
  } catch (error) {
    console.error("Error fetching pending data:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};


const updatedData = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!status || (status !== "approved" && status !== "rejected")) {
    return res.status(400).json({ message: "Invalid status. Must be 'approved' or 'rejected'." });
  }
  try {
    const updatedSeat = await Pending.findByIdAndUpdate(
      id,
      { status },
      { new: true },
    );

    if (!updatedSeat) {
      return res.status(404).json({ message: "Seat not found" });
    }

    res
      .status(200)
      .json({ message: `Seat status updated to ${status} successfully` });
  } catch (error) {
    console.error("Error updating seat status:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const deletePending = async (req, res) => {
  const { id } = req.params;
  try {
    const deleteSeat = await Pending.findByIdAndDelete(id);
    if (!deleteSeat) {
      return res.status(404).json({ message: "Seat not found" });
    }
    res.status(200).json({ message: "Seat deleted successfully" });
  } catch (error) {
    console.error("Error deleting seat:", error.message);
    res.status(500).json({ message: "Failed to delete the seat" });
  }
};

module.exports = {
  addPendingStatus,
  getPendingData,
  updatedData,
  deletePending,
};
