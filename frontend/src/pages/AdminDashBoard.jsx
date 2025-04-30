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
  const [selectedEvent, setSelectedEvent] = useState("");
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await axios.get(
          "https://cuengage.onrender.com/event/getAll",
        );
        setEvents(res.data.events);
      } catch (err) {
        setError("Error fetching events: " + err.message);
      }
    };
    fetchEvents();
  }, []);

  useEffect(() => {
    if (selectedEvent) {
      fetchAllData(selectedEvent);
    }
  }, [selectedEvent]);

  useEffect(() => {
    if (viewMode === "contestants") {
      setContestants([]);
      fetchContestants(selectedEvent);
    } else if (viewMode === "pending") {
      setSeats([]);
      fetchSeats("pending", selectedEvent);
    } else if (viewMode === "approved") {
      setApprovedSeats([]);
      fetchSeats("approved", selectedEvent);
    }
  }, [viewMode]);

  const fetchAllData = async (eventName) => {
    setLoading(true);
    setError(null);
    try {
      const [contestantsRes, seatsRes] = await Promise.all([
        axios.get("https://cuengage.onrender.com/contestant/getData", {
          params: { event: eventName },
        }),
        axios.get("https://cuengage.onrender.com/pending", {
          params: { event: eventName },
        }),
      ]);
      setContestants(contestantsRes.data.data);
      const allSeats = seatsRes.data.data;
      setSeats(allSeats.filter((s) => s.status === "pending"));
      setApprovedSeats(allSeats.filter((s) => s.status === "approved"));
    } catch (err) {
      setError("Error fetching event data: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchContestants = async (eventName) => {
    setLoading(true);
    try {
      const res = await axios.get(
        "https://cuengage.onrender.com/contestant/getData",
        {
          params: { event: eventName },
        },
      );
      setContestants(res.data.data);
    } catch (err) {
      setError("Error fetching contestants.");
    } finally {
      setLoading(false);
    }
  };

  const fetchSeats = async (status, eventName) => {
    setLoading(true);
    try {
      const res = await axios.get("https://cuengage.onrender.com/pending", {
        params: { status, event: eventName },
      });
      const data = res.data.data;
      if (status === "pending") {
        setSeats(data.filter((s) => s.status === "pending"));
      } else {
        setApprovedSeats(data.filter((s) => s.status === "approved"));
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const generateContestantsPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(18);
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
    doc.autoTable({
      startY: 30,
      head: [tableColumn],
      body: tableRows,
      styles: {
        lineColor: [0, 0, 0],
        lineWidth: 0.1,
      },
      headStyles: {
        fillColor: [240, 240, 240],
        textColor: [0, 0, 0],
        
      },
    });
    doc.save(`${selectedEvent}_contestants.pdf`);
  };

  const generateSeatsPDF = (seatsData, filename) => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text(selectedEvent, 14, 20);
    doc.setFontSize(12);
    const tableColumn = [
      "S.No",
      "Name",
      "Roll No",
      "Seat Number",
      "Department",
    ];
    const tableRows = seatsData.map((s, index) => [
      index + 1,
      s.name,
      s.rollNo,
      s.seat,
      s.department,
    ]);
    doc.autoTable({
      startY: 30,
      head: [tableColumn],
      body: tableRows,
      styles: {
        lineColor: [0, 0, 0],
        lineWidth: 0.1,
      },
      headStyles: {
        fillColor: [240, 240, 240],
        textColor: [0, 0, 0],
        
      },
    });
    doc.save(filename);
  };

  const generateApprovedSeatsPDF = () => {
    generateSeatsPDF(approvedSeats, `${selectedEvent}_hallBookings.pdf`);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4 flex flex-col items-center">
      <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4 mb-6">
        <Settings className="w-6 h-6 text-orange-500" />
        <h1 className="text-2xl sm:text-4xl font-bold">Admin Controls</h1>
        <Settings className="w-6 h-6 text-orange-500" />
      </div>

      <div className="mb-6 text-center">
        <label className="mr-2 font-semibold">Select Event:</label>
        <select
          value={selectedEvent}
          onChange={(e) => setSelectedEvent(e.target.value)}
          className="bg-gray-800 text-white px-4 py-2 rounded"
        >
          <option value="" disabled>
            -- Choose an Event --
          </option>
          {events.map((event) => (
            <option key={event._id} value={event.eName}>
              {event.eName}
            </option>
          ))}
        </select>
      </div>

      {selectedEvent && (
        <div className="mb-8 flex flex-col sm:flex-row flex-wrap justify-center gap-4">
          <button
            onClick={() => setViewMode("contestants")}
            className="bg-gradient-to-r from-green-500 to-green-700 text-white font-bold py-2 px-6 rounded-lg hover:from-green-600 hover:to-green-800 transition"
          >
            View Contestants
          </button>
          <button
            onClick={() => setViewMode("pending")}
            className="bg-gradient-to-r from-blue-500 to-blue-700 text-white font-bold py-2 px-6 rounded-lg hover:from-blue-600 hover:to-blue-800 transition"
          >
            See Pending Seats
          </button>
          <button
            onClick={() => setViewMode("approved")}
            className="bg-gradient-to-r from-purple-500 to-purple-700 text-white font-bold py-2 px-6 rounded-lg hover:from-purple-600 hover:to-purple-800 transition"
          >
            See Approved Seats
          </button>
        </div>
      )}

      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {viewMode === "contestants" && (
        <div className="w-full overflow-x-auto max-w-6xl">
          {contestants.length > 0 && (
            <div className="flex justify-end mb-4">
              <button
                onClick={generateContestantsPDF}
                className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
              >
                Download Contestants PDF
              </button>
            </div>
          )}
          {contestants.length === 0 ? (
            <p className="text-center text-red-500">No records found!</p>
          ) : (
            <table className="w-full text-left border-collapse border border-gray-700 text-sm">
              <thead className="bg-gray-800">
                <tr>
                  <th className="border border-gray-600 px-2 py-2">S.No</th>
                  <th className="border border-gray-600 px-2 py-2">Name</th>
                  <th className="border border-gray-600 px-2 py-2">Roll No</th>
                  <th className="border border-gray-600 px-2 py-2">Phone</th>
                  <th className="border border-gray-600 px-2 py-2">Year</th>
                  <th className="border border-gray-600 px-2 py-2">Act</th>
                  <th className="border border-gray-600 px-2 py-2">
                    Department
                  </th>
                </tr>
              </thead>
              <tbody>
                {contestants.map((c, index) => (
                  <tr key={c.rollNo} className="bg-gray-700">
                    <td className="border border-gray-600 px-2 py-2">
                      {index + 1}
                    </td>
                    <td className="border border-gray-600 px-2 py-2">
                      {c.name}
                    </td>
                    <td className="border border-gray-600 px-2 py-2">
                      {c.rollNo}
                    </td>
                    <td className="border border-gray-600 px-2 py-2">
                      {c.phone}
                    </td>
                    <td className="border border-gray-600 px-2 py-2">
                      {c.year}
                    </td>
                    <td className="border border-gray-600 px-2 py-2">
                      {c.act}
                    </td>
                    <td className="border border-gray-600 px-2 py-2">
                      {c.program}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {["pending", "approved"].includes(viewMode) && (
        <div className="w-full overflow-x-auto max-w-6xl">
          {viewMode === "approved" && approvedSeats.length > 0 && (
            <div className="flex justify-end mb-4">
              <button
                onClick={generateApprovedSeatsPDF}
                className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
              >
                Download Approved Seats PDF
              </button>
            </div>
          )}
          {(viewMode === "approved" && approvedSeats.length === 0) ||
          (viewMode === "pending" && seats.length === 0) ? (
            <p className="text-center text-red-500">No records found!</p>
          ) : (
            <table className="w-full text-left border-collapse border border-gray-700 text-sm">
              <thead className="bg-gray-800">
                <tr>
                  <th className="border border-gray-600 px-2 py-2">S.No</th>
                  <th className="border border-gray-600 px-2 py-2">Name</th>
                  <th className="border border-gray-600 px-2 py-2">Roll No</th>
                  <th className="border border-gray-600 px-2 py-2">Seat No</th>
                  <th className="border border-gray-600 px-2 py-2">
                    Department
                  </th>
                </tr>
              </thead>
              <tbody>
                {(viewMode === "approved" ? approvedSeats : seats).map(
                  (seat, index) => (
                    <tr key={seat._id} className="bg-gray-700">
                      <td className="border border-gray-600 px-2 py-2">
                        {index + 1}
                      </td>
                      <td className="border border-gray-600 px-2 py-2">
                        {seat.name}
                      </td>
                      <td className="border border-gray-600 px-2 py-2">
                        {seat.rollNo}
                      </td>
                      <td className="border border-gray-600 px-2 py-2">
                        {seat.seat}
                      </td>
                      <td className="border border-gray-600 px-2 py-2">
                        {seat.department}
                      </td>
                    </tr>
                  ),
                )}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
