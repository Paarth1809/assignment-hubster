
import { useState, useEffect } from 'react';
import { getAssignments, deleteAssignment } from '@/utils/storage';
import { Assignment } from '@/utils/types';
import { useToast } from "@/hooks/use-toast";
import { formatDate, formatFileSize, getStatusColor } from '@/utils/assignmentUtils';
import AssignmentSkeleton from './assignments/AssignmentSkeleton';
import EmptyAssignments from './assignments/EmptyAssignments';
import AssignmentCardMobile from './assignments/AssignmentCardMobile';
import AssignmentTable from './assignments/AssignmentTable';
import DeleteAssignmentDialog from './assignments/DeleteAssignmentDialog';

interface AssignmentListProps {
  classId?: string;
  onAssignmentUpdate?: () => void;
  isTeacher?: boolean;
}

const AssignmentList = ({ classId, onAssignmentUpdate, isTeacher = false }: AssignmentListProps) => {
  const { toast } = useToast();
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedAssignment, setSelectedAssignment] = useState<string | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  useEffect(() => {
    // Simulate loading delay
    const timer = setTimeout(() => {
      if (classId) {
        // Filter assignments by classId
        setAssignments(getAssignments().filter(assignment => assignment.classId === classId));
      } else {
        setAssignments(getAssignments());
      }
      setIsLoading(false);
    }, 800);

    return () => clearTimeout(timer);
  }, [classId]);

  const handleDeleteClick = (assignmentId: string) => {
    setSelectedAssignment(assignmentId);
    setShowDeleteDialog(true);
  };

  const handleConfirmDelete = () => {
    if (selectedAssignment) {
      deleteAssignment(selectedAssignment);
      setAssignments(assignments.filter(a => a.id !== selectedAssignment));
      toast({
        title: "Assignment Deleted",
        description: "The assignment has been successfully deleted.",
      });
      if (onAssignmentUpdate) {
        onAssignmentUpdate();
      }
    }
    setShowDeleteDialog(false);
    setSelectedAssignment(null);
  };

  return (
    <div>
      {isLoading ? (
        <AssignmentSkeleton />
      ) : assignments.length === 0 ? (
        <EmptyAssignments />
      ) : (
        <div className="glass rounded-xl shadow-md overflow-hidden">
          <div className="grid gap-4 p-4 md:hidden">
            {assignments.map((assignment) => (
              <AssignmentCardMobile
                key={assignment.id}
                assignment={assignment}
                getStatusColor={getStatusColor}
                formatFileSize={formatFileSize}
                onDelete={isTeacher ? handleDeleteClick : undefined}
              />
            ))}
          </div>
          
          <div className="hidden md:block">
            <AssignmentTable
              assignments={assignments}
              getStatusColor={getStatusColor}
              formatFileSize={formatFileSize}
              formatDate={formatDate}
              onDelete={isTeacher ? handleDeleteClick : undefined}
            />
          </div>
        </div>
      )}
      
      <DeleteAssignmentDialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
};

export default AssignmentList;
