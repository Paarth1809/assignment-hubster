
export interface Assignment {
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
  classId: string;
  dueDate?: string;
  points?: number;
}

export interface Classroom {
  id: string;
  name: string;
  section?: string;
  subject?: string;
  description?: string;
  createdAt: string;
  teacherName: string;
  coverImage?: string;
  enrollmentCode: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: 'student' | 'teacher';
  avatar?: string;
  enrolledClasses: string[]; // Array of classroom IDs
}
