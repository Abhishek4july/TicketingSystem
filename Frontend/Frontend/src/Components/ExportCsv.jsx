import React, { useState } from 'react';
import axios from 'axios';
import Papa from 'papaparse';

function ExportCsv() {
  const [loading, setLoading] = useState(false);

  const handleExportCSV = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/v1/admin/tickets`);
      const tickets = res.data.data;

      const csvData = tickets.map(ticket => ({
        TicketID: ticket._id,
        Subject: ticket.subject,
        Priority: ticket.priority,
        Status: ticket.status,
        Tags: ticket.tags.join(","),
        CreatedBy: ticket.createdBy?.FullName,
        AssignedTo: ticket.assignedTo?.FullName || "Not Assigned",
        CreatedAt: new Date(ticket.createdAt).toLocaleString(),
        ClosedAt: ticket.closedAt ? new Date(ticket.closedAt).toLocaleString() : "N/A",
      }));

      const csv = Papa.unparse(csvData);
      const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute("href", url);
      link.setAttribute("download", "ticket_report.csv");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("CSV Export failed", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleExportCSV}
      disabled={loading}
      className={`px-4 py-2 rounded text-black ${
        loading ? "bg-gray-500 cursor-not-allowed" : "bg-green-600 hover:bg-green-700"
      }`}
    >
      {loading ? (
        <span className="flex items-center gap-2">
          <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 100 16v-4l-3 3 3 3v-4a8 8 0 01-8-8z" />
          </svg>
          Exporting...
        </span>
      ) : (
        "Export CSV"
      )}
    </button>
  );
}

export default ExportCsv;
