import React, { useState } from 'react';
import axios from 'axios';
import Papa from 'papaparse';

function ExportFilteredCsv({ filters = {} }) {
  const [loading, setLoading] = useState(false);

  const handleExportCSV = async () => {
    try {
      setLoading(true);

      const params = new URLSearchParams();
      if (filters.status) params.append("status", filters.status);
      if (filters.priority) params.append("priority", filters.priority);
      if (filters.startDate) params.append("startDate", filters.startDate);
      if (filters.endDate) params.append("endDate", filters.endDate);
      if (filters.tags && filters.tags.length > 0)
        params.append("tags", filters.tags.join(','));

      const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/v1/admin/tickets/filter?${params.toString()}`);
      const tickets = res.data.data;

      const csvData = tickets.map(ticket => ({
        TicketID: ticket._id,
        Subject: ticket.subject,
        Priority: ticket.priority,
        Status: ticket.status,
        Tags: ticket.tags.join(','),
        CreatedBy: ticket.createdBy?.FullName,
        AssignedTo: ticket.assignedTo?.FullName || 'Not Assigned',
        CreatedAt: new Date(ticket.createdAt).toLocaleString(),
        ClosedAt: ticket.closedAt ? new Date(ticket.closedAt).toLocaleString() : 'N/A',
      }));

      const csv = Papa.unparse(csvData);
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);

      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', 'filtered_tickets_report.csv');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('CSV export failed', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleExportCSV}
      disabled={loading}
      className={`bg-green-600 text-black ml-1.5 px-4 py-2 rounded hover:bg-green-700 ${loading && 'opacity-60 cursor-wait'}`}
    >
      {loading ? 'Exporting...' : 'Export Filtered CSV'}
    </button>
  );
}

export default ExportFilteredCsv;
