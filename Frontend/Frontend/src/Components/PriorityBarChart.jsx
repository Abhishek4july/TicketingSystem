import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from "recharts";

const DEFAULT_COLORS = [
  "#ef4444", // Red
  "#f59e0b", // Amber
  "#22c55e", // Green
  "#3b82f6", // Blue
  "#a855f7", // Purple
  "#14b8a6", // Teal
  "#6b7280", // Gray
];

const PriorityBarChart = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPriorityData = async () => {
      try {
        const response = await axios.get("/api/v1/admin/analytics");
        const ticketsByPriority = response.data.data.ticketsByPriority;

        const formattedData = Object.entries(ticketsByPriority).map(
          ([name, value], index) => ({
            name,
            value,
            fill: DEFAULT_COLORS[index % DEFAULT_COLORS.length],
          })
        );

        setData(formattedData);
      } catch (error) {
        console.error("Error fetching priority data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPriorityData();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-80">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="w-full h-96 bg-gray-700 p-4 shadow rounded-xl">
      <h2 className="text-xl font-semibold mb-4">Tickets by Priority</h2>
      <ResponsiveContainer width="100%" height="85%">
        <BarChart
          data={data}
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
        >
         <XAxis 
          dataKey="name" 
           interval={0} 
          angle={-30} 
          textAnchor="end" 
         height={60}
          />
          <YAxis allowDecimals={false} />
          <Tooltip />
          <Legend />
          <Bar dataKey="value" name="Count">
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.fill} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default PriorityBarChart;
