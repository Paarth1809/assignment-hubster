
import { useState, useEffect } from 'react';
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
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Shield, User, Bell, Palette, Languages } from 'lucide-react';
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

  // Notification preferences
  const [emailNotifications, setEmailNotifications] = useState(profile?.preferences?.notifications?.email || false);
  const [browserNotifications, setBrowserNotifications] = useState(profile?.preferences?.notifications?.browser || false);

  // Theme settings
  const [theme, setTheme] = useState(profile?.preferences?.theme || 'system');
  
  // Language settings
  const [language, setLanguage] = useState(profile?.preferences?.language || 'en');

  useEffect(() => {
    if (profile) {
      setName(profile.name || '');
      setEmail(profile.email || '');
      setRole(profile.role || 'student');
      setEmailNotifications(profile.preferences?.notifications?.email || false);
      setBrowserNotifications(profile.preferences?.notifications?.browser || false);
      setTheme(profile.preferences?.theme || 'system');
      setLanguage(profile.preferences?.language || 'en');
    }
  }, [profile]);

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

  const handleUpdateNotifications = () => {
    if (!profile) return;
    
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
      
      toast({
        title: 'Notification settings updated',
        description: 'Your notification preferences have been saved.',
      });
    } catch (error: any) {
      toast({
        title: 'Update failed',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  const handleUpdateAppearance = () => {
    if (!profile) return;
    
    try {
      const updatedProfile: UserProfile = {
        ...profile,
        preferences: {
          ...profile.preferences,
          theme,
          language
        }
      };
      
      updateProfile(updatedProfile);
      
      toast({
        title: 'Appearance settings updated',
        description: 'Your appearance preferences have been saved.',
      });
    } catch (error: any) {
      toast({
        title: 'Update failed',
        description: error.message,
        variant: 'destructive',
      });
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
                      value="appearance" 
                      className="w-full justify-start mb-1 data-[state=active]:bg-primary/10 p-2 rounded"
                    >
                      <Palette className="mr-2 h-4 w-4" />
                      Appearance
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
              </TabsContent>
              
              <TabsContent value="appearance" className="mt-0">
                <Card>
                  <CardHeader>
                    <CardTitle>Appearance Settings</CardTitle>
                    <CardDescription>
                      Customize how the application looks
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label>Theme</Label>
                        <RadioGroup 
                          value={theme} 
                          onValueChange={(value) => setTheme(value as 'light' | 'dark' | 'system')}
                          className="flex flex-col space-y-1"
                        >
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="light" id="theme-light" />
                            <Label htmlFor="theme-light">Light</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="dark" id="theme-dark" />
                            <Label htmlFor="theme-dark">Dark</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="system" id="theme-system" />
                            <Label htmlFor="theme-system">System Default</Label>
                          </div>
                        </RadioGroup>
                      </div>
                      
                      <Separator />
                      
                      <div className="space-y-2">
                        <Label htmlFor="language">Language</Label>
                        <Select value={language} onValueChange={setLanguage}>
                          <SelectTrigger id="language">
                            <SelectValue placeholder="Select language" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="en">English</SelectItem>
                            <SelectItem value="es">Español</SelectItem>
                            <SelectItem value="fr">Français</SelectItem>
                            <SelectItem value="de">Deutsch</SelectItem>
                            <SelectItem value="zh">中文</SelectItem>
                          </SelectContent>
                        </Select>
                        <p className="text-xs text-muted-foreground">
                          This will change the language for the user interface (preview feature)
                        </p>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button onClick={handleUpdateAppearance}>
                      Save Appearance Settings
                    </Button>
                  </CardFooter>
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
                    <Button>
                      Change Password
                    </Button>
                  </CardFooter>
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
