
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { AlertCircle, Calendar, Clock, Link, Play, Plus, Video, X } from "lucide-react";
import { LiveClass, UserProfile } from "@/utils/types";
import { createLiveClass, getLiveClassesForClassroom, updateLiveClass, deleteLiveClass } from "@/utils/storage";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/utils/assignmentUtils";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface LiveTabProps {
  classId: string;
  currentUser: UserProfile;
}

const LiveTab = ({ classId, currentUser }: LiveTabProps) => {
  const { toast } = useToast();
  const [liveClasses, setLiveClasses] = useState<LiveClass[]>(getLiveClassesForClassroom(classId));
  const [isCreating, setIsCreating] = useState(false);
  const [newLiveClass, setNewLiveClass] = useState<Partial<LiveClass>>({
    title: "",
    description: "",
    scheduledStart: new Date().toISOString().slice(0, 16),
    status: "scheduled",
    classId,
    createdBy: currentUser.id,
    meetingUrl: ""
  });
  const [selectedLiveClass, setSelectedLiveClass] = useState<LiveClass | null>(null);
  const [isJoining, setIsJoining] = useState(false);

  const isTeacher = currentUser.role === 'teacher';

  const handleCreateLiveClass = () => {
    if (!newLiveClass.title || !newLiveClass.scheduledStart) {
      toast({
        title: "Missing information",
        description: "Please provide a title and scheduled start time",
        variant: "destructive"
      });
      return;
    }

    const liveClassToCreate: LiveClass = {
      id: `live-${Date.now()}`,
      title: newLiveClass.title || "",
      description: newLiveClass.description,
      scheduledStart: newLiveClass.scheduledStart || new Date().toISOString(),
      scheduledEnd: newLiveClass.scheduledEnd,
      status: "scheduled",
      classId,
      createdBy: currentUser.id,
      meetingUrl: newLiveClass.meetingUrl
    };

    createLiveClass(liveClassToCreate);
    setLiveClasses(getLiveClassesForClassroom(classId));
    setIsCreating(false);
    setNewLiveClass({
      title: "",
      description: "",
      scheduledStart: new Date().toISOString().slice(0, 16),
      status: "scheduled",
      classId,
      createdBy: currentUser.id,
      meetingUrl: ""
    });

    toast({
      title: "Live class created",
      description: "Your live class has been scheduled successfully"
    });
  };

  const handleStartLiveClass = (liveClass: LiveClass) => {
    const updatedLiveClass = {
      ...liveClass,
      status: "live" as const,
      actualStart: new Date().toISOString()
    };
    
    updateLiveClass(updatedLiveClass);
    setLiveClasses(getLiveClassesForClassroom(classId));
    
    toast({
      title: "Live class started",
      description: "Students can now join your live class"
    });
  };

  const handleEndLiveClass = (liveClass: LiveClass) => {
    const updatedLiveClass = {
      ...liveClass,
      status: "completed" as const,
      actualEnd: new Date().toISOString()
    };
    
    updateLiveClass(updatedLiveClass);
    setLiveClasses(getLiveClassesForClassroom(classId));
    
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
    setLiveClasses(getLiveClassesForClassroom(classId));
    
    toast({
      title: "Live class cancelled",
      description: "Your live class has been cancelled"
    });
  };

  const handleDeleteLiveClass = (liveClassId: string) => {
    deleteLiveClass(liveClassId);
    setLiveClasses(getLiveClassesForClassroom(classId));
    
    toast({
      title: "Live class deleted",
      description: "The live class has been deleted"
    });
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

  const handleJoinLiveClass = (liveClass: LiveClass) => {
    setSelectedLiveClass(liveClass);
    setIsJoining(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Live Classes</h2>
        {isTeacher && (
          <Dialog open={isCreating} onOpenChange={setIsCreating}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                Schedule Live Class
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Schedule a Live Class</DialogTitle>
                <DialogDescription>
                  Create a new live class session for your students. Fill in the details below to schedule it.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="title">Title</Label>
                  <Input 
                    id="title" 
                    value={newLiveClass.title || ''}
                    onChange={(e) => setNewLiveClass({...newLiveClass, title: e.target.value})}
                    placeholder="Class title"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea 
                    id="description" 
                    value={newLiveClass.description || ''}
                    onChange={(e) => setNewLiveClass({...newLiveClass, description: e.target.value})}
                    placeholder="Provide details about this live class"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="scheduledStart">Scheduled Start</Label>
                  <Input 
                    id="scheduledStart" 
                    type="datetime-local"
                    value={newLiveClass.scheduledStart ? new Date(newLiveClass.scheduledStart).toISOString().slice(0, 16) : ''}
                    onChange={(e) => setNewLiveClass({...newLiveClass, scheduledStart: e.target.value})}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="scheduledEnd">Scheduled End (Optional)</Label>
                  <Input 
                    id="scheduledEnd" 
                    type="datetime-local"
                    value={newLiveClass.scheduledEnd ? new Date(newLiveClass.scheduledEnd).toISOString().slice(0, 16) : ''}
                    onChange={(e) => setNewLiveClass({...newLiveClass, scheduledEnd: e.target.value})}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="meetingUrl">Meeting URL (Optional)</Label>
                  <Input 
                    id="meetingUrl" 
                    value={newLiveClass.meetingUrl || ''}
                    onChange={(e) => setNewLiveClass({...newLiveClass, meetingUrl: e.target.value})}
                    placeholder="https://meet.example.com/your-meeting-id"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsCreating(false)}>Cancel</Button>
                <Button onClick={handleCreateLiveClass}>Schedule Live Class</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </div>

      {liveClasses.length === 0 ? (
        <div className="py-12 text-center">
          <Video className="mx-auto h-12 w-12 text-muted-foreground opacity-50" />
          <h3 className="mt-4 text-lg font-medium">No live classes scheduled</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            {isTeacher 
              ? "Schedule a live class for your students by clicking the 'Schedule Live Class' button." 
              : "Your teacher hasn't scheduled any live classes yet."}
          </p>
          {isTeacher && (
            <Button className="mt-4" onClick={() => setIsCreating(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Schedule Live Class
            </Button>
          )}
        </div>
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
              <Card key={liveClass.id} className={liveClass.status === 'live' ? 'border-green-500 dark:border-green-700' : ''}>
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg">{liveClass.title}</CardTitle>
                    {getStatusBadge(liveClass.status)}
                  </div>
                  <CardDescription className="line-clamp-2">
                    {liveClass.description || "No description provided"}
                  </CardDescription>
                </CardHeader>
                <CardContent className="pb-2 text-sm">
                  <div className="flex flex-col space-y-2">
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span>{formatDate(liveClass.scheduledStart)}</span>
                    </div>
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span>
                        {new Date(liveClass.scheduledStart).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        {liveClass.scheduledEnd && ` - ${new Date(liveClass.scheduledEnd).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`}
                      </span>
                    </div>
                    {liveClass.meetingUrl && (
                      <div className="flex items-center">
                        <Link className="h-4 w-4 mr-2 text-muted-foreground" />
                        <a 
                          href={liveClass.meetingUrl} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-primary truncate hover:underline"
                        >
                          Meeting Link
                        </a>
                      </div>
                    )}
                  </div>
                </CardContent>
                <CardFooter className="pt-2">
                  {isTeacher ? (
                    <div className="flex flex-wrap justify-between w-full gap-2">
                      {liveClass.status === 'scheduled' && (
                        <>
                          <Button size="sm" onClick={() => handleStartLiveClass(liveClass)}>
                            <Play className="h-4 w-4 mr-2" />
                            Start Class
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline" 
                            onClick={() => handleCancelLiveClass(liveClass)}
                          >
                            <X className="h-4 w-4 mr-2" />
                            Cancel
                          </Button>
                        </>
                      )}
                      {liveClass.status === 'live' && (
                        <Button 
                          size="sm" 
                          variant="destructive" 
                          onClick={() => handleEndLiveClass(liveClass)}
                        >
                          End Class
                        </Button>
                      )}
                      {(liveClass.status === 'completed' || liveClass.status === 'cancelled') && (
                        <Button 
                          size="sm" 
                          variant="outline" 
                          onClick={() => handleDeleteLiveClass(liveClass.id)}
                        >
                          Delete
                        </Button>
                      )}
                    </div>
                  ) : (
                    <div className="w-full">
                      {liveClass.status === 'live' ? (
                        <Button 
                          className="w-full" 
                          onClick={() => handleJoinLiveClass(liveClass)}
                        >
                          Join Live Class
                        </Button>
                      ) : liveClass.status === 'scheduled' ? (
                        <Button 
                          variant="outline" 
                          className="w-full"
                          disabled
                        >
                          Not Started Yet
                        </Button>
                      ) : (
                        <Button 
                          variant="outline" 
                          className="w-full" 
                          disabled
                        >
                          {liveClass.status === 'completed' ? 'Class Ended' : 'Class Cancelled'}
                        </Button>
                      )}
                    </div>
                  )}
                </CardFooter>
              </Card>
            ))}
        </div>
      )}

      <Dialog open={isJoining} onOpenChange={setIsJoining}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Join Live Class</DialogTitle>
            <DialogDescription>
              You're about to join the live class session.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            {selectedLiveClass?.meetingUrl ? (
              <>
                <div className="mb-4">
                  <h3 className="font-medium">{selectedLiveClass.title}</h3>
                  <p className="text-sm text-muted-foreground">{selectedLiveClass.description}</p>
                </div>
                <Separator className="my-4" />
                <p className="text-sm mb-4">
                  You're about to join the live class. Click the button below to open the meeting link.
                </p>
                <div className="flex justify-center">
                  <a 
                    href={selectedLiveClass.meetingUrl} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="w-full"
                  >
                    <Button className="w-full">
                      Join Meeting
                    </Button>
                  </a>
                </div>
              </>
            ) : (
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>No meeting link available</AlertTitle>
                <AlertDescription>
                  The teacher has not provided a meeting link for this live class. Please contact your teacher for more information.
                </AlertDescription>
              </Alert>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsJoining(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default LiveTab;
