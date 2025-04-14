
import { Classroom, UserProfile } from "@/utils/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { deleteClassroom, updateClassroom } from "@/utils/storage";
import { useNavigate } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";

interface SettingsTabProps {
  classroom: Classroom;
  currentUser?: UserProfile;
}

const SettingsTab = ({ classroom, currentUser }: SettingsTabProps) => {
  const [name, setName] = useState(classroom.name);
  const [section, setSection] = useState(classroom.section || "");
  const [subject, setSubject] = useState(classroom.subject || "");
  const [description, setDescription] = useState(classroom.description || "");
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const isTeacher = currentUser?.role === 'teacher';

  const handleSaveChanges = () => {
    // Update the classroom with the new details
    const updatedClassroom = {
      ...classroom,
      name,
      section: section || undefined,
      subject: subject || undefined,
      description: description || undefined,
    };
    
    updateClassroom(updatedClassroom);
    
    toast({
      title: "Settings saved",
      description: "Your classroom settings have been updated.",
    });
    setIsEditing(false);
  };
  
  const handleDeleteClass = () => {
    deleteClassroom(classroom.id);
    toast({
      title: "Classroom deleted",
      description: "The classroom has been permanently deleted.",
    });
    navigate('/');
  };

  if (!isTeacher) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-medium mb-2">Settings Access Restricted</h2>
        <p className="text-muted-foreground">
          Only teachers can access classroom settings.
        </p>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-xl font-medium mb-6">Class Settings</h2>
      
      <div className="space-y-6">
        <Card className="glass rounded-xl p-6 shadow-md">
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium mb-1">Class Details</h3>
              <p className="text-muted-foreground text-sm mb-4">
                Basic information about your class.
              </p>
              
              {isEditing ? (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Class Name</label>
                    <Input 
                      value={name} 
                      onChange={(e) => setName(e.target.value)} 
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Section</label>
                      <Input 
                        value={section} 
                        onChange={(e) => setSection(e.target.value)}
                        placeholder="e.g., Period 3"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Subject</label>
                      <Input 
                        value={subject} 
                        onChange={(e) => setSubject(e.target.value)}
                        placeholder="e.g., Mathematics"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Description</label>
                    <Textarea 
                      value={description} 
                      onChange={(e) => setDescription(e.target.value)} 
                      rows={3}
                      placeholder="Add a description for your class"
                    />
                  </div>
                  
                  <div className="flex flex-wrap gap-2 pt-2">
                    <Button onClick={handleSaveChanges}>
                      Save Changes
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={() => {
                        setName(classroom.name);
                        setSection(classroom.section || "");
                        setSubject(classroom.subject || "");
                        setDescription(classroom.description || "");
                        setIsEditing(false);
                      }}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="grid grid-cols-3 gap-4 py-2 border-b">
                    <div className="font-medium">Name</div>
                    <div className="col-span-2">{classroom.name}</div>
                  </div>
                  <div className="grid grid-cols-3 gap-4 py-2 border-b">
                    <div className="font-medium">Section</div>
                    <div className="col-span-2">{classroom.section || "—"}</div>
                  </div>
                  <div className="grid grid-cols-3 gap-4 py-2 border-b">
                    <div className="font-medium">Subject</div>
                    <div className="col-span-2">{classroom.subject || "—"}</div>
                  </div>
                  <div className="grid grid-cols-3 gap-4 py-2 border-b">
                    <div className="font-medium">Teacher</div>
                    <div className="col-span-2">{classroom.teacherName}</div>
                  </div>
                  <div className="grid grid-cols-3 gap-4 py-2 border-b">
                    <div className="font-medium">Class Code</div>
                    <div className="col-span-2 font-mono">{classroom.enrollmentCode}</div>
                  </div>
                  <div className="grid grid-cols-3 gap-4 py-2">
                    <div className="font-medium">Created</div>
                    <div className="col-span-2">
                      {new Date(classroom.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                  
                  <div className="pt-4">
                    <Button onClick={() => setIsEditing(true)}>
                      Edit Details
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </Card>
        
        <Card className="glass rounded-xl p-6 shadow-md border-destructive/20">
          <h3 className="text-lg font-medium text-destructive mb-4">Danger Zone</h3>
          <p className="text-sm text-muted-foreground mb-4">
            These actions are irreversible and will permanently affect your classroom.
          </p>
          
          <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
            <DialogTrigger asChild>
              <Button variant="destructive">
                Delete Class
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Delete Classroom</DialogTitle>
                <DialogDescription>
                  This will permanently remove the classroom and all its assignments. 
                  This action cannot be undone.
                </DialogDescription>
              </DialogHeader>
              <div className="pt-4 pb-2">
                <p>Are you sure you want to delete <strong>{classroom.name}</strong>?</p>
              </div>
              <DialogFooter className="pt-2">
                <Button variant="ghost" onClick={() => setShowDeleteDialog(false)}>
                  Cancel
                </Button>
                <Button variant="destructive" onClick={handleDeleteClass}>
                  Delete
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          
          <p className="text-xs text-muted-foreground mt-2">
            This will permanently remove the class and all its contents.
          </p>
        </Card>
      </div>
    </div>
  );
};

export default SettingsTab;
