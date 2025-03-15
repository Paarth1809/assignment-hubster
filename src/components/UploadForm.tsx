
import { useState, useRef, DragEvent, ChangeEvent } from 'react';
import { useToast } from "@/hooks/use-toast";
import { saveAssignment } from '@/utils/storage';

interface FileDetails {
  name: string;
  size: number;
  type: string;
}

const UploadForm = () => {
  const { toast } = useToast();
  const [dragActive, setDragActive] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [fileDetails, setFileDetails] = useState<FileDetails | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

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
        };
        
        saveAssignment(assignmentData);
        
        toast({
          title: "Assignment Submitted",
          description: "Your assignment has been successfully submitted.",
        });
        
        // Reset form
        setTitle('');
        setDescription('');
        setFile(null);
        setFileDetails(null);
        
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
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
    <section id="upload" className="py-20 px-6">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-10 animate-fade-in">
          <h2 className="text-3xl font-bold mb-3">Upload Assignment</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Submit your assignment files in any format. We support documents, PDFs, images, and more.
          </p>
        </div>
        
        <form 
          onSubmit={handleSubmit}
          onDragEnter={handleDrag}
          className="glass rounded-xl p-8 shadow-xl shadow-blue-500/5 animate-scale-in"
        >
          <div className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="title" className="block text-sm font-medium">
                Assignment Title
              </label>
              <input
                id="title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter assignment title"
                className="w-full px-4 py-3 rounded-lg border border-input bg-background transition-colors focus:border-ring focus:ring-1 focus:ring-ring focus:outline-none"
                required
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="description" className="block text-sm font-medium">
                Description (Optional)
              </label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Enter additional details about your assignment"
                rows={3}
                className="w-full px-4 py-3 rounded-lg border border-input bg-background transition-colors focus:border-ring focus:ring-1 focus:ring-ring focus:outline-none resize-none"
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
                      <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
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
            
            <div className="pt-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-primary text-white font-medium rounded-lg px-6 py-3.5 transition-all hover:bg-primary/90 focus:ring-4 focus:ring-primary/30 disabled:opacity-70 disabled:pointer-events-none flex items-center justify-center"
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
                    Submitting...
                  </>
                ) : "Submit Assignment"}
              </button>
            </div>
          </div>
        </form>
        
        <div className="text-center mt-8">
          <p className="text-sm text-muted-foreground">
            All submissions are secure and encrypted. Your privacy is our priority.
          </p>
        </div>
      </div>
    </section>
  );
};

export default UploadForm;
