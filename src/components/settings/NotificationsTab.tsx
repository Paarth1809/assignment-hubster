
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { UserProfile } from '@/utils/types';
import { useToast } from '@/hooks/use-toast';
import { Bell, Mail, Browser, Clock, Loader2 } from 'lucide-react';

interface NotificationsTabProps {
  profile: UserProfile;
  updateProfile: (profile: UserProfile) => void;
}

export default function NotificationsTab({ profile, updateProfile }: NotificationsTabProps) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Notification settings with defaults
  const [emailNotifications, setEmailNotifications] = useState(
    profile?.preferences?.notifications?.email || false
  );
  const [browserNotifications, setBrowserNotifications] = useState(
    profile?.preferences?.notifications?.browser || false
  );
  const [emailUpdates, setEmailUpdates] = useState(
    profile?.preferences?.notifications?.emailUpdates || false
  );
  const [newAssignmentAlerts, setNewAssignmentAlerts] = useState(
    profile?.preferences?.notifications?.newAssignmentAlerts || true
  );

  const handleUpdateNotifications = () => {
    setIsSubmitting(true);
    
    try {
      const updatedProfile: UserProfile = {
        ...profile,
        preferences: {
          ...profile.preferences,
          notifications: {
            email: emailNotifications,
            browser: browserNotifications,
            emailUpdates: emailUpdates,
            newAssignmentAlerts: newAssignmentAlerts
          }
        }
      };
      
      updateProfile(updatedProfile);
      
      toast({
        title: "Notification settings updated",
        description: "Your notification preferences have been saved successfully."
      });
    } catch (error: any) {
      console.error("Failed to update notifications:", error);
      toast({
        title: "Update failed",
        description: "There was an error updating your notification settings.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Request browser notification permission
  const requestBrowserPermission = async () => {
    if (!("Notification" in window)) {
      toast({
        title: "Notifications not supported",
        description: "This browser does not support desktop notifications",
        variant: "destructive"
      });
      return;
    }
    
    if (Notification.permission === "granted") {
      setBrowserNotifications(true);
      return;
    }
    
    if (Notification.permission !== "denied") {
      const permission = await Notification.requestPermission();
      if (permission === "granted") {
        setBrowserNotifications(true);
        toast({
          title: "Notifications enabled",
          description: "You will now receive browser notifications"
        });
      } else {
        toast({
          title: "Permission denied",
          description: "You need to allow notifications in your browser settings",
          variant: "destructive"
        });
      }
    } else {
      toast({
        title: "Permission denied",
        description: "You need to allow notifications in your browser settings",
        variant: "destructive"
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bell className="h-5 w-5" />
          Notification Settings
        </CardTitle>
        <CardDescription>
          Manage how you receive notifications about classroom activity
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-medium">Notification Channels</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Choose how you want to be notified about classroom activities
            </p>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    Email Notifications
                  </Label>
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
                  <Label className="flex items-center gap-2">
                    <Browser className="h-4 w-4" />
                    Browser Notifications
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Allow push notifications in your browser
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Switch 
                    checked={browserNotifications}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        requestBrowserPermission();
                      } else {
                        setBrowserNotifications(false);
                      }
                    }}
                  />
                  {browserNotifications && (
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => {
                        // Test notification
                        new Notification("Test Notification", {
                          body: "This is a test notification from the learning platform"
                        });
                      }}
                    >
                      Test
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>
          
          <Separator />
          
          <div>
            <h3 className="text-lg font-medium">Notification Types</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Select which types of notifications you want to receive
            </p>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    Weekly Email Updates
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Receive a weekly summary of your classroom activity
                  </p>
                </div>
                <Switch 
                  checked={emailUpdates}
                  onCheckedChange={setEmailUpdates}
                  disabled={!emailNotifications}
                />
              </div>
              
              <Separator />
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>New Assignment Alerts</Label>
                  <p className="text-sm text-muted-foreground">
                    Get notified when a new assignment is posted
                  </p>
                </div>
                <Switch 
                  checked={newAssignmentAlerts}
                  onCheckedChange={setNewAssignmentAlerts}
                />
              </div>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button onClick={handleUpdateNotifications} disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            'Save Notification Settings'
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}
