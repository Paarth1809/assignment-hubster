
import { DragEvent } from 'react';
import { Assignment } from '@/utils/types';
import FileUploader from './upload/FileUploader';
import AssignmentDetailsForm from './upload/AssignmentDetailsForm';
import SubmitButtons from './upload/SubmitButtons';
import { useAssignmentForm } from '@/hooks/useAssignmentForm';

interface UploadFormProps {
  classId: string;
  assignment?: Assignment | null;
  onSuccess?: () => void;
  onCancel?: () => void;
  isSubmission?: boolean;
}

const UploadForm = ({ classId, assignment, onSuccess, onCancel, isSubmission = false }: UploadFormProps) => {
  const {
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
  } = useAssignmentForm(classId, assignment, onSuccess, isSubmission);

  const handleDrag = (e: DragEvent<HTMLDivElement | HTMLFormElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  return (
    <form 
      onSubmit={handleSubmit}
      onDragEnter={handleDrag}
      className="space-y-6"
    >
      {!isSubmission && (
        <AssignmentDetailsForm 
          title={title}
          setTitle={setTitle}
          description={description}
          setDescription={setDescription}
          dueDate={dueDate}
          setDueDate={setDueDate}
          dueTime={dueTime}
          setDueTime={setDueTime}
          selectedDate={selectedDate}
          setSelectedDate={setSelectedDate}
          allowLateSubmissions={allowLateSubmissions}
          setAllowLateSubmissions={setAllowLateSubmissions}
          locked={locked}
          setLocked={setLocked}
          points={points}
          setPoints={setPoints}
          handleDateSelect={handleDateSelect}
        />
      )}
      
      <FileUploader 
        fileDetails={fileDetails}
        setFileDetails={setFileDetails}
        setFile={setFile}
      />
      
      <SubmitButtons 
        onCancel={onCancel}
        isSubmitting={isSubmitting}
        isSubmission={isSubmission}
        assignment={assignment}
      />
    </form>
  );
};

export default UploadForm;
