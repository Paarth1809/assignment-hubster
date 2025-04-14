
import { Assignment, Classroom } from "@/utils/types";
import { FileText } from "lucide-react";

interface StreamTabProps {
  classroom: Classroom;
  assignments: Assignment[];
}

const StreamTab = ({ classroom, assignments }: StreamTabProps) => {
  return (
    <div className="space-y-8">
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 shadow-md">
        <h2 className="text-xl font-medium mb-4 text-white">Class Description</h2>
        <p className="text-gray-400">
          {classroom.description || "No class description available."}
        </p>
      </div>
      
      <div className="space-y-4">
        <h2 className="text-xl font-medium text-white">Upcoming</h2>
        {assignments.length > 0 ? (
          <div className="space-y-3">
            {assignments.slice(0, 3).map((assignment) => (
              <div 
                key={assignment.id} 
                className="flex items-start p-4 border border-gray-800 rounded-lg bg-gray-900 hover:bg-gray-800 transition-colors"
              >
                <div className="flex-shrink-0 mr-4">
                  <FileText className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium text-white">{assignment.title}</h3>
                  <p className="text-sm text-gray-400">
                    {new Date(assignment.dateSubmitted).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-400">No upcoming assignments.</p>
        )}
      </div>
    </div>
  );
};

export default StreamTab;
