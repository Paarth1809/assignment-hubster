
import { useState } from "react";
import { Assignment } from "@/utils/types";
import { FileText, Users, Plus } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import GradesTable from "@/components/grades/GradesTable";
import EmptyGradesState from "@/components/grades/EmptyGradesState";
import AddGradeDialog from "@/components/grades/AddGradeDialog";
import GradesAnalytics from "@/components/grades/GradesAnalytics";
import { useNavigate } from "react-router-dom";

interface GradesTabProps {
  assignments: Assignment[];
  classroomId: string;
  teacherId?: string;
}

const GradesTab = ({ assignments, classroomId, teacherId }: GradesTabProps) => {
  const { user, profile } = useAuth();
  const [activeTab, setActiveTab] = useState("grades");
  const navigate = useNavigate();

  const isTeacher = profile?.role === "teacher" || (teacherId && user?.id === teacherId);

  const handleCreateAssignment = () => {
    // Navigate to the classwork tab
    const currentUrl = window.location.pathname;
    navigate(`${currentUrl}?tab=classwork`);
    
    // This will trigger the tab change in the parent component
    // We'll also need to update ClassroomDetails.tsx to handle this URL parameter
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-medium">Grades</h2>
        <div className="flex gap-2">
          {isTeacher && (
            <Button 
              onClick={handleCreateAssignment} 
              className="gap-2 bg-primary hover:bg-primary/90 transition-colors"
            >
              <FileText className="h-4 w-4" />
              Add Assignment
            </Button>
          )}
          {isTeacher && <AddGradeDialog classroomId={classroomId} />}
        </div>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="grades">
            <FileText className="h-4 w-4 mr-2" />
            Grades Table
          </TabsTrigger>
          <TabsTrigger value="analytics">
            <Users className="h-4 w-4 mr-2" />
            Analytics
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="grades">
          {assignments.length > 0 ? (
            <GradesTable assignments={assignments} />
          ) : (
            <EmptyGradesState />
          )}
        </TabsContent>
        
        <TabsContent value="analytics">
          <GradesAnalytics 
            classroomId={classroomId}
            studentId={user?.id}
            isTeacher={isTeacher}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default GradesTab;
