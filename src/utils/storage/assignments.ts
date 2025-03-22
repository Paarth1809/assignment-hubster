
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

// Create a new assignment
export const createAssignment = (assignment: Assignment): Assignment => {
  const assignments = getAssignments();
  assignments.push(assignment);
  setLocalStorage(ASSIGNMENTS_STORAGE_KEY, assignments);
  return assignment;
};

// Save an assignment from form data
export const saveAssignment = (assignmentData: any): Assignment => {
  // Generate a random ID
  const id = Math.random().toString(36).substring(2, 10);
  
  const newAssignment: Assignment = {
    id,
    title: assignmentData.title,
    description: assignmentData.description,
    fileName: assignmentData.fileName,
    fileSize: assignmentData.fileSize,
    fileType: assignmentData.fileType,
    dateSubmitted: new Date().toISOString(),
    status: 'pending',
    classId: assignmentData.classId,
    dueDate: assignmentData.dueDate,
    points: assignmentData.points,
    locked: false
  };
  
  return createAssignment(newAssignment);
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

// Lock an assignment
export const lockAssignment = (assignmentId: string): Assignment | null => {
  const assignments = getAssignments();
  const index = assignments.findIndex(a => a.id === assignmentId);
  if (index !== -1) {
    assignments[index].locked = true;
    setLocalStorage(ASSIGNMENTS_STORAGE_KEY, assignments);
    return assignments[index];
  }
  return null;
};

// Unlock an assignment
export const unlockAssignment = (assignmentId: string): Assignment | null => {
  const assignments = getAssignments();
  const index = assignments.findIndex(a => a.id === assignmentId);
  if (index !== -1) {
    assignments[index].locked = false;
    setLocalStorage(ASSIGNMENTS_STORAGE_KEY, assignments);
    return assignments[index];
  }
  return null;
};

// Check if an assignment is past due date
export const isAssignmentPastDue = (assignment: Assignment): boolean => {
  if (!assignment.dueDate) return false;
  
  const dueDate = new Date(assignment.dueDate);
  const currentDate = new Date();
  
  return currentDate > dueDate;
};

// Delete an assignment
export const deleteAssignment = (assignmentId: string): void => {
  const assignments = getAssignments();
  const filteredAssignments = assignments.filter(a => a.id !== assignmentId);
  setLocalStorage(ASSIGNMENTS_STORAGE_KEY, filteredAssignments);
};
