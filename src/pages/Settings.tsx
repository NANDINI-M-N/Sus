import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { useProfile } from '@/hooks/useProfile';
import { supabase } from '@/lib/supabase';
import { useNavigate } from 'react-router-dom';
import {
  User,
  Bell,
  Camera,
  ArrowLeft
} from 'lucide-react';

interface Profile {
  id: string;
  email: string;
  first_name: string | null;
  last_name: string | null;
  avatar_url: string | null;
  phone: string | null;
  role: 'admin' | 'recruiter' | 'candidate';
  created_at: string;
  updated_at: string;
}

const Settings = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { profile } = useProfile();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  
  // Profile settings
  const [profileData, setProfileData] = useState({
    name: `${(profile as Profile)?.first_name || ''} ${(profile as Profile)?.last_name || ''}`.trim(),
    email: user?.email || '',
    avatar_url: (profile as Profile)?.avatar_url || '',
    phone: (profile as Profile)?.phone || ''
  });

  // Notification settings
  const [notifications, setNotifications] = useState({
    email_notifications: true,
    interview_reminders: true,
    candidate_updates: true,
    report_notifications: false
  });

  useEffect(() => {
    if (profile) {
      setProfileData({
        name: `${(profile as Profile)?.first_name || ''} ${(profile as Profile)?.last_name || ''}`.trim(),
        email: user?.email || '',
        avatar_url: (profile as Profile)?.avatar_url || '',
        phone: (profile as Profile)?.phone || ''
      });
    }
  }, [profile, user]);

  const handleProfileUpdate = async () => {
    setLoading(true);
    try {
      const [firstName, ...lastNameParts] = profileData.name.split(' ');
      const lastName = lastNameParts.join(' ');

      const { error } = await supabase
        .from('profiles')
        .update({
          first_name: firstName || null,
          last_name: lastName || null,
          phone: profileData.phone,
          updated_at: new Date().toISOString()
        })
        .eq('id', user?.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Profile updated successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update profile",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0D14] text-gray-100">
      <div className="max-w-6xl mx-auto py-8 px-4">
        <div className="flex items-center mb-8">
          <Button
            variant="ghost"
            className="mr-4 text-gray-400 hover:text-white"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-semibold text-white">Settings</h1>
            <p className="text-gray-400 mt-2">Manage your account preferences and settings</p>
          </div>
        </div>

        <Tabs defaultValue="profile" className="w-full">
          <div className="border-b border-gray-800">
            <TabsList>
              <TabsTrigger 
                value="profile"
                className="flex items-center space-x-2 px-4 py-3 transition-colors data-[state=active]:text-[#22C55E] text-gray-400 hover:text-gray-200 border-b-2 border-transparent data-[state=active]:border-[#22C55E]"
              >
                <User className="w-4 h-4" />
                <span className="text-sm font-medium">Profile</span>
            </TabsTrigger>
              <TabsTrigger 
                value="notifications"
                className="flex items-center space-x-2 px-4 py-3 transition-colors data-[state=active]:text-[#22C55E] text-gray-400 hover:text-gray-200 border-b-2 border-transparent data-[state=active]:border-[#22C55E]"
              >
                <Bell className="w-4 h-4" />
                <span className="text-sm font-medium">Notifications</span>
            </TabsTrigger>
          </TabsList>
          </div>

          <TabsContent value="profile">
            <Card className="bg-[#151A23] border border-gray-800 rounded-xl p-6">
              <div className="mb-6">
                <h2 className="text-lg font-semibold text-white flex items-center">
                  <User className="w-5 h-5 mr-2 text-gray-400" />
                  Profile Information
                </h2>
                <p className="text-gray-400 text-sm mt-1">Update your personal information and profile picture</p>
              </div>

              <div className="mb-8">
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    <div className="w-24 h-24 rounded-full bg-[#22C55E] flex items-center justify-center text-white text-2xl overflow-hidden">
                      {profileData.avatar_url ? (
                        <img 
                          src={profileData.avatar_url} 
                          alt="Profile" 
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        profileData.name?.charAt(0)
                      )}
                    </div>
                    <button
                      onClick={() => {}}
                      className="absolute -bottom-1 -right-1 bg-white text-gray-800 p-2 rounded-full shadow-lg hover:bg-gray-100 transition-colors"
                    >
                      <Camera className="w-4 h-4" />
                    </button>
                  </div>
                  <div>
                    <Button 
                      variant="outline" 
                      className="bg-transparent border border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-white transition-colors"
                    >
                          Change Avatar
                      </Button>
                    <p className="text-gray-500 text-sm mt-1">JPG, PNG or GIF. Max size 2MB.</p>
                  </div>
                </div>
                  </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                  <Label htmlFor="name" className="text-gray-300">Full Name</Label>
                    <Input
                    id="name"
                    value={profileData.name}
                    onChange={(e) => setProfileData(prev => ({ ...prev, name: e.target.value }))}
                    className="bg-[#1E2433] border-gray-800 text-white placeholder-gray-500 focus:ring-[#22C55E] focus:border-[#22C55E] rounded-lg"
                    />
                  </div>
                  <div className="space-y-2">
                  <Label htmlFor="email" className="text-gray-300">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={profileData.email}
                    disabled
                    className="bg-[#1E2433] border-gray-800 text-gray-400 cursor-not-allowed rounded-lg"
                    />
                  </div>
                  <div className="space-y-2">
                  <Label htmlFor="phone" className="text-gray-300">Phone Number</Label>
                    <Input
                      id="phone"
                      value={profileData.phone}
                    onChange={(e) => setProfileData(prev => ({ ...prev, phone: e.target.value }))}
                    className="bg-[#1E2433] border-gray-800 text-white placeholder-gray-500 focus:ring-[#22C55E] focus:border-[#22C55E] rounded-lg"
                    />
                  </div>
                </div>

              <div className="mt-8 flex justify-end">
                  <Button 
                    onClick={handleProfileUpdate} 
                    disabled={loading}
                  className="bg-[#22C55E] text-white hover:bg-[#1EA54D] transition-colors px-8 py-2 rounded-lg font-medium"
                  >
                  {loading ? "Saving Changes..." : "Save Changes"}
                  </Button>
                </div>
            </Card>
          </TabsContent>

          <TabsContent value="notifications">
            <Card className="bg-[#151A23] border border-gray-800 rounded-xl p-6">
              <div className="mb-6">
                <h2 className="text-lg font-semibold text-white flex items-center">
                  <Bell className="w-5 h-5 mr-2 text-gray-400" />
                  Notification Preferences
                </h2>
                <p className="text-gray-400 text-sm mt-1">Choose how you want to be notified</p>
                      </div>

              <div className="space-y-6">
                    <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-gray-300">Email Notifications</Label>
                    <p className="text-gray-400 text-sm">Receive notifications via email</p>
                      </div>
                      <Switch
                    checked={notifications.email_notifications}
                    onCheckedChange={(checked) => 
                      setNotifications(prev => ({ ...prev, email_notifications: checked }))
                    }
                  />
                </div>

                    <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-gray-300">Interview Reminders</Label>
                    <p className="text-gray-400 text-sm">Get reminded about upcoming interviews</p>
                      </div>
                      <Switch
                    checked={notifications.interview_reminders}
                    onCheckedChange={(checked) => 
                      setNotifications(prev => ({ ...prev, interview_reminders: checked }))
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-gray-300">Candidate Updates</Label>
                    <p className="text-gray-400 text-sm">Get notified about candidate status changes</p>
                  </div>
                  <Switch
                    checked={notifications.candidate_updates}
                    onCheckedChange={(checked) => 
                      setNotifications(prev => ({ ...prev, candidate_updates: checked }))
                    }
                  />
                </div>

                    <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-gray-300">Report Notifications</Label>
                    <p className="text-gray-400 text-sm">Get notified when new reports are available</p>
                  </div>
                  <Switch
                    checked={notifications.report_notifications}
                    onCheckedChange={(checked) => 
                      setNotifications(prev => ({ ...prev, report_notifications: checked }))
                    }
                  />
                </div>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Settings;