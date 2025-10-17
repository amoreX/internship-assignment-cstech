import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { FileQuestion } from 'lucide-react';

export default function NotFound() {
  const [, setLocation] = useLocation();

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardContent className="flex flex-col items-center justify-center py-12">
          <FileQuestion className="h-16 w-16 text-muted-foreground mb-4" />
          <h1 className="text-2xl font-semibold mb-2">Page Not Found</h1>
          <p className="text-muted-foreground text-center mb-6">
            The page you're looking for doesn't exist or has been moved.
          </p>
          <Button onClick={() => setLocation('/login')} data-testid="button-go-home">
            Go to Login
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
