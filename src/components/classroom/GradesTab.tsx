
import { useState, useEffect } from "react";
import { Assignment } from "@/utils/types";
import { FileText, UserPlus, Users } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import StudentGradesChart from "@/components/analytics/StudentGradesChart";
import ClassroomPerformanceChart from "@/components/analytics/ClassroomPerformanceChart";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { saveGrade } from "@/services/GradeService";
import { useToast } from "@/hooks/use-toast";

interface GradesTabProps {
  assignments: Assignment[];
  classroomId: string;
  teacherId?: string;
}

const GradesTab = ({ assignments, classroomId, teacherId }: GradesTabProps) => {
  const { user, profile } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("grades");
  const [showAddGradeDialog, setShowAddGradeDialog] = useState(false);
  const [newGrade, setNewGrade] = useState({
    studentId: "",
    assignmentName: "",
    grade: 0,
    maxGrade: 100
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isTeacher = profile?.role === "teacher" || (teacherId && user?.id === teacherId);

  const handleAddGrade = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newGrade.studentId || !newGrade.assignmentName || newGrade.grade < 0) {
      toast({
        title: "Invalid input",
        description: "Please fill all required fields with valid values.",
        variant: "destructive"
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      await saveGrade({
        student_id: newGrade.studentId,
        classroom_id: classroomId,
        assignment_name: newGrade.assignmentName,
        grade: newGrade.grade,
        max_grade: newGrade.maxGrade
      });
      
      toast({
        title: "Grade added",
        description: "The grade has been successfully added."
      });
      
      setShowAddGradeDialog(false);
      setNewGrade({
        studentId: "",
        assignmentName: "",
        grade: 0,
        maxGrade: 100
      });
    } catch (error: any) {
      toast({
        title: "Error adding grade",
        description: error.message || "There was an error adding the grade.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-medium">Grades</h2>
        {isTeacher && (
          <Dialog open={showAddGradeDialog} onOpenChange={setShowAddGradeDialog}>
            <DialogTrigger asChild>
              <Button>
                <UserPlus className="h-4 w-4 mr-2" />
                Add Grade
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Grade</DialogTitle>
                <DialogDescription>
                  Enter the details for the new grade entry.
                </DialogDescription>
              </DialogHeader>
              
              <form onSubmit={handleAddGrade} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="studentId">Student ID</Label>
                  <Input 
                    id="studentId"
                    value={newGrade.studentId}
                    onChange={(e) => setNewGrade({...newGrade, studentId: e.target.value})}
                    placeholder="Enter student ID"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="assignmentName">Assignment Name</Label>
                  <Input 
                    id="assignmentName"
                    value={newGrade.assignmentName}
                    onChange={(e) => setNewGrade({...newGrade, assignmentName: e.target.value})}
                    placeholder="Enter assignment name"
                    required
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="grade">Grade</Label>
                    <Input 
                      id="grade"
                      type="number"
                      min="0"
                      max={newGrade.maxGrade}
                      value={newGrade.grade}
                      onChange={(e) => setNewGrade({...newGrade, grade: Number(e.target.value)})}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="maxGrade">Max Grade</Label>
                    <Input 
                      id="maxGrade"
                      type="number"
                      min="1"
                      value={newGrade.maxGrade}
                      onChange={(e) => setNewGrade({...newGrade, maxGrade: Number(e.target.value)})}
                      required
                    />
                  </div>
                </div>
                
                <DialogFooter>
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? "Saving..." : "Save Grade"}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        )}
      </div>
      
      <Tabs defaultValue="grades" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="grades">
            <FileText className="h-4 w-4 mr-2" />
            Grades Table
          </TabsTrigger>
          <TabsTrigger value="analytics">
            <Users className="h-4 w-4 mr-2" />
            Analytics
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="grades">
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
        </TabsContent>
        
        <TabsContent value="analytics">
          <div className="space-y-8">
            {user && (
              <StudentGradesChart 
                studentId={user.id} 
                classroomId={classroomId} 
              />
            )}
            
            {isTeacher && (
              <ClassroomPerformanceChart 
                classroomId={classroomId} 
              />
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default GradesTab;
