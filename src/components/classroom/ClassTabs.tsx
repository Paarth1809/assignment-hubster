
import { TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BookOpen, Users, FileText, MessageSquare, Settings, Video, LayoutDashboard, Upload } from "lucide-react";

interface ClassTabsProps {
  activeTab: string;
  onTabChange: (value: string) => void;
  children?: React.ReactNode;
}

const ClassTabs = ({ activeTab, onTabChange, children }: ClassTabsProps) => {
  return (
    <>
      <TabsList className="grid w-full max-w-4xl grid-cols-7">
        <TabsTrigger value="dashboard" className="gap-2">
          <LayoutDashboard className="h-4 w-4" />
          <span className="hidden sm:inline">Dashboard</span>
        </TabsTrigger>
        <TabsTrigger value="assignments" className="gap-2">
          <FileText className="h-4 w-4" />
          <span className="hidden sm:inline">Assignments</span>
        </TabsTrigger>
        <TabsTrigger value="live" className="gap-2">
          <Video className="h-4 w-4" />
          <span className="hidden sm:inline">Live</span>
        </TabsTrigger>
        <TabsTrigger value="submissions" className="gap-2">
          <Upload className="h-4 w-4" />
          <span className="hidden sm:inline">Submissions</span>
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
      
      {children}
    </>
  );
};

export default ClassTabs;
