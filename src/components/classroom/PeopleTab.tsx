
import { Classroom, UserProfile } from "@/utils/types";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Copy, Check, UserPlus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface PeopleTabProps {
  classroom: Classroom;
  currentUser?: UserProfile;
}

const PeopleTab = ({ classroom, currentUser }: PeopleTabProps) => {
  const { toast } = useToast();
  const [copySuccess, setCopySuccess] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');

  const copyClassCode = () => {
    navigator.clipboard.writeText(classroom.enrollmentCode);
    setCopySuccess(true);
    
    toast({
      title: "Class code copied",
      description: "The enrollment code has been copied to your clipboard.",
    });
    
    setTimeout(() => setCopySuccess(false), 3000);
  };

  const sendInvite = (e: React.FormEvent) => {
    e.preventDefault();
    
    // In a real app, this would send an email invitation
    toast({
      title: "Invitation sent",
      description: `An invitation has been sent to ${inviteEmail}.`,
    });
    
    setInviteEmail('');
  };

  // Get initials for avatar fallback
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  const isTeacher = currentUser?.role === 'teacher';

  return (
    <div className="space-y-8">
      {isTeacher && (
        <Card className="border shadow-sm">
          <CardHeader>
            <CardTitle>Invite Students</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Class Code</label>
                <div className="flex mt-1.5">
                  <div className="bg-muted flex-1 rounded-l-md px-3 py-2 font-mono">
                    {classroom.enrollmentCode}
                  </div>
                  <Button
                    variant="secondary"
                    className="rounded-l-none"
                    onClick={copyClassCode}
                  >
                    {copySuccess ? (
                      <Check className="h-4 w-4 text-green-500" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground mt-1.5">
                  Share this code with students to join your class
                </p>
              </div>

              <div className="border-t pt-4">
                <form onSubmit={sendInvite} className="flex flex-col sm:flex-row gap-2">
                  <Input
                    type="email"
                    placeholder="student@example.com"
                    value={inviteEmail}
                    onChange={(e) => setInviteEmail(e.target.value)}
                    className="flex-1"
                    required
                  />
                  <Button type="submit">
                    <UserPlus className="h-4 w-4 mr-2" />
                    Invite
                  </Button>
                </form>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-medium mb-4">Teachers</h3>
          <div className="border rounded-lg divide-y">
            <div className="flex items-center gap-4 p-4">
              <Avatar>
                <AvatarImage src="" alt={classroom.teacherName} />
                <AvatarFallback>{getInitials(classroom.teacherName)}</AvatarFallback>
              </Avatar>
              <div>
                <div className="font-medium">{classroom.teacherName}</div>
                <div className="text-sm text-muted-foreground">Teacher</div>
              </div>
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-medium mb-4">Students</h3>
          <div className="border rounded-lg">
            <div className="p-8 text-center text-muted-foreground">
              <p>No students have joined this class yet.</p>
              {isTeacher && (
                <p className="text-sm mt-1">
                  Share the class code with your students to get started.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PeopleTab;
