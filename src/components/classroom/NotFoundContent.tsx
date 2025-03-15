
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const NotFoundContent = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-2xl font-bold mb-4">Classroom not found</h1>
          <p className="text-muted-foreground mb-8">
            The classroom you're looking for doesn't exist or has been deleted.
          </p>
          <Link to="/">
            <Button>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Return to Dashboard
            </Button>
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default NotFoundContent;
