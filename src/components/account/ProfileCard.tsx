
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserProfile } from '@/utils/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Settings, LogOut, Layout } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';

interface ProfileCardProps {
  profile: UserProfile;
  handleLogout: () => Promise<void>;
  updateProfile: (profile: UserProfile) => void;
}

export default function ProfileCard({ profile, handleLogout, updateProfile }: ProfileCardProps) {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(profile?.name || '');
  const [username, setUsername] = useState(profile?.username || '');
  const [isSaving, setIsSaving] = useState(false);

  // Get initials for avatar fallback
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  const handleSaveProfile = () => {
    setIsSaving(true);
    
    try {
      const updatedProfile = {
        ...profile,
        name,
        username
      };
      
      updateProfile(updatedProfile);
      
      toast({
        title: 'Profile updated',
        description: 'Your profile has been updated successfully.',
      });
      setIsEditing(false);
    } catch (error: any) {
      toast({
        title: 'Update failed',
        description: error.message || 'An error occurred',
        variant: 'destructive',
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-col items-center pt-6">
        <Avatar className="h-24 w-24 mb-4">
          <AvatarImage src={profile.avatar} alt={profile.name} />
          <AvatarFallback className="text-xl">{getInitials(profile.name)}</AvatarFallback>
        </Avatar>
        
        {isEditing ? (
          <div className="w-full space-y-4">
            <div className="space-y-2">
              <Label htmlFor="edit-name">Display Name</Label>
              <Input 
                id="edit-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your full name"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="edit-username">Username</Label>
              <Input 
                id="edit-username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Choose a username"
              />
            </div>
            
            <div className="flex gap-2">
              <Button 
                onClick={handleSaveProfile} 
                disabled={isSaving}
                className="flex-1"
              >
                {isSaving ? 'Saving...' : 'Save'}
              </Button>
              <Button 
                variant="outline" 
                onClick={() => {
                  setName(profile.name);
                  setUsername(profile.username || '');
                  setIsEditing(false);
                }}
                className="flex-1"
              >
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          <div className="text-center">
            <h2 className="text-xl font-semibold">{profile.name}</h2>
            {profile.username && (
              <p className="text-sm text-muted-foreground mb-1">@{profile.username}</p>
            )}
            <p className="text-sm text-muted-foreground">{profile.email}</p>
            <div className="mt-1 inline-block px-2 py-1 bg-primary/10 text-primary text-xs rounded-full">
              {profile.role === 'teacher' ? 'Teacher' : 'Student'}
            </div>
            <Button 
              variant="outline"
              size="sm"
              className="mt-3"
              onClick={() => setIsEditing(true)}
            >
              Edit Profile
            </Button>
          </div>
        )}
      </CardHeader>
      <CardContent>
        <div className="space-y-4 mt-2">
          <Button 
            variant="outline" 
            className="w-full justify-start"
            onClick={() => navigate('/settings')}
          >
            <Settings className="mr-2 h-4 w-4" />
            Settings
          </Button>
          <Button 
            variant="outline" 
            className="w-full justify-start"
            onClick={() => navigate('/')}
          >
            <Layout className="mr-2 h-4 w-4" />
            Dashboard
          </Button>
          <Separator />
          <Button 
            variant="outline" 
            className="w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/10"
            onClick={handleLogout}
          >
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
