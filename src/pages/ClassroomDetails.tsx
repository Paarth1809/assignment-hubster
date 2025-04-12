import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getClassroomById } from "@/utils/storage";
import { useToast } from "@/hooks/use-toast";
import ClassHeader from "@/components/classroom/ClassHeader";
import ClassTabs from "@/components/classroom/ClassTabs";
import NotFoundContent from "@/components/classroom/NotFoundContent";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Classroom } from "@/utils/types";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import StreamTab from "@/components/classroom/StreamTab";

const ClassroomDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [classroom, setClassroom] = useState<Classroom | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("dashboard");

  useEffect(() => {
    const fetchClassroom = async () => {
      if (!id) {
        setError("Class ID is missing");
        setLoading(false);
        return;
      }

      try {
        // Properly await the Promise from getClassroomById
        const classroomData = await getClassroomById(id);
        if (!classroomData) {
          setError("Class not found");
        } else {
          setClassroom(classroomData);
        }
      } catch (err) {
        console.error("Error fetching classroom:", err);
        setError("Failed to load classroom data");
        toast({
          title: "Error",
          description: "Failed to load classroom data",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchClassroom();
  }, [id, toast]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin h-12 w-12 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (error || !classroom) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <main className="container mx-auto py-20 px-6">
          <NotFoundContent message={error || "Class not found"} />
        </main>
        <Footer />
      </div>
    );
  }

  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        <ClassHeader classroom={classroom} />
        <div className="container mx-auto px-4 pb-16">
          <Tabs value={activeTab} onValueChange={handleTabChange}>
            <ClassTabs 
              activeTab={activeTab} 
              onTabChange={handleTabChange}
              classroom={classroom} 
            />
            <TabsContent value="dashboard">
              <StreamTab classroom={classroom} assignments={[]} />
            </TabsContent>
            {/* Other tab contents would go here */}
          </Tabs>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ClassroomDetails;
