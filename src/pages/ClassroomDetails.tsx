
import { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { getClassroomById } from '@/utils/storage';
import { getAssignmentsForClass } from '@/utils/storage/assignments';
import { Assignment, Classroom } from '@/utils/types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, BookOpen } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ClassTabs from '@/components/classroom/ClassTabs';
import StreamTab from '@/components/classroom/StreamTab';
import ClassworkTab from '@/components/classroom/ClassworkTab';
import GradesTab from '@/components/classroom/GradesTab';
import LiveTab from '@/components/classroom/LiveTab';
import PeopleTab from '@/components/classroom/PeopleTab';
import SettingsTab from '@/components/classroom/SettingsTab';
import DashboardTab from '@/components/classroom/DashboardTab';
import { Tabs, TabsContent } from '@/components/ui/tabs';

const ClassroomDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { user, profile } = useAuth();
  const [classroom, setClassroom] = useState<Classroom | null>(null);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isTeacher, setIsTeacher] = useState(false);
  const [activeTab, setActiveTab] = useState("stream");

  // Check URL parameters for tab selection
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const tabParam = params.get('tab');
    if (tabParam && ['stream', 'classwork', 'grades', 'live', 'people', 'settings', 'dashboard'].includes(tabParam)) {
      setActiveTab(tabParam);
    }
  }, [location.search]);

  useEffect(() => {
    const fetchClassroomDetails = async () => {
      if (!id) {
        console.error("No classroom ID provided");
        navigate('/not-found');
        return;
      }

      try {
        setIsLoading(true);
        const classroomData = await getClassroomById(id);
        if (classroomData) {
          setClassroom(classroomData);

          // Check if the current user is the teacher of this classroom
          setIsTeacher(profile?.id === classroomData.teacherId);

          // Fetch assignments
          const assignmentsData = getAssignmentsForClass(id);
          setAssignments(assignmentsData);
        } else {
          console.error(`Classroom with ID ${id} not found`);
          navigate('/not-found');
        }
      } catch (error) {
        console.error("Failed to fetch classroom details:", error);
        navigate('/not-found');
      } finally {
        setIsLoading(false);
      }
    };

    fetchClassroomDetails();
  }, [id, navigate, user, profile]);

  // Refresh assignments when active tab changes to classwork or grades
  useEffect(() => {
    if ((activeTab === 'classwork' || activeTab === 'grades' || activeTab === 'dashboard') && id) {
      const assignmentsData = getAssignmentsForClass(id);
      setAssignments(assignmentsData);
    }
  }, [activeTab, id]);
  
  // Update URL when tab changes
  const handleTabChange = (newTab: string) => {
    setActiveTab(newTab);
    // Update URL without full page reload
    navigate(`/classroom/${id}?tab=${newTab}`, { replace: true });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="pt-20 pb-20 px-6">
          <div className="max-w-4xl mx-auto">
            <Skeleton className="h-12 w-full mb-4" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Skeleton className="h-48 w-full" />
              <Skeleton className="h-48 w-full" />
            </div>
            <Skeleton className="h-96 w-full mt-4" />
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
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-2xl font-bold">{classroom?.name}</CardTitle>
              <Badge variant="secondary">
                <BookOpen className="h-4 w-4 mr-2" />
                {isTeacher ? 'Teacher' : 'Student'}
              </Badge>
            </CardHeader>
            <CardContent>
              <CardDescription>
                {classroom?.description || 'No description provided.'}
              </CardDescription>
              <div className="mt-4 flex items-center text-sm text-muted-foreground">
                <Calendar className="h-4 w-4 mr-2" />
                Created on: {new Date(classroom?.createdAt || '').toLocaleDateString()}
              </div>
              {classroom?.section && (
                <div className="mt-2 flex items-center text-sm text-muted-foreground">
                  <Clock className="h-4 w-4 mr-2" />
                  Section: {classroom?.section}
                </div>
              )}
            </CardContent>
          </Card>

          {classroom && (
            <ClassTabs 
              classroom={classroom} 
              activeTab={activeTab} 
              onTabChange={handleTabChange}
            >
              <TabsContent value="stream">
                <StreamTab classroom={classroom} />
              </TabsContent>
              <TabsContent value="classwork">
                <ClassworkTab classroom={classroom} />
              </TabsContent>
              <TabsContent value="grades">
                <GradesTab 
                  assignments={assignments} 
                  classroomId={classroom.id}
                  teacherId={classroom.teacherId}
                />
              </TabsContent>
              <TabsContent value="live">
                <LiveTab classroom={classroom} />
              </TabsContent>
              <TabsContent value="people">
                <PeopleTab classroom={classroom} />
              </TabsContent>
              <TabsContent value="dashboard">
                <DashboardTab classroom={classroom} />
              </TabsContent>
              {isTeacher && (
                <TabsContent value="settings">
                  <SettingsTab classroom={classroom} currentUser={profile} />
                </TabsContent>
              )}
            </ClassTabs>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ClassroomDetails;
