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

// Check if an assignment is past due
export const isAssignmentPastDue = (assignment: Assignment): boolean => {
  if (!assignment.dueDate) return false;
  
  const now = new Date();
  const dueDate = new Date(assignment.dueDate);
  
  return now > dueDate;
};

// Check if an assignment is locked
export const isAssignmentLocked = (assignment: Assignment): boolean => {
  return assignment.locked === true;
};

// Check if submissions are allowed for an assignment
export const canSubmitAssignment = (assignment: Assignment): boolean => {
  // If assignment is locked, submission is not allowed
  if (isAssignmentLocked(assignment)) return false;
  
  // If there's no due date, submission is allowed
  if (!assignment.dueDate) return true;
  
  // If the assignment allows late submissions, submission is always allowed
  if (assignment.allowLateSubmissions) return true;
  
  // Otherwise, check if it's past the due date
  return !isAssignmentPastDue(assignment);
};
