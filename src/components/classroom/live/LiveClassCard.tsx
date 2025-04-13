
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, Link, Play, X } from "lucide-react";
import { LiveClass } from "@/utils/types";
import { formatDate } from "@/utils/assignmentUtils";

interface LiveClassCardProps {
  liveClass: LiveClass;
  isTeacher: boolean;
  onJoin: (liveClass: LiveClass) => void;
  onHost: (liveClass: LiveClass) => void;
  onStart: (liveClass: LiveClass) => void;
  onEnd: (liveClass: LiveClass) => void;
  onCancel: (liveClass: LiveClass) => void;
  onDelete: (liveClassId: string) => void;
}

const LiveClassCard = ({ 
  liveClass, 
  isTeacher, 
  onJoin, 
  onHost, 
  onStart, 
  onEnd, 
  onCancel, 
  onDelete 
}: LiveClassCardProps) => {
  
  const getStatusBadge = (status: LiveClass['status']) => {
    switch (status) {
      case 'scheduled':
        return <Badge variant="outline" className="bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300">Scheduled</Badge>;
      case 'live':
        return <Badge variant="outline" className="bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-300">Live Now</Badge>;
      case 'completed':
        return <Badge variant="outline" className="bg-gray-50 text-gray-700 dark:bg-gray-900/20 dark:text-gray-300">Completed</Badge>;
      case 'cancelled':
        return <Badge variant="outline" className="bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-300">Cancelled</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  return (
    <Card className={liveClass.status === 'live' ? 'border-green-500 dark:border-green-700' : ''}>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg">{liveClass.title}</CardTitle>
          {getStatusBadge(liveClass.status)}
        </div>
        <CardDescription className="line-clamp-2">
          {liveClass.description || "No description provided"}
        </CardDescription>
      </CardHeader>
      <CardContent className="pb-2 text-sm">
        <div className="flex flex-col space-y-2">
          <div className="flex items-center">
            <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
            <span>{formatDate(liveClass.scheduledStart)}</span>
          </div>
          <div className="flex items-center">
            <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
            <span>
              {new Date(liveClass.scheduledStart).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              {liveClass.scheduledEnd && ` - ${new Date(liveClass.scheduledEnd).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`}
            </span>
          </div>
          {liveClass.meetingUrl && liveClass.status === 'live' && (
            <div className="flex items-center">
              <Link className="h-4 w-4 mr-2 text-muted-foreground" />
              <a 
                href={liveClass.meetingUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-primary truncate hover:underline"
              >
                Meeting Link
              </a>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="pt-2">
        {isTeacher ? (
          <div className="flex flex-wrap justify-between w-full gap-2">
            {liveClass.status === 'scheduled' && (
              <>
                <Button size="sm" onClick={() => onStart(liveClass)}>
                  <Play className="h-4 w-4 mr-2" />
                  Start Class
                </Button>
                <Button 
                  size="sm" 
                  variant="outline" 
                  onClick={() => onCancel(liveClass)}
                >
                  <X className="h-4 w-4 mr-2" />
                  Cancel
                </Button>
              </>
            )}
            {liveClass.status === 'live' && (
              <>
                <Button 
                  size="sm"
                  onClick={() => onHost(liveClass)}
                >
                  Host Again
                </Button>
                <Button 
                  size="sm" 
                  variant="destructive" 
                  onClick={() => onEnd(liveClass)}
                >
                  End Class
                </Button>
              </>
            )}
            {(liveClass.status === 'completed' || liveClass.status === 'cancelled') && (
              <Button 
                size="sm" 
                variant="outline" 
                onClick={() => onDelete(liveClass.id)}
              >
                Delete
              </Button>
            )}
          </div>
        ) : (
          <div className="w-full">
            {liveClass.status === 'live' ? (
              <Button 
                className="w-full" 
                onClick={() => onJoin(liveClass)}
              >
                Join Live Class
              </Button>
            ) : liveClass.status === 'scheduled' ? (
              <Button 
                variant="outline" 
                className="w-full"
                disabled
              >
                Not Started Yet
              </Button>
            ) : (
              <Button 
                variant="outline" 
                className="w-full" 
                disabled
              >
                {liveClass.status === 'completed' ? 'Class Ended' : 'Class Cancelled'}
              </Button>
            )}
          </div>
        )}
      </CardFooter>
    </Card>
  );
};

export default LiveClassCard;
