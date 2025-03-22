
import { useState } from 'react';
import { useToast } from "@/hooks/use-toast";
import { saveAssignment } from '@/utils/storage';
import { Button } from "@/components/ui/button";
import FileUploader from './FileUploader';
import FormFields from './FormFields';

interface FileDetails {
  name: string;
  size: number;
  type: string;
}

interface UploadFormProps {
  classId: string;
  onSuccess?: () => void;
}

const UploadForm = ({ classId, onSuccess }: UploadFormProps) => {
  const { toast } = useToast();
  const [file, setFile] = useState<File | null>(null);
  const [fileDetails, setFileDetails] = useState<FileDetails | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [points, setPoints] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [autoLock, setAutoLock] = useState(true);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!file) {
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
        const assignmentData = {
          title,
          description: description.trim() || undefined,
          fileName: fileDetails!.name,
          fileSize: fileDetails!.size,
          fileType: fileDetails!.type,
          classId,
          dueDate: dueDate || undefined,
          points: points ? parseInt(points) : undefined,
          locked: false // Initially not locked
        };
        
        saveAssignment(assignmentData);
        
        toast({
          title: "Assignment Created",
          description: "Your assignment has been successfully created.",
        });
        
        // Reset form
        setTitle('');
        setDescription('');
        setFile(null);
        setFileDetails(null);
        setDueDate('');
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

  return (
    <form 
      onSubmit={handleSubmit}
      className="space-y-6"
    >
      <FormFields
        title={title}
        setTitle={setTitle}
        description={description}
        setDescription={setDescription}
        dueDate={dueDate}
        setDueDate={setDueDate}
        points={points}
        setPoints={setPoints}
        autoLock={autoLock}
        setAutoLock={setAutoLock}
      />
      
      <FileUploader
        fileDetails={fileDetails}
        setFileDetails={setFileDetails}
        setFile={setFile}
      />
      
      <div className="pt-4">
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
              Creating Assignment...
            </>
          ) : "Create Assignment"}
        </Button>
      </div>
    </form>
  );
};

export default UploadForm;
