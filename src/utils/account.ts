
import { UserProfile, Classroom } from "./types";
import { getCurrentUser } from "./storage";

// Get classrooms created by the current user (as a teacher)
export const getTeacherClassrooms = async (allClassrooms: Classroom[]): Promise<Classroom[]> => {
  const currentUser = getCurrentUser();
  if (!currentUser) return [];
  
  // Filter classrooms where the user is the teacher (based on naming convention)
  return allClassrooms.filter(classroom => 
    classroom.teacherName.toLowerCase() === currentUser.name.toLowerCase()
  );
};

// Get classrooms that the user is enrolled in (as a student)
export const getStudentClassrooms = async (allClassrooms: Classroom[]): Promise<Classroom[]> => {
  const currentUser = getCurrentUser();
  if (!currentUser || !currentUser.enrolledClasses) return [];
  
  // Filter classrooms that the user is enrolled in
  return allClassrooms.filter(classroom => 
    currentUser.enrolledClasses.includes(classroom.id)
  );
};
