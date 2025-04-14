
import { Assignment } from "@/utils/types";

interface GradesTableProps {
  assignments: Assignment[];
}

const GradesTable = ({ assignments }: GradesTableProps) => {
  return (
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
  );
};

export default GradesTable;
