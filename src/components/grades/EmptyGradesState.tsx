
import { FileText } from "lucide-react";

const EmptyGradesState = () => {
  return (
    <div className="text-center py-12 glass rounded-xl shadow-md">
      <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
      <h3 className="text-lg font-medium mb-2">No assignments yet</h3>
      <p className="text-muted-foreground max-w-md mx-auto">
        Grades will appear here once you have submitted assignments and they have been graded.
      </p>
    </div>
  );
};

export default EmptyGradesState;
