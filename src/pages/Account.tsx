
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Settings, LogOut, BookOpen, Layout } from 'lucide-react';
import { getClassrooms, getCurrentUser } from '@/utils/storage';

export default function Account() {
  const { profile, signOut } = useAuth();
  const navigate = useNavigate();
  
  const classrooms = getClassrooms().filter(classroom => {
    const user = getCurrentUser();
    return user && user.enrolledClasses.includes(classroom.id);
  });

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

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-20 pb-20 px-6">
        <div className="max-w-4xl mx-auto">
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
            </div>
            
            <div className="md:col-span-2">
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <h2 className="text-xl font-semibold">My Classes</h2>
                    <Button variant="outline" size="sm" onClick={() => navigate('/')}>
                      View All
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
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
                      {classrooms.slice(0, 3).map((classroom) => (
                        <div key={classroom.id} className="flex items-center justify-between border rounded-lg p-3">
                          <div>
                            <h3 className="font-medium">{classroom.name}</h3>
                            <p className="text-xs text-muted-foreground">
                              {classroom.section || ''} {classroom.subject ? ` • ${classroom.subject}` : ''}
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
                </CardContent>
                <CardFooter className="flex justify-center border-t pt-4">
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
