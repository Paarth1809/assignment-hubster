
import { Assignment } from "@/utils/types";
import { FileText } from "lucide-react";

interface GradesTabProps {
  assignments: Assignment[];
}

const GradesTab = ({ assignments }: GradesTabProps) => {
  return (
    <div>
      <h2 className="text-xl font-medium mb-6">Grades</h2>
      
      {assignments.length > 0 ? (
        <div className="glass rounded-xl shadow-md overflow-hidden">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b">
                <th className="text-left p-4">Assignment</th>
                <th className="text-left p-4">Submitted</th>
                <th className="text-right p-4">Grade</th>
              </tr>
            </thead>
            <tbody>
              {assignments.map((assignment) => (
                <tr key={assignment.id} className="border-b hover:bg-muted/20 transition-colors">
                  <td className="p-4">
                    <span className="font-medium">{assignment.title}</span>
                  </td>
                  <td className="p-4 text-muted-foreground">
                    {new Date(assignment.dateSubmitted).toLocaleDateString()}
                  </td>
                  <td className="p-4 text-right">
                    {assignment.grade ? (
                      <span className="font-medium">{assignment.grade}</span>
                    ) : (
                      <span className="text-muted-foreground">Not graded</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-center py-12 glass rounded-xl shadow-md">
          <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium mb-2">No assignments yet</h3>
          <p className="text-muted-foreground max-w-md mx-auto">
            Grades will appear here once you have submitted assignments and they have been graded.
          </p>
        </div>
      )}
    </div>
  );
};

export default GradesTab;
