
import { Button } from "@/components/ui/button";

interface SubmitButtonsProps {
  onCancel?: () => void;
  isSubmitting: boolean;
  isSubmission: boolean;
  assignment?: any;
}

const SubmitButtons = ({ 
  onCancel, 
  isSubmitting, 
  isSubmission, 
  assignment 
}: SubmitButtonsProps) => {
  return (
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
            {isSubmission ? "Submitting..." : assignment ? "Updating..." : "Creating..."}
          </>
        ) : (
          isSubmission ? "Submit Assignment" : assignment ? "Update Assignment" : "Create Assignment"
        )}
      </Button>
    </div>
  );
};

export default SubmitButtons;
