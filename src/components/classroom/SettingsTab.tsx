
import { Classroom } from "@/utils/types";
import { Button } from "@/components/ui/button";

interface SettingsTabProps {
  classroom: Classroom;
}

const SettingsTab = ({ classroom }: SettingsTabProps) => {
  return (
    <div>
      <h2 className="text-xl font-medium mb-6">Class Settings</h2>
      
      <div className="glass rounded-xl p-6 shadow-md space-y-6">
        <div>
          <h3 className="text-lg font-medium mb-1">Class Details</h3>
          <p className="text-muted-foreground text-sm mb-4">
            Basic information about your class.
          </p>
          
          <div className="space-y-3">
            <div className="grid grid-cols-3 gap-4 py-2 border-b">
              <div className="font-medium">Name</div>
              <div className="col-span-2">{classroom.name}</div>
            </div>
            <div className="grid grid-cols-3 gap-4 py-2 border-b">
              <div className="font-medium">Section</div>
              <div className="col-span-2">{classroom.section || "—"}</div>
            </div>
            <div className="grid grid-cols-3 gap-4 py-2 border-b">
              <div className="font-medium">Subject</div>
              <div className="col-span-2">{classroom.subject || "—"}</div>
            </div>
            <div className="grid grid-cols-3 gap-4 py-2 border-b">
              <div className="font-medium">Teacher</div>
              <div className="col-span-2">{classroom.teacherName}</div>
            </div>
            <div className="grid grid-cols-3 gap-4 py-2 border-b">
              <div className="font-medium">Class Code</div>
              <div className="col-span-2 font-mono">{classroom.enrollmentCode}</div>
            </div>
            <div className="grid grid-cols-3 gap-4 py-2">
              <div className="font-medium">Created</div>
              <div className="col-span-2">
                {new Date(classroom.createdAt).toLocaleDateString()}
              </div>
            </div>
          </div>
        </div>
        
        <div className="pt-4">
          <Button variant="destructive">
            Delete Class
          </Button>
          <p className="text-xs text-muted-foreground mt-2">
            This will permanently remove the class and all its contents.
          </p>
        </div>
      </div>
    </div>
  );
};

export default SettingsTab;
