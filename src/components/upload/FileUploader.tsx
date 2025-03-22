
import { useState, useRef, DragEvent, ChangeEvent } from 'react';

interface FileDetails {
  name: string;
  size: number;
  type: string;
}

interface FileUploaderProps {
  fileDetails: FileDetails | null;
  setFileDetails: (details: FileDetails | null) => void;
  setFile: (file: File | null) => void;
}

const FileUploader = ({ fileDetails, setFileDetails, setFile }: FileUploaderProps) => {
  const [dragActive, setDragActive] = useState(false);
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

  return (
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
  );
};

export default FileUploader;
