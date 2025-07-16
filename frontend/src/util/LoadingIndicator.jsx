// Spinner.js
import React from 'react';

function LoadingIndicator () {
  return (
    <div className="flex items-center justify-center">
      <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-blue-500"></div>
    </div>
  );
};

export default LoadingIndicator;
