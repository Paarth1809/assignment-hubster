
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
  const id = Math.random().toString(36).substring(2, 10);
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

// Get classrooms for the current user based on their enrolledClasses
export const getUserClassrooms = (): Classroom[] => {
  const user = getCurrentUser();
  if (!user || !user.enrolledClasses || user.enrolledClasses.length === 0) {
    return [];
  }
  
  const allClassrooms = getClassrooms();
  return allClassrooms.filter(classroom => user.enrolledClasses.includes(classroom.id));
};

// Join a classroom
export const joinClassroom = (code: string, userId: string): Classroom | null => {
  const classrooms = getClassrooms();
  const classroom = classrooms.find(c => c.enrollmentCode === code);
  
  if (classroom) {
    // Update the user's enrolledClasses to include this classroom
    const currentUser = getCurrentUser();
    if (currentUser) {
      // Make sure enrolledClasses exists and doesn't already include this class
      if (!currentUser.enrolledClasses) {
        currentUser.enrolledClasses = [];
      }
      
      if (!currentUser.enrolledClasses.includes(classroom.id)) {
        currentUser.enrolledClasses.push(classroom.id);
        saveUserProfile(currentUser);
      }
    }
    
    return classroom;
  }
  
  return null;
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
