
import { Classroom } from "../../types";
import { getLocalStorage, setLocalStorage } from "../base";
import { getCurrentUser, saveUserProfile } from "../users";
import { supabase } from "@/integrations/supabase/client";
import { CLASSROOMS_STORAGE_KEY } from "./initialize";
import { getClassroomByCode } from "./getClassrooms";

// Join a classroom by code
export const joinClassroom = async (code: string, userId: string): Promise<Classroom | null> => {
  // Normalize the code to uppercase for consistent matching
  const normalizedCode = code.toUpperCase().trim();
  
  try {
    // Find classroom by enrollment code
    const classroom = await getClassroomByCode(normalizedCode);
    
    if (classroom) {
      // Check if user is already enrolled
      const { data: enrollment, error: enrollmentError } = await supabase
        .from('user_enrollments')
        .select('*')
        .eq('user_id', userId)
        .eq('classroom_id', classroom.id)
        .single();
      
      if (!enrollmentError && enrollment) {
        console.log(`User ${userId} is already enrolled in classroom ${classroom.id}`);
      } else {
        // Enroll user in classroom
        const { error: insertError } = await supabase
          .from('user_enrollments')
          .insert({
            user_id: userId,
            classroom_id: classroom.id
          });
        
        if (insertError) {
          console.error("Error enrolling user in classroom:", insertError);
        } else {
          console.log(`User ${userId} joined classroom ${classroom.id}`);
        }
      }
      
      return classroom;
    }
  } catch (error) {
    console.error("Error joining classroom:", error);
  }
  
  // Fallback to local storage
  const classrooms = getLocalStorage<Classroom[]>(CLASSROOMS_STORAGE_KEY, []);
  const classroom = classrooms.find(c => c.enrollmentCode === normalizedCode);
  
  if (classroom) {
    // Also update local enrollment
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
        
        console.log(`User ${userId} joined classroom ${classroom.id}`);
      } else {
        console.log(`User ${userId} is already enrolled in classroom ${classroom.id}`);
      }
    } else {
      console.error("Cannot join classroom: No user profile found");
    }
    
    return classroom;
  }
  
  console.error(`No classroom found with enrollment code: ${normalizedCode}`);
  return null;
};

// Get classrooms for the current user based on teacher ID or enrollment
export const getUserClassrooms = async (): Promise<Classroom[]> => {
  try {
    const session = await supabase.auth.getSession();
    if (session.data.session) {
      const userId = session.data.session.user.id;
      
      // 1. Get classrooms where user is teacher
      const { data: teacherClassrooms, error: teacherError } = await supabase
        .from('classrooms')
        .select('*')
        .eq('teacher_id', userId);
      
      if (teacherError) throw teacherError;
      
      // 2. Get classrooms where user is enrolled
      const { data: enrollments, error: enrollmentError } = await supabase
        .from('user_enrollments')
        .select('classroom_id')
        .eq('user_id', userId);
        
      if (enrollmentError) throw enrollmentError;
      
      // 3. Fetch enrolled classrooms if there are any enrollments
      let enrolledClassrooms: any[] = [];
      if (enrollments && enrollments.length > 0) {
        const classroomIds = enrollments.map(e => e.classroom_id);
        
        const { data, error } = await supabase
          .from('classrooms')
          .select('*')
          .in('id', classroomIds);
          
        if (error) throw error;
        enrolledClassrooms = data || [];
      }
      
      // 4. Combine and map to Classroom type
      const allClassrooms = [...(teacherClassrooms || []), ...enrolledClassrooms];
      
      const classrooms = allClassrooms.map(c => ({
        id: c.id,
        name: c.name,
        section: c.section || undefined,
        subject: c.subject || undefined,
        description: c.description || undefined,
        createdAt: c.created_at,
        teacherName: c.teacher_name,
        enrollmentCode: c.enrollment_code,
      }));
      
      // Update local storage
      setLocalStorage(CLASSROOMS_STORAGE_KEY, classrooms);
      
      return classrooms;
    }
  } catch (error) {
    console.error("Error fetching user classrooms:", error);
  }
  
  // Fallback to local storage
  return getLocalStorage<Classroom[]>(CLASSROOMS_STORAGE_KEY, []);
};

// Leave a classroom
export const leaveClassroom = async (classroomId: string): Promise<void> => {
  try {
    const session = await supabase.auth.getSession();
    if (session.data.session) {
      const userId = session.data.session.user.id;
      
      const { error } = await supabase
        .from('user_enrollments')
        .delete()
        .eq('user_id', userId)
        .eq('classroom_id', classroomId);
      
      if (error) throw error;
    }
  } catch (error) {
    console.error(`Error leaving classroom ${classroomId}:`, error);
  }
  
  // Also update local storage
  const user = getCurrentUser();
  
  if (user && user.enrolledClasses) {
    // Remove the classroom from the user's enrolled classes
    user.enrolledClasses = user.enrolledClasses.filter(id => id !== classroomId);
    
    // Save updated user profile
    saveUserProfile(user);
  }
};
