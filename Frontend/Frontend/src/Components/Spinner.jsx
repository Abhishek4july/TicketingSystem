// Spinner.jsx
import React from 'react';

const Spinner = ({ size = 'w-12 h-12', color = 'border-cyan-400' }) => (
  <div className="flex justify-center items-center">
    <div
      className={`animate-spin rounded-full border-4 border-t-transparent ${size} ${color}`}
      role="status"
    >
      <span className="sr-only">Loading...</span>
    </div>
  </div>
);

export default Spinner;
