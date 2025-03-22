
import { useState, useEffect } from "react";
import { useParams, Navigate, Link, useLocation, useNavigate } from "react-router-dom";
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

const ClassroomDetails = () => {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const { profile } = useAuth();
  
  // Parse URL params
  const searchParams = new URLSearchParams(location.search);
  const tabParam = searchParams.get('tab');
  const showCreateForm = searchParams.get('create') === 'true';
  
  // Set active tab from URL params or default to dashboard
  const [activeTab, setActiveTab] = useState(tabParam || "dashboard");
  const [classroom, setClassroom] = useState(id ? getClassroomById(id) : undefined);
  const [assignments, setAssignments] = useState<Assignment[]>([]);

  useEffect(() => {
    if (id) {
      setClassroom(getClassroomById(id));
      setAssignments(getAssignmentsForClass(id));
    }
  }, [id]);
  
  // Update URL when tab changes
  useEffect(() => {
    if (tabParam !== activeTab) {
      navigate(`/classroom/${id}?tab=${activeTab}${showCreateForm ? '&create=true' : ''}`, { replace: true });
    }
  }, [activeTab, id, showCreateForm, tabParam, navigate]);
  
  // Update active tab when URL param changes
  useEffect(() => {
    if (tabParam && tabParam !== activeTab) {
      setActiveTab(tabParam);
    }
  }, [tabParam]);

  if (!profile) {
    return <Navigate to="/auth" />;
  }

  if (!classroom) {
    return <NotFoundContent />;
  }

  const handleTabChange = (value: string) => {
    // If changing tabs, remove the create parameter from URL
    setActiveTab(value);
    navigate(`/classroom/${id}?tab=${value}`, { replace: true });
  };

  return (
    <div className="min-h-screen bg-[#121212] text-white">
      <Navbar />
      <main className="pt-16">
        <ClassHeader classroom={classroom} activeTab={activeTab} />

        <Tabs value={activeTab} onValueChange={handleTabChange}>
          <ClassTabs activeTab={activeTab} onTabChange={handleTabChange}>
            <div className="max-w-7xl mx-auto px-6 py-8">
              <TabsContent value="dashboard">
                <StreamTab classroom={classroom} assignments={assignments} />
              </TabsContent>

              <TabsContent value="assignments">
                <ClassworkTab 
                  classId={classroom.id} 
                  isTeacher={profile?.role === "teacher"}
                  showCreateForm={showCreateForm && activeTab === "assignments"}
                />
              </TabsContent>

              <TabsContent value="live">
                <LiveTab 
                  classId={classroom.id}
                  currentUser={profile}
                  showCreateForm={showCreateForm && activeTab === "live"}
                />
              </TabsContent>

              <TabsContent value="submissions">
                <ClassworkTab 
                  classId={classroom.id} 
                  isTeacher={profile?.role === "teacher"}
                  showCreateForm={showCreateForm && activeTab === "submissions"}
                  isSubmissions
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
        </Tabs>
      </main>
      <Footer />
    </div>
  );
};

export default ClassroomDetails;
