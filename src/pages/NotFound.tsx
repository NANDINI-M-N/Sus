
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle, Home, ArrowLeft, RefreshCw } from "lucide-react";

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  const handleGoHome = () => {
    navigate("/");
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  const handleRefresh = () => {
    window.location.reload();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-dark-primary p-4">
      <Card className="max-w-md w-full bg-dark-secondary border-border-dark text-center">
        <CardHeader className="pb-4">
          <div className="flex justify-center mb-4">
            <AlertTriangle className="h-16 w-16 text-tech-green" />
          </div>
          <CardTitle className="text-4xl font-bold text-text-primary mb-2">404</CardTitle>
          <CardDescription className="text-text-secondary text-lg">
            Oops! The page you're looking for doesn't exist.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-text-secondary text-sm">
            The page at <code className="bg-dark-primary px-2 py-1 rounded text-tech-green">{location.pathname}</code> could not be found.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button 
              onClick={handleGoHome}
              className="bg-tech-green hover:bg-tech-green/90 text-dark-primary"
            >
              <Home className="h-4 w-4 mr-2" />
              Go Home
            </Button>
            
            <Button 
              variant="outline"
              onClick={handleGoBack}
              className="border-border-dark text-text-secondary hover:text-text-primary"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Go Back
            </Button>
            
            <Button 
              variant="outline"
              onClick={handleRefresh}
              className="border-border-dark text-text-secondary hover:text-text-primary"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
          </div>

          <div className="mt-6 pt-4 border-t border-border-dark">
            <p className="text-text-secondary text-xs">
              If you believe this is an error, please contact support at{" "}
              <a 
                href="mailto:support@codesignal.com" 
                className="text-tech-green hover:underline"
              >
                support@codesignal.com
              </a>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default NotFound;
