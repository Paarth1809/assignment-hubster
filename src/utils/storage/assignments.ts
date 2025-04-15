
import { Assignment } from "../types";
import { getLocalStorage, setLocalStorage } from "./base";

// Assignments
const ASSIGNMENTS_STORAGE_KEY = 'assignments';

// Initialize assignments
export const initializeAssignments = (): Assignment[] => {
  if (!localStorage.getItem(ASSIGNMENTS_STORAGE_KEY)) {
    localStorage.setItem(ASSIGNMENTS_STORAGE_KEY, JSON.stringify([]));
  }
  return getAssignments();
};

// Get all assignments
export const getAssignments = (): Assignment[] => {
  return getLocalStorage<Assignment[]>(ASSIGNMENTS_STORAGE_KEY, []);
};

// Get assignments for a specific class
export const getAssignmentsForClass = (classId: string): Assignment[] => {
  const assignments = getAssignments();
  return assignments.filter(assignment => assignment.classId === classId);
};

// Check if an assignment is past due
export const isAssignmentPastDue = (assignment: Assignment): boolean => {
  if (!assignment.dueDate) return false;
  
  const now = new Date();
  const dueDate = new Date(assignment.dueDate);
  
  return now > dueDate;
};

// Check if submissions are allowed for an assignment
export const isSubmissionAllowed = (assignment: Assignment): boolean => {
  // If assignment is locked, submission is not allowed
  if (assignment.locked) return false;
  
  // If there's no due date, submission is allowed
  if (!assignment.dueDate) return true;
  
  // If the assignment allows late submissions, submission is always allowed
  if (assignment.allowLateSubmissions) return true;
  
  // Otherwise, check if it's past the due date
  return !isAssignmentPastDue(assignment);
};

// Create a new assignment
export const createAssignment = (assignment: Assignment): Assignment => {
  const assignments = getAssignments();
  assignments.push(assignment);
  setLocalStorage(ASSIGNMENTS_STORAGE_KEY, assignments);
  return assignment;
};

// Save an assignment from form data
export const saveAssignment = (assignmentData: any): Assignment => {
  // Generate a random ID if one doesn't exist
  const id = assignmentData.id || Math.random().toString(36).substring(2, 10);
  
  const newAssignment: Assignment = {
    id,
    title: assignmentData.title,
    description: assignmentData.description,
    fileName: assignmentData.fileName,
    fileSize: assignmentData.fileSize,
    fileType: assignmentData.fileType,
    dateSubmitted: assignmentData.dateSubmitted || new Date().toISOString(),
    status: assignmentData.status || 'pending',
    classId: assignmentData.classId,
    dueDate: assignmentData.dueDate,
    dueTime: assignmentData.dueTime,
    allowLateSubmissions: assignmentData.allowLateSubmissions,
    locked: assignmentData.locked,
    points: assignmentData.points,
    studentId: assignmentData.studentId
  };
  
  if (assignmentData.id) {
    // Update existing assignment
    return updateAssignment(newAssignment);
  } else {
    // Create new assignment
    return createAssignment(newAssignment);
  }
};

// Update an assignment
export const updateAssignment = (updatedAssignment: Assignment): Assignment => {
  const assignments = getAssignments();
  const index = assignments.findIndex(a => a.id === updatedAssignment.id);
  if (index !== -1) {
    assignments[index] = updatedAssignment;
    setLocalStorage(ASSIGNMENTS_STORAGE_KEY, assignments);
  }
  return updatedAssignment;
};

// Delete an assignment
export const deleteAssignment = (assignmentId: string): void => {
  const assignments = getAssignments();
  const filteredAssignments = assignments.filter(a => a.id !== assignmentId);
  setLocalStorage(ASSIGNMENTS_STORAGE_KEY, filteredAssignments);
};
