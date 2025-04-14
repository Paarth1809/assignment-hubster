
import { Assignment, Classroom, Announcement } from "@/utils/types";
import { FileText } from "lucide-react";

interface StreamTabProps {
  classroom: Classroom;
  assignments?: Assignment[];
  announcements?: Announcement[];
}

const StreamTab = ({ classroom, assignments = [], announcements = [] }: StreamTabProps) => {
  return (
    <div className="space-y-8">
      <div className="glass rounded-xl p-6 shadow-md">
        <h2 className="text-xl font-medium mb-4">Class Description</h2>
        <p className="text-muted-foreground">
          {classroom.description || "No class description available."}
        </p>
      </div>
      
      {announcements.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-xl font-medium">Announcements</h2>
          <div className="space-y-3">
            {announcements.map((announcement) => (
              <div 
                key={announcement.id} 
                className="p-4 border rounded-lg hover:bg-muted/20 transition-colors"
              >
                <h3 className="font-medium">{announcement.title}</h3>
                <p className="text-sm text-muted-foreground mt-2">{announcement.content}</p>
                <div className="flex justify-between mt-3 text-xs text-muted-foreground">
                  <span>{announcement.author}</span>
                  <span>{new Date(announcement.dateCreated).toLocaleDateString()}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      
      <div className="space-y-4">
        <h2 className="text-xl font-medium">Upcoming</h2>
        {assignments.length > 0 ? (
          <div className="space-y-3">
            {assignments.slice(0, 3).map((assignment) => (
              <div 
                key={assignment.id} 
                className="flex items-start p-4 border rounded-lg hover:bg-muted/20 transition-colors"
              >
                <div className="flex-shrink-0 mr-4">
                  <FileText className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium">{assignment.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    {new Date(assignment.dateSubmitted).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground">No upcoming assignments.</p>
        )}
      </div>
    </div>
  );
};

export default StreamTab;
