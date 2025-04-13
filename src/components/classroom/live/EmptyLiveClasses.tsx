
import { Button } from "@/components/ui/button";
import { Plus, Video } from "lucide-react";

interface EmptyLiveClassesProps {
  isTeacher: boolean;
  onCreateClick: () => void;
}

const EmptyLiveClasses = ({ isTeacher, onCreateClick }: EmptyLiveClassesProps) => {
  return (
    <div className="py-12 text-center">
      <Video className="mx-auto h-12 w-12 text-muted-foreground opacity-50" />
      <h3 className="mt-4 text-lg font-medium">No live classes scheduled</h3>
      <p className="mt-2 text-sm text-muted-foreground">
        {isTeacher 
          ? "Schedule a live class for your students by clicking the 'Schedule Live Class' button." 
          : "Your teacher hasn't scheduled any live classes yet."}
      </p>
      {isTeacher && (
        <Button className="mt-4" onClick={onCreateClick}>
          <Plus className="mr-2 h-4 w-4" />
          Schedule Live Class
        </Button>
      )}
    </div>
  );
};

export default EmptyLiveClasses;
