
import { Classroom } from "@/utils/types";
import { Users } from "lucide-react";

interface PeopleTabProps {
  classroom: Classroom;
}

const PeopleTab = ({ classroom }: PeopleTabProps) => {
  return (
    <div>
      <h2 className="text-xl font-medium mb-6">People</h2>
      
      <div className="glass rounded-xl shadow-md overflow-hidden">
        <div className="p-6 border-b">
          <h3 className="text-lg font-medium">Teachers</h3>
        </div>
        <div className="p-4">
          <div className="flex items-center p-2 hover:bg-muted/20 transition-colors rounded-md">
            <div className="flex-shrink-0 h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center mr-4">
              <Users className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="font-medium">{classroom.teacherName}</p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="glass rounded-xl shadow-md overflow-hidden mt-6">
        <div className="p-6 border-b">
          <h3 className="text-lg font-medium">Students</h3>
        </div>
        <div className="p-6 text-center text-muted-foreground">
          <p>No students have joined this class yet.</p>
          <p className="mt-2 text-sm">
            Students can join with class code: 
            <span className="font-mono font-medium ml-1">{classroom.enrollmentCode}</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default PeopleTab;
