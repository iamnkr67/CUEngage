const Admin = require("../model/adminSchema");

const loginAdmin = async (req, res) => {
  let { username, password } = req.body;
  try {
    const admin = await Admin.findOne({ username, password });

    if (admin) {
      res.status(200).json({ message: "Successful" });
    } else {
      res.status(400).json({ message: "Invalid Credentials" });
    }
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};
module.exports = { loginAdmin };
