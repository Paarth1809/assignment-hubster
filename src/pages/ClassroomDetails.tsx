
import { useState, useEffect } from "react";
import { useParams, Navigate } from "react-router-dom";
import { TabsContent } from "@/components/ui/tabs";
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

const ClassroomDetails = () => {
  const { id } = useParams<{ id: string }>();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [classroom, setClassroom] = useState(id ? getClassroomById(id) : undefined);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const { profile } = useAuth();

  useEffect(() => {
    if (id) {
      setClassroom(getClassroomById(id));
      setAssignments(getAssignmentsForClass(id));
    }
  }, [id]);

  // Updated access control logic
  const hasAccess = () => {
    if (!profile || !classroom) return false;
    if (profile.role === 'teacher') return true;
    return profile.enrolledClasses?.includes(classroom.id);
  };

  if (!profile) {
    return <Navigate to="/auth" />;
  }

  if (!classroom) {
    return <NotFoundContent />;
  }

  if (!hasAccess()) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="pt-20 pb-20">
          <div className="max-w-4xl mx-auto px-6 py-12 text-center">
            <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
            <p className="text-muted-foreground mb-6">
              You don't have access to this classroom. Please contact the teacher for an enrollment code.
            </p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-20 pb-20">
        <ClassHeader classroom={classroom} />

        <ClassTabs activeTab={activeTab} onTabChange={setActiveTab}>
          <div className="max-w-7xl mx-auto px-6 py-8">
            <TabsContent value="dashboard">
              <StreamTab classroom={classroom} assignments={assignments} />
            </TabsContent>

            <TabsContent value="assignments">
              <ClassworkTab 
                classId={classroom.id} 
                isTeacher={profile?.role === "teacher"}
              />
            </TabsContent>

            <TabsContent value="live">
              <LiveTab 
                classId={classroom.id}
                currentUser={profile}
              />
            </TabsContent>

            <TabsContent value="submissions">
              <ClassworkTab 
                classId={classroom.id} 
                isTeacher={profile?.role === "teacher"}
              />
            </TabsContent>

            <TabsContent value="people">
              <PeopleTab classroom={classroom} currentUser={profile} />
            </TabsContent>

            <TabsContent value="grades">
              <GradesTab assignments={assignments} />
            </TabsContent>

            <TabsContent value="settings">
              <SettingsTab classroom={classroom} currentUser={profile} />
            </TabsContent>
          </div>
        </ClassTabs>
      </main>
      <Footer />
    </div>
  );
};

export default ClassroomDetails;
