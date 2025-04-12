
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CreateClassForm from "@/components/classroom/CreateClassForm";
import PageHeader from "@/components/classroom/PageHeader";
import { useAuth } from "@/context/AuthContext";
import { Navigate } from "react-router-dom";

const CreateClass = () => {
  const { profile, user } = useAuth();

  // Redirect if not logged in
  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  // Only teachers can create classes
  const isTeacher = profile?.role === 'teacher';
  if (!isTeacher) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="py-20 px-6">
        <div className="max-w-2xl mx-auto">
          <PageHeader 
            title="Create Class" 
            description="Create a new class for your students to join." 
          />

          <div className="glass rounded-xl p-8 shadow-xl shadow-blue-500/5">
            <CreateClassForm initialTeacherName={profile?.name || "Teacher"} />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default CreateClass;
