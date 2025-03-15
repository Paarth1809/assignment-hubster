
import React from 'react';
import { Assignment } from '@/utils/types';
import { Button } from "@/components/ui/button";
import { 
  Table, 
  TableHeader, 
  TableBody, 
  TableHead, 
  TableRow,
  TableCell 
} from "@/components/ui/table";

interface AssignmentTableProps {
  assignments: Assignment[];
  getStatusColor: (status: Assignment['status']) => string;
  formatFileSize: (bytes: number) => string;
  formatDate: (dateString: string) => string;
  onDelete: (id: string) => void;
}

const AssignmentTable = ({ 
  assignments, 
  getStatusColor, 
  formatFileSize, 
  formatDate, 
  onDelete 
}: AssignmentTableProps) => {
  return (
    <Table>
      <TableHeader>
        <TableRow className="bg-muted/50">
          <TableHead className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            Assignment
          </TableHead>
          <TableHead className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            Date Submitted
          </TableHead>
          <TableHead className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            Status
          </TableHead>
          <TableHead className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            Actions
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody className="divide-y divide-border">
        {assignments.map((assignment) => (
          <TableRow key={assignment.id} className="hover:bg-muted/20 transition-colors">
            <TableCell className="px-6 py-4 whitespace-nowrap">
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
            </TableCell>
            <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
              {formatDate(assignment.dateSubmitted)}
            </TableCell>
            <TableCell className="px-6 py-4 whitespace-nowrap">
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(assignment.status)}`}>
                {assignment.status.charAt(0).toUpperCase() + assignment.status.slice(1)}
              </span>
            </TableCell>
            <TableCell className="px-6 py-4 whitespace-nowrap text-sm">
              <div className="flex space-x-2">
                <Button variant="ghost" className="h-8 px-2 text-primary">
                  Download
                </Button>
                <Button 
                  variant="ghost" 
                  className="h-8 px-2 text-destructive"
                  onClick={() => onDelete(assignment.id)}
                >
                  Delete
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default AssignmentTable;
