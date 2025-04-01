
import { useState, useEffect } from "react";
import { useParams, Navigate } from "react-router-dom";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { getClassroomById, getAssignmentsForClass } from "@/utils/storage";
import { Assignment } from "@/utils/types";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ClassHeader from "@/components/classroom/ClassHeader";
import ClassTabs from "@/components/classroom/ClassTabs";
import StreamTab from "@/components/classroom/StreamTab";
import ClassworkTab from "@/components/classroom/ClassworkTab";
import LiveTab from "@/components/classroom/LiveTab";
import PeopleTab from "@/components/classroom/PeopleTab";
import GradesTab from "@/components/classroom/GradesTab";
import SettingsTab from "@/components/classroom/SettingsTab";
import NotFoundContent from "@/components/classroom/NotFoundContent";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";

const ClassroomDetails = () => {
  const { id } = useParams<{ id: string }>();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [classroom, setClassroom] = useState(id ? getClassroomById(id) : undefined);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const { profile } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (id) {
      setClassroom(getClassroomById(id));
      setAssignments(getAssignmentsForClass(id));
    }
  }, [id]);

  if (!profile) {
    return <Navigate to="/auth" />;
  }

  if (!classroom) {
    return <NotFoundContent />;
  }

  // Check if user is enrolled in this class
  const isEnrolled = profile.enrolledClasses?.includes(classroom.id);
  const isTeacher = profile.role === "teacher";
  const isClassTeacher = classroom.teacherId === profile.id;

  // If user is not enrolled and not the teacher of this class, redirect to home
  if (!isEnrolled && !(isTeacher && isClassTeacher)) {
    toast({
      title: "Access denied",
      description: "You are not enrolled in this class",
      variant: "destructive",
    });
    return <Navigate to="/" />;
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-20 pb-20">
        <ClassHeader classroom={classroom} />

        <div className="border-b sticky top-16 bg-background z-10">
          <div className="max-w-7xl mx-auto px-6">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <ClassTabs activeTab={activeTab} onTabChange={setActiveTab} />
              
              <TabsContent value="dashboard">
                <div className="max-w-7xl mx-auto px-6 py-8">
                  <StreamTab classroom={classroom} assignments={assignments} />
                </div>
              </TabsContent>

              <TabsContent value="assignments">
                <div className="max-w-7xl mx-auto px-6 py-8">
                  <ClassworkTab 
                    classId={classroom.id} 
                    isTeacher={isTeacher && isClassTeacher}
                  />
                </div>
              </TabsContent>

              <TabsContent value="live">
                <div className="max-w-7xl mx-auto px-6 py-8">
                  <LiveTab 
                    classId={classroom.id}
                    currentUser={profile}
                  />
                </div>
              </TabsContent>

              <TabsContent value="submissions">
                <div className="max-w-7xl mx-auto px-6 py-8">
                  <ClassworkTab 
                    classId={classroom.id} 
                    isTeacher={isTeacher && isClassTeacher} 
                  />
                </div>
              </TabsContent>

              <TabsContent value="people">
                <div className="max-w-7xl mx-auto px-6 py-8">
                  <PeopleTab classroom={classroom} currentUser={profile} />
                </div>
              </TabsContent>

              <TabsContent value="grades">
                <div className="max-w-7xl mx-auto px-6 py-8">
                  <GradesTab assignments={assignments} />
                </div>
              </TabsContent>

              <TabsContent value="settings">
                <div className="max-w-7xl mx-auto px-6 py-8">
                  <SettingsTab classroom={classroom} currentUser={profile} />
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ClassroomDetails;
