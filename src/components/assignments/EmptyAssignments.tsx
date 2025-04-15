
import React from 'react';
import { Button } from "@/components/ui/button";
import { FilePlus } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface EmptyAssignmentsProps {
  isTeacher?: boolean;
  classId?: string;
}

const EmptyAssignments = ({ isTeacher = false, classId }: EmptyAssignmentsProps) => {
  const navigate = useNavigate();

  const handleCreateAssignment = () => {
    if (classId) {
      navigate(`/classroom/${classId}?tab=classwork`);
    }
  };

  return (
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
        {isTeacher 
          ? "Create your first assignment to get started." 
          : "There are no assignments in this class yet."}
      </p>
      {isTeacher && (
        <Button 
          onClick={handleCreateAssignment} 
          size="lg" 
          className="gap-2 bg-primary hover:bg-primary/90 transition-colors"
        >
          <FilePlus className="h-4 w-4" />
          Create Assignment
        </Button>
      )}
    </div>
  );
};

export default EmptyAssignments;

