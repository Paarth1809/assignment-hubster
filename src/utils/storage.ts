
interface Assignment {
  id: string;
  title: string;
  description?: string;
  fileName: string;
  fileSize: number;
  fileType: string;
  dateSubmitted: string;
  status: 'pending' | 'submitted' | 'graded';
  feedback?: string;
  grade?: string;
}

// Get assignments from local storage
export const getAssignments = (): Assignment[] => {
  const assignments = localStorage.getItem('assignments');
  return assignments ? JSON.parse(assignments) : [];
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
