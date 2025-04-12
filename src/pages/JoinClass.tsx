
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { joinClassroom, getClassroomByCode } from "@/utils/storage";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, LogIn, CheckCircle } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useAuth } from "@/context/AuthContext";

const JoinClass = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, profile } = useAuth();
  const [code, setCode] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [foundClassDetails, setFoundClassDetails] = useState<{name: string, section?: string} | null>(null);
  const [isChecking, setIsChecking] = useState(false);

  // Check if code exists as user types
  useEffect(() => {
    const checkClassCode = async () => {
      if (code.length >= 6) {
        setIsChecking(true);
        try {
          const classroom = await getClassroomByCode(code);
          if (classroom) {
            setFoundClassDetails({
              name: classroom.name,
              section: classroom.section
            });
          } else {
            setFoundClassDetails(null);
          }
        } catch (error) {
          console.error("Error checking class code:", error);
          setFoundClassDetails(null);
        } finally {
          setIsChecking(false);
        }
      } else {
        setFoundClassDetails(null);
      }
    };
    
    const timeoutId = setTimeout(checkClassCode, 500);
    return () => clearTimeout(timeoutId);
  }, [code]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (!code.trim()) {
      toast({
        title: "Class code required",
        description: "Please enter a class code to join",
        variant: "destructive",
      });
      setIsSubmitting(false);
      return;
    }

    if (!user || !profile) {
      toast({
        title: "Authentication required",
        description: "You need to be logged in to join a class",
        variant: "destructive",
      });
      setIsSubmitting(false);
      return;
    }

    try {
      const result = await joinClassroom(code.toUpperCase(), user.id);
      
      if (result) {
        toast({
          title: "Joined Class",
          description: `You have successfully joined ${result.name}.`,
        });
        navigate(`/classroom/${result.id}`);
      } else {
        toast({
          title: "Invalid Class Code",
          description: "No class found with this code. Please check and try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error joining class:", error);
      toast({
        title: "Join Failed",
        description: "There was an error joining the class. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="py-20 px-6">
        <div className="max-w-md mx-auto">
          <div className="mb-8">
            <Button
              variant="ghost"
              className="mb-4"
              onClick={() => navigate(-1)}
            >
              <ArrowLeft size={16} className="mr-2" />
              Back
            </Button>
            <h1 className="text-3xl font-bold mb-2">Join Class</h1>
            <p className="text-muted-foreground">
              Enter a class code to join an existing class.
            </p>
          </div>

          <div className="glass rounded-xl p-8 shadow-xl shadow-blue-500/5">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="code" className="text-md">
                  Class Code <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="code"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  placeholder="Enter class code (e.g., ABC1234)"
                  className="w-full tracking-widest text-center text-lg font-medium uppercase"
                  maxLength={7}
                  required
                />
                <p className="text-xs text-muted-foreground pt-1">
                  Ask your teacher for the class code, then enter it here.
                </p>
              </div>

              {isChecking && (
                <div className="flex justify-center">
                  <div className="animate-spin h-5 w-5 border-2 border-primary border-t-transparent rounded-full"></div>
                </div>
              )}

              {foundClassDetails && !isChecking && (
                <div className="bg-muted p-4 rounded-md flex items-start gap-3 animate-in fade-in duration-300">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                  <div>
                    <p className="font-medium">{foundClassDetails.name}</p>
                    {foundClassDetails.section && (
                      <p className="text-sm text-muted-foreground">Section: {foundClassDetails.section}</p>
                    )}
                    <p className="text-sm text-green-500 font-medium mt-1">Class found! Click Join to enroll.</p>
                  </div>
                </div>
              )}

              <div className="pt-4">
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full"
                >
                  {isSubmitting ? (
                    <>
                      <svg
                        className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                      </svg>
                      Joining...
                    </>
                  ) : (
                    <>
                      <LogIn size={16} className="mr-2" />
                      Join Class
                    </>
                  )}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default JoinClass;
