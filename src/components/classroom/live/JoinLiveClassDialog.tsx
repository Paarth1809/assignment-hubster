
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { LiveClass } from "@/utils/types";

interface JoinLiveClassDialogProps {
  isOpen: boolean;
  onClose: () => void;
  liveClass: LiveClass | null;
}

const JoinLiveClassDialog = ({ isOpen, onClose, liveClass }: JoinLiveClassDialogProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Join Live Class</DialogTitle>
          <DialogDescription>
            You're about to join the live class session.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          {liveClass?.meetingUrl ? (
            <>
              <div className="mb-4">
                <h3 className="font-medium">{liveClass.title}</h3>
                <p className="text-sm text-muted-foreground">{liveClass.description}</p>
              </div>
              <Separator className="my-4" />
              <p className="text-sm mb-4">
                You're about to join the live class. Click the button below to open the meeting link.
              </p>
              <div className="flex justify-center">
                <a 
                  href={liveClass.meetingUrl} 
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
          <Button variant="outline" onClick={onClose}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default JoinLiveClassDialog;
