
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';

export default function SecurityTab() {
  const { toast } = useToast();

  const handlePasswordChange = () => {
    toast({
      title: 'Password update',
      description: 'Password change functionality is simulated in this demo.',
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Security Settings</CardTitle>
        <CardDescription>
          Manage your password and account security
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="current-password">Current Password</Label>
            <Input 
              id="current-password"
              type="password"
              placeholder="Enter your current password"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="new-password">New Password</Label>
            <Input 
              id="new-password"
              type="password"
              placeholder="Enter your new password"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="confirm-password">Confirm New Password</Label>
            <Input 
              id="confirm-password"
              type="password"
              placeholder="Confirm your new password"
            />
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button onClick={handlePasswordChange}>
          Change Password
        </Button>
      </CardFooter>
    </Card>
  );
}
