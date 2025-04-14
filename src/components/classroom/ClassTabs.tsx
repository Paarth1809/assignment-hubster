
import { ReactNode } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BookOpen, Users, FileText, MessageSquare, Settings, Video, LayoutDashboard } from "lucide-react";
import { Classroom } from "@/utils/types";

interface ClassTabsProps {
  classroom: Classroom;
  children: ReactNode;
  activeTab: string;
  onTabChange: (value: string) => void;
}

const ClassTabs = ({ classroom, children, activeTab, onTabChange }: ClassTabsProps) => {
  return (
    <Tabs value={activeTab} onValueChange={onTabChange} className="mt-6">
      <TabsList className="grid w-full max-w-4xl grid-cols-7">
        <TabsTrigger value="stream" className="gap-2">
          <MessageSquare className="h-4 w-4" />
          <span className="hidden sm:inline">Stream</span>
        </TabsTrigger>
        <TabsTrigger value="classwork" className="gap-2">
          <FileText className="h-4 w-4" />
          <span className="hidden sm:inline">Classwork</span>
        </TabsTrigger>
        <TabsTrigger value="grades" className="gap-2">
          <BookOpen className="h-4 w-4" />
          <span className="hidden sm:inline">Grades</span>
        </TabsTrigger>
        <TabsTrigger value="live" className="gap-2">
          <Video className="h-4 w-4" />
          <span className="hidden sm:inline">Live</span>
        </TabsTrigger>
        <TabsTrigger value="people" className="gap-2">
          <Users className="h-4 w-4" />
          <span className="hidden sm:inline">People</span>
        </TabsTrigger>
        <TabsTrigger value="settings" className="gap-2">
          <Settings className="h-4 w-4" />
          <span className="hidden sm:inline">Settings</span>
        </TabsTrigger>
        <TabsTrigger value="dashboard" className="gap-2">
          <LayoutDashboard className="h-4 w-4" />
          <span className="hidden sm:inline">Dashboard</span>
        </TabsTrigger>
      </TabsList>
      {children}
    </Tabs>
  );
};

export default ClassTabs;
