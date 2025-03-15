
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BookOpen, Users, FileText, MessageSquare, Settings } from "lucide-react";

interface ClassTabsProps {
  activeTab: string;
  onTabChange: (value: string) => void;
  children: React.ReactNode;
}

const ClassTabs = ({ activeTab, onTabChange, children }: ClassTabsProps) => {
  return (
    <div className="border-b sticky top-16 bg-background z-10">
      <div className="max-w-7xl mx-auto px-6">
        <Tabs 
          defaultValue="stream" 
          value={activeTab} 
          onValueChange={onTabChange} 
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
          
          {children}
        </Tabs>
      </div>
    </div>
  );
};

export default ClassTabs;
