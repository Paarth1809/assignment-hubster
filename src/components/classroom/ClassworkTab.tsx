
import { Assignment } from "@/utils/types";
import { Button } from "@/components/ui/button";
import { PlusCircle, FileUp } from "lucide-react";
import AssignmentList from "@/components/AssignmentList";
import UploadForm from "@/components/UploadForm";
import { useState } from "react";
import { getAssignmentsForClass } from "@/utils/storage";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/context/AuthContext";

interface ClassworkTabProps {
  classroom?: { id: string; teacherId?: string };
  assignments?: Assignment[];
}

const ClassworkTab = ({ classroom, assignments = [] }: ClassworkTabProps) => {
  const { toast } = useToast();
  const { profile } = useAuth();
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [currentAssignments, setCurrentAssignments] = useState<Assignment[]>(assignments);
  const [editingAssignment, setEditingAssignment] = useState<Assignment | null>(null);
  
  const classId = classroom?.id || '';
  const isTeacher = profile?.id === classroom?.teacherId;

  const handleCreateAssignment = () => {
    setEditingAssignment(null);
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

  const handleEditAssignment = (assignment: Assignment) => {
    setEditingAssignment(assignment);
    setShowUploadForm(true);
    
    // Scroll to the form when editing
    setTimeout(() => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    }, 100);
  };

  const handleFormClose = () => {
    setShowUploadForm(false);
    setEditingAssignment(null);
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
          <h3 className="text-lg font-medium mb-4">
            {editingAssignment ? "Edit Assignment" : "Create New Assignment"}
          </h3>
          <UploadForm 
            classId={classId} 
            assignment={editingAssignment}
            onSuccess={() => {
              setShowUploadForm(false);
              setEditingAssignment(null);
              setCurrentAssignments(getAssignmentsForClass(classId));
              toast({
                title: editingAssignment ? "Assignment Updated" : "Assignment Created",
                description: editingAssignment 
                  ? "The assignment has been successfully updated." 
                  : "The assignment has been successfully created and is now available to your students.",
              });
            }} 
            onCancel={handleFormClose}
          />
        </Card>
      )}
      
      <AssignmentList 
        classId={classId} 
        onAssignmentUpdate={() => setCurrentAssignments(getAssignmentsForClass(classId))}
        isTeacher={isTeacher}
        onEditAssignment={isTeacher ? handleEditAssignment : undefined}
      />
    </div>
  );
};

export default ClassworkTab;
