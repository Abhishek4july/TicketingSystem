import React, { useEffect, useState } from "react";
import axios from "axios";
import dayjs from "dayjs";
import { Link } from "react-router-dom";
import Spinner from "./Spinner";

const UserDashboard = () => {
  const [tickets, setTickets] = useState([]);
  const [statusSummary, setStatusSummary] = useState({ open: 0, progress: 0, resolved: 0 });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const [preferences, setPreferences] = useState({
     notifyOnTicketCreated: false,
    notifyOnStatusChange: false,
    notifyOnAdminComment: false,
  });

  const [notifLoading, setNotifLoading] = useState(false);
  const [notifMessage, setNotifMessage] = useState("");

  useEffect(() => {
    const fetchMyTickets = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/v1/users/tickets`);
        setTickets(res.data.data);

        const summary = { open: 0, progress: 0, resolved: 0 };
        res.data.data.forEach((ticket) => {
          const status = ticket.status.toLowerCase();
          if (status === "open") summary.open++;
          else if (status === "in progress") summary.progress++;
          else if (status === "resolved") summary.resolved++;
        });
        setStatusSummary(summary);
      } catch (error) {
        setError("Failed to load tickets");
      } finally {
        setLoading(false);
      }
    };

    const fetchNotificationSettings = async () => {
  try {
    const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/v1/users/preferences`);
    const data = res.data.data || {};

    setPreferences({
      notifyOnTicketCreated : data.notifyOnTicketCreated  ?? false,
      notifyOnStatusChange: data.notifyOnStatusChange ?? false,
      notifyOnAdminComment: data.notifyOnAdminComment ?? false,
    });
  } catch (err) {
    console.error("Failed to fetch notification settings");
  }
};


    fetchMyTickets();
    fetchNotificationSettings();
  }, []);

  const handleToggle = async (settingKey, value) => {
    setNotifLoading(true);
    setNotifMessage("");
    try {
      await axios.put(`${import.meta.env.VITE_API_URL}/api/v1/users/preferences`, { [settingKey]: value });
      setPreferences((prev) => ({ ...prev, [settingKey]: value }));
      setNotifMessage("Notification settings updated");
    } catch (err) {
      setNotifMessage("Failed to update settings");
    } finally {
      setNotifLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-6 text-white">
      <h1 className="text-3xl font-bold text-cyan-400 mb-6">My Tickets</h1>

      {/* Notification Preferences */}
      <div className="bg-gray-900 p-4 rounded-md mb-8 max-w-md">
        <h2 className="text-xl font-semibold mb-4">Notification Preferences</h2>
        <div className="flex flex-col space-y-2">
          {[
            { label: "Notify me on ticket creation", key: "notifyOnTicketCreated" },
            { label: "Notify me on status change", key: "notifyOnStatusChange" },
            { label: "Notify me when admin adds a comment", key: "notifyOnAdminComment" },
          ].map(({ label, key }) => (
            <label key={key} className="flex items-center space-x-3">
              <input
                type="checkbox"
                checked={preferences[key]}
                onChange={(e) => handleToggle(key, e.target.checked)}
                disabled={notifLoading}
              />
              <span>{label}</span>
            </label>
          ))}
        </div>
        {notifLoading && <p className="text-sm text-gray-400 mt-2">Saving...</p>}
        {notifMessage && <p className="text-sm mt-2">{notifMessage}</p>}
      </div>

      {/* Status Summary */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
          {[1, 2, 3].map((_, i) => (
            <div
              key={i}
              className="flex justify-center items-center p-6 rounded-xl shadow-md bg-gray-800 h-[100px]"
            >
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-cyan-400"></div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
          <StatusCard label="Open" count={statusSummary.open} color="bg-red-600" />
          <StatusCard label="In Progress" count={statusSummary.progress} color="bg-yellow-500" />
          <StatusCard label="Resolved" count={statusSummary.resolved} color="bg-green-600" />
        </div>
      )}

      {/* New Ticket Button */}
      {!loading && (
        <div className="mb-6 text-right">
          <Link
            to="/submitTicket"
            className="bg-white px-5 py-2 rounded-lg text-gray-950 font-semibold hover:bg-cyan-700 transition hover:text-black"
          >
            + Create New Ticket
          </Link>
        </div>
      )}

      {error && <div className="text-red-500 text-center">{error}</div>}

      {/* Ticket List */}
      {loading ? (
        <Spinner />
      ) : (
        <div className="bg-gray-800 rounded-xl shadow-lg p-4 overflow-x-auto">
          <table className="min-w-full text-left">
            <thead>
              <tr className="border-b border-gray-700 text-gray-300 text-sm">
                <th className="py-2 px-3">Subject</th>
                <th className="py-2 px-3">Status</th>
                <th className="py-2 px-3">Priority</th>
                <th className="py-2 px-3">Created At</th>
                <th className="py-2 px-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {tickets.map((ticket) => (
                <tr key={ticket._id} className="border-b border-gray-700 hover:bg-gray-700/20">
                  <td className="py-2 px-3">{ticket.subject}</td>
                  <td className="py-2 px-3">{ticket.status}</td>
                  <td className="py-2 px-3">{ticket.priority}</td>
                  <td className="py-2 px-3">{dayjs(ticket.createdAt).format("DD MMM YYYY")}</td>
                  <td className="py-2 px-3">
                    <Link
                      to={`/user/tickets/${ticket._id}`}
                      className="text-cyan-400 hover:underline mr-4"
                    >
                      View
                    </Link>
                    <Link
                      to={`/user/tickets/${ticket._id}/comments`}
                      className="text-yellow-400 hover:underline"
                    >
                      Comments
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {tickets.length === 0 && (
            <p className="text-center text-gray-400 mt-6">No tickets found.</p>
          )}
        </div>
      )}
    </div>
  );
};

const StatusCard = ({ label, count, color }) => (
  <div className={`p-4 rounded-xl shadow-md text-center ${color}`}>
    <p className="text-lg font-semibold">{label}</p>
    <p className="text-2xl font-bold">{count}</p>
  </div>
);

export default UserDashboard;
