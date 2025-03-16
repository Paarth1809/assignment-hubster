
import { BookOpen, Calendar, UserCheck } from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Classroom, LiveClass } from '@/utils/types';

interface StatsCardProps {
  classrooms: Classroom[];
  upcomingLiveClasses: LiveClass[];
  userRole: 'teacher' | 'student';
}

export default function StatsCard({ classrooms, upcomingLiveClasses, userRole }: StatsCardProps) {
  return (
    <Card className="mt-6">
      <CardHeader>
        <h3 className="text-lg font-medium">Account Stats</h3>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center">
          <BookOpen className="h-5 w-5 text-muted-foreground mr-3" />
          <div>
            <p className="text-sm font-medium">Enrolled Classes</p>
            <p className="text-2xl font-bold">{classrooms.length}</p>
          </div>
        </div>
        
        <div className="flex items-center">
          <Calendar className="h-5 w-5 text-muted-foreground mr-3" />
          <div>
            <p className="text-sm font-medium">Upcoming Live Classes</p>
            <p className="text-2xl font-bold">{upcomingLiveClasses.length}</p>
          </div>
        </div>
        
        <div className="flex items-center">
          <UserCheck className="h-5 w-5 text-muted-foreground mr-3" />
          <div>
            <p className="text-sm font-medium">Account Type</p>
            <p className="text-lg font-medium">
              {userRole === 'teacher' ? 'Teacher Account' : 'Student Account'}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
