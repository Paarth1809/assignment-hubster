
import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { 
  getClassroomById, 
  getAssignments,
  updateAssignmentStatus
} from "@/utils/storage";
import { Assignment } from "@/utils/types";
import { 
  BookOpen, 
  Users, 
  FileText, 
  MessageSquare, 
  Settings,
  ArrowLeft,
  PlusCircle
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AssignmentList from "@/components/AssignmentList";
import UploadForm from "@/components/UploadForm";

const ClassroomDetails = () => {
  const { id } = useParams<{ id: string }>();
  const [activeTab, setActiveTab] = useState("stream");
  const [classroom, setClassroom] = useState(id ? getClassroomById(id) : undefined);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [showUploadForm, setShowUploadForm] = useState(false);

  useEffect(() => {
    if (id) {
      setClassroom(getClassroomById(id));
      setAssignments(getAssignments(id));
    }
  }, [id]);

  if (!classroom) {
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
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-20 pb-20">
        {/* Class Header */}
        <header className="border-b">
          <div className="max-w-7xl mx-auto px-6 py-8">
            <Link to="/" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-4">
              <ArrowLeft className="mr-1 h-4 w-4" />
              Back to classes
            </Link>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <h1 className="text-3xl font-bold">{classroom.name}</h1>
                <div className="flex items-center text-muted-foreground gap-1 mt-1">
                  {classroom.section && <span>{classroom.section}</span>}
                  {classroom.section && classroom.subject && <span>•</span>}
                  {classroom.subject && <span>{classroom.subject}</span>}
                </div>
              </div>
              <div className="flex items-center text-sm text-muted-foreground">
                <span className="border px-3 py-1 rounded font-mono">
                  {classroom.enrollmentCode}
                </span>
              </div>
            </div>
          </div>
        </header>

        {/* Tabs Navigation */}
        <div className="border-b sticky top-16 bg-background z-10">
          <div className="max-w-7xl mx-auto px-6">
            <Tabs 
              defaultValue="stream" 
              value={activeTab} 
              onValueChange={setActiveTab} 
              className="w-full"
            >
              <TabsList className="grid w-full max-w-2xl grid-cols-5">
                <TabsTrigger value="stream" className="gap-2">
                  <MessageSquare className="h-4 w-4" />
                  <span className="hidden sm:inline">Stream</span>
                </TabsTrigger>
                <TabsTrigger value="classwork" className="gap-2">
                  <FileText className="h-4 w-4" />
                  <span className="hidden sm:inline">Classwork</span>
                </TabsTrigger>
                <TabsTrigger value="people" className="gap-2">
                  <Users className="h-4 w-4" />
                  <span className="hidden sm:inline">People</span>
                </TabsTrigger>
                <TabsTrigger value="grades" className="gap-2">
                  <BookOpen className="h-4 w-4" />
                  <span className="hidden sm:inline">Grades</span>
                </TabsTrigger>
                <TabsTrigger value="settings" className="gap-2">
                  <Settings className="h-4 w-4" />
                  <span className="hidden sm:inline">Settings</span>
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </div>

        {/* Tab Content */}
        <div className="max-w-7xl mx-auto px-6 py-8">
          {activeTab === "stream" && (
            <div className="space-y-8">
              <div className="glass rounded-xl p-6 shadow-md">
                <h2 className="text-xl font-medium mb-4">Class Description</h2>
                <p className="text-muted-foreground">
                  {classroom.description || "No class description available."}
                </p>
              </div>
              
              <div className="space-y-4">
                <h2 className="text-xl font-medium">Upcoming</h2>
                {assignments.length > 0 ? (
                  <div className="space-y-3">
                    {assignments.slice(0, 3).map((assignment) => (
                      <div 
                        key={assignment.id} 
                        className="flex items-start p-4 border rounded-lg hover:bg-muted/20 transition-colors"
                      >
                        <div className="flex-shrink-0 mr-4">
                          <FileText className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-medium">{assignment.title}</h3>
                          <p className="text-sm text-muted-foreground">
                            {new Date(assignment.dateSubmitted).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground">No upcoming assignments.</p>
                )}
              </div>
            </div>
          )}

          {activeTab === "classwork" && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-medium">Assignments</h2>
                <Button onClick={() => setShowUploadForm(!showUploadForm)}>
                  <PlusCircle className="h-4 w-4 mr-2" />
                  {showUploadForm ? "Cancel" : "Create Assignment"}
                </Button>
              </div>
              
              {showUploadForm && (
                <div className="glass rounded-xl p-6 shadow-md mb-8">
                  <h3 className="text-lg font-medium mb-4">Create New Assignment</h3>
                  <UploadForm classId={classroom.id} onSuccess={() => {
                    setShowUploadForm(false);
                    setAssignments(getAssignments(classroom.id));
                  }} />
                </div>
              )}
              
              <AssignmentList 
                classId={classroom.id} 
                onAssignmentUpdate={() => setAssignments(getAssignments(classroom.id))}
              />
            </div>
          )}

          {activeTab === "people" && (
            <div>
              <h2 className="text-xl font-medium mb-6">People</h2>
              
              <div className="glass rounded-xl shadow-md overflow-hidden">
                <div className="p-6 border-b">
                  <h3 className="text-lg font-medium">Teachers</h3>
                </div>
                <div className="p-4">
                  <div className="flex items-center p-2 hover:bg-muted/20 transition-colors rounded-md">
                    <div className="flex-shrink-0 h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center mr-4">
                      <Users className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">{classroom.teacherName}</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="glass rounded-xl shadow-md overflow-hidden mt-6">
                <div className="p-6 border-b">
                  <h3 className="text-lg font-medium">Students</h3>
                </div>
                <div className="p-6 text-center text-muted-foreground">
                  <p>No students have joined this class yet.</p>
                  <p className="mt-2 text-sm">
                    Students can join with class code: 
                    <span className="font-mono font-medium ml-1">{classroom.enrollmentCode}</span>
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === "grades" && (
            <div>
              <h2 className="text-xl font-medium mb-6">Grades</h2>
              
              {assignments.length > 0 ? (
                <div className="glass rounded-xl shadow-md overflow-hidden">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-4">Assignment</th>
                        <th className="text-left p-4">Submitted</th>
                        <th className="text-right p-4">Grade</th>
                      </tr>
                    </thead>
                    <tbody>
                      {assignments.map((assignment) => (
                        <tr key={assignment.id} className="border-b hover:bg-muted/20 transition-colors">
                          <td className="p-4">
                            <span className="font-medium">{assignment.title}</span>
                          </td>
                          <td className="p-4 text-muted-foreground">
                            {new Date(assignment.dateSubmitted).toLocaleDateString()}
                          </td>
                          <td className="p-4 text-right">
                            {assignment.grade ? (
                              <span className="font-medium">{assignment.grade}</span>
                            ) : (
                              <span className="text-muted-foreground">Not graded</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-12 glass rounded-xl shadow-md">
                  <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">No assignments yet</h3>
                  <p className="text-muted-foreground max-w-md mx-auto">
                    Grades will appear here once you have submitted assignments and they have been graded.
                  </p>
                </div>
              )}
            </div>
          )}

          {activeTab === "settings" && (
            <div>
              <h2 className="text-xl font-medium mb-6">Class Settings</h2>
              
              <div className="glass rounded-xl p-6 shadow-md space-y-6">
                <div>
                  <h3 className="text-lg font-medium mb-1">Class Details</h3>
                  <p className="text-muted-foreground text-sm mb-4">
                    Basic information about your class.
                  </p>
                  
                  <div className="space-y-3">
                    <div className="grid grid-cols-3 gap-4 py-2 border-b">
                      <div className="font-medium">Name</div>
                      <div className="col-span-2">{classroom.name}</div>
                    </div>
                    <div className="grid grid-cols-3 gap-4 py-2 border-b">
                      <div className="font-medium">Section</div>
                      <div className="col-span-2">{classroom.section || "—"}</div>
                    </div>
                    <div className="grid grid-cols-3 gap-4 py-2 border-b">
                      <div className="font-medium">Subject</div>
                      <div className="col-span-2">{classroom.subject || "—"}</div>
                    </div>
                    <div className="grid grid-cols-3 gap-4 py-2 border-b">
                      <div className="font-medium">Teacher</div>
                      <div className="col-span-2">{classroom.teacherName}</div>
                    </div>
                    <div className="grid grid-cols-3 gap-4 py-2 border-b">
                      <div className="font-medium">Class Code</div>
                      <div className="col-span-2 font-mono">{classroom.enrollmentCode}</div>
                    </div>
                    <div className="grid grid-cols-3 gap-4 py-2">
                      <div className="font-medium">Created</div>
                      <div className="col-span-2">
                        {new Date(classroom.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="pt-4">
                  <Button variant="destructive">
                    Delete Class
                  </Button>
                  <p className="text-xs text-muted-foreground mt-2">
                    This will permanently remove the class and all its contents.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ClassroomDetails;
