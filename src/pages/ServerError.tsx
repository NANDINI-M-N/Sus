
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle, Home, RefreshCw, Mail } from "lucide-react";

const ServerError = () => {
  const navigate = useNavigate();

  const handleGoHome = () => {
    navigate("/");
  };

  const handleRefresh = () => {
    window.location.reload();
  };

  const handleContactSupport = () => {
    window.open("mailto:support@codeinterview.com?subject=Server Error Report", "_blank");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-dark-primary p-4">
      <Card className="max-w-md w-full bg-dark-secondary border-border-dark text-center">
        <CardHeader className="pb-4">
          <div className="flex justify-center mb-4">
            <AlertTriangle className="h-16 w-16 text-red-500" />
          </div>
          <CardTitle className="text-4xl font-bold text-text-primary mb-2">500</CardTitle>
          <CardDescription className="text-text-secondary text-lg">
            Internal Server Error
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-text-secondary">
            We're experiencing technical difficulties. Our team has been notified and is working to resolve the issue.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button 
              onClick={handleRefresh}
              className="bg-tech-green hover:bg-tech-green/90 text-dark-primary"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Try Again
            </Button>
            
            <Button 
              variant="outline"
              onClick={handleGoHome}
              className="border-border-dark text-text-secondary hover:text-text-primary"
            >
              <Home className="h-4 w-4 mr-2" />
              Go Home
            </Button>
          </div>

          <div className="mt-6 pt-4 border-t border-border-dark">
            <Button 
              variant="outline"
              onClick={handleContactSupport}
              className="w-full border-border-dark text-text-secondary hover:text-text-primary"
            >
              <Mail className="h-4 w-4 mr-2" />
              Contact Support
            </Button>
            <p className="text-text-secondary text-xs mt-2">
              Error ID: {Math.random().toString(36).substr(2, 9).toUpperCase()}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ServerError;
