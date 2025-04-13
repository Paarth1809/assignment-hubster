
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Plus } from "lucide-react";
import { LiveClass, Classroom } from "@/utils/types";
import { useToast } from "@/hooks/use-toast";

interface CreateLiveClassDialogProps {
  classroom: Classroom;
  profileId: string | undefined;
  onCreate: (liveClass: LiveClass) => void;
}

const CreateLiveClassDialog = ({ classroom, profileId, onCreate }: CreateLiveClassDialogProps) => {
  const { toast } = useToast();
  const [isCreating, setIsCreating] = useState(false);
  const [newLiveClass, setNewLiveClass] = useState<Partial<LiveClass>>({
    title: "",
    description: "",
    scheduledStart: new Date().toISOString().slice(0, 16),
    status: "scheduled",
    classId: classroom.id,
    createdBy: profileId || "",
    meetingUrl: ""
  });

  const handleCreateLiveClass = () => {
    if (!newLiveClass.title || !newLiveClass.scheduledStart) {
      toast({
        title: "Missing information",
        description: "Please provide a title and scheduled start time",
        variant: "destructive"
      });
      return;
    }

    // Safety check for profile id
    if (!profileId) {
      toast({
        title: "Error",
        description: "You must be logged in to create a live class",
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
      classId: classroom.id,
      createdBy: profileId,
      meetingUrl: newLiveClass.meetingUrl
    };

    onCreate(liveClassToCreate);
    setIsCreating(false);
    setNewLiveClass({
      title: "",
      description: "",
      scheduledStart: new Date().toISOString().slice(0, 16),
      status: "scheduled",
      classId: classroom.id,
      createdBy: profileId,
      meetingUrl: ""
    });

    toast({
      title: "Live class created",
      description: "Your live class has been scheduled successfully"
    });
  };

  return (
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
            <p className="text-sm text-muted-foreground">
              Leave blank to auto-generate a meeting URL when you start the class
            </p>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setIsCreating(false)}>Cancel</Button>
          <Button onClick={handleCreateLiveClass}>Schedule Live Class</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CreateLiveClassDialog;
