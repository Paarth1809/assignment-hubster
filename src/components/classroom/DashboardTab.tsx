
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from '@/context/AuthContext';
import { getAssignmentsForClass } from '@/utils/storage/assignments';
import { Assignment } from '@/utils/types';
import { FileText, Users, Calendar, CheckCircle, Clock } from 'lucide-react';
import { formatDate } from '@/utils/assignmentUtils';

interface DashboardTabProps {
  classroom: {
    id: string;
    name: string;
    teacherId?: string;
  };
}

const DashboardTab = ({ classroom }: DashboardTabProps) => {
  const { user, profile } = useAuth();
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    submitted: 0,
    graded: 0,
    upcomingDue: 0
  });
  const [activeTab, setActiveTab] = useState('overview');
  const isTeacher = profile?.id === classroom?.teacherId;
  
  useEffect(() => {
    if (classroom.id) {
      const assignmentsData = getAssignmentsForClass(classroom.id);
      setAssignments(assignmentsData);
      
      // Calculate dashboard stats
      const now = new Date();
      const upcomingDueCount = assignmentsData.filter(a => {
        if (!a.dueDate) return false;
        const dueDate = new Date(a.dueDate);
        const diffDays = Math.ceil((dueDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
        return diffDays >= 0 && diffDays <= 7; // Due within 7 days
      }).length;
      
      setStats({
        total: assignmentsData.length,
        pending: assignmentsData.filter(a => a.status === 'pending').length,
        submitted: assignmentsData.filter(a => a.status === 'submitted').length,
        graded: assignmentsData.filter(a => a.status === 'graded').length,
        upcomingDue: upcomingDueCount
      });
    }
  }, [classroom.id]);
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-medium">Dashboard</h2>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <FileText className="mr-2 h-4 w-4" />
              Total Assignments
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {isTeacher ? "Assignments created" : "Assignments assigned"}
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <CheckCircle className="mr-2 h-4 w-4" />
              {isTeacher ? "Submitted" : "Completed"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{isTeacher ? stats.submitted : stats.graded}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {isTeacher ? "Assignments submitted by students" : "Assignments graded"}
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <Clock className="mr-2 h-4 w-4" />
              Upcoming Due
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.upcomingDue}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Due in the next 7 days
            </p>
          </CardContent>
        </Card>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="recent">Recent Activity</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Class Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium mb-2">Assignments Status</h3>
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <div className="text-lg font-bold">{stats.pending}</div>
                      <p className="text-xs text-muted-foreground">Pending</p>
                    </div>
                    <div>
                      <div className="text-lg font-bold">{stats.submitted}</div>
                      <p className="text-xs text-muted-foreground">Submitted</p>
                    </div>
                    <div>
                      <div className="text-lg font-bold">{stats.graded}</div>
                      <p className="text-xs text-muted-foreground">Graded</p>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium mb-2">Upcoming Assignments</h3>
                  {assignments
                    .filter(a => a.dueDate && new Date(a.dueDate) > new Date())
                    .sort((a, b) => new Date(a.dueDate!).getTime() - new Date(b.dueDate!).getTime())
                    .slice(0, 3)
                    .map(assignment => (
                      <div key={assignment.id} className="flex justify-between items-center p-2 rounded hover:bg-muted/40">
                        <div>
                          <div className="font-medium text-sm">{assignment.title}</div>
                          <div className="text-xs text-muted-foreground">
                            Due: {formatDate(assignment.dueDate!)}
                          </div>
                        </div>
                        <div className={`px-2 py-1 rounded-full text-xs ${
                          assignment.status === 'pending' 
                            ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-500' 
                            : assignment.status === 'submitted' 
                              ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-500'
                              : 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-500'
                        }`}>
                          {assignment.status.charAt(0).toUpperCase() + assignment.status.slice(1)}
                        </div>
                      </div>
                    ))}
                  {assignments.filter(a => a.dueDate && new Date(a.dueDate) > new Date()).length === 0 && (
                    <div className="text-center p-4 text-muted-foreground text-sm">
                      No upcoming assignments
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="recent" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {assignments
                  .sort((a, b) => new Date(b.dateSubmitted).getTime() - new Date(a.dateSubmitted).getTime())
                  .slice(0, 5)
                  .map(assignment => (
                    <div key={assignment.id} className="flex items-start p-2 rounded hover:bg-muted/40">
                      <div className="flex-shrink-0 h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center mr-3">
                        <FileText className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <div className="font-medium text-sm">{assignment.title}</div>
                        <div className="text-xs text-muted-foreground">
                          {assignment.status === 'pending' 
                            ? 'Created' 
                            : assignment.status === 'submitted' 
                              ? 'Submitted' 
                              : 'Graded'}: {formatDate(assignment.dateSubmitted)}
                        </div>
                      </div>
                    </div>
                  ))}
                {assignments.length === 0 && (
                  <div className="text-center p-4 text-muted-foreground text-sm">
                    No recent activity
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DashboardTab;
