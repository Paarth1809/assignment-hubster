
import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { LiveClass } from "@/utils/types";
import { useToast } from "@/hooks/use-toast";

interface HostLiveClassDialogProps {
  isOpen: boolean;
  onClose: (updatedUrl?: string) => void;
  liveClass: LiveClass | null;
}

const HostLiveClassDialog = ({ isOpen, onClose, liveClass }: HostLiveClassDialogProps) => {
  const { toast } = useToast();
  const [hostUrl, setHostUrl] = useState(liveClass?.meetingUrl || "");

  return (
    <Dialog open={isOpen} onOpenChange={() => onClose(hostUrl)}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Host Live Class</DialogTitle>
          <DialogDescription>
            You're about to host a live class session.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          {liveClass && (
            <>
              <div className="mb-4">
                <h3 className="font-medium">{liveClass.title}</h3>
                <p className="text-sm text-muted-foreground">{liveClass.description}</p>
              </div>
              <Separator className="my-4" />
              <div className="mb-4">
                <Label htmlFor="hostUrl">Meeting URL</Label>
                <div className="flex items-center mt-1">
                  <Input 
                    id="hostUrl" 
                    value={hostUrl}
                    onChange={(e) => setHostUrl(e.target.value)}
                    className="mr-2"
                    readOnly
                  />
                  <Button 
                    variant="outline" 
                    size="icon" 
                    onClick={() => {
                      navigator.clipboard.writeText(hostUrl);
                      toast({
                        title: "Copied",
                        description: "Meeting URL copied to clipboard",
                      });
                    }}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                  </Button>
                </div>
                <p className="mt-2 text-sm text-muted-foreground">
                  Share this link with your students so they can join the live class.
                </p>
              </div>

              <div className="flex justify-between">
                <a 
                  href={hostUrl} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="flex-1 mr-2"
                >
                  <Button className="w-full">
                    Start Hosting
                  </Button>
                </a>
                <Button 
                  variant="outline" 
                  className="flex-1 ml-2" 
                  onClick={() => onClose(hostUrl)}
                >
                  Close
                </Button>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default HostLiveClassDialog;
