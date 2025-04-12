import { Classroom, UserProfile } from "../types";
import { getLocalStorage, setLocalStorage } from "./base";
import { getCurrentUser, saveUserProfile } from "./users";
import { supabase } from "@/integrations/supabase/client";

// Classrooms
const CLASSROOMS_STORAGE_KEY = 'classrooms';

// Initialize classrooms
export const initializeClassrooms = async (): Promise<Classroom[]> => {
  if (!localStorage.getItem(CLASSROOMS_STORAGE_KEY)) {
    localStorage.setItem(CLASSROOMS_STORAGE_KEY, JSON.stringify([]));
  }
  return await getClassrooms();
};

// Get all classrooms
export const getClassrooms = async (): Promise<Classroom[]> => {
  try {
    // First try to get from Supabase if user is authenticated
    const session = await supabase.auth.getSession();
    if (session.data.session) {
      // Fetch classrooms where user is teacher
      const { data: teacherClassrooms, error: teacherError } = await supabase
        .from('classrooms')
        .select('*')
        .eq('teacher_id', session.data.session.user.id);

      if (teacherError) throw teacherError;

      // Fetch classrooms where user is enrolled
      const { data: enrollments, error: enrollmentError } = await supabase
        .from('user_enrollments')
        .select('classroom_id')
        .eq('user_id', session.data.session.user.id);

      if (enrollmentError) throw enrollmentError;

      // Get the enrolled classrooms if there are any enrollments
      let enrolledClassrooms: any[] = [];
      if (enrollments.length > 0) {
        const classroomIds = enrollments.map(e => e.classroom_id);
        const { data, error } = await supabase
          .from('classrooms')
          .select('*')
          .in('id', classroomIds);
        
        if (error) throw error;
        enrolledClassrooms = data || [];
      }

      // Convert Supabase data to match our Classroom type
      const classrooms = [...teacherClassrooms, ...enrolledClassrooms].map(c => ({
        id: c.id,
        name: c.name,
        section: c.section || undefined,
        subject: c.subject || undefined,
        description: c.description || undefined,
        createdAt: c.created_at,
        teacherName: c.teacher_name,
        enrollmentCode: c.enrollment_code,
      }));

      // Update local storage with latest data
      setLocalStorage(CLASSROOMS_STORAGE_KEY, classrooms);
      return classrooms;
    } 
  } catch (error) {
    console.error("Error fetching classrooms from Supabase:", error);
  }
  
  // Fallback to local storage if Supabase fetch fails or user is not authenticated
  return getLocalStorage<Classroom[]>(CLASSROOMS_STORAGE_KEY, []);
};

// Get classroom by ID
export const getClassroomById = async (id: string): Promise<Classroom | undefined> => {
  try {
    // Try to get from Supabase first
    const { data, error } = await supabase
      .from('classrooms')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    
    if (data) {
      return {
        id: data.id,
        name: data.name,
        section: data.section || undefined,
        subject: data.subject || undefined,
        description: data.description || undefined,
        createdAt: data.created_at,
        teacherName: data.teacher_name,
        enrollmentCode: data.enrollment_code,
      };
    }
  } catch (error) {
    console.error(`Error fetching classroom ${id} from Supabase:`, error);
  }
  
  // Fallback to local storage
  const classrooms = getLocalStorage<Classroom[]>(CLASSROOMS_STORAGE_KEY, []);
  return classrooms.find(classroom => classroom.id === id);
};

// Create a new classroom
export const createClassroom = async (classroom: Classroom): Promise<Classroom> => {
  try {
    const session = await supabase.auth.getSession();
    if (session.data.session) {
      // Insert into Supabase
      const { data, error } = await supabase
        .from('classrooms')
        .insert({
          id: classroom.id,
          name: classroom.name,
          section: classroom.section,
          subject: classroom.subject,
          description: classroom.description,
          teacher_name: classroom.teacherName,
          enrollment_code: classroom.enrollmentCode,
          teacher_id: session.data.session.user.id
        })
        .select()
        .single();
      
      if (error) throw error;
      
      // Update local storage
      const classrooms = getLocalStorage<Classroom[]>(CLASSROOMS_STORAGE_KEY, []);
      classrooms.push(classroom);
      setLocalStorage(CLASSROOMS_STORAGE_KEY, classrooms);
      
      return classroom;
    }
  } catch (error) {
    console.error("Error creating classroom in Supabase:", error);
  }
  
  // Fallback to local storage only
  const classrooms = getLocalStorage<Classroom[]>(CLASSROOMS_STORAGE_KEY, []);
  classrooms.push(classroom);
  setLocalStorage(CLASSROOMS_STORAGE_KEY, classrooms);
  return classroom;
};

// Save a classroom from form data
export const saveClassroom = async (formData: any): Promise<Classroom> => {
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

// Get classrooms for the current user based on their enrolledClasses
export const getUserClassrooms = async (): Promise<Classroom[]> => {
  // This function is now redundant as getClassrooms already handles this logic
  // but we keep it for compatibility
  return getClassrooms();
};

// Join a classroom by code
export const joinClassroom = async (code: string, userId: string): Promise<Classroom | null> => {
  // Normalize the code to uppercase for consistent matching
  const normalizedCode = code.toUpperCase().trim();
  
  try {
    // First check if classroom exists in Supabase
    const session = await supabase.auth.getSession();
    if (session.data.session) {
      // Find classroom by enrollment code
      const { data: classroom, error } = await supabase
        .from('classrooms')
        .select('*')
        .eq('enrollment_code', normalizedCode)
        .single();
      
      if (error) {
        console.error(`No classroom found with enrollment code: ${normalizedCode}`, error);
        return null;
      }
      
      if (classroom) {
        // Check if user is already enrolled
        const { data: enrollment, error: enrollmentError } = await supabase
          .from('user_enrollments')
          .select('*')
          .eq('user_id', session.data.session.user.id)
          .eq('classroom_id', classroom.id)
          .single();
        
        if (!enrollmentError && enrollment) {
          console.log(`User ${userId} is already enrolled in classroom ${classroom.id}`);
        } else {
          // Enroll user in classroom
          const { error: insertError } = await supabase
            .from('user_enrollments')
            .insert({
              user_id: session.data.session.user.id,
              classroom_id: classroom.id
            });
          
          if (insertError) {
            console.error("Error enrolling user in classroom:", insertError);
          } else {
            console.log(`User ${userId} joined classroom ${classroom.id}`);
          }
        }
        
        // Convert Supabase data to Classroom type
        return {
          id: classroom.id,
          name: classroom.name,
          section: classroom.section || undefined,
          subject: classroom.subject || undefined,
          description: classroom.description || undefined,
          createdAt: classroom.created_at,
          teacherName: classroom.teacher_name,
          enrollmentCode: classroom.enrollment_code,
        };
      }
    }
  } catch (error) {
    console.error("Error joining classroom:", error);
  }
  
  // Fallback to local storage
  const classrooms = getLocalStorage<Classroom[]>(CLASSROOMS_STORAGE_KEY, []);
  const classroom = classrooms.find(c => c.enrollmentCode === normalizedCode);
  
  if (classroom) {
    // Get the current user profile
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

// Find a classroom by enrollment code
export const getClassroomByCode = async (code: string): Promise<Classroom | undefined> => {
  try {
    // Try to get from Supabase first
    const { data, error } = await supabase
      .from('classrooms')
      .select('*')
      .eq('enrollment_code', code.toUpperCase().trim())
      .single();
    
    if (error) throw error;
    
    if (data) {
      return {
        id: data.id,
        name: data.name,
        section: data.section || undefined,
        subject: data.subject || undefined,
        description: data.description || undefined,
        createdAt: data.created_at,
        teacherName: data.teacher_name,
        enrollmentCode: data.enrollment_code,
      };
    }
  } catch (error) {
    console.error(`Error fetching classroom with code ${code} from Supabase:`, error);
  }
  
  // Fallback to local storage
  const classrooms = getLocalStorage<Classroom[]>(CLASSROOMS_STORAGE_KEY, []);
  return classrooms.find(classroom => classroom.enrollmentCode === code.toUpperCase().trim());
};

// Update a classroom
export const updateClassroom = async (updatedClassroom: Classroom): Promise<Classroom> => {
  try {
    const session = await supabase.auth.getSession();
    if (session.data.session) {
      // Update in Supabase
      const { error } = await supabase
        .from('classrooms')
        .update({
          name: updatedClassroom.name,
          section: updatedClassroom.section,
          subject: updatedClassroom.subject,
          description: updatedClassroom.description,
          teacher_name: updatedClassroom.teacherName,
        })
        .eq('id', updatedClassroom.id);
      
      if (error) throw error;
    }
  } catch (error) {
    console.error(`Error updating classroom ${updatedClassroom.id} in Supabase:`, error);
  }
  
  // Update in local storage as well
  const classrooms = getLocalStorage<Classroom[]>(CLASSROOMS_STORAGE_KEY, []);
  const index = classrooms.findIndex(c => c.id === updatedClassroom.id);
  if (index !== -1) {
    classrooms[index] = updatedClassroom;
    setLocalStorage(CLASSROOMS_STORAGE_KEY, classrooms);
  }
  
  return updatedClassroom;
};

// Delete a classroom
export const deleteClassroom = async (classroomId: string): Promise<void> => {
  try {
    const session = await supabase.auth.getSession();
    if (session.data.session) {
      // Delete from Supabase
      const { error } = await supabase
        .from('classrooms')
        .delete()
        .eq('id', classroomId);
      
      if (error) throw error;
    }
  } catch (error) {
    console.error(`Error deleting classroom ${classroomId} from Supabase:`, error);
  }
  
  // Delete from local storage as well
  const classrooms = getLocalStorage<Classroom[]>(CLASSROOMS_STORAGE_KEY, []);
  const filteredClassrooms = classrooms.filter(c => c.id !== classroomId);
  setLocalStorage(CLASSROOMS_STORAGE_KEY, filteredClassrooms);
};

// Leave a classroom
export const leaveClassroom = async (classroomId: string): Promise<void> => {
  try {
    const session = await supabase.auth.getSession();
    if (session.data.session) {
      // Delete enrollment from Supabase
      const { error } = await supabase
        .from('user_enrollments')
        .delete()
        .eq('user_id', session.data.session.user.id)
        .eq('classroom_id', classroomId);
      
      if (error) throw error;
    }
  } catch (error) {
    console.error(`Error leaving classroom ${classroomId} in Supabase:`, error);
  }
  
  // Update local storage as well
  const user = getCurrentUser();
  
  if (user && user.enrolledClasses) {
    // Remove the classroom from the user's enrolled classes
    user.enrolledClasses = user.enrolledClasses.filter(id => id !== classroomId);
    
    // Save updated user profile
    saveUserProfile(user);
  }
};
