
import { Classroom, LiveClass } from './types';
import { getClassrooms, getCurrentUser, getLiveClasses } from './storage';

// Get classrooms the current user is enrolled in
export function getUserClassrooms(): Classroom[] {
  return getClassrooms().filter(classroom => {
    const user = getCurrentUser();
    return user && user.enrolledClasses.includes(classroom.id);
  });
}

// Get upcoming live classes for the user's classrooms
export function getUpcomingLiveClasses(classrooms: Classroom[]): LiveClass[] {
  const allLiveClasses = getLiveClasses();
  return allLiveClasses.filter(liveClass => {
    return (liveClass.status === 'scheduled' || liveClass.status === 'live') && 
           classrooms.some(classroom => classroom.id === liveClass.classId);
  }).sort((a, b) => new Date(a.scheduledStart).getTime() - new Date(b.scheduledStart).getTime());
}
