
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BookOpen, Calendar, Bell, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Classroom, LiveClass } from '@/utils/types';
import { formatDate } from '@/utils/assignmentUtils';

interface ContentTabsProps {
  classrooms: Classroom[];
  upcomingLiveClasses: LiveClass[];
}

export default function ContentTabs({ classrooms, upcomingLiveClasses }: ContentTabsProps) {
  const [activeTab, setActiveTab] = useState("classes");
  const navigate = useNavigate();

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
  );
}
