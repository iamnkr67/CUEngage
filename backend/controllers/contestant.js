const Contestant = require("../model/contestantSchema");

const add = async (req, res) => {
  try {
    const { name, rollNo, phone, year, act, program, eName } = req.body;

    if (!name || !rollNo || !phone || !year || !act || !program || !eName) {
      return res.status(400).json({ message: "All fields are required." });
    }

    const newContestant = new Contestant({
      name,
      rollNo,
      phone,
      year,
      act,
      program,
      eName,
    });
    await newContestant.save();

    return res
      .status(201)
      .json({ message: "Application submitted successfully." });
  } catch (error) {
    console.error("Error adding contestant:", error);
    return res.status(500).json({ message: "Internal Server Error." });
  }
};

const getdata = async (req, res) => {
  try {
    const { event } = req.query;
    const query = event ? { eName: event } : {};
    const data = await Contestant.find(query);
    res.status(200).json({ data });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

module.exports = { add, getdata };
