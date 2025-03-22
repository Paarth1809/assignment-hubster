
import { Classroom } from "@/utils/types";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

interface ClassHeaderProps {
  classroom: Classroom;
}

const ClassHeader = ({ classroom }: ClassHeaderProps) => {
  return (
    <div className="bg-[#121212] text-white py-4 border-b border-[#2A2A2A]">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col space-y-4">
          <div className="flex items-center">
            <Button 
              variant="ghost" 
              size="sm" 
              asChild 
              className="text-gray-300 hover:text-white hover:bg-transparent"
            >
              <Link to="/classes">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to classes
              </Link>
            </Button>
          </div>
          
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold">{classroom.name}</h1>
              <p className="text-gray-400 mt-1">{classroom.section || ''} {classroom.section && classroom.subject ? '•' : ''} {classroom.subject || ''}</p>
            </div>
            <div className="bg-[#1A1A1A] px-4 py-2 rounded-lg border border-[#2A2A2A]">
              <p className="text-sm font-medium">{classroom.enrollmentCode}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClassHeader;
