
import { Assignment } from "@/utils/types";
import { Button } from "@/components/ui/button";
import { Edit, Trash, Download, SendHorizontal } from "lucide-react";
import { isAssignmentPastDue, isSubmissionAllowed } from '@/utils/storage/assignments';

interface AssignmentTableProps {
  assignments: Assignment[];
  getStatusColor: (status: Assignment['status']) => string;
  formatFileSize: (bytes: number) => string;
  formatDate: (date: string) => string;
  onDelete?: (id: string) => void;
  onEdit?: (assignment: Assignment) => void;
  onSubmit?: (assignment: Assignment) => void;
}

const AssignmentTable = ({ 
  assignments, 
  getStatusColor, 
  formatFileSize, 
  formatDate, 
  onDelete,
  onEdit,
  onSubmit
}: AssignmentTableProps) => {
  return (
    <table className="w-full">
      <thead>
        <tr className="border-b border-border">
          <th className="text-left p-4 font-medium text-sm">Title</th>
          <th className="text-left p-4 font-medium text-sm">Status</th>
          <th className="text-left p-4 font-medium text-sm">Due Date</th>
          <th className="text-center p-4 font-medium text-sm">File</th>
          <th className="text-right p-4 font-medium text-sm">Actions</th>
        </tr>
      </thead>
      <tbody>
        {assignments.map((assignment) => {
          const isPastDue = isAssignmentPastDue(assignment);
          const submissionAllowed = isSubmissionAllowed(assignment);
          
          return (
            <tr key={assignment.id} className="border-b border-border hover:bg-muted/10">
              <td className="p-4 text-sm">
                <div className="font-medium">{assignment.title}</div>
                {assignment.description && (
                  <div className="text-xs text-muted-foreground mt-1 line-clamp-1">
                    {assignment.description}
                  </div>
                )}
              </td>
              <td className="p-4 text-sm">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(assignment.status)}`}>
                  {assignment.status.charAt(0).toUpperCase() + assignment.status.slice(1)}
                </span>
              </td>
              <td className="p-4 text-sm">
                {assignment.dueDate ? (
                  <div className={isPastDue ? "text-destructive" : ""}>
                    {formatDate(assignment.dueDate)}
                    {isPastDue && !submissionAllowed && (
                      <div className="text-xs text-destructive mt-1">Closed</div>
                    )}
                  </div>
                ) : (
                  <span className="text-muted-foreground">No due date</span>
                )}
              </td>
              <td className="p-4 text-sm text-center">
                <div className="text-xs">{assignment.fileName}</div>
                <div className="text-xs text-muted-foreground">{formatFileSize(assignment.fileSize)}</div>
              </td>
              <td className="p-4 text-sm">
                <div className="flex justify-end gap-2">
                  {onSubmit && assignment.status === 'pending' && (
                    <Button 
                      variant="default" 
                      size="sm" 
                      onClick={() => onSubmit(assignment)}
                    >
                      <SendHorizontal className="h-4 w-4 mr-1" />
                      Submit
                    </Button>
                  )}
                  <Button variant="outline" size="icon">
                    <Download className="h-4 w-4" />
                  </Button>
                  {onEdit && (
                    <Button 
                      variant="outline" 
                      size="icon"
                      onClick={() => onEdit(assignment)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                  )}
                  {onDelete && (
                    <Button 
                      variant="outline" 
                      size="icon" 
                      className="text-destructive hover:text-destructive"
                      onClick={() => onDelete(assignment.id)}
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};

export default AssignmentTable;
