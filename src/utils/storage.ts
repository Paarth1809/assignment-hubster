
import { Assignment, Classroom, UserProfile } from './types';

// Get assignments from local storage
export const getAssignments = (classId?: string): Assignment[] => {
  const assignments = localStorage.getItem('assignments');
  const parsedAssignments = assignments ? JSON.parse(assignments) : [];
  
  if (classId) {
    return parsedAssignments.filter((assignment: Assignment) => assignment.classId === classId);
  }
  
  return parsedAssignments;
};

// Save assignment to local storage
export const saveAssignment = (assignment: Omit<Assignment, 'id' | 'dateSubmitted' | 'status'>) => {
  const assignments = getAssignments();
  
  const newAssignment: Assignment = {
    ...assignment,
    id: Date.now().toString(),
    dateSubmitted: new Date().toISOString(),
    status: 'submitted'
  };
  
  localStorage.setItem('assignments', JSON.stringify([newAssignment, ...assignments]));
  return newAssignment;
};

// Update assignment status
export const updateAssignmentStatus = (id: string, status: Assignment['status'], feedback?: string, grade?: string) => {
  const assignments = getAssignments();
  const updatedAssignments = assignments.map(assignment => 
    assignment.id === id ? { ...assignment, status, feedback, grade } : assignment
  );
  
  localStorage.setItem('assignments', JSON.stringify(updatedAssignments));
};

// Delete assignment
export const deleteAssignment = (id: string) => {
  const assignments = getAssignments();
  const updatedAssignments = assignments.filter(assignment => assignment.id !== id);
  
  localStorage.setItem('assignments', JSON.stringify(updatedAssignments));
};

// Get classrooms from local storage
export const getClassrooms = (): Classroom[] => {
  const classrooms = localStorage.getItem('classrooms');
  return classrooms ? JSON.parse(classrooms) : [];
};

// Save classroom to local storage
export const saveClassroom = (classroom: Omit<Classroom, 'id' | 'createdAt' | 'enrollmentCode'>) => {
  const classrooms = getClassrooms();
  
  const enrollmentCode = generateEnrollmentCode();
  
  const newClassroom: Classroom = {
    ...classroom,
    id: Date.now().toString(),
    createdAt: new Date().toISOString(),
    enrollmentCode
  };
  
  localStorage.setItem('classrooms', JSON.stringify([newClassroom, ...classrooms]));
  return newClassroom;
};

// Delete classroom
export const deleteClassroom = (id: string) => {
  const classrooms = getClassrooms();
  const updatedClassrooms = classrooms.filter(classroom => classroom.id !== id);
  
  localStorage.setItem('classrooms', JSON.stringify(updatedClassrooms));
  
  // Also delete all assignments for this classroom
  const assignments = getAssignments();
  const updatedAssignments = assignments.filter(assignment => assignment.classId !== id);
  
  localStorage.setItem('assignments', JSON.stringify(updatedAssignments));
};

// Generate enrollment code
const generateEnrollmentCode = (): string => {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = '';
  for (let i = 0; i < 7; i++) {
    code += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return code;
};

// Join classroom with enrollment code
export const joinClassroom = (enrollmentCode: string, userId: string): Classroom | null => {
  const classrooms = getClassrooms();
  const classroom = classrooms.find(c => c.enrollmentCode === enrollmentCode);
  
  if (classroom) {
    // Update user profile
    const userProfile = getCurrentUser();
    if (userProfile && !userProfile.enrolledClasses.includes(classroom.id)) {
      userProfile.enrolledClasses.push(classroom.id);
      saveUserProfile(userProfile);
    }
    return classroom;
  }
  
  return null;
};

// Get user profile
export const getCurrentUser = (): UserProfile | null => {
  const userProfile = localStorage.getItem('currentUser');
  return userProfile ? JSON.parse(userProfile) : null;
};

// Save user profile
export const saveUserProfile = (profile: UserProfile) => {
  localStorage.setItem('currentUser', JSON.stringify(profile));
  return profile;
};

// Create default user if none exists
export const initializeDefaultUser = () => {
  const currentUser = getCurrentUser();
  if (!currentUser) {
    const defaultUser: UserProfile = {
      id: "user1",
      name: "Demo User",
      email: "demo@example.com",
      role: "teacher",
      enrolledClasses: []
    };
    saveUserProfile(defaultUser);
    return defaultUser;
  }
  return currentUser;
};

// Get classroom by ID
export const getClassroomById = (id: string): Classroom | undefined => {
  const classrooms = getClassrooms();
  return classrooms.find(classroom => classroom.id === id);
};
