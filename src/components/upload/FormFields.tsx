
import { useState } from 'react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";

interface FormFieldsProps {
  title: string;
  setTitle: (title: string) => void;
  description: string;
  setDescription: (description: string) => void;
  dueDate: string;
  setDueDate: (dueDate: string) => void;
  points: string;
  setPoints: (points: string) => void;
  autoLock: boolean;
  setAutoLock: (autoLock: boolean) => void;
}

const FormFields = ({
  title,
  setTitle,
  description,
  setDescription,
  dueDate,
  setDueDate,
  points,
  setPoints,
  autoLock,
  setAutoLock
}: FormFieldsProps) => {
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
            Due Date (Optional)
          </Label>
          <Input
            id="dueDate"
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="points">
            Points (Optional)
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
      </div>
      
      <div className="flex items-center space-x-2">
        <Switch
          id="auto-lock"
          checked={autoLock}
          onCheckedChange={setAutoLock}
        />
        <Label htmlFor="auto-lock" className="text-sm text-muted-foreground">
          Automatically prevent submissions after due date
        </Label>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="description">
          Description (Optional)
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

export default FormFields;
