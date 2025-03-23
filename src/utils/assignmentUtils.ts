
import { Assignment } from "./types";

// Format date function
export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  
  // Format date with time
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    hour12: true
  }).format(date);
};

// Format file size function
export const formatFileSize = (bytes: number): string => {
  if (bytes < 1024) return bytes + ' bytes';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
};

// Get status color function
export const getStatusColor = (status: Assignment['status']): string => {
  switch (status) {
    case 'submitted':
      return 'text-blue-500 bg-blue-50 dark:bg-blue-900/20';
    case 'graded':
      return 'text-green-500 bg-green-50 dark:bg-green-900/20';
    case 'pending':
      return 'text-yellow-500 bg-yellow-50 dark:bg-yellow-900/20';
    default:
      return 'text-gray-500 bg-gray-50 dark:bg-gray-900/20';
  }
};
