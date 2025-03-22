
import React from 'react';

const EmptyAssignments = () => {
  return (
    <div className="text-center py-12 bg-[#1A1A1A] border border-[#2A2A2A] rounded-xl">
      <svg 
        xmlns="http://www.w3.org/2000/svg" 
        width="48" 
        height="48" 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="1.5" 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        className="mx-auto text-gray-500 mb-4"
      >
        <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="8" y1="13" x2="16" y2="13" />
        <line x1="8" y1="17" x2="16" y2="17" />
        <line x1="8" y1="9" x2="10" y2="9" />
      </svg>
      <h3 className="text-lg font-medium text-white">No assignments yet</h3>
      <p className="text-gray-400 mt-1 mb-6 max-w-md mx-auto">
        There are no assignments in this class yet. Create your first assignment to get started.
      </p>
    </div>
  );
};

export default EmptyAssignments;
