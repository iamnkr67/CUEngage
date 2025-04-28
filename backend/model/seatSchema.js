const mongoose = require("mongoose");

const seatSchema = new mongoose.Schema({
  clsName: {
    type: String,
    require: true,
  },
  seats: {
    type: Array,
    require: true,
  },
});
module.exports = mongoose.model("seatlayouts", seatSchema);

// const mongoose = require("mongoose");

// const seatSchema = new mongoose.Schema({
//   boys: [
//     {
//       label: {
//         type: String,
//         required: true,
//       },
//       seats: {
//         type: [String], // Array of strings to represent seat identifiers
//         required: true,
//       },
//     },
//   ],
//   girls: [
//     {
//       label: {
//         type: String,
//         required: true,
//       },
//       seats: {
//         type: [String], // Array of strings to represent seat identifiers
//         required: true,
//       },
//     },
//   ],
// });

// module.exports = mongoose.model("SeatLayout", seatSchema);
