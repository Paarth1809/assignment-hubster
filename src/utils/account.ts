
import { UserProfile, Classroom, LiveClass } from "./types";
import { getCurrentUser } from "./storage";
import { getLiveClasses } from "./storage/liveClasses";

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

// Get upcoming live classes for a collection of classrooms
export const getUpcomingLiveClasses = async (classrooms: Classroom[]): Promise<LiveClass[]> => {
  // Get all live classes
  const allLiveClasses = getLiveClasses();
  const now = new Date();
  
  // Filter to only include upcoming classes for the provided classrooms
  return allLiveClasses.filter(liveClass => {
    // Check if class belongs to one of the user's classrooms
    const isUserClassroom = classrooms.some(classroom => classroom.id === liveClass.classId);
    
    // Check if the class is scheduled in the future or currently ongoing
    const scheduledStart = new Date(liveClass.scheduledStart);
    const isUpcoming = scheduledStart >= now || liveClass.status === 'live';
    
    return isUserClassroom && isUpcoming;
  });
};

// Helper function to get all user classrooms (both as teacher and student)
export const getUserClassrooms = async (): Promise<Classroom[]> => {
  // This would normally fetch from a database or API
  // For simplicity, we're using mock data
  const allClassrooms: Classroom[] = []; // Replace with actual data source
  
  const currentUser = getCurrentUser();
  if (!currentUser) return [];
  
  const teacherClasses = await getTeacherClassrooms(allClassrooms);
  const studentClasses = await getStudentClassrooms(allClassrooms);
  
  // Combine both types of classrooms
  return [...teacherClasses, ...studentClasses];
};
