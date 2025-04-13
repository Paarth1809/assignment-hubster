
import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { UserPlus } from "lucide-react";
import { saveGrade } from "@/services/GradeService";
import { useToast } from "@/hooks/use-toast";

interface AddGradeDialogProps {
  classroomId: string;
}

const AddGradeDialog = ({ classroomId }: AddGradeDialogProps) => {
  const { toast } = useToast();
  const [showDialog, setShowDialog] = useState(false);
  const [newGrade, setNewGrade] = useState({
    studentId: "",
    assignmentName: "",
    grade: 0,
    maxGrade: 100
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

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
      
      setShowDialog(false);
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
    <Dialog open={showDialog} onOpenChange={setShowDialog}>
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
  );
};

export default AddGradeDialog;
