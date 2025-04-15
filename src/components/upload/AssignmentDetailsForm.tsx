
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Calendar as CalendarIcon, Clock, Lock, LockOpen } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface AssignmentDetailsProps {
  title: string;
  setTitle: (title: string) => void;
  description: string;
  setDescription: (description: string) => void;
  dueDate: string;
  setDueDate: (date: string) => void;
  dueTime: string;
  setDueTime: (time: string) => void;
  selectedDate: Date | undefined;
  setSelectedDate: (date: Date | undefined) => void;
  allowLateSubmissions: boolean;
  setAllowLateSubmissions: (allow: boolean) => void;
  locked: boolean;
  setLocked: (locked: boolean) => void;
  points: string;
  setPoints: (points: string) => void;
  handleDateSelect: (date: Date | undefined) => void;
}

const AssignmentDetailsForm = ({
  title,
  setTitle,
  description,
  setDescription,
  dueDate,
  dueTime,
  setDueTime,
  selectedDate,
  allowLateSubmissions,
  setAllowLateSubmissions,
  locked,
  setLocked,
  points,
  setPoints,
  handleDateSelect
}: AssignmentDetailsProps) => {
  return (
    <>
      <div className="space-y-2">
        <Label htmlFor="title">
          Assignment Title
        </Label>
        <Input
          id="title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter assignment title"
          required
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="dueDate">
            Due Date
          </Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !selectedDate && "text-muted-foreground"
                )}
                id="dueDate"
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {selectedDate ? format(selectedDate, "PPP") : <span>Select a date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={handleDateSelect}
                initialFocus
                className={cn("p-3 pointer-events-auto")}
              />
            </PopoverContent>
          </Popover>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="dueTime">
            Due Time
          </Label>
          <div className="flex items-center">
            <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
            <Input
              id="dueTime"
              type="time"
              value={dueTime}
              onChange={(e) => setDueTime(e.target.value)}
              placeholder="23:59"
              className="w-full"
            />
          </div>
        </div>
      </div>
      
      <div className="flex flex-col md:flex-row gap-6">
        <div className="flex items-center space-x-2">
          <Switch
            id="allowLateSubmissions"
            checked={allowLateSubmissions}
            onCheckedChange={setAllowLateSubmissions}
          />
          <Label htmlFor="allowLateSubmissions" className="text-sm font-normal">
            Allow late submissions
          </Label>
        </div>
        
        <div className="flex items-center space-x-2">
          <Switch
            id="lockAssignment"
            checked={locked}
            onCheckedChange={setLocked}
          />
          <Label htmlFor="lockAssignment" className="text-sm font-normal flex items-center">
            {locked ? 
              <Lock className="mr-1 h-4 w-4 text-red-500" /> : 
              <LockOpen className="mr-1 h-4 w-4 text-green-500" />
            }
            {locked ? "Assignment locked" : "Assignment unlocked"}
          </Label>
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="points">
          Points
        </Label>
        <Input
          id="points"
          type="number"
          value={points}
          onChange={(e) => setPoints(e.target.value)}
          placeholder="100"
          min="0"
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="description">
          Description
        </Label>
        <Textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Enter additional details about the assignment"
          rows={3}
        />
      </div>
    </>
  );
};

export default AssignmentDetailsForm;
