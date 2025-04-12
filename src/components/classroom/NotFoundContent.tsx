
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface NotFoundContentProps {
  message: string;
}

const NotFoundContent = ({ message }: NotFoundContentProps) => {
  const navigate = useNavigate();
  
  return (
    <div className="text-center py-16">
      <h2 className="text-2xl font-bold mb-4">Not Found</h2>
      <p className="text-muted-foreground mb-8">{message}</p>
      <Button onClick={() => navigate('/')}>
        Return to Dashboard
      </Button>
    </div>
  );
};

export default NotFoundContent;
