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

// Optional: define fallback colors for dynamic tag names
const TAG_COLORS = [
  "#3b82f6", // blue
  "#10b981", // green
  "#f59e0b", // amber
  "#ef4444", // red
  "#8b5cf6", // purple
  "#ec4899", // pink
  "#0ea5e9", // sky
  "#14b8a6", // teal
  "#eab308", // yellow
];

const TagsBarChart = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tagKeys, setTagKeys] = useState([]);

  useEffect(() => {
    const fetchTagsData = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/v1/admin/analytics`,
          {withCredentials:true}
        );
        const tagsData = response.data.data.ticketsByTag || {};

        const tagNames = Object.keys(tagsData);
        const tagCounts = Object.values(tagsData);

        const formatted = [
          tagNames.reduce((acc, tag) => {
            acc[tag] = tagsData[tag];
            return acc;
          }, { category: "Tags" }),
        ];

        setTagKeys(tagNames);
        setData(formatted);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching tags data:", error);
        setLoading(false);
      }
    };

    fetchTagsData();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-80">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="w-full h-80 bg-blue-950 p-4 shadow rounded-xl">
      <h2 className="text-xl text-blue-400 font-semibold mb-4">Tickets by Tags</h2>
      <ResponsiveContainer width="100%" height="85%">
        <BarChart data={data}>
          <XAxis dataKey="category" />
          <YAxis allowDecimals={false} />
          <Tooltip />
          <Legend />
          {tagKeys.map((tag, index) => (
            <Bar
              key={tag}
              dataKey={tag}
              name={tag}
              fill={TAG_COLORS[index % TAG_COLORS.length]}
            />
          ))}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default TagsBarChart;
