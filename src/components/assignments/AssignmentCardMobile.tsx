
import React from 'react';
import { Assignment } from '@/utils/types';
import { Button } from "@/components/ui/button";
import { Lock, Unlock } from "lucide-react";
import { isAssignmentPastDue } from '@/utils/storage';

interface AssignmentCardMobileProps {
  assignment: Assignment;
  getStatusColor: (status: Assignment['status']) => string;
  formatFileSize: (bytes: number) => string;
  onDelete: (id: string) => void;
  onLockToggle?: (id: string, lock: boolean) => void;
  isTeacher?: boolean;
}

const AssignmentCardMobile = ({ 
  assignment, 
  getStatusColor, 
  formatFileSize, 
  onDelete,
  onLockToggle,
  isTeacher = false
}: AssignmentCardMobileProps) => {
  const isPastDue = isAssignmentPastDue(assignment);
  
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
            <h4 className="text-sm font-medium flex items-center gap-2">
              {assignment.title}
              {assignment.locked && (
                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400">
                  <Lock className="w-3 h-3 mr-1" />
                  Locked
                </span>
              )}
            </h4>
            <div className="flex space-x-2 items-center mt-1">
              <span className="text-xs text-muted-foreground truncate max-w-[120px]">
                {assignment.fileName}
              </span>
              <span className="text-xs text-muted-foreground">
                {formatFileSize(assignment.fileSize)}
              </span>
            </div>
            {assignment.dueDate && (
              <div className="mt-1">
                <span className="text-xs text-muted-foreground">
                  Due: {assignment.dueDate}
                </span>
                {isPastDue && !assignment.locked && isTeacher && (
                  <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400">
                    Past due
                  </span>
                )}
              </div>
            )}
          </div>
        </div>
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(assignment.status)}`}>
          {assignment.status.charAt(0).toUpperCase() + assignment.status.slice(1)}
        </span>
      </div>
      <div className="grid grid-cols-2 mt-4 gap-2">
        <Button variant="outline" size="sm" className="w-full" disabled={assignment.locked}>
          Download
        </Button>
        {isTeacher && onLockToggle && (
          <Button 
            variant="outline" 
            size="sm" 
            className="w-full"
            onClick={() => onLockToggle(assignment.id, !assignment.locked)}
          >
            {assignment.locked ? (
              <>
                <Unlock className="h-3 w-3 mr-1" />
                Unlock
              </>
            ) : (
              <>
                <Lock className="h-3 w-3 mr-1" />
                Lock
              </>
            )}
          </Button>
        )}
        {(!isTeacher || !onLockToggle) && (
          <Button 
            variant="outline" 
            size="sm" 
            className="w-full text-destructive hover:text-destructive"
            onClick={() => onDelete(assignment.id)}
          >
            Delete
          </Button>
        )}
        {isTeacher && onLockToggle && (
          <Button 
            variant="outline" 
            size="sm" 
            className="w-full col-span-2 text-destructive hover:text-destructive"
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
