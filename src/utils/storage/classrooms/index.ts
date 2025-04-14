
import { initializeClassrooms } from './initialize';
import { getClassrooms, getClassroomById, getClassroomByCode } from './getClassrooms';
import { createClassroom, saveClassroom, updateClassroom, deleteClassroom } from './manageClassrooms';
import { joinClassroom, leaveClassroom, getUserClassrooms } from './enrollment';

// Re-export all functions
export {
  // Initialization
  initializeClassrooms,
  
  // Reading classrooms
  getClassrooms,
  getClassroomById,
  getClassroomByCode,
  
  // Managing classrooms
  createClassroom,
  saveClassroom,
  updateClassroom,
  deleteClassroom,
  
  // Enrollment
  joinClassroom,
  leaveClassroom,
  getUserClassrooms
};
