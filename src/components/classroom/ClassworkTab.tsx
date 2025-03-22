
import { Assignment } from "@/utils/types";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import AssignmentList from "@/components/AssignmentList";
import UploadForm from "@/components/UploadForm";
import { useState } from "react";
import { getAssignmentsForClass } from "@/utils/storage";
import { Card } from "@/components/ui/card";
import { useAuth } from "@/context/AuthContext";

interface ClassworkTabProps {
  classId: string;
  isTeacher?: boolean;
}

const ClassworkTab = ({ classId, isTeacher = false }: ClassworkTabProps) => {
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [assignments, setAssignments] = useState<Assignment[]>(getAssignmentsForClass(classId));
  const { profile } = useAuth();

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-xl font-medium text-white">Assignments</h2>
        {isTeacher && (
          <Button 
            onClick={() => setShowUploadForm(!showUploadForm)}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <PlusCircle className="h-4 w-4 mr-2" />
            {showUploadForm ? "Cancel" : "Create Assignment"}
          </Button>
        )}
      </div>
      
      {showUploadForm && isTeacher && (
        <Card className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-xl p-4 sm:p-6 shadow-md mb-8">
          <h3 className="text-lg font-medium mb-4 text-white">Create New Assignment</h3>
          <UploadForm classId={classId} onSuccess={() => {
            setShowUploadForm(false);
            setAssignments(getAssignmentsForClass(classId));
          }} />
        </Card>
      )}
      
      <AssignmentList 
        classId={classId} 
        onAssignmentUpdate={() => setAssignments(getAssignmentsForClass(classId))}
        isTeacher={isTeacher}
      />
    </div>
  );
};

export default ClassworkTab;
