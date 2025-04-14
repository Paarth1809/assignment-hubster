
import { Assignment } from "@/utils/types";
import { Button } from "@/components/ui/button";
import { PlusCircle, FileUp, SendHorizontal, FilePlus } from "lucide-react";
import AssignmentList from "@/components/AssignmentList";
import UploadForm from "@/components/UploadForm";
import { useState, useEffect } from "react";
import { getAssignmentsForClass, saveAssignment } from "@/utils/storage/assignments";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/context/AuthContext";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface ClassworkTabProps {
  classroom?: { id: string; teacherId?: string };
}

const ClassworkTab = ({ classroom }: ClassworkTabProps) => {
  const { toast } = useToast();
  const { user, profile } = useAuth();
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [currentAssignments, setCurrentAssignments] = useState<Assignment[]>([]);
  const [editingAssignment, setEditingAssignment] = useState<Assignment | null>(null);
  const [submittingAssignment, setSubmittingAssignment] = useState<Assignment | null>(null);
  const [activeTab, setActiveTab] = useState("assignments");
  
  const classId = classroom?.id || '';
  const isTeacher = profile?.id === classroom?.teacherId;

  // Load assignments when the component mounts or when classId changes
  useEffect(() => {
    if (classId) {
      refreshAssignments();
    }
  }, [classId]);

  const refreshAssignments = () => {
    setCurrentAssignments(getAssignmentsForClass(classId));
  };

  const handleCreateAssignment = () => {
    setEditingAssignment(null);
    setSubmittingAssignment(null);
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
    setSubmittingAssignment(null);
    setShowUploadForm(true);
    
    // Scroll to the form when editing
    setTimeout(() => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    }, 100);
  };

  const handleSubmitAssignment = (assignment: Assignment) => {
    setSubmittingAssignment(assignment);
    setEditingAssignment(null);
    setShowUploadForm(true);
    
    // Scroll to the form when submitting
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
    setSubmittingAssignment(null);
  };

  const handleFormSuccess = () => {
    setShowUploadForm(false);
    setEditingAssignment(null);
    setSubmittingAssignment(null);
    // Refresh assignments list
    refreshAssignments();
    
    toast({
      title: submittingAssignment 
        ? "Assignment Submitted" 
        : editingAssignment 
          ? "Assignment Updated" 
          : "Assignment Created",
      description: submittingAssignment 
        ? "Your assignment has been successfully submitted." 
        : editingAssignment 
          ? "The assignment has been successfully updated." 
          : "The assignment has been successfully created and is now available to your students.",
    });
  };

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="assignments">Assignments</TabsTrigger>
          {!isTeacher && <TabsTrigger value="submissions">My Submissions</TabsTrigger>}
        </TabsList>
        
        <TabsContent value="assignments">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <h2 className="text-xl font-medium">Assignments</h2>
            {isTeacher && (
              <Button onClick={handleCreateAssignment} size="lg" className="gap-2">
                {showUploadForm && !submittingAssignment && !editingAssignment ? (
                  <>
                    <PlusCircle className="h-4 w-4" />
                    Cancel
                  </>
                ) : (
                  <>
                    <FilePlus className="h-4 w-4" />
                    Create Assignment
                  </>
                )}
              </Button>
            )}
          </div>
          
          {showUploadForm && (
            <Card className="glass rounded-xl p-4 sm:p-6 shadow-md mb-8">
              <h3 className="text-lg font-medium mb-4">
                {submittingAssignment 
                  ? "Submit Assignment" 
                  : editingAssignment 
                    ? "Edit Assignment" 
                    : "Create New Assignment"}
              </h3>
              <UploadForm 
                classId={classId} 
                assignment={editingAssignment || submittingAssignment}
                onSuccess={handleFormSuccess} 
                onCancel={handleFormClose}
                isSubmission={!!submittingAssignment}
              />
            </Card>
          )}
          
          <AssignmentList 
            classId={classId} 
            onAssignmentUpdate={refreshAssignments}
            isTeacher={isTeacher}
            onEditAssignment={isTeacher ? handleEditAssignment : undefined}
            onSubmitAssignment={!isTeacher ? handleSubmitAssignment : undefined}
          />
        </TabsContent>
        
        <TabsContent value="submissions">
          <div className="mb-6">
            <h2 className="text-xl font-medium">My Submissions</h2>
            <p className="text-muted-foreground mt-1">Track your submitted assignments and their status.</p>
          </div>
          
          <AssignmentList 
            classId={classId} 
            onAssignmentUpdate={refreshAssignments}
            isTeacher={false}
            onlySubmitted={true}
            currentUserId={user?.id}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ClassworkTab;
