
import { useState, useRef, DragEvent, ChangeEvent, useEffect } from 'react';
import { useToast } from "@/hooks/use-toast";
import { saveAssignment, updateAssignment } from '@/utils/storage';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Assignment } from '@/utils/types';

interface FileDetails {
  name: string;
  size: number;
  type: string;
}

interface UploadFormProps {
  classId: string;
  assignment?: Assignment | null;
  onSuccess?: () => void;
  onCancel?: () => void;
}

const UploadForm = ({ classId, assignment, onSuccess, onCancel }: UploadFormProps) => {
  const { toast } = useToast();
  const [dragActive, setDragActive] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [fileDetails, setFileDetails] = useState<FileDetails | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [dueTime, setDueTime] = useState('');
  const [allowLateSubmissions, setAllowLateSubmissions] = useState(true);
  const [points, setPoints] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
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
        
        // Format time as HH:MM for the time input
        const hours = dueDateTime.getHours().toString().padStart(2, '0');
        const minutes = dueDateTime.getMinutes().toString().padStart(2, '0');
        setDueTime(`${hours}:${minutes}`);
      }
      
      setAllowLateSubmissions(assignment.allowLateSubmissions !== false);
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

  const handleDrag = (e: DragEvent<HTMLDivElement | HTMLFormElement>) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = (file: File) => {
    setFile(file);
    setFileDetails({
      name: file.name,
      size: file.size,
      type: file.type
    });
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + ' bytes';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const onButtonClick = () => {
    fileInputRef.current?.click();
  };

  const removeFile = () => {
    setFile(null);
    setFileDetails(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!assignment && !file) {
      toast({
        title: "No file selected",
        description: "Please select a file to upload",
        variant: "destructive",
      });
      return;
    }
    
    if (!title.trim()) {
      toast({
        title: "Title required",
        description: "Please provide a title for your assignment",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);
    
    // In a real app, this would upload to a server
    // For now, we'll simulate a submission delay
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
            
        const assignmentData = {
          ...(assignment ? { id: assignment.id } : {}),
          title,
          description: description.trim() || undefined,
          fileName: finalFileDetails.fileName,
          fileSize: finalFileDetails.fileSize,
          fileType: finalFileDetails.fileType,
          classId,
          dueDate: dueDateISO,
          allowLateSubmissions,
          points: points ? parseInt(points) : undefined,
          ...(assignment ? { 
            dateSubmitted: assignment.dateSubmitted,
            status: assignment.status 
          } : {})
        };
        
        if (assignment) {
          // Update existing assignment
          updateAssignment({
            ...assignment,
            ...assignmentData
          });
        } else {
          // Create new assignment
          saveAssignment(assignmentData);
        }
        
        // Reset form
        setTitle('');
        setDescription('');
        setFile(null);
        setFileDetails(null);
        setDueDate('');
        setDueTime('');
        setAllowLateSubmissions(true);
        setPoints('');
        
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
        
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

  return (
    <form 
      onSubmit={handleSubmit}
      onDragEnter={handleDrag}
      className="space-y-6"
    >
      <div className="space-y-2">
        <Label htmlFor="title">
          Assignment Title
        </Label>
        <Input
          id="title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter assignment title"
          required
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="dueDate">
            Due Date
          </Label>
          <Input
            id="dueDate"
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="dueTime">
            Due Time
          </Label>
          <Input
            id="dueTime"
            type="time"
            value={dueTime}
            onChange={(e) => setDueTime(e.target.value)}
            placeholder="23:59"
          />
        </div>
      </div>
      
      <div className="flex items-center space-x-2">
        <input
          type="checkbox"
          id="allowLateSubmissions"
          checked={allowLateSubmissions}
          onChange={(e) => setAllowLateSubmissions(e.target.checked)}
          className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
        />
        <Label htmlFor="allowLateSubmissions" className="text-sm font-normal">
          Allow submissions after due date
        </Label>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="points">
          Points
        </Label>
        <Input
          id="points"
          type="number"
          value={points}
          onChange={(e) => setPoints(e.target.value)}
          placeholder="100"
          min="0"
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="description">
          Description
        </Label>
        <Textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Enter additional details about the assignment"
          rows={3}
        />
      </div>
      
      <div 
        className={`relative border-2 border-dashed rounded-lg p-6 transition-all duration-300 ${
          dragActive 
            ? 'border-primary bg-primary/5' 
            : 'border-input hover:border-muted-foreground/50'
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          onChange={handleChange}
          accept=".pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx,.txt,.rtf,.zip,.rar,.jpg,.jpeg,.png"
        />
        
        {!fileDetails ? (
          <div className="text-center cursor-pointer" onClick={onButtonClick}>
            <svg 
              className="mx-auto h-12 w-12 text-muted-foreground"
              xmlns="http://www.w3.org/2000/svg" 
              width="24" 
              height="24" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="1.5" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            >
              <path d="M4 22h16a2 2 0 0 0 2-2V7.5L14.5 2H6a2 2 0 0 0-2 2v4" />
              <polyline points="14 2 14 8 20 8" />
              <path d="M10 20v-7" />
              <path d="M7 17l3-3 3 3" />
            </svg>
            <p className="mt-2 text-sm font-medium text-muted-foreground">
              Drag & drop your file here or{" "}
              <span className="text-primary hover:underline">browse</span>
            </p>
            <p className="mt-1 text-xs text-muted-foreground/80">
              Supports: PDF, DOC, DOCX, PPT, PPTX, XLS, XLSX, TXT, RTF, ZIP, RAR, JPG, JPEG, PNG
            </p>
          </div>
        ) : (
          <div className="flex items-center gap-4">
            <div className="flex-shrink-0 h-12 w-12 rounded-md bg-primary/10 flex items-center justify-center">
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                width="24" 
                height="24" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                className="text-primary"
              >
                <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2H6a2 2 0 0 0-2 2v4" />
                <polyline points="14 2 14 8 20 8" />
              </svg>
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium truncate">{fileDetails.name}</p>
              <p className="text-xs text-muted-foreground">{formatFileSize(fileDetails.size)}</p>
            </div>
            <button 
              type="button" 
              onClick={removeFile}
              className="flex-shrink-0 rounded-full p-1.5 text-muted-foreground hover:text-destructive transition-colors"
            >
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                width="16" 
                height="16" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              >
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>
        )}
      </div>
      
      <div className="flex justify-between pt-4 gap-4">
        {onCancel && (
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            className="w-full"
          >
            Cancel
          </Button>
        )}
        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full"
        >
          {isSubmitting ? (
            <>
              <svg 
                className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" 
                xmlns="http://www.w3.org/2000/svg" 
                fill="none" 
                viewBox="0 0 24 24"
              >
                <circle 
                  className="opacity-25" 
                  cx="12" 
                  cy="12" 
                  r="10" 
                  stroke="currentColor" 
                  strokeWidth="4"
                />
                <path 
                  className="opacity-75" 
                  fill="currentColor" 
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              {assignment ? "Updating..." : "Submitting..."}
            </>
          ) : assignment ? "Update Assignment" : "Submit Assignment"}
        </Button>
      </div>
    </form>
  );
};

export default UploadForm;
