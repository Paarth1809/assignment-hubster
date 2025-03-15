
import React from 'react';

const AssignmentSkeleton = () => {
  return (
    <div className="space-y-4">
      {[...Array(3)].map((_, index) => (
        <div key={index} className="animate-pulse space-y-3 glass rounded-xl p-4">
          <div className="h-6 bg-gray-200 dark:bg-gray-800 rounded w-3/4"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-1/2"></div>
          <div className="flex space-x-4 pt-2">
            <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-1/4"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-1/4"></div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default AssignmentSkeleton;
