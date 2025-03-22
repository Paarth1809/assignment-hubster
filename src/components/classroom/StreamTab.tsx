
import { Assignment, Classroom, LiveClass } from "@/utils/types";
import { FileText, Video, Upload, Clock, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/utils/assignmentUtils";
import { useNavigate } from "react-router-dom";
import { getLiveClassesForClassroom } from "@/utils/storage";

interface StreamTabProps {
  classroom: Classroom;
  assignments: Assignment[];
}

const StreamTab = ({ classroom, assignments }: StreamTabProps) => {
  const { profile } = useAuth();
  const navigate = useNavigate();
  const isTeacher = profile?.role === 'teacher';
  
  // Get the next 3 upcoming live classes
  const liveClasses = getLiveClassesForClassroom(classroom.id)
    .filter(lc => lc.status === 'scheduled' || lc.status === 'live')
    .sort((a, b) => new Date(a.scheduledStart).getTime() - new Date(b.scheduledStart).getTime())
    .slice(0, 3);

  // Check if there's currently a live class
  const currentLiveClass = liveClasses.find(lc => lc.status === 'live');

  const handleCreateAction = (tab: string) => {
    navigate(`/classroom/${classroom.id}?tab=${tab}&create=true`);
  };

  const getStatusBadge = (status: LiveClass['status']) => {
    switch (status) {
      case 'scheduled':
        return <Badge variant="outline" className="bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300">Scheduled</Badge>;
      case 'live':
        return <Badge variant="outline" className="bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-300">Live Now</Badge>;
      case 'completed':
        return <Badge variant="outline" className="bg-gray-50 text-gray-700 dark:bg-gray-900/20 dark:text-gray-300">Completed</Badge>;
      case 'cancelled':
        return <Badge variant="outline" className="bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-300">Cancelled</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  return (
    <div className="space-y-8">
      {currentLiveClass && (
        <Card className="bg-green-900/20 border-green-700">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2">
              <Video className="h-5 w-5 text-green-500" />
              Live Class In Progress
              {getStatusBadge(currentLiveClass.status)}
            </CardTitle>
            <CardDescription>
              {currentLiveClass.title} is live now! Join to participate in the discussion.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              className="mt-2"
              onClick={() => navigate(`/classroom/${classroom.id}?tab=live`)}
            >
              Join Live Class
            </Button>
          </CardContent>
        </Card>
      )}
      
      <div className="bg-[#1A1A1A] rounded-lg border border-[#2A2A2A] p-6">
        <h2 className="text-xl font-medium mb-4 text-white">Class Description</h2>
        <p className="text-gray-400">
          {classroom.description || "No class description available."}
        </p>
      </div>
      
      {isTeacher && (
        <div className="bg-[#1A1A1A] rounded-lg border border-[#2A2A2A] p-6">
          <h2 className="text-xl font-medium mb-4 text-white">Quick Actions</h2>
          <div className="flex flex-wrap gap-3">
            <Button 
              className="bg-blue-600 hover:bg-blue-700 gap-2"
              onClick={() => handleCreateAction("assignments")}
            >
              <FileText className="h-4 w-4" />
              Create Assignment
            </Button>
            <Button 
              className="bg-green-600 hover:bg-green-700 gap-2"
              onClick={() => handleCreateAction("live")}
            >
              <Video className="h-4 w-4" />
              Schedule Live Class
            </Button>
            <Button 
              className="bg-purple-600 hover:bg-purple-700 gap-2"
              onClick={() => handleCreateAction("submissions")}
            >
              <Upload className="h-4 w-4" />
              Request Submission
            </Button>
          </div>
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <h2 className="text-xl font-medium text-white flex items-center gap-2">
            <FileText className="h-5 w-5 text-blue-500" />
            Upcoming Assignments
          </h2>
          {assignments.length > 0 ? (
            <div className="space-y-3">
              {assignments.slice(0, 3).map((assignment) => (
                <div 
                  key={assignment.id} 
                  className="flex items-start p-4 border border-[#2A2A2A] rounded-lg bg-[#1A1A1A] hover:bg-[#252525] transition-colors cursor-pointer"
                  onClick={() => navigate(`/classroom/${classroom.id}?tab=assignments`)}
                >
                  <div className="flex-shrink-0 mr-4">
                    <FileText className="h-5 w-5 text-blue-400" />
                  </div>
                  <div>
                    <h3 className="font-medium text-white">{assignment.title}</h3>
                    <div className="flex gap-3 text-sm text-gray-400">
                      <span>
                        {formatDate(assignment.dateSubmitted)}
                      </span>
                      {assignment.dueDate && (
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          Due: {formatDate(assignment.dueDate)}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              {assignments.length > 3 && (
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => navigate(`/classroom/${classroom.id}?tab=assignments`)}
                >
                  View All Assignments
                </Button>
              )}
            </div>
          ) : (
            <p className="text-gray-400">No upcoming assignments.</p>
          )}
        </div>
        
        <div className="space-y-4">
          <h2 className="text-xl font-medium text-white flex items-center gap-2">
            <Video className="h-5 w-5 text-green-500" />
            Upcoming Live Classes
          </h2>
          {liveClasses.length > 0 ? (
            <div className="space-y-3">
              {liveClasses.map((liveClass) => (
                <div 
                  key={liveClass.id} 
                  className={`flex items-start p-4 border rounded-lg transition-colors cursor-pointer ${
                    liveClass.status === 'live' 
                      ? 'border-green-700 bg-green-900/20 hover:bg-green-900/30' 
                      : 'border-[#2A2A2A] bg-[#1A1A1A] hover:bg-[#252525]'
                  }`}
                  onClick={() => navigate(`/classroom/${classroom.id}?tab=live`)}
                >
                  <div className="flex-shrink-0 mr-4">
                    <Video className={`h-5 w-5 ${liveClass.status === 'live' ? 'text-green-400' : 'text-gray-400'}`} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium text-white">{liveClass.title}</h3>
                      {getStatusBadge(liveClass.status)}
                    </div>
                    <div className="flex gap-3 text-sm text-gray-400 mt-1">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {formatDate(liveClass.scheduledStart)}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {new Date(liveClass.scheduledStart).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
              {getLiveClassesForClassroom(classroom.id).length > 3 && (
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => navigate(`/classroom/${classroom.id}?tab=live`)}
                >
                  View All Live Classes
                </Button>
              )}
            </div>
          ) : (
            <p className="text-gray-400">No upcoming live classes.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default StreamTab;
