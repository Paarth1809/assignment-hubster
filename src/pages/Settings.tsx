
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Shield, User, Bell } from 'lucide-react';
import { UserProfile } from '@/utils/types';

export default function Settings() {
  const { profile, updateProfile, signOut } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<string>('profile');
  
  // Profile state
  const [name, setName] = useState(profile?.name || '');
  const [email, setEmail] = useState(profile?.email || '');
  const [role, setRole] = useState<'student' | 'teacher'>(profile?.role || 'student');
  const [isUpdating, setIsUpdating] = useState(false);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!profile) return;
    
    setIsUpdating(true);
    
    try {
      const updatedProfile: UserProfile = {
        ...profile,
        name,
        email,
        role
      };
      
      updateProfile(updatedProfile);
      
      toast({
        title: 'Profile updated',
        description: 'Your profile has been updated successfully.',
      });
    } catch (error: any) {
      toast({
        title: 'Update failed',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const handleLogout = async () => {
    await signOut();
    toast({
      title: 'Logged out',
      description: 'You have been logged out successfully.',
    });
    navigate('/');
  };

  if (!profile) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="pt-20 pb-20 px-6">
          <div className="max-w-4xl mx-auto text-center py-12">
            <h1 className="text-2xl font-bold">Please login to access settings</h1>
            <Button onClick={() => navigate('/auth')} className="mt-4">
              Go to Login
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-20 pb-20 px-6">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">Settings</h1>
          
          <div className="flex flex-col md:flex-row gap-6">
            <Card className="w-full md:w-64 h-fit">
              <CardContent className="p-6">
                <Tabs 
                  orientation="vertical" 
                  value={activeTab} 
                  onValueChange={setActiveTab} 
                  className="w-full space-y-4"
                >
                  <TabsList className="flex flex-col h-auto p-0 bg-transparent">
                    <TabsTrigger 
                      value="profile" 
                      className="w-full justify-start mb-1 data-[state=active]:bg-primary/10 p-2 rounded"
                    >
                      <User className="mr-2 h-4 w-4" />
                      Account
                    </TabsTrigger>
                    <TabsTrigger 
                      value="notifications" 
                      className="w-full justify-start mb-1 data-[state=active]:bg-primary/10 p-2 rounded"
                    >
                      <Bell className="mr-2 h-4 w-4" />
                      Notifications
                    </TabsTrigger>
                    <TabsTrigger 
                      value="security" 
                      className="w-full justify-start mb-1 data-[state=active]:bg-primary/10 p-2 rounded"
                    >
                      <Shield className="mr-2 h-4 w-4" />
                      Security
                    </TabsTrigger>
                  </TabsList>
                </Tabs>
                
                <Separator className="my-4" />
                
                <Button 
                  variant="outline" 
                  className="w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/10"
                  onClick={handleLogout}
                >
                  Logout
                </Button>
              </CardContent>
            </Card>
            
            <div className="flex-1">
              <TabsContent value="profile" className="mt-0">
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
                          <Label>Role</Label>
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
              </TabsContent>
              
              <TabsContent value="notifications" className="mt-0">
                <Card>
                  <CardHeader>
                    <CardTitle>Notification Settings</CardTitle>
                    <CardDescription>
                      Manage how you receive notifications
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">
                      Notification settings will be available in a future update.
                    </p>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="security" className="mt-0">
                <Card>
                  <CardHeader>
                    <CardTitle>Security Settings</CardTitle>
                    <CardDescription>
                      Manage your password and account security
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">
                      Security settings will be available in a future update.
                    </p>
                  </CardContent>
                </Card>
              </TabsContent>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
