
import { useState, useEffect } from 'react';
import { getAssignments, deleteAssignment } from '@/utils/storage';
import { Assignment } from '@/utils/types';
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface AssignmentListProps {
  classId?: string;
  onAssignmentUpdate?: () => void;
}

const AssignmentList = ({ classId, onAssignmentUpdate }: AssignmentListProps) => {
  const { toast } = useToast();
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedAssignment, setSelectedAssignment] = useState<string | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  useEffect(() => {
    // Simulate loading delay
    const timer = setTimeout(() => {
      setAssignments(classId ? getAssignments(classId) : getAssignments());
      setIsLoading(false);
    }, 800);

    return () => clearTimeout(timer);
  }, [classId]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + ' bytes';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const getStatusColor = (status: Assignment['status']) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300';
      case 'submitted':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300';
      case 'graded':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';
    }
  };

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
        <div className="space-y-4">
          {[...Array(3)].map((_, index) => (
            <div key={index} className="animate-pulse space-y-3 glass rounded-xl p-4">
              <div className="h-6 bg-gray-200 dark:bg-gray-800 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-1/2"></div>
              <div className="flex space-x-4 pt-2">
                <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-1/4"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-1/4"></div>
              </div>
            </div>
          ))}
        </div>
      ) : assignments.length === 0 ? (
        <div className="text-center py-12 glass rounded-xl">
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            width="48" 
            height="48" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="1.5" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            className="mx-auto text-muted-foreground mb-4"
          >
            <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
            <polyline points="14 2 14 8 20 8" />
            <line x1="8" y1="13" x2="16" y2="13" />
            <line x1="8" y1="17" x2="16" y2="17" />
            <line x1="8" y1="9" x2="10" y2="9" />
          </svg>
          <h3 className="text-lg font-medium">No assignments yet</h3>
          <p className="text-muted-foreground mt-1 mb-6 max-w-md mx-auto">
            There are no assignments in this class yet. Create your first assignment to get started.
          </p>
        </div>
      ) : (
        <div className="glass rounded-xl shadow-md overflow-hidden">
          <div className="grid gap-4 p-4 md:hidden">
            {assignments.map((assignment) => (
              <div key={assignment.id} className="glass-hover p-4 rounded-lg">
                <div className="flex justify-between items-start">
                  <div className="flex items-start">
                    <div className="flex-shrink-0 h-10 w-10 rounded-md bg-primary/10 flex items-center justify-center">
                      <svg 
                        xmlns="http://www.w3.org/2000/svg" 
                        width="20" 
                        height="20" 
                        viewBox="0 0 24 24" 
                        fill="none" 
                        stroke="currentColor" 
                        strokeWidth="2" 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        className="text-primary"
                      >
                        <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
                        <polyline points="14 2 14 8 20 8" />
                      </svg>
                    </div>
                    <div className="ml-4">
                      <h4 className="text-sm font-medium">{assignment.title}</h4>
                      <div className="flex space-x-2 items-center mt-1">
                        <span className="text-xs text-muted-foreground truncate max-w-[120px]">
                          {assignment.fileName}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {formatFileSize(assignment.fileSize)}
                        </span>
                      </div>
                    </div>
                  </div>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(assignment.status)}`}>
                    {assignment.status.charAt(0).toUpperCase() + assignment.status.slice(1)}
                  </span>
                </div>
                <div className="grid grid-cols-2 mt-4 gap-2">
                  <Button variant="outline" size="sm" className="w-full">
                    Download
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full text-destructive hover:text-destructive"
                    onClick={() => handleDeleteClick(assignment.id)}
                  >
                    Delete
                  </Button>
                </div>
              </div>
            ))}
          </div>
          
          <table className="w-full hidden md:table">
            <thead className="bg-muted/50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Assignment
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Date Submitted
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {assignments.map((assignment) => (
                <tr key={assignment.id} className="hover:bg-muted/20 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-start">
                      <div className="flex-shrink-0 h-10 w-10 rounded-md bg-primary/10 flex items-center justify-center">
                        <svg 
                          xmlns="http://www.w3.org/2000/svg" 
                          width="20" 
                          height="20" 
                          viewBox="0 0 24 24" 
                          fill="none" 
                          stroke="currentColor" 
                          strokeWidth="2" 
                          strokeLinecap="round" 
                          strokeLinejoin="round" 
                          className="text-primary"
                        >
                          <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
                          <polyline points="14 2 14 8 20 8" />
                        </svg>
                      </div>
                      <div className="ml-4">
                        <h4 className="text-sm font-medium">{assignment.title}</h4>
                        <div className="flex space-x-2 items-center mt-1">
                          <span className="text-xs text-muted-foreground truncate max-w-[180px]">
                            {assignment.fileName}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {formatFileSize(assignment.fileSize)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
                    {formatDate(assignment.dateSubmitted)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(assignment.status)}`}>
                      {assignment.status.charAt(0).toUpperCase() + assignment.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <div className="flex space-x-2">
                      <Button variant="ghost" className="h-8 px-2 text-primary">
                        Download
                      </Button>
                      <Button 
                        variant="ghost" 
                        className="h-8 px-2 text-destructive"
                        onClick={() => handleDeleteClick(assignment.id)}
                      >
                        Delete
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Assignment?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              assignment and any associated data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmDelete}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default AssignmentList;
