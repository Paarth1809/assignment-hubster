
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { LiveClass, Classroom } from "@/utils/types";
import { createLiveClass, getLiveClassesForClassroom, updateLiveClass, deleteLiveClass } from "@/utils/storage/liveClasses";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/context/AuthContext";
import CreateLiveClassDialog from "./live/CreateLiveClassDialog";
import LiveClassCard from "./live/LiveClassCard";
import JoinLiveClassDialog from "./live/JoinLiveClassDialog";
import HostLiveClassDialog from "./live/HostLiveClassDialog";
import EmptyLiveClasses from "./live/EmptyLiveClasses";

interface LiveTabProps {
  classroom: Classroom;
}

const LiveTab = ({ classroom }: LiveTabProps) => {
  const { profile } = useAuth();
  const { toast } = useToast();
  const [liveClasses, setLiveClasses] = useState<LiveClass[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  const [selectedLiveClass, setSelectedLiveClass] = useState<LiveClass | null>(null);
  const [isJoining, setIsJoining] = useState(false);
  const [isHosting, setIsHosting] = useState(false);
  const [hostUrl, setHostUrl] = useState("");

  // Make sure profile is defined before assuming it's a teacher
  const isTeacher = profile?.role === 'teacher';

  // Fetch live classes when component mounts or classroom changes
  useEffect(() => {
    if (classroom?.id) {
      setLiveClasses(getLiveClassesForClassroom(classroom.id));
    }
  }, [classroom]);

  const handleCreateLiveClass = (liveClassToCreate: LiveClass) => {
    createLiveClass(liveClassToCreate);
    setLiveClasses(getLiveClassesForClassroom(classroom.id));
    setIsCreating(false);

    toast({
      title: "Live class created",
      description: "Your live class has been scheduled successfully"
    });
  };

  const handleStartLiveClass = (liveClass: LiveClass) => {
    // Generate a random meeting URL if one doesn't exist
    if (!liveClass.meetingUrl) {
      const roomId = Math.random().toString(36).substring(2, 12);
      liveClass.meetingUrl = `https://meet.jit.si/${roomId}`;
    }
    
    const updatedLiveClass = {
      ...liveClass,
      status: "live" as const,
      actualStart: new Date().toISOString()
    };
    
    updateLiveClass(updatedLiveClass);
    setLiveClasses(getLiveClassesForClassroom(classroom.id));
    
    toast({
      title: "Live class started",
      description: "Students can now join your live class"
    });
    
    // Open the hosting dialog
    setSelectedLiveClass(updatedLiveClass);
    setHostUrl(updatedLiveClass.meetingUrl);
    setIsHosting(true);
  };

  const handleEndLiveClass = (liveClass: LiveClass) => {
    const updatedLiveClass = {
      ...liveClass,
      status: "completed" as const,
      actualEnd: new Date().toISOString()
    };
    
    updateLiveClass(updatedLiveClass);
    setLiveClasses(getLiveClassesForClassroom(classroom.id));
    
    toast({
      title: "Live class ended",
      description: "Your live class has been marked as completed"
    });
  };

  const handleCancelLiveClass = (liveClass: LiveClass) => {
    const updatedLiveClass = {
      ...liveClass,
      status: "cancelled" as const
    };
    
    updateLiveClass(updatedLiveClass);
    setLiveClasses(getLiveClassesForClassroom(classroom.id));
    
    toast({
      title: "Live class cancelled",
      description: "Your live class has been cancelled"
    });
  };

  const handleDeleteLiveClass = (liveClassId: string) => {
    deleteLiveClass(liveClassId);
    setLiveClasses(getLiveClassesForClassroom(classroom.id));
    
    toast({
      title: "Live class deleted",
      description: "The live class has been deleted"
    });
  };

  const handleJoinLiveClass = (liveClass: LiveClass) => {
    setSelectedLiveClass(liveClass);
    setIsJoining(true);
  };

  const handleHostLiveClass = (liveClass: LiveClass) => {
    setSelectedLiveClass(liveClass);
    setHostUrl(liveClass.meetingUrl || '');
    setIsHosting(true);
  };

  const handleCloseHostDialog = (updatedUrl?: string) => {
    if (selectedLiveClass && updatedUrl && selectedLiveClass.meetingUrl !== updatedUrl) {
      const updatedLiveClass = {
        ...selectedLiveClass,
        meetingUrl: updatedUrl
      };
      updateLiveClass(updatedLiveClass);
      setLiveClasses(getLiveClassesForClassroom(classroom.id));
    }
    setIsHosting(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Live Classes</h2>
        {isTeacher && (
          <CreateLiveClassDialog 
            classroom={classroom}
            profileId={profile?.id}
            onCreate={handleCreateLiveClass}
          />
        )}
      </div>

      {liveClasses.length === 0 ? (
        <EmptyLiveClasses 
          isTeacher={isTeacher}
          onCreateClick={() => setIsCreating(true)}
        />
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {liveClasses
            .sort((a, b) => {
              // Sort order: Live > Scheduled > Completed > Cancelled
              const statusOrder = { live: 0, scheduled: 1, completed: 2, cancelled: 3 };
              if (statusOrder[a.status] !== statusOrder[b.status]) {
                return statusOrder[a.status] - statusOrder[b.status];
              }
              // For same status, sort by scheduled start date
              return new Date(b.scheduledStart).getTime() - new Date(a.scheduledStart).getTime();
            })
            .map(liveClass => (
              <LiveClassCard
                key={liveClass.id}
                liveClass={liveClass}
                isTeacher={isTeacher}
                onJoin={handleJoinLiveClass}
                onHost={handleHostLiveClass}
                onStart={handleStartLiveClass}
                onEnd={handleEndLiveClass}
                onCancel={handleCancelLiveClass}
                onDelete={handleDeleteLiveClass}
              />
            ))}
        </div>
      )}

      {/* Dialog for students to join live class */}
      <JoinLiveClassDialog
        isOpen={isJoining}
        onClose={() => setIsJoining(false)}
        liveClass={selectedLiveClass}
      />

      {/* Dialog for teachers to host live class */}
      <HostLiveClassDialog
        isOpen={isHosting}
        onClose={handleCloseHostDialog}
        liveClass={selectedLiveClass}
      />
    </div>
  );
};

export default LiveTab;
