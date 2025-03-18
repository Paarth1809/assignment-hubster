
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

  // Simplified access control - allow everyone
  const hasAccess = () => {
    return true; // Allow access to everyone
  };

  if (!profile) {
    return <Navigate to="/auth" />;
  }

  if (!classroom) {
    return <NotFoundContent />;
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
                viewMode="submissions"
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

            <TabsContent value="stream">
              <StreamTab classroom={classroom} assignments={assignments} />
            </TabsContent>
          </div>
        </ClassTabs>
      </main>
      <Footer />
    </div>
  );
};

export default ClassroomDetails;
