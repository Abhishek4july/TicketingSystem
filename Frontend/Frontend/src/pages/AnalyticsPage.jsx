import React from 'react';
import OpenClosedChart from '../Components/OpenClosedChart.jsx';
import PriorityBarChart from '../Components/PriorityBarChart.jsx';
import TagsBarChart from '../Components/TagsBarChart.jsx';
import AvgResolutionTimeCard from '../Components/AvgResolutionTimeCard.jsx';

const AnalyticsPage = () => {
  return (
    <div className="p-6 mt-4 mx-auto max-w-7xl text-center">
      <h1 className="text-2xl text-white font-bold mb-6">Ticket Analytics</h1>

      {/* Responsive layout: column on mobile, row on md+ */}
      <div className="flex flex-col md:flex-row md:flex-wrap md:gap-6 space-y-6 md:space-y-0 justify-center">
        <div className="w-full md:w-[48%] xl:w-[32%]">
          <OpenClosedChart />
        </div>
        <div className="w-full md:w-[48%] xl:w-[32%]">
          <PriorityBarChart />
        </div>
        <div className="w-full md:w-[48%] xl:w-[32%]">
          <TagsBarChart />
        </div>
        <div className="w-full md:w-[48%] xl:w-[32%]">
          <AvgResolutionTimeCard />
        </div>
      </div>
    </div>
  );
};

export default AnalyticsPage;
