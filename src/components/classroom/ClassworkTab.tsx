
import { Assignment } from "@/utils/types";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import AssignmentList from "@/components/AssignmentList";
import UploadForm from "@/components/UploadForm";
import { useState } from "react";
import { getAssignments } from "@/utils/storage";

interface ClassworkTabProps {
  classId: string;
}

const ClassworkTab = ({ classId }: ClassworkTabProps) => {
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [assignments, setAssignments] = useState<Assignment[]>(getAssignments(classId));

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-medium">Assignments</h2>
        <Button onClick={() => setShowUploadForm(!showUploadForm)}>
          <PlusCircle className="h-4 w-4 mr-2" />
          {showUploadForm ? "Cancel" : "Create Assignment"}
        </Button>
      </div>
      
      {showUploadForm && (
        <div className="glass rounded-xl p-6 shadow-md mb-8">
          <h3 className="text-lg font-medium mb-4">Create New Assignment</h3>
          <UploadForm classId={classId} onSuccess={() => {
            setShowUploadForm(false);
            setAssignments(getAssignments(classId));
          }} />
        </div>
      )}
      
      <AssignmentList 
        classId={classId} 
        onAssignmentUpdate={() => setAssignments(getAssignments(classId))}
      />
    </div>
  );
};

export default ClassworkTab;
