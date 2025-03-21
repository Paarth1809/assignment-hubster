import { Assignment, Classroom, UserProfile, LiveClass } from "./types";

// Local Storage Helpers
const getLocalStorage = <T>(key: string, defaultValue: T): T => {
  const storedValue = localStorage.getItem(key);
  return storedValue ? JSON.parse(storedValue) : defaultValue;
};

const setLocalStorage = <T>(key: string, value: T): void => {
  localStorage.setItem(key, JSON.stringify(value));
};

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
    // In a real app, we would add the user to the classroom here
    // For now, we'll just return the classroom
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

// User Profiles
const USER_PROFILE_STORAGE_KEY = 'user_profile';

// Initialize default user profile
export const initializeDefaultUser = (): UserProfile | null => {
  // Check if a user profile exists
  const storedProfile = localStorage.getItem(USER_PROFILE_STORAGE_KEY);
  if (storedProfile) {
    return JSON.parse(storedProfile);
  }

  return null;
};

// Get current user profile
export const getCurrentUser = (): UserProfile | null => {
  const storedProfile = localStorage.getItem(USER_PROFILE_STORAGE_KEY);
  return storedProfile ? JSON.parse(storedProfile) : null;
};

// Save user profile
export const saveUserProfile = (profile: UserProfile): void => {
  localStorage.setItem(USER_PROFILE_STORAGE_KEY, JSON.stringify(profile));
};

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
    points: assignmentData.points
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

// Delete an assignment
export const deleteAssignment = (assignmentId: string): void => {
  const assignments = getAssignments();
  const filteredAssignments = assignments.filter(a => a.id !== assignmentId);
  setLocalStorage(ASSIGNMENTS_STORAGE_KEY, filteredAssignments);
};

// Live Classes
const LIVE_CLASSES_STORAGE_KEY = 'classroom_live_classes';

// Initialize live classes
export const initializeLiveClasses = () => {
  if (!localStorage.getItem(LIVE_CLASSES_STORAGE_KEY)) {
    localStorage.setItem(LIVE_CLASSES_STORAGE_KEY, JSON.stringify([]));
  }
  return getLiveClasses();
};

// Get all live classes
export const getLiveClasses = (): LiveClass[] => {
  const liveClasses = localStorage.getItem(LIVE_CLASSES_STORAGE_KEY);
  return liveClasses ? JSON.parse(liveClasses) : [];
};

// Get live classes for a specific classroom
export const getLiveClassesForClassroom = (classId: string): LiveClass[] => {
  const liveClasses = getLiveClasses();
  return liveClasses.filter(liveClass => liveClass.classId === classId);
};

// Create a new live class
export const createLiveClass = (liveClass: LiveClass): LiveClass => {
  const liveClasses = getLiveClasses();
  liveClasses.push(liveClass);
  localStorage.setItem(LIVE_CLASSES_STORAGE_KEY, JSON.stringify(liveClasses));
  return liveClass;
};

// Update a live class
export const updateLiveClass = (updatedLiveClass: LiveClass): LiveClass => {
  const liveClasses = getLiveClasses();
  const index = liveClasses.findIndex(lc => lc.id === updatedLiveClass.id);
  
  if (index !== -1) {
    liveClasses[index] = updatedLiveClass;
    localStorage.setItem(LIVE_CLASSES_STORAGE_KEY, JSON.stringify(liveClasses));
  }
  
  return updatedLiveClass;
};

// Delete a live class
export const deleteLiveClass = (liveClassId: string): void => {
  const liveClasses = getLiveClasses();
  const filteredLiveClasses = liveClasses.filter(lc => lc.id !== liveClassId);
  localStorage.setItem(LIVE_CLASSES_STORAGE_KEY, JSON.stringify(filteredLiveClasses));
};

// Initialize the app with some default data
export const initializeAppData = () => {
  // Initialize classrooms
  initializeClassrooms();

  // Initialize assignments
  initializeAssignments();
  
    // Initialize default user if not authenticated
    initializeDefaultUser();
  
  // Initialize live classes
  initializeLiveClasses();
};
