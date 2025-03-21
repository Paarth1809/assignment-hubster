
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { UserProfile } from '@/utils/types';
import { Bell, Globe, Mail, MessageSquare } from 'lucide-react';

interface NotificationsTabProps {
  profile: UserProfile;
  updateProfile: (profile: Partial<UserProfile>) => Promise<void>;
}

export default function NotificationsTab({ profile, updateProfile }: NotificationsTabProps) {
  const { toast } = useToast();
  const [isSaving, setIsSaving] = useState(false);
  
  // Initialize notification preferences
  const [emailNotifications, setEmailNotifications] = useState(
    profile.preferences?.notifications?.email ?? true
  );
  const [browserNotifications, setBrowserNotifications] = useState(
    profile.preferences?.notifications?.browser ?? true
  );
  const [emailUpdates, setEmailUpdates] = useState(
    profile.preferences?.notifications?.emailUpdates ?? true
  );
  const [assignmentAlerts, setAssignmentAlerts] = useState(
    profile.preferences?.notifications?.newAssignmentAlerts ?? true
  );
  
  // Browser notification permission state
  const [notificationPermission, setNotificationPermission] = useState<NotificationPermission | null>(
    typeof Notification !== 'undefined' ? Notification.permission : null
  );
  
  // Request permission for browser notifications
  const requestNotificationPermission = async () => {
    if (typeof Notification === 'undefined') {
      toast({
        title: 'Notifications not supported',
        description: 'Your browser does not support notifications.',
        variant: 'destructive',
      });
      return;
    }
    
    try {
      const permission = await Notification.requestPermission();
      setNotificationPermission(permission);
      
      if (permission === 'granted') {
        toast({
          title: 'Notifications enabled',
          description: 'You will now receive browser notifications.',
        });
        
        // Send a test notification
        new Notification('AssignHub Notifications', {
          body: 'You have successfully enabled notifications!',
          icon: '/favicon.ico',
        });
      } else if (permission === 'denied') {
        toast({
          title: 'Notifications blocked',
          description: 'Please enable notifications in your browser settings.',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Error requesting notification permission:', error);
      toast({
        title: 'Error enabling notifications',
        description: 'There was a problem enabling notifications.',
        variant: 'destructive',
      });
    }
  };
  
  const saveNotificationSettings = async () => {
    setIsSaving(true);
    
    try {
      await updateProfile({
        preferences: {
          ...profile.preferences,
          notifications: {
            email: emailNotifications,
            browser: browserNotifications,
            emailUpdates: emailUpdates,
            newAssignmentAlerts: assignmentAlerts,
          }
        }
      });
      
      toast({
        title: 'Notification settings saved',
        description: 'Your notification preferences have been updated.',
      });
    } catch (error) {
      console.error('Error saving notification settings:', error);
      toast({
        title: 'Error saving settings',
        description: 'There was a problem saving your notification settings.',
        variant: 'destructive',
      });
    } finally {
      setIsSaving(false);
    }
  };
  
  // Helper for determining if notification permissions can be requested
  const canRequestNotifications = () => {
    return typeof Notification !== 'undefined' && notificationPermission !== 'granted';
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Notification Settings</h3>
        <p className="text-sm text-muted-foreground">
          Configure how you want to receive notifications from the platform
        </p>
      </div>
      
      <Separator />
      
      <div className="grid gap-6">
        {/* Notification Channels */}
        <Card>
          <CardHeader>
            <CardTitle>Notification Channels</CardTitle>
            <CardDescription>
              Choose how you want to be notified
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between space-x-2">
              <div className="flex items-center space-x-4">
                <div className="p-2 bg-primary/10 rounded-full">
                  <Mail className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <Label htmlFor="email-notifications" className="font-medium">
                    Email Notifications
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Receive email notifications for important updates
                  </p>
                </div>
              </div>
              <Switch
                id="email-notifications"
                checked={emailNotifications}
                onCheckedChange={setEmailNotifications}
              />
            </div>
            
            <div className="flex items-center justify-between space-x-2">
              <div className="flex items-center space-x-4">
                <div className="p-2 bg-primary/10 rounded-full">
                  <Globe className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <Label htmlFor="browser-notifications" className="font-medium">
                    Browser Notifications
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Get real-time notifications in your browser
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                {canRequestNotifications() && (
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={requestNotificationPermission}
                  >
                    Enable
                  </Button>
                )}
                <Switch
                  id="browser-notifications"
                  checked={browserNotifications}
                  onCheckedChange={setBrowserNotifications}
                  disabled={notificationPermission !== 'granted'}
                />
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Notification Types */}
        <Card>
          <CardHeader>
            <CardTitle>Notification Types</CardTitle>
            <CardDescription>
              Select which types of notifications you want to receive
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between space-x-2">
              <div className="flex items-center space-x-4">
                <div className="p-2 bg-primary/10 rounded-full">
                  <MessageSquare className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <Label htmlFor="email-updates" className="font-medium">
                    Weekly Updates and Newsletters
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Get weekly summaries and educational tips
                  </p>
                </div>
              </div>
              <Switch
                id="email-updates"
                checked={emailUpdates}
                onCheckedChange={setEmailUpdates}
              />
            </div>
            
            <div className="flex items-center justify-between space-x-2">
              <div className="flex items-center space-x-4">
                <div className="p-2 bg-primary/10 rounded-full">
                  <Bell className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <Label htmlFor="assignment-alerts" className="font-medium">
                    New Assignment Alerts
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Be notified when teachers post new assignments
                  </p>
                </div>
              </div>
              <Switch
                id="assignment-alerts"
                checked={assignmentAlerts}
                onCheckedChange={setAssignmentAlerts}
              />
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="flex justify-end">
        <Button 
          onClick={saveNotificationSettings} 
          disabled={isSaving}
        >
          {isSaving ? 'Saving...' : 'Save Settings'}
        </Button>
      </div>
    </div>
  );
}
