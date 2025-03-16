
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { UserProfile } from '@/utils/types';

interface NotificationsTabProps {
  profile: UserProfile;
  updateProfile: (profile: UserProfile) => void;
}

export default function NotificationsTab({ profile, updateProfile }: NotificationsTabProps) {
  const [emailNotifications, setEmailNotifications] = useState(
    profile?.preferences?.notifications?.email || false
  );
  const [browserNotifications, setBrowserNotifications] = useState(
    profile?.preferences?.notifications?.browser || false
  );

  const handleUpdateNotifications = () => {
    try {
      const updatedProfile: UserProfile = {
        ...profile,
        preferences: {
          ...profile.preferences,
          notifications: {
            email: emailNotifications,
            browser: browserNotifications
          }
        }
      };
      
      updateProfile(updatedProfile);
    } catch (error: any) {
      console.error("Failed to update notifications:", error);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Notification Settings</CardTitle>
        <CardDescription>
          Manage how you receive notifications
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Email Notifications</Label>
              <p className="text-sm text-muted-foreground">
                Receive notifications about classroom activity via email
              </p>
            </div>
            <Switch 
              checked={emailNotifications}
              onCheckedChange={setEmailNotifications}
            />
          </div>
          
          <Separator />
          
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Browser Notifications</Label>
              <p className="text-sm text-muted-foreground">
                Allow push notifications in your browser
              </p>
            </div>
            <Switch 
              checked={browserNotifications}
              onCheckedChange={setBrowserNotifications}
            />
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button onClick={handleUpdateNotifications}>
          Save Notification Settings
        </Button>
      </CardFooter>
    </Card>
  );
}
