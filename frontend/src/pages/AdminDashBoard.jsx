import React, { useState, useEffect } from "react";
import axios from "axios";
import { Settings } from "lucide-react";
import jsPDF from "jspdf";
import "jspdf-autotable";

const AdminDashboard = () => {
  const [contestants, setContestants] = useState([]);
  const [seats, setSeats] = useState([]);
  const [approvedSeats, setApprovedSeats] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [viewMode, setViewMode] = useState("none");
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogAction, setDialogAction] = useState(null);
  const [currentSeat, setCurrentSeat] = useState(null);
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState("");

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await axios.get(
          "https://cuengage.onrender.com/event/getAll",
        );
        setEvents(res.data.events);
      } catch (err) {
        console.error("Error fetching events:", err);
      }
    };
    fetchEvents();
  }, []);

  const handleViewContestants = async () => {
    if (!selectedEvent) return alert("Please select an event first.");
    setContestants([]);
    setSeats([]);
    setApprovedSeats([]);
    setError(null);
    setLoading(true);
    setViewMode("contestants");
    try {
      const response = await axios.get(
        "https://cuengage.onrender.com/contestant/getData",
        {
          params: { event: selectedEvent },
        },
      );
      setContestants(response.data.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSeats = async (status) => {
    if (!selectedEvent) return alert("Please select an event first.");
    setContestants([]);
    setSeats([]);
    setApprovedSeats([]);
    setError(null);
    setLoading(true);
    setViewMode(status);
    try {
      const response = await axios.get(
        "https://cuengage.onrender.com/pending",
        {
          params: { status, event: selectedEvent },
        },
      );
      const seats = response.data.data;
      setSeats(seats.filter((s) => s.status === "pending"));
      setApprovedSeats(seats.filter((s) => s.status === "approved"));
    } catch (err) {
      if (err.response && err.response.status === 400)
        setError("No seats booked.");
      else setError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const generateContestantsPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.setTextColor(0, 0, 0);
    doc.text(selectedEvent, 14, 20);
    doc.setFontSize(12);
    const tableColumn = [
      "S.No",
      "Roll No",
      "Name",
      "Phone",
      "Year",
      "Act",
      "Department",
    ];
    const tableRows = contestants.map((c, index) => [
      index + 1,
      c.rollNo,
      c.name,
      c.phone,
      c.year,
      c.act,
      c.program,
    ]);
    doc.autoTable({ startY: 30, head: [tableColumn], body: tableRows });
    doc.save("ContestantsList.pdf");
  };

  const generateApprovedSeatsPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.setTextColor(0, 0, 0);
    doc.text(selectedEvent, 14, 20);
    doc.setFontSize(12);
    const tableColumn = [
      "S.No",
      "Name",
      "Roll No",
      "Seat Number",
      "Department",
    ];
    const tableRows = approvedSeats.map((s, index) => [
      index + 1,
      s.name,
      s.rollNo,
      s.seat,
      s.department,
    ]);
    doc.autoTable({ startY: 30, head: [tableColumn], body: tableRows });
    doc.save("ApprovedSeatsList.pdf");
  };

  const generatePendingSeatsPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.setTextColor(0, 0, 0);
    doc.text(selectedEvent, 14, 20);
    doc.setFontSize(12);
    const tableColumn = [
      "S.No",
      "Name",
      "Roll No",
      "Seat Number",
      "Department",
    ];
    const tableRows = seats.map((s, index) => [
      index + 1,
      s.name,
      s.rollNo,
      s.seat,
      s.department,
    ]);
    doc.autoTable({ startY: 30, head: [tableColumn], body: tableRows });
    doc.save("PendingSeatsList.pdf");
  };

  const openConfirmationDialog = (seatId, action) => {
    setCurrentSeat(seatId);
    setDialogAction(action);
    setOpenDialog(true);
  };

  const closeConfirmationDialog = () => {
    setOpenDialog(false);
    setCurrentSeat(null);
    setDialogAction(null);
  };

  const handleApprove = async (seatId) => {
    try {
      await axios.patch(`https://cuengage.onrender.com/pending/${seatId}`, {
        status: "approved",
      });
      alert("Seat approved successfully!");
      handleSeats("pending");
      handleSeats("approved");
      closeConfirmationDialog();
    } catch (error) {
      console.error("Error approving seat:", error);
      alert("Failed to approve seat.");
    }
  };

  const handleReject = async (seatId) => {
    try {
      await axios.delete(`https://cuengage.onrender.com/pending/${seatId}`);
      setSeats((prev) => prev.filter((s) => s._id !== seatId));
      alert("Seat rejected successfully!");
      closeConfirmationDialog();
    } catch (error) {
      console.error("Error rejecting seat:", error);
      alert("Failed to reject seat.");
    }
  };

  const handleDialogConfirm = () => {
    if (dialogAction === "approve") handleApprove(currentSeat);
    else if (dialogAction === "reject") handleReject(currentSeat);
  };

  return (
    <div className="min-h-screen flex flex-col items-center bg-gray-900 text-white p-6">
      <div className="flex items-center space-x-4 mb-8">
        <Settings className="w-8 h-8 text-orange-500" />
        <h1 className="text-4xl font-bold">Admin Controls</h1>
        <Settings className="w-8 h-8 text-orange-500" />
      </div>

      <div className="mb-6">
        <label className="mr-2 font-semibold">Select Event:</label>
        <select
          value={selectedEvent}
          onChange={(e) => setSelectedEvent(e.target.value)}
          className="bg-gray-800 text-white px-4 py-2 rounded"
        >
          <option value="">-- Choose an Event --</option>
          {events.map((event) => (
            <option key={event._id} value={event.eName}>
              {event.eName}
            </option>
          ))}
        </select>
      </div>

      {selectedEvent && (
        <div className="space-y-4 mb-8 flex flex-wrap justify-center">
          <button
            onClick={handleViewContestants}
            className="bg-gradient-to-r from-green-500 to-green-700 text-white font-bold py-3 px-6 rounded-lg hover:from-green-600 hover:to-green-800 transition"
          >
            View Contestants
          </button>

          <button
            onClick={() => handleSeats("pending")}
            className="bg-gradient-to-r from-blue-500 to-blue-700 text-white font-bold py-3 px-6 rounded-lg hover:from-blue-600 hover:to-blue-800 transition ml-4"
          >
            See Pending Seats
          </button>

          <button
            onClick={() => handleSeats("approved")}
            className="bg-gradient-to-r from-purple-500 to-purple-700 text-white font-bold py-3 px-6 rounded-lg hover:from-purple-600 hover:to-purple-800 transition ml-4"
          >
            See Approved Seats
          </button>
        </div>
      )}

      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}


      {viewMode === "contestants" && contestants.length > 0 && (
        <div className="w-full max-w-5xl">
          <div className="flex justify-end mb-4">
            <button
              onClick={generateContestantsPDF}
              className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
            >
              Download Contestants PDF
            </button>
          </div>
          <table className="w-full text-left border-collapse border border-gray-700">
            <thead>
              <tr className="bg-gray-800">
                <th className="border border-gray-600 px-4 py-2">S.No</th>
                <th className="border border-gray-600 px-4 py-2">Name</th>
                <th className="border border-gray-600 px-4 py-2">Roll No</th>
                <th className="border border-gray-600 px-4 py-2">Phone</th>
                <th className="border border-gray-600 px-4 py-2">Year</th>
                <th className="border border-gray-600 px-4 py-2">Act</th>
                <th className="border border-gray-600 px-4 py-2">Department</th>
              </tr>
            </thead>
            <tbody>
              {contestants.map((c, index) => (
                <tr key={c.rollNo} className="bg-gray-700">
                  <td className="border border-gray-600 px-4 py-2">
                    {index + 1}
                  </td>
                  <td className="border border-gray-600 px-4 py-2">{c.name}</td>
                  <td className="border border-gray-600 px-4 py-2">
                    {c.rollNo}
                  </td>
                  <td className="border border-gray-600 px-4 py-2">
                    {c.phone}
                  </td>
                  <td className="border border-gray-600 px-4 py-2">{c.year}</td>
                  <td className="border border-gray-600 px-4 py-2">{c.act}</td>
                  <td className="border border-gray-600 px-4 py-2">
                    {c.program}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {viewMode === "pending" && seats.length > 0 && (
        <div className="w-full max-w-5xl">
          <div className="flex justify-end mb-4">
            <button
              onClick={generatePendingSeatsPDF}
              className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
            >
              Download Pending Seats PDF
            </button>
          </div>
          <table className="w-full text-left border-collapse border border-gray-700">
            <thead>
              <tr className="bg-gray-800">
                <th className="border border-gray-600 px-4 py-2">S.No</th>
                <th className="border border-gray-600 px-4 py-2">Name</th>
                <th className="border border-gray-600 px-4 py-2">Roll No</th>
                <th className="border border-gray-600 px-4 py-2">Seat No</th>
                <th className="border border-gray-600 px-4 py-2">Department</th>
                <th className="border border-gray-600 px-4 py-2">Action</th>
              </tr>
            </thead>
            <tbody>
              {seats.map((s, index) => (
                <tr key={s._id} className="bg-gray-700">
                  <td className="border border-gray-600 px-4 py-2">
                    {index + 1}
                  </td>
                  <td className="border border-gray-600 px-4 py-2">{s.name}</td>
                  <td className="border border-gray-600 px-4 py-2">
                    {s.rollNo}
                  </td>
                  <td className="border border-gray-600 px-4 py-2">{s.seat}</td>
                  <td className="border border-gray-600 px-4 py-2">
                    {s.department}
                  </td>
                  <td className="border border-gray-600 px-4 py-2">
                    <button
                      onClick={() => openConfirmationDialog(s._id, "approve")}
                      className="bg-green-500 hover:bg-green-700 text-white py-1 px-3 rounded"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => openConfirmationDialog(s._id, "reject")}
                      className="bg-red-500 hover:bg-red-700 text-white py-1 px-3 rounded ml-2"
                    >
                      Reject
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {viewMode === "approved" && approvedSeats.length > 0 && (
        <div className="w-full max-w-5xl">
          <div className="flex justify-end mb-4">
            <button
              onClick={generateApprovedSeatsPDF}
              className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
            >
              Download Approved Seats PDF
            </button>
          </div>
          <table className="w-full text-left border-collapse border border-gray-700">
            <thead>
              <tr className="bg-gray-800">
                <th className="border border-gray-600 px-4 py-2">S.No</th>
                <th className="border border-gray-600 px-4 py-2">Name</th>
                <th className="border border-gray-600 px-4 py-2">Roll No</th>
                <th className="border border-gray-600 px-4 py-2">Seat No</th>
                <th className="border border-gray-600 px-4 py-2">Department</th>
              </tr>
            </thead>
            <tbody>
              {approvedSeats.map((s, index) => (
                <tr key={s._id} className="bg-gray-700">
                  <td className="border border-gray-600 px-4 py-2">
                    {index + 1}
                  </td>
                  <td className="border border-gray-600 px-4 py-2">{s.name}</td>
                  <td className="border border-gray-600 px-4 py-2">
                    {s.rollNo}
                  </td>
                  <td className="border border-gray-600 px-4 py-2">{s.seat}</td>
                  <td className="border border-gray-600 px-4 py-2">
                    {s.department}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {openDialog && (
        <div
          className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center"
          onClick={closeConfirmationDialog}
        >
          <div
            className="bg-white text-black p-6 rounded-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-semibold">Are you sure?</h3>
            <div className="mt-4">
              <button
                onClick={handleDialogConfirm}
                className="bg-blue-500 text-white py-2 px-4 rounded-lg"
              >
                Confirm
              </button>
              <button
                onClick={closeConfirmationDialog}
                className="bg-gray-500 text-white py-2 px-4 rounded-lg ml-4"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
