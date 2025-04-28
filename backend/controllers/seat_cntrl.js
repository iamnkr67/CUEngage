
const Seat = require("../model/seatSchema");

const getAllSeat = async (req, res) => {
  try {
    const data = await Seat.find();
    res.status(200).json(data);
  } catch (error) {
    res.json({ msg: "Error while fetching database" });
  }
};

module.exports = { getAllSeat };
