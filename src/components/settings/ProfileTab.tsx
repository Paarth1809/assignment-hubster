
import React, { useState } from 'react';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { UserProfile } from '@/utils/types';

interface ProfileTabProps {
  profile: UserProfile;
  updateProfile: (profile: UserProfile) => void;
}

export default function ProfileTab({ profile, updateProfile }: ProfileTabProps) {
  const [name, setName] = useState(profile?.name || '');
  const [email, setEmail] = useState(profile?.email || '');
  const [role, setRole] = useState<'student' | 'teacher'>(profile?.role || 'student');
  const [username, setUsername] = useState(profile?.username || '');
  const [isUpdating, setIsUpdating] = useState(false);
  
  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    
    setIsUpdating(true);
    
    try {
      const updatedProfile: UserProfile = {
        ...profile,
        name,
        email,
        role,
        username
      };
      
      updateProfile(updatedProfile);
    } catch (error: any) {
      console.error("Failed to update profile:", error);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <Card>
      <form onSubmit={handleUpdateProfile}>
        <CardHeader>
          <CardTitle>Profile Settings</CardTitle>
          <CardDescription>
            Manage your account information
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input 
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input 
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Choose a username"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input 
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled
              />
              <p className="text-xs text-muted-foreground">
                Email can only be changed through the authentication service
              </p>
            </div>
            
            <div className="space-y-2">
              <Label>Account Type</Label>
              <RadioGroup 
                value={role} 
                onValueChange={(value) => setRole(value as 'student' | 'teacher')}
                className="flex flex-col space-y-1"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="student" id="profile-student" />
                  <Label htmlFor="profile-student">Student</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="teacher" id="profile-teacher" />
                  <Label htmlFor="profile-teacher">Teacher</Label>
                </div>
              </RadioGroup>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit" disabled={isUpdating}>
            {isUpdating ? 'Saving...' : 'Save Changes'}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
