import { useState, useEffect } from 'react';
import { useToast } from "@/hooks/use-toast";
import { saveAssignment, updateAssignment } from '@/utils/storage';
import { Assignment } from '@/utils/types';
import { useAuth } from "@/context/AuthContext";

interface FileDetails {
  name: string;
  size: number;
  type: string;
}

export const useAssignmentForm = (
  classId: string,
  assignment: Assignment | null | undefined,
  onSuccess?: () => void,
  isSubmission: boolean = false
) => {
  const { toast } = useToast();
  const { profile } = useAuth();
  const [file, setFile] = useState<File | null>(null);
  const [fileDetails, setFileDetails] = useState<FileDetails | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [dueTime, setDueTime] = useState('');
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [allowLateSubmissions, setAllowLateSubmissions] = useState(true);
  const [locked, setLocked] = useState(false);
  const [points, setPoints] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Populate form when editing an assignment
  useEffect(() => {
    if (assignment) {
      setTitle(assignment.title);
      setDescription(assignment.description || '');
      
      // Handle due date and time if it exists
      if (assignment.dueDate) {
        const dueDateTime = new Date(assignment.dueDate);
        // Format date as YYYY-MM-DD for the date input
        setDueDate(dueDateTime.toISOString().split('T')[0]);
        setSelectedDate(dueDateTime);
        
        // Format time as HH:MM for the time input
        const hours = dueDateTime.getHours().toString().padStart(2, '0');
        const minutes = dueDateTime.getMinutes().toString().padStart(2, '0');
        setDueTime(`${hours}:${minutes}`);
      }
      
      setAllowLateSubmissions(assignment.allowLateSubmissions !== false);
      setLocked(assignment.locked === true);
      setPoints(assignment.points ? assignment.points.toString() : '');
      
      // Set file details from existing assignment
      if (assignment.fileName) {
        setFileDetails({
          name: assignment.fileName,
          size: assignment.fileSize,
          type: assignment.fileType
        });
      }
    }
  }, [assignment]);

  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date);
    if (date) {
      setDueDate(date.toISOString().split('T')[0]);
    } else {
      setDueDate('');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isSubmission && !assignment && !file) {
      toast({
        title: "No file selected",
        description: "Please select a file to upload",
        variant: "destructive",
      });
      return;
    }
    
    if (!title.trim() && !isSubmission) {
      toast({
        title: "Title required",
        description: "Please provide a title for your assignment",
        variant: "destructive",
      });
      return;
    }

    if (isSubmission && !file) {
      toast({
        title: "No file selected",
        description: "Please select a file to submit",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);
    
    // Simulate a submission delay
    setTimeout(() => {
      try {
        // If we're editing, we need to keep the existing file details if no new file was uploaded
        const finalFileDetails = file 
          ? { 
              fileName: file.name, 
              fileSize: file.size, 
              fileType: file.type 
            }
          : assignment 
            ? { 
                fileName: assignment.fileName, 
                fileSize: assignment.fileSize, 
                fileType: assignment.fileType 
              }
            : fileDetails 
              ? {
                  fileName: fileDetails.name,
                  fileSize: fileDetails.size,
                  fileType: fileDetails.type
                }
              : null;
            
        if (!finalFileDetails) {
          throw new Error("File details missing");
        }
        
        // Process due date and time
        let dueDateISO: string | undefined = undefined;
        if (dueDate) {
          const dateObj = new Date(dueDate);
          
          // Add time if specified
          if (dueTime) {
            const [hours, minutes] = dueTime.split(':').map(Number);
            dateObj.setHours(hours, minutes);
          } else {
            // Default to end of day if no time specified
            dateObj.setHours(23, 59, 59);
          }
          
          dueDateISO = dateObj.toISOString();
        }

        if (isSubmission && assignment) {
          // Update assignment status to 'submitted' when submitting
          const updatedAssignment: Assignment = {
            ...assignment,
            status: 'submitted' as const,
            dateSubmitted: new Date().toISOString(),
            fileName: finalFileDetails.fileName,
            fileSize: finalFileDetails.fileSize,
            fileType: finalFileDetails.fileType,
            studentId: profile?.id,
          };
          
          updateAssignment(updatedAssignment);
          
          toast({
            title: "Assignment Submitted",
            description: "Your assignment has been successfully submitted.",
          });
        } else {
          // Create or update assignment
          const assignmentData: Partial<Assignment> = {
            ...(assignment ? { id: assignment.id } : {}),
            title,
            description: description.trim() || undefined,
            fileName: finalFileDetails.fileName,
            fileSize: finalFileDetails.fileSize,
            fileType: finalFileDetails.fileType,
            classId,
            dueDate: dueDateISO,
            allowLateSubmissions,
            locked,
            points: points ? parseInt(points) : undefined,
            ...(assignment ? { 
              dateSubmitted: assignment.dateSubmitted,
              status: assignment.status 
            } : {
              dateSubmitted: new Date().toISOString(),
              status: 'pending' as const
            })
          };
          
          if (assignment) {
            // Update existing assignment
            updateAssignment({
              ...assignment,
              ...assignmentData
            } as Assignment);
          } else {
            // Create new assignment
            saveAssignment(assignmentData as Assignment);
          }
        }
        
        // Reset form
        setTitle('');
        setDescription('');
        setFile(null);
        setFileDetails(null);
        setDueDate('');
        setDueTime('');
        setSelectedDate(undefined);
        setAllowLateSubmissions(true);
        setLocked(false);
        setPoints('');
        
        if (onSuccess) {
          onSuccess();
        }
      } catch (error) {
        console.error('Error submitting assignment:', error);
        toast({
          title: "Submission Failed",
          description: "There was an error submitting your assignment. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsSubmitting(false);
      }
    }, 1500);
  };

  return {
    file,
    setFile,
    fileDetails,
    setFileDetails,
    title,
    setTitle,
    description,
    setDescription,
    dueDate,
    setDueDate,
    dueTime,
    setDueTime,
    selectedDate,
    setSelectedDate,
    allowLateSubmissions,
    setAllowLateSubmissions,
    locked,
    setLocked,
    points,
    setPoints,
    isSubmitting,
    handleDateSelect,
    handleSubmit
  };
};
