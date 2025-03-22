
import { Classroom } from "@/utils/types";
import { Button } from "@/components/ui/button";
import { ArrowLeft, FileText, Video, Users, BookOpen, Settings } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Badge } from "@/components/ui/badge";

interface ClassHeaderProps {
  classroom: Classroom;
  activeTab?: string;
}

const ClassHeader = ({ classroom, activeTab = "dashboard" }: ClassHeaderProps) => {
  const { profile } = useAuth();
  const navigate = useNavigate();
  const isTeacher = profile?.role === 'teacher';

  const handleQuickAction = (tab: string, action?: string) => {
    if (action) {
      navigate(`/classroom/${classroom.id}?tab=${tab}&create=true`);
    } else {
      navigate(`/classroom/${classroom.id}?tab=${tab}`);
    }
  };

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
          
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold">{classroom.name}</h1>
              <p className="text-gray-400 mt-1">
                {classroom.section || ''} {classroom.section && classroom.subject ? '•' : ''} {classroom.subject || ''}
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="bg-[#1A1A1A] px-4 py-2 rounded-lg border border-[#2A2A2A] flex items-center">
                <p className="text-sm font-medium mr-2">Code:</p>
                <Badge variant="secondary" className="bg-blue-500/20 text-blue-300">
                  {classroom.enrollmentCode}
                </Badge>
              </div>
              
              {isTeacher && (
                <div className="flex gap-2">
                  {activeTab !== "live" && (
                    <Button 
                      size="sm"
                      variant="outline"
                      className="gap-1 border-green-600 text-green-500 hover:bg-green-600/20"
                      onClick={() => handleQuickAction("live", "create")}
                    >
                      <Video className="h-3.5 w-3.5" />
                      <span className="hidden sm:inline">Live</span>
                    </Button>
                  )}
                  {activeTab !== "assignments" && (
                    <Button 
                      size="sm" 
                      variant="outline"
                      className="gap-1 border-blue-600 text-blue-500 hover:bg-blue-600/20"
                      onClick={() => handleQuickAction("assignments", "create")}
                    >
                      <FileText className="h-3.5 w-3.5" />
                      <span className="hidden sm:inline">Assignment</span>
                    </Button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClassHeader;
