const Admin = require("../model/adminSchema");
const jwt = require("jsonwebtoken");

const loginAdmin = async (req, res) => {
  let { username, password } = req.body;
  try {
    const admin = await Admin.findOne({ username, password });

    if (admin) {
      const authToken = jwt.sign(
        {
          id: admin._id,
          username: admin.username,
        },
        process.env.JWT_SECRET,
        { expiresIn: "1d" },
      );

      res.status(200).json({ message: "Successful", authToken });
    } else {
      res.status(400).json({ message: "Invalid Credentials" });
    }
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};
module.exports = { loginAdmin };
