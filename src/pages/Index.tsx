import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Features from "@/components/Features";
import SocialProof from "@/components/SocialProof";
import Footer from "@/components/Footer";
import SkipLink from "@/components/accessibility/SkipLink";
import { useAuth } from "@/hooks/useAuth";
import { useProfile } from "@/hooks/useProfile";
import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import PageLoader from "@/components/loading/PageLoader";
import LogoutNotification from "@/components/notifications/LogoutNotification";

const Index = () => {
  const { user, loading: authLoading } = useAuth();
  const { profile, loading: profileLoading } = useProfile();
  const navigate = useNavigate();
  const location = useLocation();
  const [showLogoutNotification, setShowLogoutNotification] = useState(false);

  useEffect(() => {
    // Check if the user was redirected from a logout action
    if (location.state && location.state.justLoggedOut) {
      setShowLogoutNotification(true);
    }
  }, [location]);

  useEffect(() => {
    // Redirect authenticated users to their dashboard
    if (user && profile && !authLoading && !profileLoading) {
      switch (profile.role) {
        case 'admin':
          navigate('/admin-dashboard');
          break;
        case 'recruiter':
          navigate('/recruiter-dashboard');
          break;
        case 'candidate':
          navigate('/candidate-dashboard');
          break;
        default:
          navigate('/candidate-dashboard');
      }
    }
  }, [user, profile, authLoading, profileLoading, navigate]);

  if (authLoading || (user && profileLoading)) {
    return <PageLoader text="Loading..." />;
  }

  return (
    <div className="min-h-screen bg-gray-900">
      <SkipLink />
      <Header />
      <main id="main-content">
        <Hero />
        <Features />
        <SocialProof />
      </main>
      <Footer />
      
      {/* Logout Notification */}
      {showLogoutNotification && (
        <LogoutNotification 
          onClose={() => setShowLogoutNotification(false)}
        />
      )}
    </div>
  );
};

export default Index;
