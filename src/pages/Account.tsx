
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Settings, LogOut, BookOpen, Layout, Bell, Calendar, UserCheck, Clock } from 'lucide-react';
import { getClassrooms, getCurrentUser, getLiveClasses } from '@/utils/storage';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LiveClass } from '@/utils/types';
import { formatDate } from '@/utils/assignmentUtils';

export default function Account() {
  const { profile, signOut } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("classes");
  
  const classrooms = getClassrooms().filter(classroom => {
    const user = getCurrentUser();
    return user && user.enrolledClasses.includes(classroom.id);
  });

  const allLiveClasses = getLiveClasses();
  const upcomingLiveClasses = allLiveClasses.filter(liveClass => {
    return (liveClass.status === 'scheduled' || liveClass.status === 'live') && 
           classrooms.some(classroom => classroom.id === liveClass.classId);
  }).sort((a, b) => new Date(a.scheduledStart).getTime() - new Date(b.scheduledStart).getTime());

  const handleLogout = async () => {
    await signOut();
    navigate('/');
  };

  if (!profile) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="pt-20 pb-20 px-6">
          <div className="max-w-4xl mx-auto text-center py-12">
            <h1 className="text-2xl font-bold">Please login to access your account</h1>
            <Button onClick={() => navigate('/auth')} className="mt-4">
              Go to Login
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Get initials for avatar fallback
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  const getLiveClassStatusBadge = (status: LiveClass['status']) => {
    switch (status) {
      case 'scheduled':
        return <Badge variant="outline" className="bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300">Scheduled</Badge>;
      case 'live':
        return <Badge variant="outline" className="bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-300">Live Now</Badge>;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-20 pb-20 px-6">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">My Account</h1>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-1">
              <Card>
                <CardHeader className="flex flex-col items-center pt-6">
                  <Avatar className="h-24 w-24 mb-4">
                    <AvatarImage src={profile.avatar} alt={profile.name} />
                    <AvatarFallback className="text-xl">{getInitials(profile.name)}</AvatarFallback>
                  </Avatar>
                  <div className="text-center">
                    <h2 className="text-xl font-semibold">{profile.name}</h2>
                    <p className="text-sm text-muted-foreground">{profile.email}</p>
                    <div className="mt-1 inline-block px-2 py-1 bg-primary/10 text-primary text-xs rounded-full">
                      {profile.role === 'teacher' ? 'Teacher' : 'Student'}
                    </div>
                  </div>
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

              <Card className="mt-6">
                <CardHeader>
                  <h3 className="text-lg font-medium">Account Stats</h3>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center">
                    <BookOpen className="h-5 w-5 text-muted-foreground mr-3" />
                    <div>
                      <p className="text-sm font-medium">Enrolled Classes</p>
                      <p className="text-2xl font-bold">{classrooms.length}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <Calendar className="h-5 w-5 text-muted-foreground mr-3" />
                    <div>
                      <p className="text-sm font-medium">Upcoming Live Classes</p>
                      <p className="text-2xl font-bold">{upcomingLiveClasses.length}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <UserCheck className="h-5 w-5 text-muted-foreground mr-3" />
                    <div>
                      <p className="text-sm font-medium">Account Type</p>
                      <p className="text-lg font-medium">
                        {profile.role === 'teacher' ? 'Teacher Account' : 'Student Account'}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div className="md:col-span-2">
              <Card className="h-full">
                <CardHeader>
                  <Tabs 
                    defaultValue="classes" 
                    value={activeTab} 
                    onValueChange={setActiveTab} 
                    className="w-full"
                  >
                    <TabsList>
                      <TabsTrigger value="classes" className="gap-2">
                        <BookOpen className="h-4 w-4" />
                        My Classes
                      </TabsTrigger>
                      <TabsTrigger value="schedule" className="gap-2">
                        <Calendar className="h-4 w-4" />
                        Upcoming Sessions
                      </TabsTrigger>
                      <TabsTrigger value="notifications" className="gap-2">
                        <Bell className="h-4 w-4" />
                        Notifications
                      </TabsTrigger>
                    </TabsList>
                  </Tabs>
                </CardHeader>
                
                <CardContent className="pb-6">
                  <TabsContent value="classes" className="mt-0">
                    {classrooms.length === 0 ? (
                      <div className="text-center py-6">
                        <BookOpen className="mx-auto h-12 w-12 text-muted-foreground opacity-50 mb-2" />
                        <h3 className="text-lg font-medium mb-1">No classes yet</h3>
                        <p className="text-sm text-muted-foreground mb-4">
                          Join a class or create one to get started
                        </p>
                        <div className="flex flex-wrap justify-center gap-2">
                          <Button size="sm" onClick={() => navigate('/create-class')}>
                            Create Class
                          </Button>
                          <Button variant="outline" size="sm" onClick={() => navigate('/join-class')}>
                            Join Class
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {classrooms.map((classroom) => (
                          <div key={classroom.id} className="flex items-center justify-between border rounded-lg p-4">
                            <div>
                              <h3 className="font-medium">{classroom.name}</h3>
                              <p className="text-xs text-muted-foreground">
                                {classroom.section || ''} {classroom.subject ? ` • ${classroom.subject}` : ''}
                              </p>
                              <p className="text-xs mt-1">
                                <span className="text-muted-foreground">Teacher:</span> {classroom.teacherName}
                              </p>
                            </div>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => navigate(`/classroom/${classroom.id}`)}
                            >
                              View
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                  </TabsContent>
                  
                  <TabsContent value="schedule" className="mt-0">
                    {upcomingLiveClasses.length === 0 ? (
                      <div className="text-center py-6">
                        <Calendar className="mx-auto h-12 w-12 text-muted-foreground opacity-50 mb-2" />
                        <h3 className="text-lg font-medium mb-1">No upcoming sessions</h3>
                        <p className="text-sm text-muted-foreground mb-4">
                          You don't have any scheduled live classes
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {upcomingLiveClasses.map((liveClass) => {
                          const classroom = classrooms.find(c => c.id === liveClass.classId);
                          return (
                            <div key={liveClass.id} className="flex justify-between border rounded-lg p-4">
                              <div>
                                <div className="flex items-center gap-2">
                                  <h3 className="font-medium">{liveClass.title}</h3>
                                  {getLiveClassStatusBadge(liveClass.status)}
                                </div>
                                <p className="text-xs text-muted-foreground">
                                  {classroom?.name} {classroom?.section ? ` • ${classroom.section}` : ''}
                                </p>
                                <div className="mt-2 flex flex-col space-y-1">
                                  <div className="flex items-center text-xs">
                                    <Calendar className="h-3 w-3 mr-1 text-muted-foreground" />
                                    <span>{formatDate(liveClass.scheduledStart)}</span>
                                  </div>
                                  <div className="flex items-center text-xs">
                                    <Clock className="h-3 w-3 mr-1 text-muted-foreground" />
                                    <span>
                                      {new Date(liveClass.scheduledStart).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                      {liveClass.scheduledEnd && ` - ${new Date(liveClass.scheduledEnd).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`}
                                    </span>
                                  </div>
                                </div>
                              </div>
                              <div>
                                <Button 
                                  size="sm"
                                  variant={liveClass.status === 'live' ? 'default' : 'outline'}
                                  onClick={() => navigate(`/classroom/${liveClass.classId}?tab=live`)}
                                >
                                  {liveClass.status === 'live' ? 'Join Now' : 'View Details'}
                                </Button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </TabsContent>
                  
                  <TabsContent value="notifications" className="mt-0">
                    <div className="text-center py-6">
                      <Bell className="mx-auto h-12 w-12 text-muted-foreground opacity-50 mb-2" />
                      <h3 className="text-lg font-medium mb-1">Notifications Center</h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        You have no new notifications at this time
                      </p>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => navigate('/settings?tab=notifications')}
                      >
                        Notification Settings
                      </Button>
                    </div>
                  </TabsContent>
                </CardContent>
                
                <CardFooter className="pt-0 px-6">
                  <div className="grid grid-cols-2 gap-4 w-full">
                    <Button 
                      variant="outline" 
                      className="w-full"
                      onClick={() => navigate('/join-class')}
                    >
                      Join Class
                    </Button>
                    <Button 
                      className="w-full"
                      onClick={() => navigate('/create-class')}
                    >
                      Create Class
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
