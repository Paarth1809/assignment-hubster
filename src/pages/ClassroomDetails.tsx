
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { TabsContent } from "@/components/ui/tabs";
import { getClassroomById, getAssignments } from "@/utils/storage";
import { Assignment } from "@/utils/types";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ClassHeader from "@/components/classroom/ClassHeader";
import ClassTabs from "@/components/classroom/ClassTabs";
import StreamTab from "@/components/classroom/StreamTab";
import ClassworkTab from "@/components/classroom/ClassworkTab";
import PeopleTab from "@/components/classroom/PeopleTab";
import GradesTab from "@/components/classroom/GradesTab";
import SettingsTab from "@/components/classroom/SettingsTab";
import NotFoundContent from "@/components/classroom/NotFoundContent";

const ClassroomDetails = () => {
  const { id } = useParams<{ id: string }>();
  const [activeTab, setActiveTab] = useState("stream");
  const [classroom, setClassroom] = useState(id ? getClassroomById(id) : undefined);
  const [assignments, setAssignments] = useState<Assignment[]>([]);

  useEffect(() => {
    if (id) {
      setClassroom(getClassroomById(id));
      setAssignments(getAssignments(id));
    }
  }, [id]);

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
            <TabsContent value="stream">
              <StreamTab classroom={classroom} assignments={assignments} />
            </TabsContent>

            <TabsContent value="classwork">
              <ClassworkTab classId={classroom.id} />
            </TabsContent>

            <TabsContent value="people">
              <PeopleTab classroom={classroom} />
            </TabsContent>

            <TabsContent value="grades">
              <GradesTab assignments={assignments} />
            </TabsContent>

            <TabsContent value="settings">
              <SettingsTab classroom={classroom} />
            </TabsContent>
          </div>
        </ClassTabs>
      </main>
      <Footer />
    </div>
  );
};

export default ClassroomDetails;
