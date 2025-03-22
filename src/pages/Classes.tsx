
import { useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { PlusIcon, BookOpenCheck } from "lucide-react";
import { motion } from "framer-motion";
import { getUserClassrooms } from "@/utils/storage";
import ClassroomCard from "@/components/ClassroomCard";
import { containerVariants, itemVariants } from "@/utils/animations";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useAuth } from "@/context/AuthContext";

const Classes = () => {
  const { profile } = useAuth();
  const isTeacher = profile?.role === 'teacher';
  
  // Get user classrooms
  const userClassrooms = getUserClassrooms();

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-20">
        <section className="py-12 px-6">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
              <div>
                <h1 className="text-3xl font-bold">All Classes</h1>
                <p className="text-muted-foreground">
                  View all your enrolled classes
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <Link to="/join-class">
                  <Button variant="outline">Join Class</Button>
                </Link>
                {isTeacher && (
                  <Link to="/create-class">
                    <Button className="flex items-center gap-2">
                      <PlusIcon size={16} />
                      Create Class
                    </Button>
                  </Link>
                )}
              </div>
            </div>
            
            {userClassrooms.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
                <BookOpenCheck size={64} className="text-muted-foreground mb-4" />
                <h2 className="text-2xl font-medium mb-2">No classes yet</h2>
                <p className="text-muted-foreground max-w-md mb-8">
                  {isTeacher 
                    ? "Create your first class to get started or join an existing class with a code" 
                    : "Join a class to get started by using an enrollment code"
                  }
                </p>
                <div className="flex flex-wrap gap-4 justify-center">
                  {isTeacher && (
                    <Link to="/create-class">
                      <Button>Create a Class</Button>
                    </Link>
                  )}
                  <Link to="/join-class">
                    <Button variant="outline">Join a Class</Button>
                  </Link>
                </div>
              </div>
            ) : (
              <motion.div 
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                {userClassrooms.map((classroom) => (
                  <motion.div key={classroom.id} variants={itemVariants}>
                    <ClassroomCard classroom={classroom} />
                  </motion.div>
                ))}
              </motion.div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Classes;
