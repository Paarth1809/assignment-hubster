
import { Classroom, UserProfile } from "../types";
import { getLocalStorage, setLocalStorage } from "./base";
import { getCurrentUser, saveUserProfile } from "./users";

// Classrooms
const CLASSROOMS_STORAGE_KEY = 'classrooms';

// Initialize classrooms
export const initializeClassrooms = (): Classroom[] => {
  if (!localStorage.getItem(CLASSROOMS_STORAGE_KEY)) {
    localStorage.setItem(CLASSROOMS_STORAGE_KEY, JSON.stringify([]));
  }
  return getClassrooms();
};

// Get all classrooms
export const getClassrooms = (): Classroom[] => {
  return getLocalStorage<Classroom[]>(CLASSROOMS_STORAGE_KEY, []);
};

// Get classroom by ID
export const getClassroomById = (id: string): Classroom | undefined => {
  const classrooms = getClassrooms();
  return classrooms.find(classroom => classroom.id === id);
};

// Create a new classroom
export const createClassroom = (classroom: Classroom): Classroom => {
  const classrooms = getClassrooms();
  classrooms.push(classroom);
  setLocalStorage(CLASSROOMS_STORAGE_KEY, classrooms);
  return classroom;
};

// Save a classroom from form data
export const saveClassroom = (formData: any): Classroom => {
  // Generate a random ID
  const id = crypto.randomUUID();
  // Generate a random enrollment code (6 characters, uppercase)
  const enrollmentCode = Math.random().toString(36).substring(2, 8).toUpperCase();
  
  const newClassroom: Classroom = {
    id,
    name: formData.name,
    section: formData.section || undefined,
    subject: formData.subject || undefined,
    description: formData.description || undefined,
    createdAt: new Date().toISOString(),
    teacherName: formData.teacherName || "Teacher",
    enrollmentCode,
  };
  
  return createClassroom(newClassroom);
};

// Join a classroom by code
export const joinClassroom = (code: string): Classroom | null => {
  // Normalize the code to uppercase for consistent matching
  const normalizedCode = code.toUpperCase().trim();
  
  const classrooms = getClassrooms();
  const classroom = classrooms.find(c => c.enrollmentCode === normalizedCode);
  
  if (classroom) {
    // Get the current user
    const user = getCurrentUser();
    
    if (user) {
      // Make sure enrolledClasses is initialized
      if (!user.enrolledClasses) {
        user.enrolledClasses = [];
      }
      
      // Check if the user is already enrolled in this class
      if (!user.enrolledClasses.includes(classroom.id)) {
        // Add classroom to user's enrolled classes
        user.enrolledClasses.push(classroom.id);
        
        // Save updated user profile
        saveUserProfile(user);
      }
    } else {
      console.error("Cannot join classroom: No user profile found");
    }
    
    return classroom;
  }
  
  return null;
};

// Get classrooms for the current user
export const getUserClassrooms = (): Classroom[] => {
  const classrooms = getClassrooms();
  const user = getCurrentUser();
  
  if (!user) {
    return [];
  }
  
  // Return all classrooms for teachers
  if (user.role === 'teacher') {
    return classrooms;
  }
  
  // For students, return only enrolled classrooms
  if (user.enrolledClasses && user.enrolledClasses.length > 0) {
    return classrooms.filter(classroom => user.enrolledClasses.includes(classroom.id));
  }
  
  return [];
};

// Update a classroom
export const updateClassroom = (updatedClassroom: Classroom): Classroom => {
  const classrooms = getClassrooms();
  const index = classrooms.findIndex(c => c.id === updatedClassroom.id);
  if (index !== -1) {
    classrooms[index] = updatedClassroom;
    setLocalStorage(CLASSROOMS_STORAGE_KEY, classrooms);
  }
  return updatedClassroom;
};

// Delete a classroom
export const deleteClassroom = (classroomId: string): void => {
  const classrooms = getClassrooms();
  const filteredClassrooms = classrooms.filter(c => c.id !== classroomId);
  setLocalStorage(CLASSROOMS_STORAGE_KEY, filteredClassrooms);
};

// Find a classroom by enrollment code
export const getClassroomByCode = (code: string): Classroom | undefined => {
  const classrooms = getClassrooms();
  return classrooms.find(classroom => classroom.enrollmentCode === code.toUpperCase().trim());
};

// Leave a classroom
export const leaveClassroom = (classroomId: string): void => {
  const user = getCurrentUser();
  
  if (user && user.enrolledClasses) {
    // Remove the classroom from the user's enrolled classes
    user.enrolledClasses = user.enrolledClasses.filter(id => id !== classroomId);
    
    // Save updated user profile
    saveUserProfile(user);
  }
};
