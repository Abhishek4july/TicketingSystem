import React, { useEffect, useState } from "react";
import axios from "axios";
import dayjs from "dayjs";
import { useNavigate } from "react-router-dom";
import ExportCsv from "./ExportCsv";
import ExportFilteredCsv from "./ExportFilteredCsv";
import { Link } from "react-router-dom";

const AdminTicketDashboard = () => {
  const [tickets, setTickets] = useState([]);
  const [searchField, setSearchField] = useState("ticketId");
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();
  const [priorityOptions, setPriorityOptions] = useState([]);
  const [statusOptions, setStatusOptions] = useState([]);

  const [filters, setFilters] = useState({
    status: "",
    priority: "",
    tags: "",
    startDate: "",
    endDate: ""
  });
  const [sort, setSort] = useState({
    field: "",
    order: "asc"
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [notificationPreferences, setNotificationPreferences] = useState({
    notifyOnNewTicket: false,
    notifyOnUserReply: false,
  });
  useEffect(() => {
  const fetchPriorityOptions = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/v1/tickets/priority`,
        {  withCredentials: true
}
      );
            console.log("Fetched priorities:", res.data); 

      setPriorityOptions(res.data.data);
    } catch (err) {
      console.error("Failed to fetch priorities:", err);
    }
  };

  const fetchStatusOptions = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/v1/tickets/statusOptions`,
        {
            withCredentials: true

        }
      );
            console.log("Fetched options:", res.data); 

      setStatusOptions(res.data.data);
    } catch (err) {
      console.error("Failed to fetch statusOptions:", err);
    }
  };
  

  fetchPriorityOptions();
  fetchStatusOptions();
}, []);

  const fetchTickets = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/v1/admin/tickets`,
        {  withCredentials: true
}
      );
      setTickets(res.data.data || []);
      setError("");
    } catch (error) {
      console.log("Error fetching tickets");
      setError("Failed to load tickets. Please try again.");
    } finally {
      setLoading(false);
    }
  };

const fetchNotificationPreferences = async () => {
  try {
    const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/v1/admin/preferences`,
      {  withCredentials: true
}
    );
    setNotificationPreferences(prev => ({
      ...prev,
      ...res.data.data
    }));
  } catch (error) {
    console.error("Failed to fetch notification preferences", error);
  }
};


  const handleToggleNotification = async (preferenceKey) => {
    try {
      const updatedPrefs = {
        ...notificationPreferences,
        [preferenceKey]: !notificationPreferences[preferenceKey],
      };
      setNotificationPreferences(updatedPrefs);
      await axios.put(`${import.meta.env.VITE_API_URL}/api/v1/admin/preferences`,{  withCredentials: true
}, updatedPrefs);
    } catch (error) {
      console.error("Failed to update notification preferences", error);
    }
  };

  const applySearch = async () => {
    if (!searchTerm) return;

    if (
      searchField === "ticketId" &&
      !/^[a-fA-F0-9]{24}$/.test(searchTerm.trim())
    ) {
      setError("Please enter a valid Ticket ID.");
      return;
    }

    setLoading(true);
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/v1/admin/tickets/search`, {
        params: { searchField: searchField.toLowerCase(), searchTerm: searchTerm.trim() },
          withCredentials: true

      });
      setTickets(res.data.data || []);
      setError("");
    } catch (error) {
      console.log("Search failed", error);
      setError("Search failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const applyFilter = async () => {
    setLoading(true);
    try {
      const params = { ...filters };

      if (filters.tags) {
        params.tags = filters.tags.split(",").map(t => t.trim()).filter(t => t.length > 0);
      }
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/v1/admin/tickets/filter`,{  withCredentials: true,
        params: filters
      });
      console.log("Fetched tickets:", res.data);
      setTickets(res.data.data || []);
      setError("");
    } catch (error) {
      console.log("Filter failed", error);
      setError("Filter failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const applySort = async () => {
    if (!sort.field) return;
    setLoading(true);
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/v1/admin/tickets/sort`,{  withCredentials: true,
 
        params: {
          sortField: sort.field,
          sortOrder: sort.order
        }
      });
      setTickets(res.data.data || []);
      setError("");
    } catch (err) {
      console.log("Sort failed", err);
      setError("Sorting failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
    fetchNotificationPreferences();
  }, []);

  const handleSearchTermChange = (e) => {
    setSearchTerm(e.target.value);
    applySearch();
  };

  return (
  <div className="p-4 sm:p-6 max-w-7xl mx-auto space-y-8 bg-gray-900 min-h-screen text-white">
    <h1 className="text-2xl sm:text-3xl font-bold text-blue-300 border-b border-blue-500 pb-2">
      🎫 Admin Ticket Dashboard
    </h1>

    {/* Search Bar */}
    <div className="flex flex-col sm:flex-row flex-wrap gap-4 items-start sm:items-end bg-gray-800 p-4 rounded-lg">
      <select
        className="border border-gray-600 bg-gray-700 p-2 rounded text-white w-full sm:w-auto"
        value={searchField}
        onChange={(e) => setSearchField(e.target.value)}
      >
        <option value="ticketId">Ticket ID</option>
        <option value="fullName">User Full Name</option>
      </select>
      <input
        type="text"
        placeholder="Search..."
        className="border border-gray-600 bg-gray-700 p-2 rounded text-white w-full sm:w-64"
        value={searchTerm}
        onChange={handleSearchTermChange}
      />
      <button
        onClick={applySearch}
        className="bg-blue-600 hover:bg-blue-700 text-black px-4 py-2 rounded shadow w-full sm:w-auto"
      >
        🔍 Search
      </button>
    </div>

    {/* Filter Section */}
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 bg-gray-800 p-4 rounded-lg">
         <select
  className="border border-gray-600 bg-gray-700 p-2 rounded text-white"
  value={filters.status}
  onChange={(e) => setFilters({ ...filters, status: e.target.value })}
>
  <option value="">Status</option>
  {statusOptions?.map((option, index) => (
    <option key={index} value={option}>
      {option.charAt(0).toUpperCase() + option.slice(1)}
    </option>
  ))}
</select>
    <select
  className="border border-gray-600 bg-gray-700 p-2 rounded text-white"
  value={filters.priority}
  onChange={(e) => setFilters({ ...filters, priority: e.target.value })}
>
  <option value="">Priority</option>
  {priorityOptions?.map((option, index) => (
    <option key={index} value={option}>
      {option.charAt(0).toUpperCase() + option.slice(1)}
    </option>
  ))}
</select>

      <input
        type="text"
        placeholder="Tags (comma separated)"
        className="border border-gray-600 bg-gray-700 p-2 rounded text-white"
        value={filters.tags}
        onChange={(e) => setFilters({ ...filters, tags: e.target.value })}
      />
      <input
        type="date"
        className="border border-gray-600 bg-gray-700 p-2 rounded text-white"
        value={filters.startDate}
        onChange={(e) => setFilters({ ...filters, startDate: e.target.value })}
      />
      <input
        type="date"
        className="border border-gray-600 bg-gray-700 p-2 rounded text-white"
        value={filters.endDate}
        onChange={(e) => setFilters({ ...filters, endDate: e.target.value })}
      />
      <button
        onClick={applyFilter}
        className="bg-purple-600 hover:bg-purple-700 text-black px-4 py-2 rounded shadow"
      >
        🎯 Apply Filters
      </button>
    </div>

    {/* Sorting Section */}
    <div className="flex flex-col sm:flex-row gap-4 bg-gray-800 p-4 rounded-lg">
      <select
        className="border border-gray-600 bg-gray-700 p-2 rounded text-white"
        onChange={(e) => setSort({ ...sort, field: e.target.value })}
      >
        <option value="">Sort by</option>
        <option value="ticketId">Ticket ID</option>
        <option value="fullName">Full Name</option>
      </select>
      <select
        className="border border-gray-600 bg-gray-700 p-2 rounded text-white"
        onChange={(e) => setSort({ ...sort, order: e.target.value })}
      >
        <option value="asc">Asc</option>
        <option value="desc">Desc</option>
      </select>
      <button
        onClick={applySort}
        className="bg-green-600 hover:bg-green-700 text-black px-4 py-2 rounded shadow"
      >
        ↕️ Sort
      </button>
    </div>

    {/* Notification Preferences */}
    <div className="bg-gray-800 p-4 rounded-lg max-w-full sm:max-w-md">
      <h2 className="text-xl font-semibold mb-4 text-blue-300">Notification Preferences</h2>
      <div className="flex items-center mb-3">
        <input
          id="notifyOnNewTicket"
          type="checkbox"
          checked={notificationPreferences.notifyOnNewTicket}
          onChange={() => handleToggleNotification("notifyOnNewTicket")}
          className="mr-2 cursor-pointer"
        />
        <label htmlFor="notifyOnNewTicket" className="cursor-pointer">
          Notify me on new ticket creation
        </label>
      </div>
      <div className="flex items-center">
        <input
          id="notifyOnUserReply"
          type="checkbox"
          checked={notificationPreferences.notifyOnUserReply}
          onChange={() => handleToggleNotification("notifyOnUserReply")}
          className="mr-2 cursor-pointer"
        />
        <label htmlFor="notifyOnUserReply" className="cursor-pointer">
          Notify me on admin comment reply
        </label>
      </div>
    </div>

    {/* Loading Spinner */}
    {loading && (
      <div className="text-center py-4">
        <div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-2"></div>
        <span className="text-blue-300">Loading...</span>
      </div>
    )}

    {/* Error Message */}
    {error && <div className="text-red-500 text-center">{error}</div>}

    {/* Ticket Table */}
    <div className="overflow-x-auto mt-4 rounded-lg border border-gray-700">
      <table className="min-w-full bg-gray-800 text-sm text-white">
        <thead className="bg-gray-700">
          <tr>
            <th className="p-2 border-b border-gray-600">Ticket ID</th>
            <th className="p-2 border-b border-gray-600">Subject</th>
            <th className="p-2 border-b border-gray-600">Priority</th>
            <th className="p-2 border-b border-gray-600">Status</th>
            <th className="p-2 border-b border-gray-600">Tags</th>
            <th className="p-2 border-b border-gray-600">Created By</th>
            <th className="p-2 border-b border-gray-600">Date</th>
          </tr>
        </thead>
        <tbody>
          {!loading &&
            tickets.map((ticket) => (
              <tr
                key={ticket._id}
                onClick={() => navigate(`/admin/tickets/${ticket._id}`)}
                className="hover:bg-gray-700 transition cursor-pointer text-left"
              >
                <td className="p-2 border-b border-gray-700">{ticket._id}</td>
                <td className="p-2 border-b border-gray-700">{ticket.subject}</td>
                <td className="p-2 border-b border-gray-700">{ticket.priority}</td>
                <td className="p-2 border-b border-gray-700">{ticket.status}</td>
                <td className="p-2 border-b border-gray-700">{ticket.tags?.join(", ")}</td>
                <td className="p-2 border-b border-gray-700">{ticket.createdBy?.FullName}</td>
                <td className="p-2 border-b border-gray-700">
                  {dayjs(ticket.createdAt).format("DD/MM/YYYY")}
                </td>
              </tr>
            ))}
          {!loading && tickets.length === 0 && (
            <tr>
              <td colSpan="7" className="p-4 text-gray-400 text-center">
                No tickets found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>

    <div className="m-auto font-bold text-center">
      <ExportFilteredCsv filters={filters} />
    </div>

    <div className="mb-6 mt-4 mx-auto w-fit">
      <Link
        to="/submitTicket"
        className="bg-white px-5 py-2 rounded-lg text-gray-950 font-semibold hover:bg-cyan-700 transition hover:text-black block text-center"
      >
        + Create New Ticket
      </Link>
    </div>
  </div>
);

};

export default AdminTicketDashboard;
