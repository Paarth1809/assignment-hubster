
import { useState, useEffect } from 'react';
import { getAssignments, deleteAssignment, lockAssignment, unlockAssignment, isAssignmentPastDue } from '@/utils/storage';
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

  const handleLockToggle = (assignmentId: string, shouldLock: boolean) => {
    if (shouldLock) {
      const assignment = lockAssignment(assignmentId);
      if (assignment) {
        setAssignments(assignments.map(a => a.id === assignmentId ? { ...a, locked: true } : a));
        toast({
          title: "Assignment Locked",
          description: "Students can no longer submit to this assignment.",
        });
      }
    } else {
      const assignment = unlockAssignment(assignmentId);
      if (assignment) {
        setAssignments(assignments.map(a => a.id === assignmentId ? { ...a, locked: false } : a));
        toast({
          title: "Assignment Unlocked",
          description: "Students can now submit to this assignment.",
        });
      }
    }
    
    if (onAssignmentUpdate) {
      onAssignmentUpdate();
    }
  };

  // Auto-check for past due assignments that should be locked
  useEffect(() => {
    if (isTeacher && assignments.length > 0) {
      const pastDueAssignments = assignments.filter(
        assignment => isAssignmentPastDue(assignment) && !assignment.locked
      );
      
      if (pastDueAssignments.length > 0) {
        // We don't automatically lock them, but we notify the teacher
        toast({
          title: `${pastDueAssignments.length} Past Due Assignment${pastDueAssignments.length > 1 ? 's' : ''}`,
          description: "There are assignments past their due date that could be locked.",
        });
      }
    }
  }, [assignments, isTeacher, toast]);

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
                onDelete={handleDeleteClick}
                onLockToggle={isTeacher ? handleLockToggle : undefined}
                isTeacher={isTeacher}
              />
            ))}
          </div>
          
          <div className="hidden md:block">
            <AssignmentTable
              assignments={assignments}
              getStatusColor={getStatusColor}
              formatFileSize={formatFileSize}
              formatDate={formatDate}
              onDelete={handleDeleteClick}
              onLockToggle={isTeacher ? handleLockToggle : undefined}
              isTeacher={isTeacher}
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
