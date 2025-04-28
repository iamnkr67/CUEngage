import React, { useState } from "react";
import axios from "axios";
import { Settings, Download, Home } from "lucide-react";
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

  // Fetch contestants data
  const handleViewContestants = async () => {
    setLoading(true);
    setError(null);
    setSeats([]);
    setViewMode("contestants");
    try {
      const response = await axios.get(
        "http://localhost:3002/contestant/getData",
      );
      setContestants(response.data.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Generate Contestants PDF
  const generateContestantsPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text("Contestants List", 14, 20);
    const tableColumn = ["Roll No", "Name", "Phone", "Year", "Act", "Program"];
    const tableRows = contestants.map((c) => [
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

  // Generate Approved Seats PDF
  const generateApprovedSeatsPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text("Approved Seats List", 14, 20);
    const tableColumn = ["Name", "Roll No", "Seat Number", "Semester"];
    const tableRows = approvedSeats.map((s) => [
      s.name,
      s.rollNo,
      s.seat,
      s.semester,
    ]);
    doc.autoTable({ startY: 30, head: [tableColumn], body: tableRows });
    doc.save("ApprovedSeatsList.pdf");
  };

  // Fetch pending or approved seats
  const handleSeats = async (status) => {
    setLoading(true);
    setError(null);
    setSeats([]);
    setApprovedSeats([]);
    setViewMode(status);
    try {
      const response = await axios.get(`http://localhost:3002/pending`, {
        params: { status },
      });
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
      await axios.patch(`http://localhost:3002/pending/${seatId}`, {
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
      await axios.delete(`http://localhost:3002/pending/${seatId}`);
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
      {/* Header */}
      <div className="flex items-center space-x-4 mb-8">
        <Settings className="w-8 h-8 text-orange-500" />
        <h1 className="text-4xl font-bold">Admin Controls</h1>
        <Settings className="w-8 h-8 text-orange-500" />
      </div>

      {/* Buttons */}
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

      {/* Loading/Error */}
      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {/* Contestants Table */}
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
                <th className="border border-gray-600 px-4 py-2">Roll No</th>
                <th className="border border-gray-600 px-4 py-2">Name</th>
                <th className="border border-gray-600 px-4 py-2">Phone</th>
                <th className="border border-gray-600 px-4 py-2">Year</th>
                <th className="border border-gray-600 px-4 py-2">Act</th>
                <th className="border border-gray-600 px-4 py-2">Program</th>
              </tr>
            </thead>
            <tbody>
              {contestants.map((c) => (
                <tr key={c.rollNo} className="bg-gray-700">
                  <td className="border border-gray-600 px-4 py-2">
                    {c.rollNo}
                  </td>
                  <td className="border border-gray-600 px-4 py-2">{c.name}</td>
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

      {/* Pending Seats Table */}
      {viewMode === "pending" && seats.length > 0 && (
        <div className="w-full max-w-5xl mt-6">
          <h2 className="text-2xl font-semibold text-center mb-4">
            Pending Seat Requests
          </h2>
          <table className="w-full text-left border-collapse border border-gray-700">
            <thead>
              <tr className="bg-gray-800">
                <th className="border border-gray-600 px-4 py-2">Name</th>
                <th className="border border-gray-600 px-4 py-2">Roll No</th>
                <th className="border border-gray-600 px-4 py-2">
                  Seat Number
                </th>
                <th className="border border-gray-600 px-4 py-2">Semester</th>
                <th className="border border-gray-600 px-4 py-2">Status</th>
                <th className="border border-gray-600 px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {seats.map((s) => (
                <tr key={s._id} className="bg-gray-700">
                  <td className="border border-gray-600 px-4 py-2">{s.name}</td>
                  <td className="border border-gray-600 px-4 py-2">
                    {s.rollNo}
                  </td>
                  <td className="border border-gray-600 px-4 py-2">{s.seat}</td>
                  <td className="border border-gray-600 px-4 py-2">
                    {s.semester}
                  </td>
                  <td className="border border-gray-600 px-4 py-2">
                    {s.status}
                  </td>
                  <td className="border border-gray-600 px-4 py-2">
                    <button
                      onClick={() => openConfirmationDialog(s._id, "approve")}
                      className="bg-green-500 hover:bg-green-700 text-white px-3 py-1 rounded mr-2"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => openConfirmationDialog(s._id, "reject")}
                      className="bg-red-500 hover:bg-red-700 text-white px-3 py-1 rounded"
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

      {/* Approved Seats Table */}
      {viewMode === "approved" && approvedSeats.length > 0 && (
        <div className="w-full max-w-5xl mt-6">
          <div className="flex justify-end mb-4">
            <button
              onClick={generateApprovedSeatsPDF}
              className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
            >
              Download Approved Seats PDF
            </button>
          </div>
          <h2 className="text-2xl font-semibold text-center mb-4">
            Approved Seat Requests
          </h2>
          <table className="w-full text-left border-collapse border border-gray-700">
            <thead>
              <tr className="bg-gray-800">
                <th className="border border-gray-600 px-4 py-2">Name</th>
                <th className="border border-gray-600 px-4 py-2">Roll No</th>
                <th className="border border-gray-600 px-4 py-2">
                  Seat Number
                </th>
                <th className="border border-gray-600 px-4 py-2">Semester</th>
              </tr>
            </thead>
            <tbody>
              {approvedSeats.map((s) => (
                <tr key={s._id} className="bg-gray-700">
                  <td className="border border-gray-600 px-4 py-2">{s.name}</td>
                  <td className="border border-gray-600 px-4 py-2">
                    {s.rollNo}
                  </td>
                  <td className="border border-gray-600 px-4 py-2">{s.seat}</td>
                  <td className="border border-gray-600 px-4 py-2">
                    {s.semester}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Confirmation Dialog */}
      {openDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white text-gray-900 p-6 rounded shadow-md text-center">
            <h2 className="text-xl font-semibold mb-4">
              Are you sure you want to {dialogAction} this seat?
            </h2>
            <div className="flex justify-center space-x-4">
              <button
                onClick={handleDialogConfirm}
                className="bg-green-500 hover:bg-green-700 text-white px-4 py-2 rounded"
              >
                Yes
              </button>
              <button
                onClick={closeConfirmationDialog}
                className="bg-red-500 hover:bg-red-700 text-white px-4 py-2 rounded"
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
