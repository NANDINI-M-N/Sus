
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { WifiOff, RefreshCw, AlertTriangle } from "lucide-react";

interface NetworkErrorProps {
  onRetry?: () => void;
  message?: string;
  showDetails?: boolean;
}

const NetworkError = ({ 
  onRetry, 
  message = "Unable to connect to the server. Please check your internet connection and try again.",
  showDetails = false 
}: NetworkErrorProps) => {
  const handleRetry = () => {
    if (onRetry) {
      onRetry();
    } else {
      window.location.reload();
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[400px] p-4">
      <Card className="max-w-md w-full bg-dark-secondary border-border-dark">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <WifiOff className="h-12 w-12 text-red-500" />
          </div>
          <CardTitle className="text-text-primary">Connection Error</CardTitle>
          <CardDescription className="text-text-secondary">
            {message}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button 
            onClick={handleRetry}
            className="w-full bg-tech-green hover:bg-tech-green/90 text-dark-primary"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Try Again
          </Button>
          
          {showDetails && (
            <Alert className="bg-dark-primary border-border-dark">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription className="text-text-secondary">
                <strong>Troubleshooting tips:</strong>
                <ul className="list-disc list-inside mt-2 space-y-1">
                  <li>Check your internet connection</li>
                  <li>Disable VPN if using one</li>
                  <li>Clear browser cache and cookies</li>
                  <li>Try refreshing the page</li>
                </ul>
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default NetworkError;
