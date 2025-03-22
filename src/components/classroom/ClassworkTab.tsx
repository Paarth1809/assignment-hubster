
import { Assignment } from "@/utils/types";
import { Button } from "@/components/ui/button";
import { PlusCircle, FileText, Upload } from "lucide-react";
import AssignmentList from "@/components/AssignmentList";
import UploadForm from "@/components/UploadForm";
import { useState, useEffect } from "react";
import { getAssignmentsForClass } from "@/utils/storage";
import { Card } from "@/components/ui/card";
import { useAuth } from "@/context/AuthContext";
import EmptyAssignments from "../assignments/EmptyAssignments";

interface ClassworkTabProps {
  classId: string;
  isTeacher?: boolean;
  showCreateForm?: boolean;
  isSubmissions?: boolean;
}

const ClassworkTab = ({ 
  classId, 
  isTeacher = false,
  showCreateForm = false,
  isSubmissions = false
}: ClassworkTabProps) => {
  const [displayUploadForm, setDisplayUploadForm] = useState(showCreateForm);
  const [assignments, setAssignments] = useState<Assignment[]>(getAssignmentsForClass(classId));
  const { profile } = useAuth();
  
  // Update form visibility when showCreateForm prop changes
  useEffect(() => {
    setDisplayUploadForm(showCreateForm);
  }, [showCreateForm]);

  useEffect(() => {
    // Refresh assignments data
    setAssignments(getAssignmentsForClass(classId));
  }, [classId]);

  const pageTitle = isSubmissions ? "Submissions" : "Assignments";
  const emptyIcon = isSubmissions ? <Upload className="h-4 w-4 mr-2" /> : <FileText className="h-4 w-4 mr-2" />;
  const actionText = isSubmissions ? "Request Submission" : "Create Assignment";

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-xl font-medium text-white flex items-center gap-2">
          {isSubmissions ? <Upload className="h-5 w-5 text-purple-500" /> : <FileText className="h-5 w-5 text-blue-500" />}
          {pageTitle}
        </h2>
        {isTeacher && (
          <Button 
            onClick={() => setDisplayUploadForm(!displayUploadForm)}
            className={`gap-2 ${isSubmissions ? 'bg-purple-600 hover:bg-purple-700' : 'bg-blue-600 hover:bg-blue-700'}`}
          >
            <PlusCircle className="h-4 w-4 mr-2" />
            {displayUploadForm ? "Cancel" : actionText}
          </Button>
        )}
      </div>
      
      {displayUploadForm && isTeacher && (
        <Card className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-xl p-4 sm:p-6 shadow-md mb-8">
          <h3 className="text-lg font-medium mb-4 text-white">{isSubmissions ? "Request New Submission" : "Create New Assignment"}</h3>
          <UploadForm 
            classId={classId} 
            onSuccess={() => {
              setDisplayUploadForm(false);
              setAssignments(getAssignmentsForClass(classId));
            }}
            isSubmissionRequest={isSubmissions}
          />
        </Card>
      )}
      
      {assignments.length > 0 ? (
        <AssignmentList 
          classId={classId} 
          onAssignmentUpdate={() => setAssignments(getAssignmentsForClass(classId))}
          isTeacher={isTeacher}
          isSubmissions={isSubmissions}
        />
      ) : (
        <EmptyAssignments 
          classId={classId}
          showCreateOptions={isTeacher} 
        />
      )}
    </div>
  );
};

export default ClassworkTab;
