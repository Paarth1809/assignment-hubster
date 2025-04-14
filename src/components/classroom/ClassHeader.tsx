
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Classroom } from "@/utils/types";

interface ClassHeaderProps {
  classroom: Classroom;
}

const ClassHeader = ({ classroom }: ClassHeaderProps) => {
  return (
    <header className="bg-black border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <Link to="/" className="inline-flex items-center text-sm text-gray-400 hover:text-white mb-4">
          <ArrowLeft className="mr-1 h-4 w-4" />
          Back to classes
        </Link>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-white">{classroom.name}</h1>
            <div className="flex items-center text-gray-400 gap-1 mt-1">
              {classroom.section && <span>{classroom.section}</span>}
              {classroom.section && classroom.subject && <span>•</span>}
              {classroom.subject && <span>{classroom.subject}</span>}
            </div>
          </div>
          <div className="flex items-center text-sm text-gray-400">
            <span className="border border-gray-700 px-3 py-1 rounded font-mono">
              {classroom.enrollmentCode}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default ClassHeader;
