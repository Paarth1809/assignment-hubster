
import { Assignment } from "@/utils/types";
import { Button } from "@/components/ui/button";
import { PlusCircle, FileUp } from "lucide-react";
import AssignmentList from "@/components/AssignmentList";
import UploadForm from "@/components/UploadForm";
import { useState } from "react";
import { getAssignmentsForClass } from "@/utils/storage";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

interface ClassworkTabProps {
  classId: string;
  isTeacher?: boolean;
}

const ClassworkTab = ({ classId, isTeacher = false }: ClassworkTabProps) => {
  const { toast } = useToast();
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [assignments, setAssignments] = useState<Assignment[]>(getAssignmentsForClass(classId));

  const handleCreateAssignment = () => {
    setShowUploadForm(!showUploadForm);
    
    if (!showUploadForm) {
      // Scroll to the form when showing it
      setTimeout(() => {
        window.scrollTo({
          top: 0,
          behavior: 'smooth'
        });
      }, 100);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-xl font-medium">Assignments</h2>
        {isTeacher && (
          <Button onClick={handleCreateAssignment}>
            {showUploadForm ? (
              <>
                <PlusCircle className="h-4 w-4 mr-2" />
                Cancel
              </>
            ) : (
              <>
                <FileUp className="h-4 w-4 mr-2" />
                Create Assignment
              </>
            )}
          </Button>
        )}
      </div>
      
      {showUploadForm && isTeacher && (
        <Card className="glass rounded-xl p-4 sm:p-6 shadow-md mb-8">
          <h3 className="text-lg font-medium mb-4">Create New Assignment</h3>
          <UploadForm classId={classId} onSuccess={() => {
            setShowUploadForm(false);
            setAssignments(getAssignmentsForClass(classId));
            toast({
              title: "Assignment Created",
              description: "The assignment has been successfully created and is now available to your students.",
            });
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
