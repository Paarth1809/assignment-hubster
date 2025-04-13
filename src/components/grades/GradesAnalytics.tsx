
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import StudentGradesChart from "@/components/analytics/StudentGradesChart";
import ClassroomPerformanceChart from "@/components/analytics/ClassroomPerformanceChart";

interface GradesAnalyticsProps {
  classroomId: string;
  studentId?: string;
  isTeacher: boolean;
}

const GradesAnalytics = ({ classroomId, studentId, isTeacher }: GradesAnalyticsProps) => {
  return (
    <div className="space-y-8">
      {studentId && (
        <StudentGradesChart 
          studentId={studentId} 
          classroomId={classroomId} 
        />
      )}
      
      {isTeacher && (
        <ClassroomPerformanceChart 
          classroomId={classroomId} 
        />
      )}
    </div>
  );
};

export default GradesAnalytics;
