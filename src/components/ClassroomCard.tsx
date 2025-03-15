
import { Link } from "react-router-dom";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { BookOpen, Users, Calendar } from "lucide-react";
import { Classroom } from "@/utils/types";

interface ClassroomCardProps {
  classroom: Classroom;
}

// Define an array of background patterns
const backgroundPatterns = [
  "bg-gradient-to-r from-blue-600 to-indigo-600",
  "bg-gradient-to-r from-emerald-500 to-teal-600",
  "bg-gradient-to-r from-orange-500 to-amber-600",
  "bg-gradient-to-r from-purple-600 to-pink-600",
  "bg-gradient-to-r from-red-500 to-rose-600",
  "bg-gradient-to-r from-blue-500 to-cyan-600",
];

const ClassroomCard = ({ classroom }: ClassroomCardProps) => {
  // Generate a deterministic pattern based on the classroom ID
  const patternIndex = classroom.id.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0) % backgroundPatterns.length;
  const backgroundPattern = backgroundPatterns[patternIndex];
  
  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  return (
    <Link to={`/classroom/${classroom.id}`} className="block transition-transform hover:-translate-y-1">
      <Card className="h-full overflow-hidden border-0 shadow-lg hover:shadow-xl transition-shadow">
        <div className={`${backgroundPattern} h-24 flex items-center justify-center`}>
          <h3 className="text-xl font-bold text-white px-4 truncate max-w-full">
            {classroom.name}
          </h3>
        </div>
        <CardHeader className="pt-4 pb-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">{classroom.section || ''}</span>
            <span className="text-sm text-muted-foreground">{classroom.subject || ''}</span>
          </div>
        </CardHeader>
        <CardContent>
          {classroom.description && (
            <p className="text-sm text-muted-foreground line-clamp-2 mb-4">{classroom.description}</p>
          )}
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Users size={14} />
            <span>{classroom.teacherName}</span>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between border-t pt-4">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Calendar size={14} />
            <span>Created {formatDate(classroom.createdAt)}</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <BookOpen size={14} />
            <span>Class Code: {classroom.enrollmentCode}</span>
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
};

export default ClassroomCard;
