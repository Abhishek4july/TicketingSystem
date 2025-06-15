import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Spinner from './Spinner';

const AvgResolutionTimeCard = () => {
  const [avgTime, setAvgTime] = useState(0);
  const [loading,setLoading]=useState(true);

  useEffect(() => {
    axios.get(`${import.meta.env.VITE_API_URL}/api/v1/admin/analytics`).then(res => {
      setAvgTime(res.data.data.avgResolutionTimeHours);
      setLoading(false)
    });
  }, []);

  return (
    
      !loading ?(
            <div className="w-full bg-gray-600 p-6 shadow rounded-xl">
      <h2 className="text-xl font-semibold mb-2">Average Resolution Time</h2>
      <p className="text-3xl font-bold text-indigo-600">
        {avgTime} hrs
      </p>
    </div>
    ):<Spinner/>
  
  );
};

export default AvgResolutionTimeCard;
