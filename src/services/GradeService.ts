
import { supabase } from "@/integrations/supabase/client";

export interface Grade {
  id: string;
  student_id: string;
  classroom_id: string;
  assignment_name: string;
  grade: number;
  max_grade: number;
  submitted_at: string;
}

// Get grades for a specific student in a classroom
export async function getStudentGrades(studentId: string, classroomId: string) {
  const { data, error } = await supabase
    .from('student_grades')
    .select('*')
    .eq('student_id', studentId)
    .eq('classroom_id', classroomId)
    .order('submitted_at', { ascending: false });
  
  if (error) {
    console.error('Error fetching student grades:', error);
    throw error;
  }
  
  return data || [];
}

// Get all grades for a classroom (teacher view)
export async function getClassroomGrades(classroomId: string) {
  const { data, error } = await supabase
    .from('student_grades')
    .select(`
      *,
      profiles:student_id (id, full_name)
    `)
    .eq('classroom_id', classroomId)
    .order('submitted_at', { ascending: false });
  
  if (error) {
    console.error('Error fetching classroom grades:', error);
    throw error;
  }
  
  return data || [];
}

// Add or update a student's grade
export async function saveGrade(grade: Omit<Grade, 'id' | 'submitted_at'>) {
  // Check if grade already exists
  const { data: existingGrade } = await supabase
    .from('student_grades')
    .select('id')
    .eq('student_id', grade.student_id)
    .eq('classroom_id', grade.classroom_id)
    .eq('assignment_name', grade.assignment_name)
    .single();
  
  if (existingGrade) {
    // Update existing grade
    const { data, error } = await supabase
      .from('student_grades')
      .update({
        grade: grade.grade,
        max_grade: grade.max_grade,
        submitted_at: new Date().toISOString()
      })
      .eq('id', existingGrade.id)
      .select()
      .single();
    
    if (error) {
      console.error('Error updating grade:', error);
      throw error;
    }
    
    return data;
  } else {
    // Insert new grade
    const { data, error } = await supabase
      .from('student_grades')
      .insert({
        student_id: grade.student_id,
        classroom_id: grade.classroom_id,
        assignment_name: grade.assignment_name,
        grade: grade.grade,
        max_grade: grade.max_grade
      })
      .select()
      .single();
    
    if (error) {
      console.error('Error creating grade:', error);
      throw error;
    }
    
    return data;
  }
}

// Get student average grades for analytics
export async function getStudentAverageGrades(studentId: string) {
  const { data, error } = await supabase
    .from('student_grades')
    .select(`
      *,
      classrooms:classroom_id (name)
    `)
    .eq('student_id', studentId);
  
  if (error) {
    console.error('Error fetching student average grades:', error);
    throw error;
  }
  
  // Calculate average grade per classroom
  const classroomGrades: Record<string, { total: number; count: number; name: string }> = {};
  
  data.forEach(grade => {
    const classroomId = grade.classroom_id;
    if (!classroomGrades[classroomId]) {
      classroomGrades[classroomId] = { 
        total: 0, 
        count: 0, 
        name: grade.classrooms.name 
      };
    }
    
    classroomGrades[classroomId].total += (grade.grade / grade.max_grade) * 100;
    classroomGrades[classroomId].count += 1;
  });
  
  return Object.entries(classroomGrades).map(([id, stats]) => ({
    classroomId: id,
    classroomName: stats.name,
    averageGrade: stats.count > 0 ? stats.total / stats.count : 0
  }));
}

// Get classroom performance analytics
export async function getClassroomPerformanceAnalytics(classroomId: string) {
  const { data, error } = await supabase
    .from('student_grades')
    .select(`
      *,
      profiles:student_id (full_name)
    `)
    .eq('classroom_id', classroomId);
  
  if (error) {
    console.error('Error fetching classroom analytics:', error);
    throw error;
  }
  
  // Calculate average grade per student
  const studentGrades: Record<string, { total: number; count: number; name: string }> = {};
  
  data.forEach(grade => {
    const studentId = grade.student_id;
    if (!studentGrades[studentId]) {
      studentGrades[studentId] = { 
        total: 0, 
        count: 0, 
        name: grade.profiles.full_name || 'Unknown Student'
      };
    }
    
    studentGrades[studentId].total += (grade.grade / grade.max_grade) * 100;
    studentGrades[studentId].count += 1;
  });
  
  return Object.entries(studentGrades).map(([id, stats]) => ({
    studentId: id,
    studentName: stats.name,
    averageGrade: stats.count > 0 ? stats.total / stats.count : 0
  }));
}
