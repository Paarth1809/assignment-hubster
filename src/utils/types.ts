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
  dueTime?: string;
  allowLateSubmissions?: boolean;
  points?: number;
  studentId?: string; // Added to track which student submitted the assignment
  locked?: boolean; // Added to support locking assignments
}

export interface LiveClass {
  id: string;
  title: string;
  description?: string;
  scheduledStart: string;
  scheduledEnd?: string;
  actualStart?: string;
  actualEnd?: string;
  status: 'scheduled' | 'live' | 'completed' | 'cancelled';
  classId: string;
  createdBy: string;
  meetingUrl?: string;
  recordingUrl?: string;
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
  liveClasses?: LiveClass[];
  teacherId?: string; // Added to support database storage
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: 'student' | 'teacher';
  avatar?: string;
  username?: string;
  enrolledClasses: string[]; // Array of classroom IDs
  preferences?: {
    notifications?: {
      email?: boolean;
      browser?: boolean;
      emailUpdates?: boolean;
      newAssignmentAlerts?: boolean;
    };
    theme?: 'light' | 'dark' | 'system';
    language?: string;
    fontSize?: 'small' | 'medium' | 'large';
  };
}

export interface AuthUser {
  id: string;
  email: string;
  user_metadata?: {
    name?: string;
    avatar_url?: string;
  };
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  dateCreated: string;
  author: string;
  authorId: string;
  classId: string;
}
