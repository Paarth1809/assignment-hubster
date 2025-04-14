
import { Classroom } from "../../types";
import { getLocalStorage, setLocalStorage } from "../base";
import { supabase } from "@/integrations/supabase/client";
import { CLASSROOMS_STORAGE_KEY } from "./initialize";

// Create a new classroom
export const createClassroom = async (classroom: Classroom): Promise<Classroom> => {
  try {
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
        teacher_id: classroom.teacherId || '00000000-0000-0000-0000-000000000000' // Default placeholder if teacherId is not provided
      })
      .select()
      .single();
    
    if (error) throw error;
    
    // Also update local storage
    const classrooms = getLocalStorage<Classroom[]>(CLASSROOMS_STORAGE_KEY, []);
    classrooms.push(classroom);
    setLocalStorage(CLASSROOMS_STORAGE_KEY, classrooms);
    
    return classroom;
  } catch (error) {
    console.error("Error creating classroom in Supabase:", error);
    
    // Fallback to local storage only
    const classrooms = getLocalStorage<Classroom[]>(CLASSROOMS_STORAGE_KEY, []);
    classrooms.push(classroom);
    setLocalStorage(CLASSROOMS_STORAGE_KEY, classrooms);
    return classroom;
  }
};

// Save a classroom from form data
export const saveClassroom = async (formData: any): Promise<Classroom> => {
  // Generate a random ID
  const id = crypto.randomUUID();
  // Generate a random enrollment code (6 characters, uppercase)
  const enrollmentCode = Math.random().toString(36).substring(2, 8).toUpperCase();
  
  // Get the current user for teacher ID
  const session = await supabase.auth.getSession();
  const teacherId = session.data.session?.user.id;
  
  const newClassroom: Classroom = {
    id,
    name: formData.name,
    section: formData.section || undefined,
    subject: formData.subject || undefined,
    description: formData.description || undefined,
    createdAt: new Date().toISOString(),
    teacherName: formData.teacherName || "Teacher",
    enrollmentCode,
    teacherId
  };
  
  return createClassroom(newClassroom);
};

// Update a classroom
export const updateClassroom = async (updatedClassroom: Classroom): Promise<Classroom> => {
  try {
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
  } catch (error) {
    console.error(`Error updating classroom ${updatedClassroom.id}:`, error);
  }
  
  // Also update in local storage
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
    const { error } = await supabase
      .from('classrooms')
      .delete()
      .eq('id', classroomId);
    
    if (error) throw error;
  } catch (error) {
    console.error(`Error deleting classroom ${classroomId}:`, error);
  }
  
  // Also delete from local storage
  const classrooms = getLocalStorage<Classroom[]>(CLASSROOMS_STORAGE_KEY, []);
  const filteredClassrooms = classrooms.filter(c => c.id !== classroomId);
  setLocalStorage(CLASSROOMS_STORAGE_KEY, filteredClassrooms);
};
