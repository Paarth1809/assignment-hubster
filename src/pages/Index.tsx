
import { useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { PlusIcon, BookOpenCheck } from "lucide-react";
import { motion } from "framer-motion";
import { initializeDefaultUser, getClassrooms, getCurrentUser } from "@/utils/storage";
import ClassroomCard from "@/components/ClassroomCard";
import { containerVariants, itemVariants } from "@/utils/animations";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const Index = () => {
  useEffect(() => {
    // Initialize default user if none exists
    initializeDefaultUser();
    
    // Smooth scroll behavior for navigation
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function (e) {
        e.preventDefault();
        
        const targetId = this.getAttribute('href')?.substring(1);
        if (!targetId) return;
        
        const targetElement = document.getElementById(targetId);
        if (targetElement) {
          window.scrollTo({
            top: targetElement.offsetTop - 80, // Offset for navbar
            behavior: 'smooth'
          });
        }
      });
    });
    
    return () => {
      document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.removeEventListener('click', function (e) {});
      });
    };
  }, []);

  const classrooms = getClassrooms();
  const currentUser = getCurrentUser();

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-20">
        <section className="py-12 px-6">
          <div className="max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-8">
              <h1 className="text-3xl font-bold">My Classes</h1>
              <Link to="/create-class">
                <Button className="flex items-center gap-2">
                  <PlusIcon size={16} />
                  Create Class
                </Button>
              </Link>
            </div>
            
            {classrooms.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
                <BookOpenCheck size={64} className="text-muted-foreground mb-4" />
                <h2 className="text-2xl font-medium mb-2">No classes yet</h2>
                <p className="text-muted-foreground max-w-md mb-8">
                  Create your first class to get started or join an existing class with a code
                </p>
                <div className="flex gap-4">
                  <Link to="/create-class">
                    <Button>Create a Class</Button>
                  </Link>
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
                {classrooms.map((classroom) => (
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

export default Index;
