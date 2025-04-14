
import { TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BookOpen, Users, FileText, MessageSquare, Settings, Video, LayoutDashboard, Upload } from "lucide-react";
import { Classroom } from "@/utils/types";

interface ClassTabsProps {
  activeTab: string;
  onTabChange: (value: string) => void;
  classroom: Classroom;
  children?: React.ReactNode;
}

const ClassTabs = ({ activeTab, onTabChange, classroom }: ClassTabsProps) => {
  return (
    <TabsList className="grid w-full max-w-4xl grid-cols-7 bg-black border border-gray-800 rounded-md my-4">
      <TabsTrigger 
        value="dashboard" 
        className="gap-2 data-[state=active]:bg-gray-800 data-[state=active]:text-white"
      >
        <LayoutDashboard className="h-4 w-4" />
        <span className="hidden sm:inline">Dashboard</span>
      </TabsTrigger>
      <TabsTrigger 
        value="assignments" 
        className="gap-2 data-[state=active]:bg-gray-800 data-[state=active]:text-white"
      >
        <FileText className="h-4 w-4" />
        <span className="hidden sm:inline">Assignments</span>
      </TabsTrigger>
      <TabsTrigger 
        value="live" 
        className="gap-2 data-[state=active]:bg-gray-800 data-[state=active]:text-white"
      >
        <Video className="h-4 w-4" />
        <span className="hidden sm:inline">Live</span>
      </TabsTrigger>
      <TabsTrigger 
        value="submissions" 
        className="gap-2 data-[state=active]:bg-gray-800 data-[state=active]:text-white"
      >
        <Upload className="h-4 w-4" />
        <span className="hidden sm:inline">Submissions</span>
      </TabsTrigger>
      <TabsTrigger 
        value="people" 
        className="gap-2 data-[state=active]:bg-gray-800 data-[state=active]:text-white"
      >
        <Users className="h-4 w-4" />
        <span className="hidden sm:inline">People</span>
      </TabsTrigger>
      <TabsTrigger 
        value="grades" 
        className="gap-2 data-[state=active]:bg-gray-800 data-[state=active]:text-white"
      >
        <BookOpen className="h-4 w-4" />
        <span className="hidden sm:inline">Grades</span>
      </TabsTrigger>
      <TabsTrigger 
        value="settings" 
        className="gap-2 data-[state=active]:bg-gray-800 data-[state=active]:text-white"
      >
        <Settings className="h-4 w-4" />
        <span className="hidden sm:inline">Settings</span>
      </TabsTrigger>
    </TabsList>
  );
};

export default ClassTabs;
