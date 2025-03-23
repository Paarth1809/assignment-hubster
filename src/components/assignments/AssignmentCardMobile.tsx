
import React from 'react';
import { Assignment } from '@/utils/types';
import { Button } from "@/components/ui/button";

interface AssignmentCardMobileProps {
  assignment: Assignment;
  getStatusColor: (status: Assignment['status']) => string;
  formatFileSize: (bytes: number) => string;
  onDelete?: (id: string) => void;
  onEdit?: (assignment: Assignment) => void;
}

const AssignmentCardMobile = ({ 
  assignment, 
  getStatusColor, 
  formatFileSize, 
  onDelete,
  onEdit
}: AssignmentCardMobileProps) => {
  return (
    <div className="glass-hover p-4 rounded-lg">
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
      <div className="grid grid-cols-3 mt-4 gap-2">
        {onEdit && (
          <Button 
            variant="outline" 
            size="sm" 
            className="w-full"
            onClick={() => onEdit(assignment)}
          >
            Edit
          </Button>
        )}
        <Button variant="outline" size="sm" className="w-full">
          Download
        </Button>
        {onDelete && (
          <Button 
            variant="outline" 
            size="sm" 
            className="w-full text-destructive hover:text-destructive"
            onClick={() => onDelete(assignment.id)}
          >
            Delete
          </Button>
        )}
      </div>
    </div>
  );
};

export default AssignmentCardMobile;
