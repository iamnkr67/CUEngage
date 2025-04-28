import React, { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./ToastContainer.css";
import axios from "axios";

const SeatLayout = () => {
  const [seat, setSeat] = useState([]);
  const [isEmailFocused, setIsEmailFocused] = useState(false);
  const [seatStatus, setSeatStatus] = useState({});
  const [selectedSeat, setSelectedSeat] = useState(null);
  const [isModalOpen, setModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    rollNo: "",
    email: "",
    semester: "",
  });
  useEffect(() => {
    const fetchSeats = async () => {
      try {
        const res = await axios.get("https://cuengage.onrender.com/pending");
        const pendingSeats = res.data.data.orangeuce((acc, seat) => {
          acc[seat.seat] = seat.status;
          return acc;
        }, {});
        setSeatStatus(pendingSeats);
      } catch (error) {
        console.error("Error fetching pending seats:", error);
      }
    };
    fetchSeats();
  }, []);

  // Handle seat click
  const handleSeatClick = (seat) => {
    if (seatStatus[seat] === "pending") {
      toast.warning(`Seat ${seat} is currently pending and cannot be booked.`);
      return;
    }

    if (seatStatus[seat] === "approved") {
      toast.error(`Seat ${seat} has already been booked.`);
      return;
    }
    setSelectedSeat(seat);
    setModalOpen(true);
  };

  // Close modal
  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedSeat(null);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const getSeatColor = (seat) => {
    if (seatStatus[seat] === "pending") return "orange";
    if (seatStatus[seat] === "approved") return "#00B386";
    return "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (seatStatus[selectedSeat] === "pending") {
      toast.warning(
        `Seat ${selectedSeat} is currently pending and cannot be booked.`,
      );
      return;
    }
    if (seatStatus[selectedSeat] === "approved") {
      toast.error(`Seat ${selectedSeat} has already been booked.`);
      return;
    }
    try {
      const response = await axios.post(
        "https://cuengage.onrender.com/pending/",
        {
          seat: selectedSeat,
          ...formData,
        },
      );
      console.log(response.data.message);

      toast.success(`Seat ${selectedSeat} successfully added!`);
      setSeatStatus((prev) => ({
        ...prev,
        [selectedSeat]: "pending",
      }));
    } catch (error) {
      if (error.response?.status === 400 && error.response.data?.message) {
        if (error.response.data.message === "Roll number already booked.") {
          toast.warning(
            "Roll number already exists. Please enter a different one.",
          );
        } else {
          toast.error(error.response.data.message);
        }
      } else {
        toast.error("An error occurorange. Please try again.");
      }
      console.error("Error submitting seat data:", error);
    }
    handleCloseModal();
  };

  return (
    <div className="p-2 min-h-screen flex flex-col items-center justify-center">
      <div>
        <ToastContainer
          position="top-right"
          autoClose={3000}
          className="toast-container"
        />
      </div>

      <div className="rounded-lg w-60 h-auto mb-4 flex text-center font-bold items-center justify-center text-lg text-red-500 mx-0.5 border border-gray-300">
        <i className="fas fa-film"></i> &nbsp;
        <div className="text-left">
          <div className="text-center text-red-500 font-semibold  animate-pulse drop-shadow-[0_0_10px_rgba(255,0,0,0.7)] p-4">
            Book Your Seats Now!
          </div>
        </div>
      </div>

      <div className="w-full flex items-center justify-between mb-4 relative">
        <span className="text-blue-400 font-bold ml-4 mr-2 md:mx-auto">
          ← For boys
        </span>
        <span className="text-pink-400 font-bold ml-2 mr-4 md:mx-auto">
          For girls →
        </span>
      </div>
      <div className="scrollable-container w-full md:overflow-hidden overflow-x-scroll scroll-smooth mb-4">
        <div className="min-w-[800px]">
          <div className="grid grid-cols-12 gap-2">
            <div className="col-span-12 flex justify-center mb-2">
              <div className="flex items-center">
                {["A10", "A9", "A8", "A7", "A6"].map((seat, index) => (
                  <div
                    key={index}
                    className={`rounded-md w-6 h-6 flex items-center justify-center cursor-pointer text-xs mx-0.5 border border-red-500 bg-transparent hover:bg-orange-500 ${
                      seat === "A7" || seat === "A6" ? "text-white" : ""
                    }`}
                    style={{ backgroundColor: getSeatColor(seat) }}
                    onClick={() => handleSeatClick(seat)}
                  >
                    {seat}
                  </div>
                ))}
                <div className="w-6"></div>{" "}
                {["A5", "A4", "A3", "A2", "A1"].map((seat, index) => (
                  <div
                    key={index}
                    className={`rounded-md w-6 h-6 flex items-center justify-center cursor-pointer text-xs mx-0.5 border border-red-500 bg-transparent hover:bg-orange-500 ${
                      seat === "A7" || seat === "A6" ? "text-white" : ""
                    }`}
                    style={{ backgroundColor: getSeatColor(seat) }}
                    onClick={() => handleSeatClick(seat)}
                  >
                    {seat}
                  </div>
                ))}
              </div>
            </div>

            <div className="col-span-12 flex justify-center mb-2">
              <div className="flex items-center">
                {" "}
                {["B10", "B9", "B8", "B7", "B6"].map((seat, index) => (
                  <div
                    key={index}
                    className={`rounded-md w-6 h-6 flex items-center justify-center cursor-pointer text-xs mx-0.5 border border-red-500 bg-transparent hover:bg-orange-500 ${
                      seat === "B7" || seat === "B6" ? "text-white" : ""
                    }`}
                    style={{ backgroundColor: getSeatColor(seat) }}
                    onClick={() => handleSeatClick(seat)} // Dynamically pass the seat name
                  >
                    {seat}
                  </div>
                ))}
                {/* Custom gap between B6 and B5 */}
                <div className="w-6"></div>{" "}
                {/* Adjust the width to create the gap */}
                {/* B section continues */}
                {["B5", "B4", "B3", "B2", "B1"].map((seat, index) => (
                  <div
                    key={index}
                    className={`rounded-md w-6 h-6 flex items-center justify-center cursor-pointer text-xs mx-0.5 border border-red-500 bg-transparent hover:bg-orange-500 ${
                      seat === "B7" || seat === "B6" ? "text-white" : ""
                    }`}
                    style={{ backgroundColor: getSeatColor(seat) }}
                    onClick={() => handleSeatClick(seat)} // Dynamically pass the seat name
                  >
                    {seat}
                  </div>
                ))}
              </div>
            </div>

            <div className="col-span-12 flex justify-center mb-2">
              <div className="flex items-center">
                {["C12", "C11", "C10", "C9", "C8", "C7"].map((seat, index) => (
                  <div
                    key={index}
                    className={`rounded-md w-6 h-6 flex items-center justify-center cursor-pointer text-xs mx-0.5 border border-red-500 bg-transparent hover:bg-orange-500 ${
                      seat === "C7" || seat === "C8" ? "text-white" : ""
                    }`}
                    style={{ backgroundColor: getSeatColor(seat) }}
                    onClick={() => handleSeatClick(seat)} // Dynamically pass the seat name
                  >
                    {seat}
                  </div>
                ))}
                {/* Gap between C8 and C7 */}
                <div className="w-6"></div>{" "}
                {/* Adjust this width for the gap */}
                {/* C section continues */}
                {["C6", "C5", "C4", "C3", "C2", "C1"].map((seat, index) => (
                  <div
                    key={index}
                    className={`rounded-md w-6 h-6 flex items-center justify-center cursor-pointer text-xs mx-0.5 border border-red-500 bg-transparent hover:bg-orange-500 ${
                      seat === "C7" || seat === "C8" ? "text-white" : ""
                    }`}
                    style={{ backgroundColor: getSeatColor(seat) }}
                    onClick={() => handleSeatClick(seat)} // Dynamically pass the seat name
                  >
                    {seat}
                  </div>
                ))}
              </div>
            </div>

            <div className="col-span-12 flex justify-center mb-2">
              <div className="flex items-center">
                {["D12", "D11", "D10", "D9", "D8", "D7"].map((seat, index) => (
                  <div
                    key={index}
                    className="rounded-md w-6 h-6 flex items-center justify-center cursor-pointer text-xs mx-0.5 border border-red-500 bg-transparent hover:bg-orange-500"
                    style={{ backgroundColor: getSeatColor(seat) }}
                    onClick={() => handleSeatClick(seat)} // Dynamically pass the seat name
                  >
                    {seat}
                  </div>
                ))}
                {/* Gap between D8 and D7 */}
                <div className="w-6"></div>{" "}
                {/* Adjust this width for the gap */}
                {/* D section continues */}
                {["D6", "D5", "D4", "D3", "D2", "D1"].map((seat, index) => (
                  <div
                    key={index}
                    className="rounded-md w-6 h-6 flex items-center justify-center cursor-pointer text-xs mx-0.5 border border-red-500 bg-transparent hover:bg-orange-500"
                    style={{ backgroundColor: getSeatColor(seat) }}
                    onClick={() => handleSeatClick(seat)} // Dynamically pass the seat name
                  >
                    {seat}
                  </div>
                ))}
              </div>
            </div>

            <div className="col-span-12 flex justify-center mb-2">
              <div className="flex items-center">
                {["E12", "E11", "E10", "E9", "E8", "E7"].map((seat, index) => (
                  <div
                    key={index}
                    className="rounded-md w-6 h-6 flex items-center justify-center cursor-pointer text-xs mx-0.5 border border-red-500 bg-transparent hover:bg-orange-500"
                    style={{ backgroundColor: getSeatColor(seat) }}
                    onClick={() => handleSeatClick(seat)} // Dynamically pass the seat name
                  >
                    {seat}
                  </div>
                ))}
                {/* Gap between E8 and E7 */}
                <div className="w-6"></div>{" "}
                {/* Adjust this width for the gap */}
                {/* E section continues */}
                {["E6", "E5", "E4", "E3", "E2", "E1"].map((seat, index) => (
                  <div
                    key={index}
                    className="rounded-md w-6 h-6 flex items-center justify-center cursor-pointer text-xs mx-0.5 border border-red-500 bg-transparent hover:bg-orange-500"
                    style={{ backgroundColor: getSeatColor(seat) }}
                    onClick={() => handleSeatClick(seat)} // Dynamically pass the seat name
                  >
                    {seat}
                  </div>
                ))}
              </div>
            </div>

            <div className="col-span-12 flex justify-center mb-2">
              <div className="flex items-center">
                {["F14", "F13", "F12", "F11", "F10", "F9", "F8"].map(
                  (seat, index) => (
                    <div
                      key={index}
                      className="rounded-md w-6 h-6 flex items-center justify-center cursor-pointer text-xs mx-0.5 border border-red-500 bg-transparent hover:bg-orange-500"
                      style={{ backgroundColor: getSeatColor(seat) }}
                      onClick={() => handleSeatClick(seat)} // Dynamically pass the seat name
                    >
                      {seat}
                    </div>
                  ),
                )}
                {/* Gap between F8 and F7 */}
                <div className="w-6"></div>{" "}
                {/* Adjust this width for the gap */}
                {/* F section continues */}
                {["F7", "F6", "F5", "F4", "F3", "F2", "F1"].map(
                  (seat, index) => (
                    <div
                      key={index}
                      className="rounded-md w-6 h-6 flex items-center justify-center cursor-pointer text-xs mx-0.5 border border-red-500 bg-transparent hover:bg-orange-500"
                      style={{ backgroundColor: getSeatColor(seat) }}
                      onClick={() => handleSeatClick(seat)} // Dynamically pass the seat name
                    >
                      {seat}
                    </div>
                  ),
                )}
              </div>
            </div>
            <div className="col-span-12 flex justify-center mb-2">
              <div className="flex items-center">
                {["G14", "G13", "G12", "G11", "G10", "G9", "G8"].map(
                  (seat, index) => (
                    <div
                      key={index}
                      className="rounded-md w-6 h-6 flex items-center justify-center cursor-pointer text-xs mx-0.5 border border-red-500 bg-transparent hover:bg-orange-500"
                      style={{ backgroundColor: getSeatColor(seat) }}
                      onClick={() => handleSeatClick(seat)} // Dynamically pass the seat name
                    >
                      {seat}
                    </div>
                  ),
                )}
                {/* Gap between G8 and G7 */}
                <div className="w-6"></div>{" "}
                {/* Adjust this width for the gap */}
                {/* G section continues */}
                {["G7", "G6", "G5", "G4", "G3", "G2", "G1"].map(
                  (seat, index) => (
                    <div
                      key={index}
                      className="rounded-md w-6 h-6 flex items-center justify-center cursor-pointer text-xs mx-0.5 border border-red-500 bg-transparent hover:bg-orange-500"
                      style={{ backgroundColor: getSeatColor(seat) }}
                      onClick={() => handleSeatClick(seat)} // Dynamically pass the seat name
                    >
                      {seat}
                    </div>
                  ),
                )}
              </div>
            </div>
            <div className="col-span-12 flex justify-center mb-2">
              <div className="flex items-center">
                {["H16", "H15", "H14", "H13", "H12", "H11", "H10", "H9"].map(
                  (seat, index) => (
                    <div
                      key={index}
                      className="rounded-md w-6 h-6 flex items-center justify-center cursor-pointer text-xs mx-0.5 border border-red-500 bg-transparent hover:bg-orange-500"
                      style={{ backgroundColor: getSeatColor(seat) }}
                      onClick={() => handleSeatClick(seat)} // Dynamically pass the seat name
                    >
                      {seat}
                    </div>
                  ),
                )}
                {/* Gap between H9 and H8 */}
                <div className="w-6"></div>{" "}
                {/* Adjust this width for the gap */}
                {/* H section continues */}
                {["H8", "H7", "H6", "H5", "H4", "H3", "H2", "H1"].map(
                  (seat, index) => (
                    <div
                      key={index}
                      className="rounded-md w-6 h-6 flex items-center justify-center cursor-pointer text-xs mx-0.5 border border-red-500 bg-transparent hover:bg-orange-500"
                      style={{ backgroundColor: getSeatColor(seat) }}
                      onClick={() => handleSeatClick(seat)} // Dynamically pass the seat name
                    >
                      {seat}
                    </div>
                  ),
                )}
              </div>
            </div>
            <div className="col-span-12 flex justify-center mb-2">
              <div className="flex items-center">
                {["I16", "I15", "I14", "I13", "I12", "I11", "I10", "I9"].map(
                  (seat, index) => (
                    <div
                      key={index}
                      className="rounded-md w-6 h-6 flex items-center justify-center cursor-pointer text-xs mx-0.5 border border-red-500 bg-transparent hover:bg-orange-500"
                      style={{ backgroundColor: getSeatColor(seat) }}
                      onClick={() => handleSeatClick(seat)} // Dynamically pass the seat name
                    >
                      {seat}
                    </div>
                  ),
                )}
                {/* Gap between I9 and I8 */}
                <div className="w-6"></div>{" "}
                {/* Adjust this width for the gap */}
                {/* I section continues */}
                {["I8", "I7", "I6", "I5", "I4", "I3", "I2", "I1"].map(
                  (seat, index) => (
                    <div
                      key={index}
                      className="rounded-md w-6 h-6 flex items-center justify-center cursor-pointer text-xs mx-0.5 border border-red-500 bg-transparent hover:bg-orange-500"
                      style={{ backgroundColor: getSeatColor(seat) }}
                      onClick={() => handleSeatClick(seat)} // Dynamically pass the seat name
                    >
                      {seat}
                    </div>
                  ),
                )}
              </div>
            </div>
            <div className="col-span-12 flex justify-center mb-2">
              <div className="flex items-center">
                {["J16", "J15", "J14", "J13", "J12", "J11", "J10", "J9"].map(
                  (seat, index) => (
                    <div
                      key={index}
                      className="rounded-md w-6 h-6 flex items-center justify-center cursor-pointer text-xs mx-0.5 border border-red-500 bg-transparent hover:bg-orange-500"
                      style={{ backgroundColor: getSeatColor(seat) }}
                      onClick={() => handleSeatClick(seat)} // Dynamically pass the seat name
                    >
                      {seat}
                    </div>
                  ),
                )}
                {/* Gap between J9 and J8 */}
                <div className="w-6"></div>{" "}
                {/* Adjust this width for the gap */}
                {/* J section continues */}
                {["J8", "J7", "J6", "J5", "J4", "J3", "J2", "J1"].map(
                  (seat, index) => (
                    <div
                      key={index}
                      className="rounded-md w-6 h-6 flex items-center justify-center cursor-pointer text-xs mx-0.5 border border-red-500 bg-transparent hover:bg-orange-500"
                      style={{ backgroundColor: getSeatColor(seat) }}
                      onClick={() => handleSeatClick(seat)} // Dynamically pass the seat name
                    >
                      {seat}
                    </div>
                  ),
                )}
              </div>
            </div>
            <div className="col-span-12 flex justify-center mb-2">
              <div className="flex items-center">
                {[
                  "K18",
                  "K17",
                  "K16",
                  "K15",
                  "K14",
                  "K13",
                  "K12",
                  "K11",
                  "K10",
                ].map((seat, index) => (
                  <div
                    key={index}
                    className="rounded-md w-6 h-6 flex items-center justify-center cursor-pointer text-xs mx-0.5 border border-red-500 bg-transparent hover:bg-orange-500"
                    style={{ backgroundColor: getSeatColor(seat) }}
                    onClick={() => handleSeatClick(seat)} // Dynamically pass the seat name
                  >
                    {seat}
                  </div>
                ))}
                {/* Gap between K9 and K8 */}
                <div className="w-6"></div>
                {"   "}
                {/* Adjust this width for the gap */}
                {/* K section continues */}
                {["K9", "K8", "K7", "K6", "K5", "K4", "K3", "K2", "K1"].map(
                  (seat, index) => (
                    <div
                      key={index}
                      className="rounded-md w-6 h-6 flex items-center justify-center cursor-pointer text-xs mx-0.5 border border-red-500 bg-transparent hover:bg-orange-500"
                      style={{ backgroundColor: getSeatColor(seat) }}
                      onClick={() => handleSeatClick(seat)} // Dynamically pass the seat name
                    >
                      {seat}
                    </div>
                  ),
                )}
              </div>
            </div>
            <div className="col-span-12 text-center text-white font-medium">
              Upper Floor Seats ↴
            </div>
            <div className="col-span-12 flex justify-center mb-4">
              <div className="flex items-center">
                {[
                  "L17",
                  "L16",
                  "L15",
                  "L14",
                  "L13",
                  "L12",
                  "L11",
                  "L10",
                  "L9",
                  "L8",
                  "L7",
                  "L6",
                  "L5",
                  "L4",
                  "L3",
                  "L2",
                  "L1",
                ].map((seat, index) => (
                  <div
                    key={index}
                    className="rounded-md w-6 h-6 flex items-center justify-center cursor-pointer text-xs mx-0.5 border border-red-500 bg-transparent hover:bg-orange-500"
                    style={{ backgroundColor: getSeatColor(seat) }}
                    onClick={() => handleSeatClick(seat)} // Dynamically pass the seat name
                  >
                    {seat}
                  </div>
                ))}
              </div>
            </div>
            <div className="col-span-12 flex justify-center mb-4">
              <div className="flex items-center">
                {[
                  "M18",
                  "M17",
                  "M16",
                  "M15",
                  "M14",
                  "M13",
                  "M12",
                  "M11",
                  "M10",
                  "M9",
                  "M8",
                  "M7",
                  "M6",
                  "M5",
                  "M4",
                  "M3",
                  "M2",
                  "M1",
                ].map((seat) => (
                  <div
                    key={seat} // Use the seat name as the key for each element
                    className="rounded-md w-6 h-6 flex items-center justify-center cursor-pointer text-xs mx-0.5 border border-red-500 bg-transparent hover:bg-orange-500"
                    style={{ backgroundColor: getSeatColor(seat) }}
                    onClick={() => handleSeatClick(seat)} // Pass the seat name dynamically
                  >
                    {seat}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-wrap justify-center mb-2">
        <div className="flex items-center mr-4 mb-2">
          <div className="w-4 h-4 border border-red-500 bg-transparent rounded mr-2"></div>
          <span>Available</span>
        </div>
        <div className="flex items-center mr-4 mb-2">
          <div
            className="w-4 h-4 rounded mr-2"
            style={{ backgroundColor: "#00B386" }}
          ></div>
          <span>Booked</span>
        </div>
        <div className="flex items-center mr-4 mb-2">
          <div className="w-4 h-4 bg-yellow-300 rounded mr-2"></div>
          <span>Pending</span>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div
          className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm"
          style={{ zIndex: 1000 }}
        >
          <div className="bg-zinc-800 p-6 rounded-lg w-96 max-w-md">
            <h2 className="text-xl font-semibold text-center text-white mb-6">
              Seat Details :
              <span className="text-center text-white mb-4">
                {" "}
                {selectedSeat}
              </span>
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="relative">
                <input
                  type="text"
                  id="name"
                  name="name"
                  placeholder="Name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="block w-full px-4 py-3 bg-zinc-700 text-white border border-zinc-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 transition duration-300"
                />
              </div>
              <div className="relative">
                <input
                  type="text"
                  id="rollNo"
                  name="rollNo"
                  placeholder="Roll No"
                  value={formData.rollNo}
                  onChange={handleChange}
                  required
                  className="block w-full px-4 py-3 bg-zinc-700 text-white border border-zinc-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 transition duration-300"
                />
              </div>
              <div className="relative">
                <input
                  type="email"
                  id="email"
                  name="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={handleChange}
                  onFocus={() => setIsEmailFocused(true)}
                  onBlur={() => setIsEmailFocused(false)}
                  required
                  className="block w-full px-4 py-3 bg-zinc-700 text-white border border-zinc-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 transition duration-300"
                />
              </div>

              {/* Email warning message */}
              {isEmailFocused && (
                <p className="text-center text-orange-500 text-sm italic mb-3">
                  Please enter a valid email. <br /> Your QR ID will be sent to
                  your email.
                </p>
              )}

              <div className="relative">
                <select
                  id="semester"
                  name="semester"
                  value={formData.semester}
                  onChange={handleChange}
                  required
                  className="block w-full px-4 py-3 bg-zinc-700 text-white border border-zinc-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 transition duration-300"
                >
                  <option value="" disabled>
                    Select Semester
                  </option>
                  <option value="UG-sem1">UG SEM1</option>
                  <option value="UG-3rd year">UG 3rd YEAR</option>
                  <option value="UG-sem2">UG SEM2</option>
                  <option value="PG-sem1">PG SEM1</option>
                  <option value="PG-sem3">PG SEM3</option>
                </select>
              </div>

              {/* Submit and Cancel Buttons */}
              <div className="flex justify-between space-x-4 mt-6">
                <button
                  type="submit"
                  onClick={handleSubmit}
                  className="w-full py-3 text-white font-semibold rounded-lg bg-gradient-to-r from-orange-500 to-orange-800 hover:from-orange-200 hover:to-orange-800 transition duration-300"
                >
                  Add Seat
                </button>
                <button
                  type="button"
                  className="w-full py-3 text-white font-semibold rounded-lg bg-orange-500 hover:bg-orange-700 transition duration-300"
                  onClick={handleCloseModal}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default SeatLayout;
