
import { TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  LayoutDashboard, 
  FileText, 
  Video, 
  Upload, 
  Users, 
  BookOpen, 
  Settings 
} from "lucide-react";

interface ClassTabsProps {
  activeTab: string;
  onTabChange: (value: string) => void;
  children?: React.ReactNode;
}

const ClassTabs = ({ activeTab, onTabChange, children }: ClassTabsProps) => {
  return (
    <>
      <div className="bg-[#121212] border-b border-[#2A2A2A]">
        <div className="flex overflow-x-auto no-scrollbar">
          <TabsList className="bg-transparent h-12 rounded-none space-x-1 px-6 max-w-7xl mx-auto w-full justify-start">
            <TabsTrigger 
              value="dashboard" 
              className="data-[state=active]:bg-[#1A1A1A] data-[state=active]:border-b-2 data-[state=active]:border-blue-500 rounded-none px-5 gap-2 text-gray-400 data-[state=active]:text-white"
            >
              <LayoutDashboard className="h-4 w-4" />
              <span>Dashboard</span>
            </TabsTrigger>
            <TabsTrigger 
              value="assignments" 
              className="data-[state=active]:bg-[#1A1A1A] data-[state=active]:border-b-2 data-[state=active]:border-blue-500 rounded-none px-5 gap-2 text-gray-400 data-[state=active]:text-white"
            >
              <FileText className="h-4 w-4" />
              <span>Assignments</span>
            </TabsTrigger>
            <TabsTrigger 
              value="live" 
              className="data-[state=active]:bg-[#1A1A1A] data-[state=active]:border-b-2 data-[state=active]:border-blue-500 rounded-none px-5 gap-2 text-gray-400 data-[state=active]:text-white"
            >
              <Video className="h-4 w-4" />
              <span>Live</span>
            </TabsTrigger>
            <TabsTrigger 
              value="submissions" 
              className="data-[state=active]:bg-[#1A1A1A] data-[state=active]:border-b-2 data-[state=active]:border-blue-500 rounded-none px-5 gap-2 text-gray-400 data-[state=active]:text-white"
            >
              <Upload className="h-4 w-4" />
              <span>Submissions</span>
            </TabsTrigger>
            <TabsTrigger 
              value="people" 
              className="data-[state=active]:bg-[#1A1A1A] data-[state=active]:border-b-2 data-[state=active]:border-blue-500 rounded-none px-5 gap-2 text-gray-400 data-[state=active]:text-white"
            >
              <Users className="h-4 w-4" />
              <span>People</span>
            </TabsTrigger>
            <TabsTrigger 
              value="grades" 
              className="data-[state=active]:bg-[#1A1A1A] data-[state=active]:border-b-2 data-[state=active]:border-blue-500 rounded-none px-5 gap-2 text-gray-400 data-[state=active]:text-white"
            >
              <BookOpen className="h-4 w-4" />
              <span>Grades</span>
            </TabsTrigger>
            <TabsTrigger 
              value="settings" 
              className="data-[state=active]:bg-[#1A1A1A] data-[state=active]:border-b-2 data-[state=active]:border-blue-500 rounded-none px-5 gap-2 text-gray-400 data-[state=active]:text-white"
            >
              <Settings className="h-4 w-4" />
              <span>Settings</span>
            </TabsTrigger>
          </TabsList>
        </div>
      </div>
      {children}
    </>
  );
};

export default ClassTabs;
