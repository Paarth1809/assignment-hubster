
import { Classroom } from "../../types";
import { getLocalStorage, setLocalStorage } from "../base";
import { supabase } from "@/integrations/supabase/client";
import { CLASSROOMS_STORAGE_KEY } from "./initialize";

// Get all classrooms
export const getClassrooms = async (): Promise<Classroom[]> => {
  try {
    // Try to get classrooms from Supabase first
    const { data: allClassrooms, error } = await supabase
      .from('classrooms')
      .select('*');
    
    if (error) {
      console.error("Error fetching classrooms from Supabase:", error);
      throw error;
    }
    
    if (allClassrooms && allClassrooms.length > 0) {
      // Map Supabase data to match Classroom type
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
      
      // Update local storage for offline access
      setLocalStorage(CLASSROOMS_STORAGE_KEY, classrooms);
      return classrooms;
    }
  } catch (error) {
    console.error("Supabase fetch failed, falling back to local storage:", error);
  }
  
  // Fallback to local storage if Supabase fetch fails
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

// Find a classroom by enrollment code
export const getClassroomByCode = async (code: string): Promise<Classroom | undefined> => {
  try {
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
    console.error(`Error fetching classroom with code ${code}:`, error);
  }
  
  // Fallback to local storage
  const classrooms = getLocalStorage<Classroom[]>(CLASSROOMS_STORAGE_KEY, []);
  return classrooms.find(classroom => classroom.enrollmentCode === code.toUpperCase().trim());
};
