
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { saveClassroom } from "@/utils/storage";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Save } from "lucide-react";

interface CreateClassFormProps {
  initialTeacherName: string;
}

const CreateClassForm = ({ initialTeacherName }: CreateClassFormProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    section: "",
    subject: "",
    description: "",
    teacherName: initialTeacherName || "Teacher",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (!formData.name.trim()) {
      toast({
        title: "Class name required",
        description: "Please provide a name for your class",
        variant: "destructive",
      });
      setIsSubmitting(false);
      return;
    }

    try {
      const newClassroom = await saveClassroom(formData);
      toast({
        title: "Class Created",
        description: "Your new class has been created successfully.",
      });
      navigate(`/classroom/${newClassroom.id}`);
    } catch (error) {
      console.error("Error creating class:", error);
      toast({
        title: "Creation Failed",
        description: "There was an error creating your class. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="name" className="text-md">
          Class Name <span className="text-red-500">*</span>
        </Label>
        <Input
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="e.g., Biology 101"
          className="w-full"
          required
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="section" className="text-md">
            Section
          </Label>
          <Input
            id="section"
            name="section"
            value={formData.section}
            onChange={handleChange}
            placeholder="e.g., Period 3"
            className="w-full"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="subject" className="text-md">
            Subject
          </Label>
          <Input
            id="subject"
            name="subject"
            value={formData.subject}
            onChange={handleChange}
            placeholder="e.g., Science"
            className="w-full"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="teacherName" className="text-md">
          Teacher Name
        </Label>
        <Input
          id="teacherName"
          name="teacherName"
          value={formData.teacherName}
          onChange={handleChange}
          placeholder="Your name"
          className="w-full"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description" className="text-md">
          Description
        </Label>
        <Textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Add a description of your class"
          rows={4}
          className="w-full resize-none"
        />
      </div>

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
              Creating Class...
            </>
          ) : (
            <>
              <Save size={16} className="mr-2" />
              Create Class
            </>
          )}
        </Button>
      </div>
    </form>
  );
};

export default CreateClassForm;
